import React, { useMemo, useState, useEffect } from 'react';
import { marked, Renderer, Tokens } from 'marked'; 
import { GroundingChunk, Language } from '../types.ts'; 
import { getText } from '../constants.ts'; 
import { ErrorMessage } from './ErrorMessage.tsx'; 

interface InsightDisplayProps {
  insight: string | null; 
  sources: GroundingChunk[];
  language: Language; 
  currentMode: "aggregated" | "structured"; 
  onGeneratePresentation: () => void;
  isGeneratingPresentation: boolean;
  presentationError: string | null;
  placeholderText: string;
}

// Simple manual slugify function as a fallback
const manualSlugify = (textInput: any): string => {
  const text = String(textInput || '');
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') 
    .replace(/[^\w-]+/g, '') 
    .replace(/--+/g, '-'); 
};

const escapeHtml = (unsafe: string): string => {
    if (typeof unsafe !== 'string') return '';
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
};

const createCustomLlycRenderer = (): Renderer => {
    const customRenderer = new Renderer();

    customRenderer.heading = function(this: Renderer, token: Tokens.Heading): string {
      const originalText = token.text === undefined ? '' : token.text;
      let textContent = originalText; 
      const id = manualSlugify(originalText); 

      if (this.parser && typeof this.parser.parseInline === 'function' && token.tokens && token.tokens.length > 0) {
        try {
          const parsed = this.parser.parseInline(token.tokens);
          if (typeof parsed === 'string') textContent = parsed;
        } catch (e) {
          console.warn("Markdown Renderer (heading): Error using this.parser.parseInline, falling back to originalText. Error:", e, "Raw token:", token.raw);
        }
      }
      
      return `
              <h${token.depth} id="${id}" class="font-montserrat text-llyc-azul-oscuro mt-4 mb-2 ${token.depth === 1 ? 'text-xl font-bold' : token.depth === 2 ? 'text-lg font-semibold' : 'text-md font-semibold'}">
                ${textContent}
              </h${token.depth}>`;
    };

    customRenderer.strong = function(this: Renderer, token: Tokens.Strong): string {
      let textContent = token.text === undefined ? '' : token.text; 
       if (this.parser && typeof this.parser.parseInline === 'function' && token.tokens && token.tokens.length > 0) {
        try {
          const parsed = this.parser.parseInline(token.tokens);
          if (typeof parsed === 'string') textContent = parsed;
        } catch (e) {
          console.warn("Markdown Renderer (strong): Error using this.parser.parseInline, falling back to token.text. Error:", e, "Raw token:", token.raw);
        }
      }
      return `<strong class="text-llyc-azul-oscuro font-semibold">${textContent}</strong>`;
    };
    
    customRenderer.link = function(this: Renderer, token: Tokens.Link): string {
      let textContent = token.text === undefined ? '' : token.text; 
      if (this.parser && typeof this.parser.parseInline === 'function' && token.tokens && token.tokens.length > 0) {
        try {
          const parsed = this.parser.parseInline(token.tokens);
          if (typeof parsed === 'string') textContent = parsed;
        } catch (e) {
          console.warn("Markdown Renderer (link): Error using this.parser.parseInline, falling back to token.text. Error:", e, "Raw token:", token.raw);
        }
      }
      return `<a href="${token.href || ''}" title="${token.title || ''}" target="_blank" rel="noopener noreferrer" class="text-llyc-red hover:text-llyc-red-dark underline">${textContent}</a>`;
    };

    customRenderer.listitem = function(this: Renderer, token: Tokens.ListItem): string {
        let textContent = token.text === undefined ? '' : token.text;

        if (this.parser && typeof this.parser.parseInline === 'function' && token.tokens && token.tokens.length > 0) {
            try {
                const parsed = this.parser.parseInline(token.tokens);
                if (typeof parsed === 'string') {
                    textContent = parsed;
                } else {
                    console.warn("Markdown Renderer (listitem): this.parser.parseInline did not return a string, using token.text as fallback. Returned:", parsed, "Raw token:", token.raw);
                }
            } catch(e) {
                console.warn("Markdown Renderer (listitem): Error using this.parser.parseInline, falling back to token.text. Error:", e, "Raw token:", token.raw);
            }
        }
        return `<li class="text-llyc-gris-01 ml-5 mb-1">${textContent}</li>`;
    };
    
    customRenderer.list = function(this: Renderer, token: Tokens.List): string {
      if (!token.items || !Array.isArray(token.items) || token.items.length === 0) {
        console.warn("Markdown Renderer (list): token.items is undefined, not an array, or empty. Rendering empty list. Token:", token);
        return token.ordered ? "<ol class=\"list-decimal list-inside text-llyc-gris-01 space-y-1 my-2\"></ol>" : "<ul class=\"list-disc list-inside text-llyc-gris-01 space-y-1 my-2\"></ul>";
      }

      const body = token.items.map(item => this.listitem(item as Tokens.ListItem)).join('');
      if (token.ordered) {
        return `<ol class="list-decimal list-inside text-llyc-gris-01 space-y-1 my-2">${body}</ol>`;
      }
      return `<ul class="list-disc list-inside text-llyc-gris-01 space-y-1 my-2">${body}</ul>`;
    };

    customRenderer.paragraph = function(this: Renderer, token: Tokens.Paragraph): string {
      let textContent = token.text === undefined ? '' : token.text;

      if (this.parser && typeof this.parser.parseInline === 'function' && token.tokens && token.tokens.length > 0) {
        try {
            const parsed = this.parser.parseInline(token.tokens);
            if (typeof parsed === 'string') {
                textContent = parsed;
            } else {
                console.warn("Markdown Renderer (paragraph): this.parser.parseInline did not return a string, using token.text as fallback. Returned:", parsed, "Raw token:", token.raw);
            }
        } catch(e) {
            console.warn("Markdown Renderer (paragraph): Error using this.parser.parseInline, falling back to token.text. Error:", e, "Raw token:", token.raw);
        }
      }
      return `<p class="text-llyc-gris-01 mb-2 leading-relaxed">${textContent}</p>`
    }

    // Table rendering with LLYC styles
    customRenderer.table = function(header: string, body: string): string {
        return `
            <div class="overflow-x-auto my-4 custom-scrollbar rounded-md shadow-sm border border-[#ACB4B6]">
                <table class="min-w-full border-collapse bg-white">
                    <thead>${header}</thead>
                    <tbody>${body}</tbody>
                </table>
            </div>`;
    };

    customRenderer.tablerow = function(content: string): string {
        // The 'content' here is already a string of <td> or <th> elements.
        // Adding hover effect to the row.
        return `<tr class="border-b border-[#ACB4B6] last:border-b-0 bg-white hover:bg-[#0A263B]/[0.03]">${content}</tr>`;
    };

    customRenderer.tablecell = function(content: string, flags: { header: boolean; align: 'center' | 'left' | 'right' | null; }): string {
        // 'content' is the already parsed inline content of the cell.
        const alignClass = flags.align ? `text-${flags.align}` : 'text-left';
        if (flags.header) {
            return `<th class="p-3 ${alignClass} font-montserrat font-semibold text-[#0A263B] bg-[#0A263B]/[0.07] border-r border-[#ACB4B6] last:border-r-0">${content}</th>`;
        }
        return `<td class="p-3 ${alignClass} text-[#6D7475] font-open-sans border-r border-[#ACB4B6] last:border-r-0">${content}</td>`;
    };

    return customRenderer;
};

