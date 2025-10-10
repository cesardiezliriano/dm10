
import React from 'react';
import { Language } from '../types.ts';
import { getText } from '../constants.ts';

interface FeedbackButtonProps {
  language: Language;
}

const FeedbackButtonIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

export const FeedbackButton: React.FC<FeedbackButtonProps> = ({ language }) => {
  const recipients = "luisma.nunez@llyc.global,marta.devicente@llyc.global,cesar.diez@llyc.global";

  const handleFeedbackClick = () => {
    const subject = encodeURIComponent(getText(language, 'FEEDBACK_EMAIL_SUBJECT'));
    const body = encodeURIComponent(getText(language, 'FEEDBACK_EMAIL_BODY_PLACEHOLDER'));
    
    // Use a standard mailto: link for universal compatibility
    const mailtoLink = `mailto:${recipients}?subject=${subject}&body=${body}`;
    
    // Navigate to the mailto link. This is more reliable than window.open for email clients.
    window.location.href = mailtoLink;
  };

  return (
    <button
      type="button"
      onClick={handleFeedbackClick}
      className="p-3 bg-[#F54963] text-white rounded-full shadow-lg hover:bg-[#D93E52] focus:outline-none focus:ring-2 focus:ring-[#36A7B7] focus:ring-offset-2 focus:ring-offset-white transition-colors duration-150"
      title={getText(language, 'BUTTON_FEEDBACK_TOOLTIP')}
      aria-label={getText(language, 'BUTTON_FEEDBACK_TOOLTIP')}
    >
      <FeedbackButtonIcon />
    </button>
  );
};
