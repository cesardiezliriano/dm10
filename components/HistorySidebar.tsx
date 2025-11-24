
import React, { useState, useEffect } from 'react';
import { HistoryItem, Language } from '../types.ts';
import { getHistory, deleteHistoryItem, clearAllHistory } from '../services/historyService.ts';
import { getText } from '../constants.ts';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadItem: (item: HistoryItem) => void;
  language: Language;
}

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);

const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ isOpen, onClose, onLoadItem, language }) => {
    const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
    const [activeTab, setActiveTab] = useState<'aggregated' | 'structured'>('aggregated');

    useEffect(() => {
        if (isOpen) {
            setHistoryItems(getHistory());
        }
    }, [isOpen]);

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const updated = deleteHistoryItem(id);
        setHistoryItems(updated);
    };

    const handleClearAll = () => {
        if (window.confirm("Are you sure you want to clear all history?")) {
            clearAllHistory();
            setHistoryItems([]);
        }
    };

    const filteredItems = historyItems.filter(item => item.type === activeTab);

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity" 
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div 
                className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-4 bg-[#0A263B] text-white flex justify-between items-center shadow-md">
                        <div className="flex items-center">
                            <ClockIcon />
                            <h2 className="font-montserrat font-bold text-lg">{getText(language, 'HISTORY_PANEL_TITLE')}</h2>
                        </div>
                        <button onClick={onClose} className="text-gray-300 hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-200">
                        <button
                            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'aggregated' ? 'text-[#F54963] border-b-2 border-[#F54963] bg-red-50' : 'text-gray-500 hover:bg-gray-50'}`}
                            onClick={() => setActiveTab('aggregated')}
                        >
                            {getText(language, 'HISTORY_TAB_AGGREGATED')}
                        </button>
                        <button
                            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'structured' ? 'text-[#F54963] border-b-2 border-[#F54963] bg-red-50' : 'text-gray-500 hover:bg-gray-50'}`}
                            onClick={() => setActiveTab('structured')}
                        >
                            {getText(language, 'HISTORY_TAB_STRUCTURED')}
                        </button>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 bg-gray-50">
                        {filteredItems.length === 0 ? (
                            <div className="text-center text-gray-500 mt-10">
                                <p>{getText(language, 'HISTORY_EMPTY_STATE')}</p>
                            </div>
                        ) : (
                            <ul className="space-y-3">
                                {filteredItems.map((item) => (
                                    <li 
                                        key={item.id} 
                                        className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-[#36A7B7] hover:shadow-md transition-all cursor-pointer group"
                                        onClick={() => { onLoadItem(item); onClose(); }}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-montserrat font-semibold text-[#0A263B] text-sm truncate pr-2">
                                                {item.clientName || "Untitled Project"}
                                            </h3>
                                            <button 
                                                onClick={(e) => handleDelete(e, item.id)}
                                                className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                                                title={getText(language, 'HISTORY_ITEM_DELETE_TOOLTIP')}
                                            >
                                                <TrashIcon />
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                                            {item.previewText}
                                        </p>
                                        <div className="flex justify-between items-center text-xs text-gray-400">
                                            <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                                            <span className="text-[#36A7B7] font-medium group-hover:underline">
                                                {getText(language, 'HISTORY_ITEM_LOAD_BUTTON')} &rarr;
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Footer */}
                    {historyItems.length > 0 && (
                        <div className="p-4 border-t border-gray-200 bg-white">
                            <button 
                                onClick={handleClearAll}
                                className="w-full py-2 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 rounded border border-transparent hover:border-red-100 transition-colors"
                            >
                                {getText(language, 'HISTORY_CLEAR_ALL')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
