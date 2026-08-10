// Fetch directly from public runtime path to avoid Vite module boundary errors
let enCache: any = null;
let afCache: any = null;

async function loadDataset(lang: 'en-ZA' | 'af-ZA') {
  if (lang === 'en-ZA' && enCache) return enCache;
  if (lang === 'af-ZA' && afCache) return afCache;

  const file = lang === 'en-ZA' ? '/en-ZA.hymns.json' : '/af-ZA.hymns.json';
  const response = await fetch(file);
  if (!response.ok) {
    throw new Error(`Failed to load ${file}: ${response.statusText}`);
  }
  
  const data = await response.json();
  if (lang === 'en-ZA') enCache = data;
  if (lang === 'af-ZA') afCache = data;
  return data;
}

export async function getHymn(id: number | string, lang: 'en-ZA' | 'af-ZA') {
  const dataset = await loadDataset(lang);
  const targetId = String(id);
  
  const hymn = Array.isArray(dataset) 
    ? dataset.find((h: any) => String(h.id || h.number || h.hymnNumber) === targetId)
    : (dataset as any)[targetId];

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
