import { create } from 'zustand';

export interface HymnVerse {
  number: number | string;
  type?: string;
  text: string[];
}

export interface Hymn {
  id: string;
  number: number;
  title: string;
  language: 'en-ZA' | 'af-ZA';
  verses: HymnVerse[];
  author?: string;
  composer?: string;
  tune?: string;
  key?: string;
}

interface HymnStoreState {
  hymns: Hymn[];
  currentHymn: Hymn | null;
  currentLanguage: 'en-ZA' | 'af-ZA';
  setLanguage: (lang: 'en-ZA' | 'af-ZA') => void;
  loadPack: (lang: 'en-ZA' | 'af-ZA') => Promise;
  selectHymnByNumber: (num: number) => void;
}

export const useHymnStore = create((set, get) => ({
  hymns: [],
  currentHymn: null,
  currentLanguage: 'en-ZA',

  setLanguage: (lang) => {
    set({ currentLanguage: lang });
    get().loadPack(lang);
  },

  loadPack: async (lang) => {
    try {
      const response = await fetch(`/${lang}.hymns.json`);
      if (!response.ok) throw new Error(`Failed to load ${lang} pack`);
      const data: Hymn[] = await response.json();
      set({ hymns: data, currentHymn: data[0] || null });
    } catch (err) {
      console.error("Error loading hymn pack:", err);
    }
  },

  selectHymnByNumber: (num) => {
    const found = get().hymns.find((h) => h.number === num);
    if (found) {
      set({ currentHymn: found });
    }
  },
}));
