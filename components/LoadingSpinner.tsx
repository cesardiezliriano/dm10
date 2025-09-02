
import React from 'react';
import { Language } from '../types.ts'; 
import { getText } from '../constants.ts'; 

interface LoadingSpinnerProps {
    language: Language; 
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ language }) => {
  return (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#36A7B7]"></div> {/* LLYC Turquesa */}
      <p className="ml-4 text-[#0A263B]">{getText(language, 'LABEL_LOADING')}</p> {/* LLYC Azul Oscuro */}
    </div>
  );
};
