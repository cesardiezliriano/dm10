import { GoogleGenAI, Tool, GenerateContentParameters, GenerateContentResponse, Part } from "@google/genai";
import { GEMINI_TEXT_MODEL, PROMPT_TEMPLATES, getText, getTimePeriodLabel, PROMPT_TEMPLATE_FOR_PPT_JSON } from '../constants.ts';
import { DataSource, GenerateContentGeminiResponse, Candidate, GroundingMetadata, GroundingChunk, StructuredInsightRequest, StructuredCampaignPlatform, Language, PresentationData, InsightRequest, UploadedImage, BrandStyle } from '../types.ts';

const getApiKey = (): string | undefined => {
  if (typeof process !== 'undefined' && 
      process.env && 
      typeof process.env.API_KEY === 'string' && 
      process.env.API_KEY.trim() !== '') {
    return process.env.API_KEY;
  }
  return undefined;
};

// Helper function to strip base64 prefix and get mime type
const getBase64DataAndMimeType = (dataUrl: string): { mimeType: string; data: string } | null => {
    const match = dataUrl.match(/^data:(image\/(?:png|jpeg|gif));base64,(.+)$/);
    if (match && match[1] && match[2]) {
        return { mimeType: match[1], data: match[2] };
    }
    console.warn("getBase64DataAndMimeType: Could not parse data URL or unsupported image type", dataUrl.substring(0, 30) + "...");
    return null;
};


const processGeminiResponse = (geminiResponse: GenerateContentResponse): GenerateContentGeminiResponse => {
    const text = geminiResponse.text;
    console.log("GeminiService: Raw text from Gemini model in processGeminiResponse (first 300 chars):", text.substring(0,300)); 

    let appCandidates: Candidate[] | undefined = undefined;
    if (geminiResponse.candidates && geminiResponse.candidates.length > 0) {
        appCandidates = geminiResponse.candidates.map(candidate => {
            let appGroundingMetadata: GroundingMetadata | undefined = undefined;
            if (candidate.groundingMetadata && candidate.groundingMetadata.groundingChunks && Array.isArray(candidate.groundingMetadata.groundingChunks)) {
                const appGroundingChunks: GroundingChunk[] = candidate.groundingMetadata.groundingChunks
                    .map(chunk => (chunk.web ? { web: { uri: chunk.web.uri, title: chunk.web.title || '' } } : null))
                    .filter(chunk => chunk !== null) as GroundingChunk[];
                if (appGroundingChunks.length > 0) {
                    appGroundingMetadata = { groundingChunks: appGroundingChunks };
                }
            }
            return {
                groundingMetadata: appGroundingMetadata,
            };
        }).filter(candidate => candidate.groundingMetadata !== undefined || candidate !== undefined); 
    }

    return {
        text: text,
        candidates: appCandidates,
    };
};

const handleGeminiError = (error: unknown, language: Language): Error => {
    console.error("GeminiService: Error from Gemini API:", error); 
    if (error instanceof Error) {
        const err = error as any; 
        if (err.message && (err.message.includes('API key not valid') || err.message.includes('API_KEY_INVALID'))) {
            return new Error(getText(language, 'ERROR_API_INVALID_KEY'));
        }
        if (err.message === getText(language, 'ERROR_API_KEY_MISSING')) {
            return err;
        }
        const detailMessage = err.details || err.message || "Unknown error";
        return new Error(getText(language, 'ERROR_GEMINI_GENERIC', detailMessage));
    }
    return new Error(getText(language, 'ERROR_UNEXPECTED'));
};

