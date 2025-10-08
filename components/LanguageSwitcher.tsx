import React from 'react';
import { Language } from '../types.ts';

interface LanguageSwitcherProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
  disabled: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ language, onLanguageChange, disabled }) => {
  const baseButtonClasses = "px-4 py-1.5 rounded-full text-sm font-bold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#36A7B7]";
  const activeClasses = "bg-[#0A263B] text-white shadow";
  const inactiveClasses = "bg-transparent text-[#878E90] hover:bg-gray-100";

  return (
    <div
      className={`inline-flex items-center p-1 space-x-1 bg-gray-200/70 rounded-full ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      style={{ fontFamily: "'Montserrat', sans-serif" }}
      role="radiogroup"
      aria-label="Language selection"
    >
      <button
        type="button"
        onClick={() => onLanguageChange(Language.ES)}
        disabled={disabled}
        className={`${baseButtonClasses} ${language === Language.ES ? activeClasses : inactiveClasses}`}
        role="radio"
        aria-checked={language === Language.ES}
      >
        ES
      </button>
      <button
        type="button"
        onClick={() => onLanguageChange(Language.EN)}
        disabled={disabled}
        className={`${baseButtonClasses} ${language === Language.EN ? activeClasses : inactiveClasses}`}
        role="radio"
        aria-checked={language === Language.EN}
      >
        EN
      </button>
    </div>
  );
};
