
import { HistoryItem, InsightRequest, StructuredInsightRequest } from '../types.ts';

const HISTORY_STORAGE_KEY = 'insights_builder_history';

export const saveToHistory = (
  type: 'aggregated' | 'structured',
  data: InsightRequest | StructuredInsightRequest,
  clientName: string = "Untitled Project",
  previewText: string = ""
): void => {
  try {
    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      type,
      clientName: clientName || "Untitled Project",
      previewText: previewText || (new Date()).toLocaleDateString(),
      data
    };

    const existingHistory = getHistory();
    // Prepend new item
    const updatedHistory = [newItem, ...existingHistory];
    
    // Limit to 50 items to prevent storage bloat
    if (updatedHistory.length > 50) {
      updatedHistory.pop();
    }

    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("Failed to save history:", error);
  }
};

export const getHistory = (): HistoryItem[] => {
  try {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error("Failed to parse history:", error);
    return [];
  }
};

export const deleteHistoryItem = (id: string): HistoryItem[] => {
  try {
    const current = getHistory();
    const updated = current.filter(item => item.id !== id);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error("Failed to delete history item:", error);
    return [];
  }
};

export const clearAllHistory = (): void => {
  localStorage.removeItem(HISTORY_STORAGE_KEY);
};
