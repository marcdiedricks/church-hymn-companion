import { HymnPack, HymnRecord } from '../types/hymn';

class HymnStore {
  private cache: Map<string, HymnPack> = new Map();

  // Strip special accents so searching "Almagtig" matches "Almágtig"
  private normalizeString(str: string): string {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  // Fetch local JSON asset from /public folder
  async loadPack(languageCode: 'en-ZA' | 'af-ZA'): Promise<HymnPack> {
    if (this.cache.has(languageCode)) {
      return this.cache.get(languageCode)!;
    }

    const response = await fetch(`/${languageCode}.hymns.json`);
    if (!response.ok) {
      throw new Error(`Failed to load ${languageCode}.hymns.json`);
    }

    const data: HymnPack = await response.json();
    this.cache.set(languageCode, data);
    return data;
  }

  // Search by exact hymn number or title/lyric text
  searchHymns(pack: HymnPack, query: string): HymnRecord[] {
    const trimmed = query.trim();
    if (!trimmed) return pack.hymns;

    const normalizedQuery = this.normalizeString(trimmed);
    const isNumeric = /^\d+$/.test(trimmed);

    if (isNumeric) {
      const num = parseInt(trimmed, 10);
      return pack.hymns.filter((h) => h.number === num);
    }

    return pack.hymns.filter((hymn) => {
      const titleMatch = this.normalizeString(hymn.title).includes(normalizedQuery);
      const lyricsMatch = hymn.sections.some((sec) =>
        sec.lines.some((line) => this.normalizeString(line).includes(normalizedQuery))
      );
      return titleMatch || lyricsMatch;
    });
  }

  // Verify that the loaded pack has valid records and numbers
  validateIntegrity(pack: HymnPack): boolean {
    if (!pack || !pack.hymns || pack.hymns.length === 0) return false;
    
    if (pack.language.code === 'en-ZA') {
      return pack.hymn_count === 588 && pack.hymns.some((h) => h.number === 1 && h.title.includes('Adoration'));
    }
    
    if (pack.language.code === 'af-ZA') {
      return pack.hymn_count === 315 && pack.hymns.some((h) => h.number === 1 && h.title.includes('Almagtig'));
    }

    return true;
  }
}

export const hymnStore = new HymnStore();