import { HymnPack, HymnRecord } from '../types/hymn';

type SupportedLanguage = 'en-ZA' | 'af-ZA';

const moveTrailingMetadata = (
  pack: HymnPack,
  hymnNumber: number,
  sectionOneBased: number,
  lineCount: number
) => {
  const hymn = pack.hymns.find((item) => item.number === hymnNumber);
  const section = hymn?.sections?.[sectionOneBased - 1];
  if (!hymn || !section || !Array.isArray(section.lines) || section.lines.length < lineCount) return;

  const moved = section.lines.splice(section.lines.length - lineCount, lineCount);
  hymn.metadata = hymn.metadata || {};
  hymn.metadata.other = Array.isArray(hymn.metadata.other) ? hymn.metadata.other : [];
  hymn.metadata.other.push(...moved);
};

const applySafeStructuralRepairs = (pack: HymnPack, language: SupportedLanguage) => {
  const metadataMoves: Record<SupportedLanguage, Array<[number, number, number]>> = {
    'en-ZA': [[5, 3, 1], [38, 1, 1], [104, 3, 2], [179, 3, 3], [509, 5, 2]],
    'af-ZA': [[26, 2, 1], [29, 5, 1], [31, 3, 1], [98, 3, 1], [100, 5, 1], [159, 3, 1], [211, 3, 1], [307, 5, 1]],
  };

  metadataMoves[language].forEach(([hymnNumber, sectionOneBased, lineCount]) => {
    moveTrailingMetadata(pack, hymnNumber, sectionOneBased, lineCount);
  });

  if (language === 'en-ZA') {
    const hymn210 = pack.hymns.find((item) => item.number === 210);
    if (hymn210) {
      hymn210.sections = hymn210.sections.filter(
        (section) => !(section.type === 'verse' && section.label === 'Verse 3' && Array.isArray(section.lines) && section.lines.length === 0)
      );
      if (hymn210.sections[2]) {
        hymn210.sections[2].number = 3;
        hymn210.sections[2].label = 'Verse 3';
      }
    }
  }

  if (language === 'af-ZA') {
    const hymn66 = pack.hymns.find((item) => item.number === 66);
    const firstSection = hymn66?.sections?.[0];

    if (hymn66 && firstSection && !hymn66.sections.some((section) => section.type === 'refrain')) {
      const markerIndex = firstSection.lines.findIndex((line) => line.trim().toLowerCase() === '[refrein]');

      if (markerIndex >= 0) {
        const refrainLines = firstSection.lines.slice(markerIndex + 1);
        firstSection.lines = firstSection.lines.slice(0, markerIndex);

        if (refrainLines.length > 0) {
          hymn66.sections.splice(1, 0, { type: 'refrain', number: 2, label: 'Refrain', lines: refrainLines });
          for (let index = 2; index < hymn66.sections.length; index += 1) {
            hymn66.sections[index].number = index + 1;
          }
        }
      }
    }
  }

  return pack;
};

export const hymnStore = {
  async loadPack(language: SupportedLanguage): Promise<HymnPack> {
    const response = await fetch(`/${language}.hymns.json`);
    if (!response.ok) throw new Error(`Failed to load ${language} hymn dataset (HTTP ${response.status})`);

    const data = (await response.json()) as HymnPack;
    return applySafeStructuralRepairs(data, language);
  },

  validateIntegrity(pack: HymnPack | null): boolean {
    if (!pack || !Array.isArray(pack.hymns) || pack.hymns.length === 0) return false;
    if (typeof pack.hymn_count === 'number' && pack.hymn_count !== pack.hymns.length) return false;

    const numbers = new Set<number>();
    const ids = new Set<string>();

    return pack.hymns.every((hymn) => {
      if (
        typeof hymn.id !== 'string' ||
        !hymn.id.trim() ||
        typeof hymn.number !== 'number' ||
        !Number.isFinite(hymn.number) ||
        numbers.has(hymn.number) ||
        ids.has(hymn.id) ||
        !Array.isArray(hymn.sections) ||
        hymn.sections.length === 0
      ) return false;

      numbers.add(hymn.number);
      ids.add(hymn.id);

      return hymn.sections.every(
        (section) => typeof section.label === 'string' && Array.isArray(section.lines) && section.lines.every((line) => typeof line === 'string')
      );
    });
  },

  searchHymns(pack: HymnPack, query: string): HymnRecord[] {
    if (!query.trim()) return pack.hymns;

    const cleanQuery = query.toLowerCase().trim();
    const parsedNumber = parseInt(cleanQuery, 10);

    if (!isNaN(parsedNumber)) {
      const numberMatches = pack.hymns.filter((hymn) => hymn.number === parsedNumber);
      if (numberMatches.length > 0) return numberMatches;
    }

    return pack.hymns.filter((hymn) => {
      const matchTitle = hymn.title ? hymn.title.toLowerCase().includes(cleanQuery) : false;
      const matchSections = Array.isArray(hymn.sections)
        ? hymn.sections.some((section) => Array.isArray(section.lines) && section.lines.some((line) => line.toLowerCase().includes(cleanQuery)))
        : false;
      return matchTitle || matchSections;
    });
  },
};
