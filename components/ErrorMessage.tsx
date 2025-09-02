
import React from 'react';
import { Language } from '../types.ts';
import { getText } from '../constants.ts';

interface ErrorMessageProps {
  message: string;
  language: Language; 
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, language }) => {
  const title = getText(language, 'LABEL_ERROR_PREFIX');

  return (
    <div className="p-4 bg-[#F54963]/80 border border-[#F54963] text-white rounded-lg shadow-lg flex items-start space-x-3" role="alert">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div>
        <strong className="font-semibold text-white" style={{fontFamily: "'Montserrat', sans-serif"}}>{title}</strong>
        <p className="text-sm mt-1 break-words whitespace-pre-wrap">{message}</p>
      </div>
    </div>
  );
};
