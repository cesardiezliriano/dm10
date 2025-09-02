
import React, { useState, useEffect, useMemo } from 'react';
import { marked } from 'marked';
import { Language, HelpTopic } from '../types.ts';
import { getText } from '../constants.ts';

interface HelpBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  topics: HelpTopic[];
}

const CloseIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const HelpBotIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#36A7B7]" viewBox="0 0 20 20" fill="currentColor">
        <path d="M11 3a1 1 0 100 2h.01a1 1 0 100-2H11zM11 6a1 1 0 011 1v3a1 1 0 01-2 0V7a1 1 0 011-1zM4.607 6.37A1 1 0 014 7v8a1 1 0 00.09.414l.05.093A8.001 8.001 0 0010 18c2.21 0 4.21-.895 5.657-2.343l.05-.093A1 1 0 0016 15V7a1 1 0 01-.607-.63L15 6H5l-.393.37zM12 19a1 1 0 01-1-1v-.01A8.093 8.093 0 0012 5.06v.006c.995.207 1.916.63 2.707 1.229A1.006 1.006 0 0115 7v8a.999.999 0 01-.293.707 6.003 6.003 0 01-2.707 1.229V18a1 1 0 01-1 1z" />
    </svg>
);


export const HelpBotModal: React.FC<HelpBotModalProps> = ({ isOpen, onClose, language, topics }) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && topics.length > 0 && !selectedTopicId) {
      // setSelectedTopicId(topics[0].id); // Optionally select the first topic by default
    }
    if (!isOpen) {
        //setSelectedTopicId(null); // Reset selected topic when modal closes
    }
  }, [isOpen, topics, selectedTopicId]);

  const selectedTopic = useMemo(() => {
    if (!selectedTopicId) return null;
    return topics.find(topic => topic.id === selectedTopicId);
  }, [selectedTopicId, topics]);

  const parseMarkdown = (markdownText: string) => {
    try {
      return marked.parse(markdownText, { gfm: true, breaks: true });
    } catch (error) {
      console.error("Error parsing markdown for help content:", error);
      return `<p>Error displaying content.</p>`;
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-3xl h-[80vh] max-h-[700px] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <HelpBotIcon />
            <h2 id="help-modal-title" className="text-xl font-semibold text-[#0A263B]" style={{fontFamily: "'Montserrat', sans-serif"}}>
              {getText(language, 'HELP_MODAL_TITLE')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#36A7B7] rounded"
            aria-label={getText(language, 'HELP_MODAL_CLOSE_BUTTON_ARIA_LABEL')}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <div className="flex-grow flex overflow-hidden">
          {/* Sidebar for Topics */}
          <nav className="w-1/3 min-w-[200px] max-w-[280px] bg-gray-50 border-r border-gray-200 p-3 sm:p-4 overflow-y-auto custom-scrollbar">
            <ul className="space-y-1">
              {topics.map(topic => (
                <li key={topic.id}>
                  <button
                    onClick={() => setSelectedTopicId(topic.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors duration-150
                                ${selectedTopicId === topic.id 
                                  ? 'bg-[#36A7B7]/20 text-[#36A7B7] font-medium' 
                                  : 'text-gray-700 hover:bg-gray-200/70 focus:bg-gray-200/70'
                                }
                                focus:outline-none focus:ring-1 focus:ring-[#36A7B7]`}
                    style={{fontFamily: selectedTopicId === topic.id ? "'Montserrat', sans-serif" : "'Open Sans', sans-serif"}}
                    aria-current={selectedTopicId === topic.id ? "page" : undefined}
                  >
                    {getText(language, topic.questionKey)}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Main Content Area */}
          <main className="flex-grow p-4 sm:p-6 overflow-y-auto custom-scrollbar text-[#0A263B]">
            {selectedTopic ? (
              <article className="prose prose-sm max-w-none prose-h1:font-montserrat prose-h1:text-lg prose-h1:text-[#0A263B] prose-h2:font-montserrat prose-h2:text-base prose-h2:text-[#0A263B] prose-strong:text-[#0A263B] prose-a:text-[#F54963]">
                <h1 className="!mb-3 !mt-0">{getText(language, selectedTopic.questionKey)}</h1>
                <div dangerouslySetInnerHTML={{ __html: parseMarkdown(getText(language, selectedTopic.answerKey)) }} />
              </article>
            ) : (
              <div className="text-center text-gray-500 pt-10">
                <HelpBotIcon />
                <h3 className="mt-2 text-lg font-medium text-[#0A263B]" style={{fontFamily: "'Montserrat', sans-serif"}}>{getText(language, 'HELP_MODAL_INTRO_TITLE')}</h3>
                <p className="mt-1 text-sm">{getText(language, 'HELP_MODAL_INTRO_TEXT')}</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

