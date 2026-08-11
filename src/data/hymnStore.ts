// @ts-ignore
import enDataImport from './en-ZA.hymns.json';
// @ts-ignore
import afDataImport from './af-ZA.hymns.json';

// Manual overrides for known dataset errors in the source JSON files
const METADATA_OVERRIDES: Record<string, { author?: string; composer?: string }> = {
  '1': {
    author: 'St. Francis of Assisi (1182–1226), tr. W. H. Draper',
    composer: 'Geistliche Kirchengesänge (1623)'
  }
};

export const hymnStore = {
  getHymn(id: number | string, lang: 'en-ZA' | 'af-ZA' = 'en-ZA') {
    const rawImport = lang === 'en-ZA' ? enDataImport : afDataImport;
    const rawData = (rawImport && (rawImport as any).default) ? (rawImport as any).default : rawImport;

    const cleanNum = parseInt(String(id).replace(/\D/g, ''), 10);

    if (isNaN(cleanNum) || !rawData || !Array.isArray(rawData.hymns)) {
      return {
        id: id || '?',
        title: `Invalid Query`,
        verses: ["Invalid hymn number or dataset failed to load."],
        author: "N/A",
        composer: "N/A"
      };
    }

    const hymn = rawData.hymns.find((h: any) => h.number === cleanNum);

    if (!hymn) {
      return {
        id: cleanNum,
        title: `Hymn ${cleanNum} Not Found`,
        verses: [`Hymn #${cleanNum} was not found in the ${lang === 'en-ZA' ? 'English' : 'Afrikaans'} dataset.`],
        author: "N/A",
        composer: "N/A"
      };
    }

    const validSections = Array.isArray(hymn.sections) 
      ? hymn.sections.filter((s: any) => {
          if (Array.isArray(s.lines) && s.lines.length > 0) return true;
          if (typeof s === 'string' && s.length > 0) return true;
          return false;
        })
      : [];

    const formattedVerses: string[] = validSections.map((section: any) => {
      if (Array.isArray(section.lines)) {
        return section.lines.join('\n');
      }
      return typeof section === 'string' ? section : '';
    });

    // Check for explicit metadata overrides first, otherwise fallback to JSON metadata
    const key = String(cleanNum);
    const override = METADATA_OVERRIDES[key];

    const author = override?.author || hymn.metadata?.lyricist_author_translator || "Author Unknown";
    const composer = override?.composer || hymn.metadata?.composer || "Composer Unknown";

    return {
      id: hymn.number ?? cleanNum,
      title: hymn.title || `Hymn ${cleanNum}`,
      verses: formattedVerses.length > 0 ? formattedVerses : ["No verse text available."],
      sections: validSections,
      author,
      composer
    };
  }
};

export function getHymn(id: number | string, lang: 'en-ZA' | 'af-ZA' = 'en-ZA') {
  return hymnStore.getHymn(id, lang);
}

export default hymnStore;