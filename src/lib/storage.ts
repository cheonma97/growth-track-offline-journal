
// Local storage utilities for offline functionality

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'growthTracker_journalEntries';

// Check if localStorage is available
const isStorageAvailable = (): boolean => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

// Get all entries from storage
export const getAllEntries = async (): Promise<JournalEntry[]> => {
  if (!isStorageAvailable()) {
    throw new Error('Local storage is not available');
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading from storage:', error);
    return [];
  }
};

// Get a specific entry by ID
export const getEntryById = async (id: string): Promise<JournalEntry | null> => {
  const entries = await getAllEntries();
  return entries.find(entry => entry.id === id) || null;
};

// Get entry by date (useful for checking if an entry exists for a specific date)
export const getEntryByDate = async (date: string): Promise<JournalEntry | null> => {
  const entries = await getAllEntries();
  return entries.find(entry => entry.date === date) || null;
};

// Save or update an entry
export const saveEntry = async (entry: JournalEntry): Promise<void> => {
  if (!isStorageAvailable()) {
    throw new Error('Local storage is not available. Please ensure your browser allows local storage.');
  }

  try {
    const entries = await getAllEntries();
    const existingIndex = entries.findIndex(existing => existing.id === entry.id);
    
    if (existingIndex >= 0) {
      // Update existing entry
      entries[existingIndex] = { ...entry, updatedAt: new Date().toISOString() };
    } else {
      // Add new entry
      entries.push(entry);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error('Error saving to storage:', error);
    throw new Error('Failed to save entry');
  }
};

// Delete an entry
export const deleteEntry = async (id: string): Promise<void> => {
  if (!isStorageAvailable()) {
    throw new Error('Local storage is not available');
  }

  try {
    const entries = await getAllEntries();
    const filteredEntries = entries.filter(entry => entry.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredEntries));
  } catch (error) {
    console.error('Error deleting from storage:', error);
    throw new Error('Failed to delete entry');
  }
};

// Export all entries (for backup purposes)
export const exportEntries = async (): Promise<string> => {
  const entries = await getAllEntries();
  return JSON.stringify(entries, null, 2);
};

// Import entries (for restore purposes)
export const importEntries = async (jsonData: string): Promise<void> => {
  if (!isStorageAvailable()) {
    throw new Error('Local storage is not available');
  }

  try {
    const entries = JSON.parse(jsonData) as JournalEntry[];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error('Error importing entries:', error);
    throw new Error('Failed to import entries');
  }
};
