import { HymnPack, HymnRecord } from '../types/hymn';

export const hymnStore = {
  /**
   * Fetches the hymn pack JSON from the public directory.
   */
  async loadPack(language: 'en-ZA' | 'af-ZA'): Promise {
    const response = await fetch(`/${language}.hymns.json`);
    if (!response.ok) {
      throw new Error(`Failed to load ${language} hymn dataset (HTTP ${response.status})`);
    }
    const data = await response.json();
    return data as HymnPack;
  },

  /**
   * Validates dataset structure and checks that hymns exist.
   */
  validateIntegrity(pack: HymnPack | null): boolean {
    if (!pack || !Array.isArray(pack.hymns) || pack.hymns.length === 0) {
      return false;
    }
    return pack.hymns.every(
      (hymn) => typeof hymn.number === 'number' && Array.isArray(hymn.verses)
    );
  },

  /**
   * Searches hymns by number or title/text query.
   */
  searchHymns(pack: HymnPack, query: string): HymnRecord[] {
    if (!query.trim()) return pack.hymns;

    const cleanQuery = query.toLowerCase().trim();
    const parsedNumber = parseInt(cleanQuery, 10);

    // If query is numeric, attempt exact number match first
    if (!isNaN(parsedNumber)) {
      const numberMatches = pack.hymns.filter((h) => h.number === parsedNumber);
      if (numberMatches.length > 0) return numberMatches;
    }

    // Otherwise, search across title and verse content
    return pack.hymns.filter((hymn) => {
      const matchTitle = hymn.title ? hymn.title.toLowerCase().includes(cleanQuery) : false;
      const matchVerses = hymn.verses.some((verse) =>
        verse.text ? verse.text.some((line) => line.toLowerCase().includes(cleanQuery)) : false
      );
      return matchTitle || matchVerses;
    });
  },
};
