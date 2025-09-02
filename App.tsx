
import React, { useState, useCallback, useEffect } from 'react';
import { DataInputForm } from './components/DataInputForm.tsx';
import { StructuredDataInputForm } from './components/StructuredDataInputForm.tsx';
import { InsightDisplay } from './components/InsightDisplay.tsx';
import { LoadingSpinner } from './components/LoadingSpinner.tsx';
import { ErrorMessage } from './components/ErrorMessage.tsx';
import { FeedbackButton } from './components/FeedbackButton.tsx';
import { HelpBotButton } from './components/HelpBotButton.tsx';
import { HelpBotModal } from './components/HelpBotModal.tsx';
import { generateInsightWithGemini, generateStructuredInsight, generatePresentationJson } from './services/geminiService.ts';
import { generatePptxFromData } from './services/presentationService.ts';
import { LANGUAGE_OPTIONS, BRAND_STYLE_OPTIONS, getText, HELP_TOPICS_LIST } from './constants.ts'; 
import { initializeMetaSdk } from './services/metaApiService.ts';
import { InsightRequest, GenerateContentGeminiResponse, GroundingChunk, DataSource, StructuredInsightRequest, Language, PresentationData, UploadedImage, BrandStyle } from './types.ts';

type AnalysisMode = "aggregated" | "structured";