export const generateInsightWithGemini = async (
  selectedDataSources: DataSource[],
  data: string,
  language: Language,
  clientName: string = "",
  sector: string = "",
  campaignMarket: string = "",
  additionalContext: string = "",
  specificQuestions: string = "",
  uploadedCreatives?: UploadedImage[],
  useSearch: boolean = false
): Promise<GenerateContentGeminiResponse> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.error("GeminiService: API_KEY environment variable not set or is empty for generateInsightWithGemini.");
    throw new Error(getText(language, 'ERROR_API_KEY_MISSING'));
  }
  const ai = new GoogleGenAI({ apiKey: apiKey });

  const sourcesString = selectedDataSources.length > 0 ? selectedDataSources.join(', ') : 'the provided general data';
  const languageInstruction = `Respond in ${language}.`;
  const currentDate = new Date().toLocaleDateString(language === Language.ES ? 'es-ES' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  let contextPreamble = "User provided the following context for this analysis:\n";
  if (clientName) contextPreamble += `- Client Name: ${clientName}\n`;
  if (sector) contextPreamble += `- Industry/Sector: ${sector}\n`;
  if (campaignMarket) contextPreamble += `- Campaign Market(s): ${campaignMarket}\n`;
  if (additionalContext) contextPreamble += `- Additional Notes/Trends/Seasonality/Targets from User: ${additionalContext}\n`;
  if (!clientName && !sector && !campaignMarket && !additionalContext) {
    contextPreamble = "User did not provide specific client, sector, market, or additional context. Consider general industry trends if relevant and accessible through search.\n";
  }
  
  const optimizerToolUrl = "https://dm-8-optimizer-v3-1076786873783.us-west1.run.app/";

  // --- Construct parts for multimodal input ---
  const contentParts: Part[] = [];

  // 1. Text part (user prompt)
  const userPromptText = `
Overall Context Summary for AI: Analysis for ${clientName || 'the client'} in the ${sector || 'relevant'} sector, targeting the ${campaignMarket || 'specified'} market(s). Analysis date: ${currentDate}.
Indicated Data Source(s): ${sourcesString}.
User-Provided Additional Context/Trends/Seasonality/Targets: ${additionalContext || "None provided."}
${uploadedCreatives && uploadedCreatives.length > 0 ? `\nUser has also uploaded ${uploadedCreatives.length} image(s) for visual analysis, referenced in subsequent parts of this request. Please analyze their visual content as per the system instructions.\n` : ""}
Provided Aggregated Data:
\`\`\`
${data}
\`\`\`

${specificQuestions ? `Specific Questions or Focus Areas from User:\n${specificQuestions}\n` : ""}

Based on all the above (including any images provided in subsequent parts of this request), please generate concise, actionable insights directly for me, the client. If the provided data includes sections labeled '=== API Data: ... ===', prioritize the analysis of this structured JSON data as it represents a direct, reliable source. Focus on interpreting any tables in depth from my business perspective. Crucially, integrate a comprehensive contextual analysis (my situation, competitors, seasonality based on ${currentDate}, and sector status in ${campaignMarket || 'my target markets'}) into your explanation of 'why' things might have happened and your recommendations for my business. Include a clear recommendation to use the Optimizer Tool (${optimizerToolUrl}) for continuous improvement. Do not just repeat the data. Provide a narrative analysis, calculate KPIs from tables if possible and explain their relevance to me, and relate findings to all available context. Include detailed visual analysis for any uploaded images as per system instructions. Remember to structure your response with clear headings, use good formatting for readability, and **highlight key conclusions for my business in bold (e.g., **This is important for your strategy.**)**. ${languageInstruction}
`;
  contentParts.push({ text: userPromptText });

  // 2. Image parts
  let imageReferencesForSystemPrompt = "";
  if (uploadedCreatives && uploadedCreatives.length > 0) {
    uploadedCreatives.forEach((creative, index) => {
        const base64Details = getBase64DataAndMimeType(creative.dataUrl);
        if (base64Details) {
            contentParts.push({
                inlineData: {
                    mimeType: base64Details.mimeType,
                    data: base64Details.data
                }
            });
            imageReferencesForSystemPrompt += `- Image ${index + 1} (filename: ${creative.name})\n`;
            console.log(`GeminiService: Added image part for ${creative.name}, MIME: ${base64Details.mimeType}`);
        } else {
            console.warn(`GeminiService: Could not extract base64 data for creative: ${creative.name}. It will be skipped for visual analysis.`);
        }
    });
  }
  
  let creativeAnalysisSystemInstruction = "";
  if (imageReferencesForSystemPrompt) {
    creativeAnalysisSystemInstruction = `
**Image & Creative Visual Analysis (CRITICAL):**
You have been provided with the following images (they appear after the main text prompt in the request):
${imageReferencesForSystemPrompt}
For each uploaded image, provide a detailed textual analysis based *directly on its visual content*. This is not about the filename, but about what you "see" in the image. Consider and describe aspects such_as:
- **Visual Elements:** Dominant objects, people (if any, describe attire, actions, expressions), setting, colors (dominant, contrasting, mood), composition (layout, balance, focal points), style (e.g., photographic, illustrative, abstract), and overall aesthetic.
- **Message & Communication (Inferred from Visuals):** What message or story does the image visually convey? Is there an evident or implied call to action? How persuasive are the visuals alone or in combination with minimal text (if any within the image)?
- **Target Audience Appeal (Inferred from Visuals):** Based on the visual style and content, who is this image likely to appeal to? Does it visually align with the likely target audience given the client context (if known)?
- **Emotional Impact (Inferred from Visuals):** What emotions or feelings might the image evoke (e.g., excitement, trust, curiosity, urgency)?
- **Strengths & Weaknesses (Visual Perspective):** What are the strong visual points of this image? Are there any visual aspects that might be confusing, distracting, or could be improved for better impact or clarity?
- **Suggestions for Visual Improvement:** Based on your visual analysis and general design best practices, offer concrete suggestions (e.g., "Consider enhancing contrast for better text legibility if text were overlaid," "The focal point could be strengthened by...", "This imagery strongly supports X, but visual consistency could be improved by Y").
- **Contextual Relevance (Visuals to Campaign):** How well do the visuals align with the campaign context (client: ${clientName || 'unknown'}, sector: ${sector || 'unknown'}, market: ${campaignMarket || 'unknown'}, goals from 'Additional Notes': ${additionalContext || 'not specified'})? Does the visual style fit?
Integrate this visual analysis clearly within your overall report under a dedicated heading like "## Visual & Creative Performance Review", with sub-headings for each image (referencing them by filename, e.g., "### Image: ${uploadedCreatives && uploadedCreatives.length > 0 ? uploadedCreatives[0].name : 'example.png'}").
This visual analysis is a key part of the deliverable. Your ability to "see" and interpret the image is critical.
`;
  } else {
    creativeAnalysisSystemInstruction = "No images were uploaded for visual analysis.";
  }

  const systemInstruction = `**Persona & Tone (CRITICAL):**
You are an expert data analyst, business strategist, and visual communication specialist. **Adopt the persona of a senior consultant speaking directly to your client, ${clientName || 'the client'}.**

**CRITICAL INSTRUCTION: DATA VERIFICATION & SELF-CORRECTION**
Before generating the final report, you must perform an internal review of the provided data, especially for manual Excel uploads or pasted text.
1.  **Review Data Tables Carefully:** Users may paste data that isn't perfectly formatted. If you see a "0" for a metric like "Leads", "Conversions", or "Ventas", double-check surrounding cells. Ensure you haven't missed a value due to column misalignment or empty header rows.
2.  **Validate Findings:** If you claim a metric is 0 or very low, verify this against the raw input again. If there is data in the row that looks like a conversion count, use it.
3.  **Reasonable Assumptions:** If a column header is ambiguous but the data looks like performance metrics, infer the most logical metric based on the context (e.g. numbers < 100 vs numbers > 1000 usually distinguish conversions vs impressions).

Your language must be **exceptionally clear and easy for a non-technical business stakeholder to understand. Simplify complex terms and avoid jargon. Be concise and eliminate any redundant phrasing.**
Your tone should be that of a **trusted consultant, not a neutral data-reporting machine.** Be **emphatic when highlighting achievements and successes.** For example, instead of 'Metric X increased by Y%,' try '**We achieved an outstanding Y% increase in Metric X, demonstrating the success of...**'
Remember, you are a consultant providing strategic advice, not just an analytical tool. Your insights should build confidence and guide decision-making.

${contextPreamble}
The user indicates the data pertains to sources like: ${sourcesString}.
The current date for this analysis is ${currentDate}.

**Output Structure & Content (CRITICAL):**
1.  **Start with a Direct Executive Summary for Business Stakeholders:** This must be brief (3-5 key bullet points or a short paragraph), immediately highlighting the most critical business implications, achievements, and top-priority recommendations. It must be oriented towards action and business value, not just a data recap.
2.  **Narrative Emphasis:** While your analysis is data-driven, your textual output should prioritize qualitative interpretation, strategic thinking, and the 'story' behind the numbers *and visuals* for the client. Use metrics to support your narrative, not to be the entire narrative.

**Comprehensive Contextual Analysis (CRITICAL):**
Before analyzing the provided data and images, deeply consider the following contextual factors. Integrate these considerations directly into your "Why might it have happened?" and "Actionable Recommendations" sections.
    a.  **Client's Situation:** Based on any information provided about '${clientName || "the client"}' and their objectives (from 'Additional Notes'). If specific client details are sparse, consider typical goals for a business in the '${sector || "relevant"}' sector.
    b.  **Competitive Landscape:** If 'Additional Notes' mention competitors, analyze their potential impact. Otherwise, consider general competitive pressures typical for the '${sector || "relevant"}' sector in the '${campaignMarket || "specified"}' market(s). ${useSearch ? "Use search grounding to identify recent major competitor activities or market shifts if possible." : ""}
    c.  **Seasonality & Timing:** Given the current analysis date of ${currentDate}, what seasonal trends, holidays, or time-sensitive factors might be influencing the data for the '${sector || "relevant"}' sector and '${campaignMarket || "specified"}' market(s)? (e.g., pre-holiday build-up, post-holiday slump, specific industry cycles).
    d.  **Sector Status in Analyzed Countries/Markets:** What is the general status or recent significant trends in the '${sector || "relevant"}' sector within the '${campaignMarket || "specified"}' market(s)? (e.g., growth, decline, regulatory changes, new technology adoption). ${useSearch ? "Use search grounding to find relevant information if specific market data is not provided." : ""}

**Integration with Optimizer Tool for Cyclical Improvement:**
An important part of our process involves continuous improvement. Our clients have access to an "Optimizer Tool" (${optimizerToolUrl}) designed to help implement quality suggestions and campaign enhancements. Your recommendations should facilitate a cyclical process where insights lead to optimizations (via the Optimizer tool), which then lead to new data and new insights.

**Core Analytical Tasks (Integrate with Contextual Analysis, focusing on client impact):**
1.  **"What happened?" (Client Summary)**: Clearly summarize key observations, trends, and performance metrics from the data. Focus on the *implications* of these numbers for the client. **Avoid overly dense numerical reporting in your narrative.** Use key figures to support your observations.
2.  **"Why might it have happened?" (Client-Centric Explanation)**: Provide potential explanations, correlations, or contributing factors. **Your primary goal here is deep causal reasoning, not just stating numerical correlations.** Explain *why* these results matter to *the client's business*. Frame explanations as answers to potential client questions (e.g., "You might be wondering why we saw a dip here... several factors related to [context] could be at play..."). **You MUST connect data to the comprehensive contextual analysis (client, competitors, seasonality, sector status).**
3.  If multiple advertising/marketing platforms are indicated, perform comparative analysis: Which platforms/campaigns appear to be most effective for specific client goals?
4.  KPI Focus: Consider relevant KPIs (Spend, impressions, clicks, CTR, CPC, conversions, CPA, ROAS, CVR for ads; user acquisition, behavior, traffic sources for GA4; sales funnels, lead gen for CRM; efficiency, quality, satisfaction for Ops). Explain their significance to the client.
5.  **In-depth Table Analysis (If data includes tables):**
    *   Your primary task is to deeply analyze these tables from the client's perspective. DO NOT simply reproduce or reformat.
    *   Extract Key Data & Calculate KPIs. State derived KPIs and explain what they mean for the client.
    *   Identify Trends & Patterns within the table. How do these trends affect the client's outcomes?
    *   Contextualize with Client Information ('${clientName}', '${sector}', '${campaignMarket}').
    *   Integrate 'Additional Notes' from user: '${additionalContext || "None provided"}'.
    *   Discuss Performance vs. Expectations if possible, in relation to client goals.
    *   Synthesize and Summarize: What is the main story this table tells *your client*, considering all context?

${creativeAnalysisSystemInstruction}

**Actionable Recommendations (Client-Focused & Concrete - CRITICAL):**
Suggest potential actions or strategic considerations. **Recommendations must be highly concrete, actionable, and specific. Explain *how* the client can implement them. Avoid vague suggestions. Prioritize recommendations that deliver clear business value.** Frame these as clear, direct advice to the client. For example, "We recommend you consider [action] because [benefit to client's business]" or "A strategic next step for your team could be to [action] to achieve [client outcome]."
    Recommendations should primarily address the *underlying causes and strategic opportunities* identified in your 'Why might it have happened?' and your visual analysis sections, explicitly tailored to the client's context, competitive situation, seasonality, and sector status.
    **Crucially, ensure one of your concluding recommendations encourages the client to use the Optimizer Tool (link: ${optimizerToolUrl}) to act upon the insights you've provided and to drive the next phase of improvements.** This recommendation should form a bridge to the next cycle of analysis. For example:
    *   "**Next Steps with the Optimizer:** To implement the suggested improvements (both for data-driven campaigns and visual creatives) and continuously refine performance, we recommend leveraging the Optimizer Tool. This will allow us to apply these targeted adjustments and systematically track their impact in our subsequent analyses."
    *   Or, if specific areas for optimization were identified: "For instance, to address the [specific area like 'ad creative visual appeal' or 'conversion funnel drop-off'], the Optimizer Tool can assist in A/B testing new visual variants or refining [specific elements]. We can then evaluate the results of these optimizations in our next insights report."
    Make this recommendation distinct and actionable, emphasizing the cyclical nature of analysis and optimization.

**Final Sentiment Summary (CRITICAL):**
After providing all the above analysis and recommendations, add a final, distinct section.
1.  Start this section with a Markdown horizontal rule (\`---\`).
2.  On the next line, add the heading \`## Sentiment Analysis\`.
3.  Below this heading, provide a concise sentiment summary of the user's input data. Clearly state the overall sentiment (e.g., "Overall Sentiment: **Positive**") and provide a 1-2 sentence justification based on the key data points (e.g., "...due to strong growth in conversions and high ROAS.").

**Output Formatting Instructions:**
- Structure your output clearly with distinct headings (e.g., "# Performance Overview for ${clientName || 'Your Campaigns'}", "## Understanding Key Metrics", "### Trend for Clicks and Its Impact", "## Factors We Considered", "## Visual & Creative Performance Review", "### Analysis of Image: [Creative_Filename.png]", "## Moving Forward with Optimization").
- Utilize bullet points, numbered lists, and short paragraphs. **When using bullet points, ensure they are short, clear, and impactful. If you generate tables within your textual insight, keep them simple and focused on the most important data for quick analysis.** Ensure proper line spacing and indentation for maximum readability.
- **Crucially, highlight the most important findings, conclusions, and actionable recommendations by enclosing them in double asterisks (Markdown for bold), like so: **This is a key insight for your business.****
- Maintain a professional, clear, and insightful tone. ${languageInstruction}
If using Google Search, ensure retrieved information directly supports the contextual analysis (client, competitors, seasonality, market status) and is explained in a client-relevant manner.`;

  const requestParams: GenerateContentParameters = {
      model: GEMINI_TEXT_MODEL,
      contents: contentParts, // Use the array of parts
      config: {
        systemInstruction: systemInstruction,
        thinkingConfig: { thinkingBudget: 1024 * 8 } // Activate Thinking Config (8k tokens) for robust data verification
      }
  };

  if (useSearch && requestParams.config) {
    requestParams.config.tools = [{ googleSearch: {} }];
  }
  console.log(`GeminiService: Sending multimodal request to Gemini. Number of parts: ${contentParts.length}. System Instruction (first 200): ${String(systemInstruction).substring(0,200)}... Prompt Text (first 200): ${String(userPromptText).substring(0,200)}...`); 

  try {
    const response: GenerateContentResponse = await ai.models.generateContent(requestParams);
    return processGeminiResponse(response);
  } catch (error: unknown) {
    throw handleGeminiError(error, language);
  }
};


