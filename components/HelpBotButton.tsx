
import React from 'react';
import { Language } from '../types.ts';
import { getText } from '../constants.ts';

interface HelpBotButtonProps {
  language: Language;
  onClick: () => void;
}

const HelpIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
  </svg>
);

export const HelpBotButton: React.FC<HelpBotButtonProps> = ({ language, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="p-3 bg-[#36A7B7] text-white rounded-full shadow-lg hover:bg-[#2A8E9A] focus:outline-none focus:ring-2 focus:ring-[#F54963] focus:ring-offset-2 focus:ring-offset-white transition-colors duration-150"
      title={getText(language, 'BUTTON_HELP_TOOLTIP')}
      aria-label={getText(language, 'BUTTON_HELP_TOOLTIP')}
    >
      <HelpIcon />
    </button>
  );
};
