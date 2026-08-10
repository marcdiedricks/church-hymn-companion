// Local memory cache for runtime fetching without build-time relative import failures
let enData: any[] | Record<string, any> | null = null;
let afData: any[] | Record<string, any> | null = null;

export async function initHymnStore() {
  try {
    const [enRes, afRes] = await Promise.all([
      fetch('/en-ZA.hymns.json'),
      fetch('/af-ZA.hymns.json')
    ]);
    if (enRes.ok) enData = await enRes.json();
    if (afRes.ok) afData = await afRes.json();
  } catch (err) {
    console.error("Failed to initialize hymn store:", err);
  }
}

export function getHymn(id: number | string, lang: 'en-ZA' | 'af-ZA' = 'en-ZA') {
  const dataset = lang === 'en-ZA' ? enData : afData;
  
  if (!dataset) {
    return {
      id,
      title: `Loading Hymn ${id}...`,
      verses: ["Loading hymn content... Please refresh if text does not appear."],
      author: "Unknown",
      composer: "Unknown"
    };
  }

  const targetId = String(id);
  const hymn = Array.isArray(dataset)
    ? dataset.find((h: any) => String(h.id ?? h.number ?? h.hymnNumber) === targetId)
    : (dataset as Record<string, any>)[targetId];

  if (!hymn) {
    return {
      id,
      title: `Hymn ${id} Not Found`,
      verses: [`Hymn #${id} could not be located in the ${lang} dataset.`],
      author: "N/A",
      composer: "N/A"
    };
  }

  return {
    id: hymn.id || hymn.number || id,
    title: hymn.title || hymn.name || `Hymn ${id}`,
    verses: hymn.verses || hymn.stanzas || hymn.lyrics || [],
    author: hymn.author || hymn.lyricist || hymn.text || "Author Unknown",
    composer: hymn.composer || hymn.music || "Composer Unknown"
  };
}
