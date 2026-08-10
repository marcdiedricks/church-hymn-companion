// @ts-ignore
import enHymns from '../../public/en-ZA.hymns.json';
// @ts-ignore
import afHymns from '../../public/af-ZA.hymns.json';

export function getHymn(id: number | string, lang: 'en-ZA' | 'af-ZA' = 'en-ZA') {
  const dataset = lang === 'en-ZA' ? enHymns : afHymns;
  const targetId = String(id);
  
  const hymn = Array.isArray(dataset) 
    ? dataset.find((h: any) => String(h.id ?? h.number ?? h.hymnNumber) === targetId)
    : (dataset as any)?.[targetId];

  if (!hymn) {
    throw new Error(`Hymn #${id} not found in ${lang} dataset.`);
  }

  return {
    id: hymn.id || hymn.number || id,
    title: hymn.title || hymn.name || `Hymn ${id}`,
    verses: hymn.verses || hymn.stanzas || hymn.lyrics || [],
    author: hymn.author || hymn.lyricist || hymn.text || "Author Unknown",
    composer: hymn.composer || hymn.music || "Composer Unknown"
  };
}
