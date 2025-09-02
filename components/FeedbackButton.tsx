
import React from 'react';
import { Language } from '../types.ts';
import { getText } from '../constants.ts';

interface FeedbackButtonProps {
  language: Language;
}

const FeedbackButtonIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 12.75h-.75a.375.375 0 01-.375-.375V12a3.375 3.375 0 00-3.375-3.375H12.25c-.378 0-.74.043-1.09.121A3.375 3.375 0 006.75 12.75v.003a.375.375 0 01-.375.375H6a2.25 2.25 0 00-2.25 2.25v.75a2.25 2.25 0 002.25 2.25h.75a.375.375 0 01.375.375v.375a3.375 3.375 0 003.375 3.375h3.75a3.375 3.375 0 003.375-3.375v-.375a.375.375 0 01.375-.375h.75a2.25 2.25 0 002.25-2.25v-.75a2.25 2.25 0 00-2.25-2.25zM9.75 12a.75.75 0 100-1.5.75.75 0 000 1.5zm3 0a.75.75 0 100-1.5.75.75 0 000 1.5zm3 0a.75.75 0 100-1.5.75.75 0 000 1.5z" />
  </svg>
);

export const FeedbackButton: React.FC<FeedbackButtonProps> = ({ language }) => {
  const recipients = "luisma.nunez@llyc.global,marta.devicente@llyc.global,cesar.diez@llyc.global";

  const handleFeedbackClick = () => {
    console.log("FeedbackButton: handleFeedbackClick function HAS BEEN CALLED.");
    const subject = encodeURIComponent(getText(language, 'FEEDBACK_EMAIL_SUBJECT'));
    const body = encodeURIComponent(getText(language, 'FEEDBACK_EMAIL_BODY_PLACEHOLDER'));
    
    // Construct Gmail compose URL
    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipients}&su=${subject}&body=${body}`;
    
    console.log(`FeedbackButton: Attempting to open Gmail compose URL: ${gmailComposeUrl}`);
    try {
      window.open(gmailComposeUrl, '_blank', 'noopener,noreferrer');
      console.log("FeedbackButton: window.open() for Gmail compose URL attempted.");
    } catch (error) {
      console.error("FeedbackButton: Error during window.open() for Gmail:", error);
    }
  };

  return (
    <button
      type="button"
      onClick={() => {
        console.log("FeedbackButton: Inline onClick triggered!"); 
        handleFeedbackClick();
      }}
      className="fixed top-1/2 -translate-y-1/2 right-4 z-50 p-3 bg-[#F54963] text-white rounded-full shadow-lg hover:bg-[#D93E52] focus:outline-none focus:ring-2 focus:ring-[#36A7B7] focus:ring-offset-2 focus:ring-offset-[#0A263B] transition-colors duration-150"
      title={getText(language, 'BUTTON_FEEDBACK_TOOLTIP')}
      aria-label={getText(language, 'BUTTON_FEEDBACK_TOOLTIP')}
    >
      <FeedbackButtonIcon />
    </button>
  );
};