let enData: any = null;
let afData: any = null;

// Fetch datasets asynchronously when the module loads
if (typeof window !== 'undefined') {
  fetch('/en-ZA.hymns.json')
    .then((res) => res.json())
    .then((data) => { enData = data; })
    .catch((err) => console.error("Failed to load English hymns JSON:", err));

  fetch('/af-ZA.hymns.json')
    .then((res) => res.json())
    .then((data) => { afData = data; })
    .catch((err) => console.error("Failed to load Afrikaans hymns JSON:", err));
}

export const hymnStore = {
  getHymn(id: number | string, lang: 'en-ZA' | 'af-ZA' = 'en-ZA') {
    const dataset = lang === 'en-ZA' ? enData : afData;

    if (!dataset) {
      return {
        id,
        title: `Hymn ${id}`,
        verses: ["Loading hymn data..."],
        author: "Unknown",
        composer: "Unknown"
      };
    }

    const targetId = String(id);
    const hymn = Array.isArray(dataset)
      ? dataset.find((h: any) => String(h.id ?? h.number ?? h.hymnNumber) === targetId)
      : dataset[targetId];

    if (!hymn) {
      return {
        id,
        title: `Hymn ${id} Not Found`,
        verses: [`Hymn #${id} was not found in the ${lang} dataset.`],
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
  },

  get(id: number | string, lang: 'en-ZA' | 'af-ZA' = 'en-ZA') {
    return this.getHymn(id, lang);
  }
};

export function getHymn(id: number | string, lang: 'en-ZA' | 'af-ZA' = 'en-ZA') {
  return hymnStore.getHymn(id, lang);
}

export default hymnStore;
