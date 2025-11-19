
import React, { useMemo, useState, useEffect } from 'react';
import { marked, Renderer } from 'marked'; 
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
  const text = String(textInput || '').replace(/<[^>]+>/g, ''); // Strip any inner HTML before slugifying
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
    const renderer = new Renderer();

    renderer.heading = (text: string, level: number): string => {
      const id = manualSlugify(text);
      const levelClasses = {
        1: 'text-xl font-bold',
        2: 'text-lg font-semibold',
        3: 'text-md font-semibold',
      }[level] || 'text-md font-semibold';
      
      return `<h${level} id="${id}" class="font-montserrat text-llyc-azul-oscuro mt-4 mb-2 ${levelClasses}">${text}</h${level}>`;
    };

    renderer.strong = (text: string): string => {
      return `<strong class="text-llyc-azul-oscuro font-semibold">${text}</strong>`;
    };
    
    renderer.link = (href: string | null, title: string | null, text: string): string => {
      return `<a href="${href || ''}" title="${title || ''}" target="_blank" rel="noopener noreferrer" class="text-llyc-red hover:text-llyc-red-dark underline">${text}</a>`;
    };

    renderer.listitem = (text: string): string => {
        // The parsed text for a list item often comes wrapped in a paragraph. 
        // We strip it to avoid extra margins from our custom paragraph renderer inside the list.
        const cleanedText = text.startsWith('<p>') && text.endsWith('</p>') ? text.slice(3, -4) : text;
        return `<li class="font-open-sans text-sm text-[#6D7475] mb-1">${cleanedText}</li>`;
    };
    
    renderer.list = (body: string, ordered: boolean): string => {
      const tag = ordered ? 'ol' : 'ul';
      const listStyle = ordered ? 'list-decimal' : 'list-disc';
      return `<${tag} class="font-open-sans text-sm text-[#6D7475] ${listStyle} list-inside space-y-1 my-2 pl-4">${body}</${tag}>`;
    };

    renderer.paragraph = (text: string): string => {
      // Avoid wrapping table content in paragraphs
      if (text.includes('<table') || text.trim().startsWith('|')) {
          return text;
      }
      return `<p class="font-open-sans text-sm text-[#6D7475] mb-2 leading-relaxed">${text}</p>`
    }

    // Table rendering with LLYC styles
    renderer.table = function(header: string, body: string): string {
        return `
            <div class="overflow-x-auto my-4 custom-scrollbar rounded-md shadow-sm border border-[#ACB4B6]">
                <table class="min-w-full border-collapse bg-white">
                    <thead>${header}</thead>
                    <tbody>${body}</tbody>
                </table>
            </div>`;
    };

    renderer.tablerow = function(content: string): string {
        return `<tr class="border-b border-[#ACB4B6] last:border-b-0 bg-white hover:bg-[#0A263B]/[0.03]">${content}</tr>`;
    };

    renderer.tablecell = function(content: string, flags: { header: boolean; align: 'center' | 'left' | 'right' | null; }): string {
        const alignClass = flags.align ? `text-${flags.align}` : 'text-left';
        if (flags.header) {
            return `<th class="p-2 ${alignClass} text-sm font-montserrat font-semibold text-[#0A263B] bg-[#0A263B]/[0.07] border-r border-[#ACB4B6] last:border-r-0">${content}</th>`;
        }
        return `<td class="p-2 ${alignClass} text-sm text-[#6D7475] font-open-sans border-r border-[#ACB4B6] last:border-r-0">${content}</td>`;
    };

    return renderer;
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

const PresentationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
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
  // STATE 1: Initial placeholder check. THIS IS THE CRITICAL FIX.
  // By checking for null at the very top, we prevent any processing on a null value.
  // If insight is null, we return the placeholder immediately and the function stops executing.
  if (insight === null) {
    return (
      <div className="text-llyc-gris-02 p-4 border border-llyc-gris-03 rounded-lg bg-llyc-azul-oscuro/5 h-full flex flex-col items-center justify-center text-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-llyc-gris-03 mb-3 opacity-70">
          <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
          <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
        </svg>
        <p className="text-sm">{placeholderText}</p>
      </div>
    );
  }

  const [copyStatusMessage, setCopyStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (copyStatusMessage) {
      const timer = setTimeout(() => {
        setCopyStatusMessage(null);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [copyStatusMessage]);
  
  // If we reach this point, `insight` is guaranteed to be a non-null string.
  const isEffectivelyEmpty = insight.trim() === '';

  const insightPartsHtml = useMemo(() => {
    if (isEffectivelyEmpty) return [];

    let parts: string[] = [];

    if (currentMode === 'structured') {
      const separatorRegex = /(?=##\s*(?:Conclusiones Estratégicas|Strategic Conclusions))/i;
      const splitParts = insight.split(separatorRegex);
      if (splitParts.length > 1) {
        parts = splitParts.filter(p => p.trim() !== '');
      } else {
        parts = [insight];
      }
    } else {
      parts = [insight];
    }
    
    return parts.map((part, index) => {
      try {
        const html = marked.parse(part, { renderer: llycMarkdownRenderer, gfm: true, breaks: true }) as string;
        if (html && html.replace(/<[^>]*>/g, '').trim() !== '') {
            return html;
        }
        return `<pre style="white-space: pre-wrap; word-wrap: break-word;">${escapeHtml(part)}</pre>`;
      } catch (error) {
        console.error(`[InsightDisplay useMemo] Error parsing markdown part ${index + 1}. Falling back.`, error);
        return `<pre style="white-space: pre-wrap; word-wrap: break-word; color: #B91C1C;">FALLBACK DUE TO ERROR:\n${escapeHtml(part)}</pre>`;
      }
    });
    
  }, [insight, isEffectivelyEmpty, currentMode]);


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
        sources.forEach(sourceItem => {
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
      <div className="space-y-4 h-full">
          <div 
            className={`relative p-4 bg-llyc-azul-oscuro/5 border border-llyc-gris-03 rounded-lg shadow text-[#0A263B] ${isEffectivelyEmpty ? 'h-full flex flex-col' : ''}`}
          >
            <div className="absolute top-2.5 right-2.5 flex items-center space-x-2 z-10">
              {copyStatusMessage && (
                <span className="text-xs text-[#36A7B7] bg-[#36A7B7]/10 px-2 py-0.5 rounded-md transition-opacity duration-300">
                  {copyStatusMessage}
                </span>
              )}
              
              {/* NEW: Top Action Button for Presentation Generation */}
              {currentMode === 'aggregated' && !isEffectivelyEmpty && (
                <button
                    type="button"
                    onClick={onGeneratePresentation}
                    title={getText(language, 'BUTTON_GENERATE_PPT')}
                    aria-label={getText(language, 'BUTTON_GENERATE_PPT')}
                    disabled={isGeneratingPresentation}
                    className="p-1.5 bg-[#0A263B] text-white rounded-md hover:bg-[#0E2A47] focus:outline-none focus:ring-2 focus:ring-[#0A263B] focus:ring-offset-1 focus:ring-offset-llyc-azul-oscuro/5 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isGeneratingPresentation ? (
                         <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <PresentationIcon />
                    )}
                </button>
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
                <div className="flex-grow flex flex-col items-center justify-center text-center text-llyc-gris-02">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-llyc-gris-03 mb-3 opacity-70" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                    </svg>
                    <p className="text-sm">{getText(language, 'NO_SPECIFIC_INSIGHTS_GENERATED')}</p>
                </div>
            ) : (
                <div className="pt-8">
                  {insightPartsHtml.map((htmlPart, index) => (
                      <div
                          key={index}
                          dangerouslySetInnerHTML={{ __html: htmlPart }}
                      />
                  ))}
                </div>
            )}
            
            {sources && sources.length > 0 && !isEffectivelyEmpty && (
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
            <>
                {/* We keep the large bottom button as a secondary CTA, but errors are shown here */}
                <div className="mt-6 p-4 bg-gray-100 border border-gray-200 rounded-lg">
                    <button
                        type="button"
                        onClick={onGeneratePresentation}
                        disabled={isGeneratingPresentation || isEffectivelyEmpty}
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
            </>
        )}
    </div>
  </React.Fragment>
  );
};