const llycMarkdownRenderer = createCustomLlycRenderer();

const ClipboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m9.75 0V9A1.875 1.875 0 0018.125 7.125H15.75c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125h.75m-9.75 0h.008v.008H9.75V12m0 0h3.75m-3.75 0a.375.375 0 01-.375-.375V9.375c0-.207.168-.375.375-.375h1.5a.375.375 0 01.375.375v2.25c0 .207-.168-.375-.375-.375h-1.5m-6.75-3.375a.75.75 0 00-.75.75v10.5a.75.75 0 00.75.75h9.75a.75.75 0 00.75-.75V12a.75.75 0 00-.75-.75H9.75L6.75 9z" />
    </svg>
);

const EmailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
);


export const InsightDisplay: React.FC<InsightDisplayProps> = ({ 
    insight, 
    sources, 
    language, 
    currentMode,
    onGeneratePresentation,
    isGeneratingPresentation,
    presentationError,
    placeholderText 
}) => {
  const [copyStatusMessage, setCopyStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (copyStatusMessage) {
      const timer = setTimeout(() => {
        setCopyStatusMessage(null);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [copyStatusMessage]);

  // STATE 1: Initial placeholder (insight is null)
  if (insight === null) {
    return (
      <div className="text-llyc-gris-02 p-4 border border-llyc-gris-03 rounded-lg bg-llyc-azul-oscuro/5 h-full flex flex-col items-center justify-center text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-llyc-gris-03 mb-3 opacity-70" viewBox="0 0 20 20" fill="currentColor">
          <path d="M11 3a1 1 0 100 2h.01a1 1 0 100-2H11zM11 6a1 1 0 011 1v3a1 1 0 01-2 0V7a1 1 0 011-1zM4.607 6.37A1 1 0 014 7v8a1 1 0 00.09.414l.05.093A8.001 8.001 0 0010 18c2.21 0 4.21-.895 5.657-2.343l.05-.093A1 1 0 0016 15V7a1 1 0 01-.607-.63L15 6H5l-.393.37zM12 19a1 1 0 01-1-1v-.01A8.093 8.093 0 0012 5.06v.006c.995.207 1.916.63 2.707 1.229A1.006 1.006 0 0115 7v8a.999.999 0 01-.293.707 6.003 6.003 0 01-2.707 1.229V18a1 1 0 01-1 1z" />
        </svg>
        <p className="text-sm">{placeholderText}</p>
      </div>
    );
  }

  // STATE 2: Insight generation has been attempted (insight is now a string, possibly empty)
  const isEffectivelyEmpty = insight.trim() === '';

  const processedInsightHtml = useMemo(() => {
    if (isEffectivelyEmpty) return ''; // No need to process if it's effectively empty
    try {
        const html = marked.parse(insight, { renderer: llycMarkdownRenderer, gfm: true, breaks: true }) as string;
        // Check if the HTML produced is just empty lists or similar empty structures.
        // A simple check: if after stripping tags, it's empty, consider it visually empty for display purposes.
        if (html && html.replace(/<[^>]*>/g, '').trim() !== '') {
            return html;
        }
        // If markdown results in visually empty HTML, but the original insight wasn't just whitespace,
        // show the raw insight pre-formatted to ensure user sees something.
        return `<pre style="white-space: pre-wrap; word-wrap: break-word; color: #0A263B; background-color: #f0f0f0; border: 1px solid #ccc; padding: 10px; font-family: 'Courier New', Courier, monospace; font-size: 0.875rem;">${escapeHtml(insight)}</pre>`;
    } catch (error) {
        console.error("[InsightDisplay useMemo] Error during marked.parse. Falling back to preformatted text. Error:", error, "Insight was:", `"${insight.substring(0,100)}..."`);
        return `<pre style="white-space: pre-wrap; word-wrap: break-word; color: #B91C1C; background-color: #FEE2E2; border: 1px solid #FCA5A5; padding: 10px; font-family: 'Courier New', Courier, monospace; font-size: 0.875rem;">FALLBACK DUE TO ERROR:\n${escapeHtml(insight)}</pre>`;
    }
  }, [insight, isEffectivelyEmpty]);

  const handleCopyInsight = async () => {
    if (isEffectivelyEmpty) return; 
    try {
      await navigator.clipboard.writeText(insight);
      setCopyStatusMessage(getText(language, 'MESSAGE_COPIED_SUCCESS'));
    } catch (err) {
      console.error('Failed to copy insight: ', err);
    }
  };

  const handleShareViaEmail = () => {
    if (isEffectivelyEmpty) return;

    const subject = encodeURIComponent(getText(language, 'EMAIL_SUBJECT_INSIGHT'));
    let body = insight;

    if (sources && sources.length > 0) {
        body += "\n\n---\n" + getText(language, 'LABEL_GROUNDING_SOURCES') + "\n";
        sources.forEach(sourceItem => { // Renamed to avoid conflict
            if (sourceItem.web) {
                body += `- ${sourceItem.web.title || ''}: ${sourceItem.web.uri}\n`;
            }
        });
    }
    const mailtoLink = `mailto:?subject=${subject}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, '_blank');
  };

  return (
    <React.Fragment>
      <div className="space-y-4 h-full"> {/* Ensure outer container can provide height for h-full */}
          <div 
            className={`relative p-4 bg-llyc-azul-oscuro/5 border border-llyc-gris-03 rounded-lg shadow text-[#0A263B] ${isEffectivelyEmpty ? 'h-full flex flex-col' : ''}`}
          >
            <div className="absolute top-2.5 right-2.5 flex items-center space-x-2 z-10"> {/* Added z-10 */}
              {copyStatusMessage && (
                <span className="text-xs text-[#36A7B7] bg-[#36A7B7]/10 px-2 py-0.5 rounded-md transition-opacity duration-300">
                  {copyStatusMessage}
                </span>
              )}
              <button
                type="button"
                onClick={handleCopyInsight}
                title={getText(language, 'BUTTON_COPY_INSIGHT')}
                aria-label={getText(language, 'BUTTON_COPY_INSIGHT')}
                disabled={isEffectivelyEmpty}
                className="p-1.5 bg-[#36A7B7] text-white rounded-md hover:bg-[#2A8E9A] focus:outline-none focus:ring-2 focus:ring-[#36A7B7] focus:ring-offset-1 focus:ring-offset-llyc-azul-oscuro/5 transition-colors duration-150 disabled:opacity-50"
              >
                <ClipboardIcon />
              </button>
              <button
                type="button"
                onClick={handleShareViaEmail}
                title={getText(language, 'BUTTON_SHARE_INSIGHT_TOOLTIP')}
                aria-label={getText(language, 'BUTTON_SHARE_INSIGHT_TOOLTIP')}
                disabled={isEffectivelyEmpty}
                className="p-1.5 bg-[#36A7B7] text-white rounded-md hover:bg-[#2A8E9A] focus:outline-none focus:ring-2 focus:ring-[#36A7B7] focus:ring-offset-1 focus:ring-offset-llyc-azul-oscuro/5 transition-colors duration-150 disabled:opacity-50"
              >
                <EmailIcon />
              </button>
            </div>

            {isEffectivelyEmpty ? (
                <div className="flex-grow flex flex-col items-center justify-center text-center text-llyc-gris-02"> {/* Removed py-8, uses flex-grow now */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-llyc-gris-03 mb-3 opacity-70" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                    </svg>
                    <p className="text-sm">{getText(language, 'NO_SPECIFIC_INSIGHTS_GENERATED')}</p>
                </div>
            ) : (
                <div 
                    className="prose prose-sm max-w-none prose-llyc pt-8" // pt-8 to clear buttons
                    dangerouslySetInnerHTML={{ __html: processedInsightHtml }}
                />
            )}
            
            {sources && sources.length > 0 && !isEffectivelyEmpty && ( // Also hide sources if effectively empty
                <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="text-xs font-semibold text-[#0A263B] mb-2" style={{fontFamily: "'Montserrat', sans-serif"}}>
                    {getText(language, 'LABEL_GROUNDING_SOURCES')}
                </h4>
                <ul className="list-disc list-inside space-y-1">
                    {sources.map((sourceItem, index) =>
                    sourceItem.web ? (
                        <li key={index} className="text-xs text-[#6D7475]">
                        <a
                            href={sourceItem.web.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-[#F54963] underline"
                            title={sourceItem.web.title}
                        >
                            {sourceItem.web.title || sourceItem.web.uri}
                        </a>
                        </li>
                    ) : null
                    )}
                </ul>
                </div>
            )}
        </div>

        {currentMode === 'aggregated' && (
            <div className="mt-6 p-4 bg-gray-100 border border-gray-200 rounded-lg">
                <button
                    type="button"
                    onClick={onGeneratePresentation}
                    disabled={isGeneratingPresentation || isEffectivelyEmpty} // Disable if insight is empty
                    className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#0A263B] hover:bg-[#0E2A47] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-[#0A263B] disabled:opacity-60 disabled:cursor-not-allowed transition duration-150 ease-in-out"
                    style={{fontFamily: "'Montserrat', sans-serif", fontWeight: 600}}
                >
                    {isGeneratingPresentation ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {getText(language, 'LABEL_GENERATING_PPT')}
                    </>
                    ) : (
                    getText(language, 'BUTTON_GENERATE_PPT')
                    )}
                </button>
                {presentationError && (
                    <div className="mt-4">
                        <ErrorMessage message={presentationError} language={language} />
                    </div>
                )}
            </div>
        )}
    </div>
  </React.Fragment>
  );
};