const App: React.FC = () => {
  const [insight, setInsight] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [groundingSources, setGroundingSources] = useState<GroundingChunk[]>([]);
  const [currentMode, setCurrentMode] = useState<AnalysisMode>("aggregated");
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(Language.ES);
  const [selectedBrandStyle, setSelectedBrandStyle] = useState<BrandStyle>(BrandStyle.LLYC_DEFAULT);
  const [isApiKeyMissingAtLoad, setIsApiKeyMissingAtLoad] = useState<boolean>(false);

  const [lastAggregatedRequest, setLastAggregatedRequest] = useState<InsightRequest | null>(null);
  const [isGeneratingPresentation, setIsGeneratingPresentation] = useState<boolean>(false);
  const [presentationError, setPresentationError] = useState<string | null>(null);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);


  useEffect(() => {
    // Initialize the Meta SDK when the app loads. The service handles the details.
    initializeMetaSdk().catch(err => {
        // Log the error, but don't show it to the user here. 
        // The ApiConnector will handle user-facing errors on connection attempt.
        console.error("Failed to initialize Meta SDK on app load:", err);
    });
  }, []);

  useEffect(() => {
    const apiKeyIsPresent = typeof process !== 'undefined' && 
                            process.env && 
                            typeof process.env.API_KEY === 'string' && 
                            process.env.API_KEY.trim() !== '';
    
    if (!apiKeyIsPresent) {
      console.warn("CRITICAL: API_KEY is not defined in the environment (e.g., process.env.API_KEY) or is empty. Application will not function correctly.");
      setIsApiKeyMissingAtLoad(true);
      setError(getText(selectedLanguage, 'API_KEY_MISSING_BANNER_MESSAGE'));
      setInsight(null); 
    }
  }, [selectedLanguage]);

  const resetStateForNewRequest = () => {
    setIsLoading(true);
    setError(null);
    setInsight(null); // Explicitly set to null
    setGroundingSources([]);
    setPresentationError(null);
  };

  const handleGenerateAggregatedInsight = useCallback(async (request: InsightRequest) => {
    console.log("App: Attempting to generate aggregated insight. Request (creative names):", JSON.stringify({...request, uploadedCreatives: request.uploadedCreatives?.map(c => c.name) }), "Language:", selectedLanguage, "Brand Style:", request.brandStyle); 
    setLastAggregatedRequest(request); 
    
    const apiKeyIsPresent = typeof process !== 'undefined' && process.env && typeof process.env.API_KEY === 'string' && process.env.API_KEY.trim() !== '';
    if (!apiKeyIsPresent) {
        console.error("App: API Key missing for aggregated insight.");
        setError(getText(selectedLanguage, 'API_KEY_MISSING_BANNER_MESSAGE'));
        setIsLoading(false);
        setInsight(null);
        return;
    }

    resetStateForNewRequest();

    const enableSearch = request.selectedDataSources.some(ds =>
      [DataSource.GA4, DataSource.GOOGLE_ADS, DataSource.META_ADS].includes(ds)
    );
    console.log("App: Search grounding enabled for aggregated insight:", enableSearch);

    try {
      const geminiResponse: GenerateContentGeminiResponse = await generateInsightWithGemini(
        request.selectedDataSources,
        request.data,
        selectedLanguage,
        request.clientName,
        request.sector,
        request.campaignMarket,
        request.additionalContext,
        request.specificQuestions,
        request.uploadedCreatives, 
        enableSearch
      );
      console.log("App: Aggregated insight generation successful. Gemini Response Text (first 100 chars):", geminiResponse.text.substring(0,100));
      setInsight(geminiResponse.text); // This can be an empty string
      if (geminiResponse.candidates && geminiResponse.candidates[0]?.groundingMetadata?.groundingChunks) {
        setGroundingSources(geminiResponse.candidates[0].groundingMetadata.groundingChunks.filter(chunk => chunk.web));
      }
    } catch (e: unknown) {
      console.error("App: Error in handleGenerateAggregatedInsight:", e);
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError(getText(selectedLanguage, 'ERROR_UNEXPECTED'));
      }
      setInsight(null); // Clear insight on error
    } finally {
      setIsLoading(false);
    }
  }, [selectedLanguage]); 

  const handleGenerateStructuredSummary = useCallback(async (request: StructuredInsightRequest) => {
    console.log("App: Attempting to generate structured summary. Request:", JSON.stringify(request), "Language:", selectedLanguage); 
    setLastAggregatedRequest(null); 

    const apiKeyIsPresent = typeof process !== 'undefined' && process.env && typeof process.env.API_KEY === 'string' && process.env.API_KEY.trim() !== '';
    if (!apiKeyIsPresent) {
        console.error("App: API Key missing for structured summary.");
        setError(getText(selectedLanguage, 'API_KEY_MISSING_BANNER_MESSAGE'));
        setIsLoading(false);
        setInsight(null);
        return;
    }

    resetStateForNewRequest();

    try {
      const geminiResponse: GenerateContentGeminiResponse = await generateStructuredInsight(
        request,
        selectedLanguage
      );
      console.log("App: Structured summary generation successful. Gemini Response Text (first 100 chars):", geminiResponse.text.substring(0,100));
      setInsight(geminiResponse.text); // This can be an empty string
       if (geminiResponse.candidates && geminiResponse.candidates[0]?.groundingMetadata?.groundingChunks) {
        setGroundingSources(geminiResponse.candidates[0].groundingMetadata.groundingChunks.filter(chunk => chunk.web));
      }
    } catch (e: unknown) {
      console.error("App: Error in handleGenerateStructuredSummary:", e);
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError(getText(selectedLanguage, 'ERROR_UNEXPECTED'));
      }
      setInsight(null); // Clear insight on error
    } finally {
      setIsLoading(false);
    }
  }, [selectedLanguage]);

  const handleGeneratePresentation = useCallback(async () => {
    console.log("[App.handleGeneratePresentation] Initiated.");
    if (insight === null || insight.trim() === '' || !lastAggregatedRequest) { // Check if insight is null or truly empty
      const errorMsg = getText(selectedLanguage, 'ERROR_PPT_GENERATION', 'Missing or empty insight, or original request data.');
      console.error("[App.handleGeneratePresentation] Error:", errorMsg);
      setPresentationError(errorMsg);
      return;
    }

    const apiKeyIsPresent = typeof process !== 'undefined' && process.env && typeof process.env.API_KEY === 'string' && process.env.API_KEY.trim() !== '';
    if (!apiKeyIsPresent) {
        const errorMsg = getText(selectedLanguage, 'API_KEY_MISSING_BANNER_MESSAGE');
        console.error("[App.handleGeneratePresentation] Error: API Key missing.");
        setPresentationError(errorMsg);
        return;
    }

    setIsGeneratingPresentation(true);
    setPresentationError(null);
    console.log("[App.handleGeneratePresentation] Calling generatePresentationJson. Language:", selectedLanguage, "Brand Style:", lastAggregatedRequest.brandStyle);

    try {
      const presentationJson: PresentationData = await generatePresentationJson(
        lastAggregatedRequest.data,
        insight, // insight is guaranteed to be a non-empty string here
        selectedLanguage,
        lastAggregatedRequest.brandStyle,
        {
          clientName: lastAggregatedRequest.clientName,
          sector: lastAggregatedRequest.sector,
          campaignMarket: lastAggregatedRequest.campaignMarket,
          additionalContext: lastAggregatedRequest.additionalContext,
          specificQuestions: lastAggregatedRequest.specificQuestions,
          uploadedCreatives: lastAggregatedRequest.uploadedCreatives 
        }
      );
      console.log("[App.handleGeneratePresentation] Presentation JSON received (first 500 chars):", JSON.stringify(presentationJson).substring(0,500));
      
      console.log("[App.handleGeneratePresentation] Calling generatePptxFromData.");
      try {
        await generatePptxFromData(presentationJson, selectedLanguage, lastAggregatedRequest.uploadedCreatives);
        console.log("[App.handleGeneratePresentation] generatePptxFromData completed successfully.");
      } catch (pptxError: unknown) {
        console.error("[App.handleGeneratePresentation] Error specifically from generatePptxFromData:", pptxError);
        const errorMsg = getText(selectedLanguage, 'ERROR_PPT_GENERATION', pptxError instanceof Error ? pptxError.message : String(pptxError));
        setPresentationError(errorMsg);
      }

    } catch (e: unknown) {
      console.error("[App.handleGeneratePresentation] Error during presentation generation (likely from generatePresentationJson):", e);
      if (e instanceof Error) {
         if (e.message.includes("Failed to parse JSON response")) { 
            setPresentationError(getText(selectedLanguage, 'ERROR_PPT_JSON_PARSE'));
        } else {
            setPresentationError(getText(selectedLanguage, 'ERROR_PPT_GENERATION', e.message));
        }
      } else {
        setPresentationError(getText(selectedLanguage, 'ERROR_PPT_GENERATION', getText(selectedLanguage, 'ERROR_UNEXPECTED')));
      }
    } finally {
      setIsGeneratingPresentation(false);
      console.log("[App.handleGeneratePresentation] Finalized.");
    }
  }, [insight, lastAggregatedRequest, selectedLanguage]);


  const renderForm = () => {
    if (currentMode === "aggregated") {
      return <DataInputForm 
                onSubmit={handleGenerateAggregatedInsight} 
                isLoading={isLoading} 
                language={selectedLanguage}
                selectedBrandStyle={selectedBrandStyle} 
                onBrandStyleChange={setSelectedBrandStyle}
             />;
    }
    return <StructuredDataInputForm onSubmit={handleGenerateStructuredSummary} isLoading={isLoading} language={selectedLanguage} />;
  };
  
  const getPlaceholderTextForInsightDisplay = () => {
    if (currentMode === "aggregated") {
        return getText(selectedLanguage, 'PLACEHOLDER_AGGREGATED_RESULTS');
    }
    return getText(selectedLanguage, 'PLACEHOLDER_STRUCTURED_RESULTS');
  };

  const handleModeChange = (newMode: AnalysisMode) => {
    if (currentMode !== newMode) {
        setCurrentMode(newMode);
        setInsight(null); // Clear insight when changing mode
        setError(null);
        setGroundingSources([]);
        setLastAggregatedRequest(null);
        setPresentationError(null);
    }
  };

  const openHelpModal = () => setIsHelpModalOpen(true);
  const closeHelpModal = () => setIsHelpModalOpen(false);

  return (
    <div className="min-h-screen bg-[#0A263B] text-[#FFFFFF] p-4 sm:p-8 flex flex-col items-center" style={{ fontFamily: "'Open Sans', sans-serif" }}>
      {isApiKeyMissingAtLoad && !error && ( // Only show banner if no other error is already displayed
        <div className="w-full max-w-5xl p-4 mb-6 bg-[#F54963] border border-[#F54963]/80 text-white rounded-lg shadow-lg text-sm">
          <strong className="font-semibold block mb-1" style={{fontFamily: "'Montserrat', sans-serif"}}>{getText(selectedLanguage, 'API_KEY_MISSING_BANNER_TITLE')}</strong>
          <p>{getText(selectedLanguage, 'API_KEY_MISSING_BANNER_MESSAGE')}</p>
        </div>
      )}
      <header className="w-full max-w-5xl mb-6 text-center">
        <div className="flex justify-between items-center mb-2">
            <div className="w-1/3"> {/* Spacer */} </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F54963] py-2 w-1/3 text-center" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {getText(selectedLanguage, 'APP_TITLE')}
            </h1>
            <div className="w-1/3 flex justify-end">
                <div className="relative">
                    <select
                        id="language-select"
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value as Language)}
                        disabled={isLoading || isGeneratingPresentation}
                        className="bg-white border border-[#ACB4B6] text-[#0A263B] text-xs sm:text-sm rounded-md p-2 pr-8 focus:ring-[#36A7B7] focus:border-[#36A7B7] appearance-none"
                        aria-label="Select language for AI response"
                    >
                        {LANGUAGE_OPTIONS.map(lang => (
                        <option key={lang.value} value={lang.value}>{lang.label}</option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#878E90]">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
            </div>
        </div>
        <p className="text-[#6D7475] text-sm sm:text-base">
          {getText(selectedLanguage, 'APP_SUBTITLE')}
        </p>
      </header>

      <main className="w-full max-w-5xl bg-[#FFFFFF] shadow-2xl rounded-xl p-6 sm:p-8">
        <div className="mb-6 flex border-b border-[#ACB4B6]">
          <button
            onClick={() => handleModeChange("aggregated")}
            disabled={isLoading || isGeneratingPresentation}
            className={`py-3 px-4 sm:px-6 font-medium text-sm sm:text-base rounded-t-md focus:outline-none transition-colors duration-150
                        ${currentMode === "aggregated" ? 'border-b-2 border-[#F54963] text-[#F54963] bg-[#F54963]/10' : 'text-[#6D7475] hover:text-[#F54963]'}`}
            style={{fontFamily: "'Montserrat', sans-serif"}}
          >
            {getText(selectedLanguage, 'TAB_AGGREGATED')}
          </button>
          <button
            onClick={() => handleModeChange("structured")}
            disabled={isLoading || isGeneratingPresentation}
            className={`py-3 px-4 sm:px-6 font-medium text-sm sm:text-base rounded-t-md focus:outline-none transition-colors duration-150
                        ${currentMode === "structured" ? 'border-b-2 border-[#F54963] text-[#F54963] bg-[#F54963]/10' : 'text-[#6D7475] hover:text-[#F54963]'}`}
            style={{fontFamily: "'Montserrat', sans-serif"}}
          >
            {getText(selectedLanguage, 'TAB_STRUCTURED')}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="md:pr-3">
            {renderForm()}
          </div>
          
          <div className="md:pl-3 md:border-l md:border-[#ACB4B6] flex flex-col">
            <h2 className="text-2xl font-semibold mb-4 text-[#0A263B]" style={{fontFamily: "'Montserrat', sans-serif"}}>
              {currentMode === "aggregated" ? getText(selectedLanguage, 'SECTION_TITLE_GENERATED_INSIGHTS') : getText(selectedLanguage, 'SECTION_TITLE_CAMPAIGN_SUMMARY')}
            </h2>
            <div className="flex-grow overflow-y-auto max-h-[calc(100vh-380px)] pr-2 custom-scrollbar text-[#0A263B]">
              {isLoading && <LoadingSpinner language={selectedLanguage} />}
              {error && !isLoading && <ErrorMessage message={error} language={selectedLanguage} />}
              
              {!isLoading && !error && (
                <InsightDisplay 
                  insight={insight} // Pass insight directly, can be null
                  sources={groundingSources} 
                  language={selectedLanguage}
                  currentMode={currentMode}
                  onGeneratePresentation={handleGeneratePresentation}
                  isGeneratingPresentation={isGeneratingPresentation}
                  presentationError={presentationError}
                  placeholderText={getPlaceholderTextForInsightDisplay()}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full max-w-5xl mt-12 text-center text-[#D1D5DB] text-xs">
        <p>&copy; {new Date().getFullYear()} {getText(selectedLanguage, 'FOOTER_TEXT')}</p>
      </footer>
      
      <FeedbackButton language={selectedLanguage} />
      <HelpBotButton language={selectedLanguage} onClick={openHelpModal} />
      <HelpBotModal 
        isOpen={isHelpModalOpen} 
        onClose={closeHelpModal} 
        language={selectedLanguage} 
        topics={HELP_TOPICS_LIST}
      />
    </div>
  );
};

export default App;