export const generateStructuredInsight = async (
  request: StructuredInsightRequest,
  language: Language
): Promise<GenerateContentGeminiResponse> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.error("GeminiService: API_KEY environment variable not set or is empty for generateStructuredInsight.");
    throw new Error(getText(language, 'ERROR_API_KEY_MISSING'));
  }
  const ai = new GoogleGenAI({ apiKey: apiKey });

  const timePeriodLabel = getTimePeriodLabel(language, request.timePeriod, request.startDate, request.endDate); 
  
  const basePromptFn = PROMPT_TEMPLATES[request.platform];
  if (!basePromptFn) {
      throw new Error(`Structured analysis for platform ${request.platform} is not currently supported with a specific template.`);
  }

  // The new prompt from constants.ts now contains the persona and full instructions.
  const userPrompt = basePromptFn(timePeriodLabel, request.currentMetrics, request.previousMetrics, language, request.campaignGoals);
  
  console.log("GeminiService: Sending request to Gemini for structured insight. Full Prompt:", userPrompt);

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: userPrompt,
    });
    return processGeminiResponse(response);
  } catch (error: unknown) {
    throw handleGeminiError(error, language);
  }
};


export const generatePresentationJson = async (
  originalData: string,
  textInsight: string, // This insight now contains visual analysis from the first Gemini call
  language: Language,
  brandStyle: BrandStyle, 
  context: {
    clientName?: string;
    sector?: string;
    campaignMarket?: string;
    additionalContext?: string;
    specificQuestions?: string;
    uploadedCreatives?: UploadedImage[]; 
  }
): Promise<PresentationData> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.error("GeminiService: API_KEY environment variable not set or is empty for generatePresentationJson.");
    throw new Error(getText(language, 'ERROR_API_KEY_MISSING'));
  }
  const ai = new GoogleGenAI({ apiKey: apiKey });

  const creativeFilenames = context.uploadedCreatives?.map(c => c.name) || [];

  // PROMPT_TEMPLATE_FOR_PPT_JSON is in constants.ts and will be updated there
  // to reflect that textInsight contains the visual analysis.
  const userPrompt = PROMPT_TEMPLATE_FOR_PPT_JSON(
    originalData,
    textInsight, // This is key: it now includes the image analysis.
    language,
    brandStyle, 
    creativeFilenames, 
    context.clientName,
    context.sector,
    context.campaignMarket,
    context.additionalContext,
    context.specificQuestions
  );
  console.log("GeminiService: Sending request to Gemini for presentation JSON. Prompt length:", userPrompt.length, "Brand Style:", brandStyle);
  console.log("GeminiService: Text insight provided to PPT JSON prompt (first 300 chars):", textInsight.substring(0,300));


  let jsonStr = ""; 
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: GEMINI_TEXT_MODEL,
        contents: userPrompt,
        config: {
            responseMimeType: "application/json",
        },
    });

    jsonStr = response.text.trim(); 
    console.log("GeminiService: Raw JSON string for presentation from AI (first 300 chars):", jsonStr.substring(0,300)); 
    
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      // FIX: Assign the captured string group from the regex match, not the entire match array.
      jsonStr = match[2].trim();
    }
    
    // FIX: Complete the function body to parse the JSON and return it, which also resolves the "must return a value" error.
    try {
        const presentationData: PresentationData = JSON.parse(jsonStr);
        // Basic validation
        if (!presentationData || (!presentationData.slides && !presentationData.motortecReportContent)) {
            console.error("GeminiService: Parsed JSON is empty or missing 'slides'/'motortecReportContent' property.");
            throw new Error("Parsed JSON is invalid or incomplete.");
        }
        return presentationData;
    } catch (parseError) {
        console.error("GeminiService: Failed to parse JSON response from AI for presentation. Raw string:", jsonStr);
        throw new Error("Failed to parse JSON response from AI for presentation. The AI's response was not valid JSON.");
    }
    
  } catch (error: unknown) {
    throw handleGeminiError(error, language);
  }
};