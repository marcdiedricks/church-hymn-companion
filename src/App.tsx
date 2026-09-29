import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HealthDrawer } from './components/HealthDrawer';
import { SearchForm } from './components/SearchForm';
import { HymnDisplay } from './components/HymnDisplay';
import { ServiceQueue } from './components/ServiceQueue';
import { hymnStore } from './data/hymnStore';
import { HymnPack, HymnRecord } from './types/hymn';

const CREATOR_CARD_URL = 'https://mzansi-digital-card.netlify.app';

export default function App() {
  const [activeLanguage, setActiveLanguage] = useState<'en-ZA' | 'af-ZA'>('en-ZA');
  const [currentPack, setCurrentPack] = useState<HymnPack | null>(null);
  const [selectedHymn, setSelectedHymn] = useState<HymnRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isValidated, setIsValidated] = useState<boolean>(false);
  const [serviceQueue, setServiceQueue] = useState<HymnRecord[]>([]);
  const [creatorCopyStatus, setCreatorCopyStatus] = useState<string>('');

  // Load JSON dataset whenever language selection changes
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    hymnStore
      .loadPack(activeLanguage)
      .then((pack) => {
        if (!isMounted) return;
        setCurrentPack(pack);
        setIsValidated(hymnStore.validateIntegrity(pack));

        const defaultHymn = pack.hymns.find((h) => h.number === 247) || pack.hymns[0];
        setSelectedHymn(defaultHymn);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeLanguage]);

  // Handle live searches
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!currentPack) return;

    const results = hymnStore.searchHymns(currentPack, query);
    if (results.length > 0) {
      setSelectedHymn(results[0]);
    }
  };

  // Toggle pinning a hymn to the setlist queue
  const handleToggleQueue = (hymn: HymnRecord) => {
    setServiceQueue((prevQueue) => {
      const exists = prevQueue.some((item) => item.id === hymn.id);
      if (exists) {
        return prevQueue.filter((item) => item.id !== hymn.id);
      } else {
        return [...prevQueue, hymn];
      }
    });
  };

  const handleRemoveFromQueue = (hymnId: string) => {
    setServiceQueue((prevQueue) => prevQueue.filter((item) => item.id !== hymnId));
  };

  const handleClearQueue = () => {
    setServiceQueue([]);
  };

  const handleCopyCreatorLink = async () => {
    try {
      await navigator.clipboard.writeText(CREATOR_CARD_URL);
      setCreatorCopyStatus('Link copied');
    } catch {
      window.prompt('Copy this link:', CREATOR_CARD_URL);
      setCreatorCopyStatus('Copy link shown');
    }
    window.setTimeout(() => setCreatorCopyStatus(''), 2200);
  };

  const isCurrentInQueue = selectedHymn
    ? serviceQueue.some((item) => item.id === selectedHymn.id)
    : false;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        <Header />

        <details className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <summary className="cursor-pointer px-4 py-3 text-sm font-bold text-slate-300 hover:text-white">
            ℹ️ Help / About
          </summary>
          <div className="border-t border-slate-800 px-4 pb-4">
            <div className="pt-4 mb-4">
              <div className="text-sm font-bold text-white mb-1">Quick help</div>
              <p className="m-0 text-xs leading-relaxed text-slate-400">
                Choose English or Afrikaans, search by hymn number or words, select the hymn section you need, and use the projector window when displaying lyrics for a congregation.
              </p>
            </div>

            <div className="border-t border-slate-800 pt-4">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 items-center">
                <div>
                  <div className="text-base font-extrabold text-amber-400 mb-1">Church Hymn Companion</div>
                  <p className="m-0 mb-2 text-xs leading-relaxed text-slate-300">
                    Offline-first English and Afrikaans hymnal with mobile and projector support.
                  </p>
                  <p className="m-0 text-xs font-bold text-white">
                    Developed by Marc Diedricks
                  </p>
                </div>

                <a
                  href={CREATOR_CARD_URL}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open Marc Diedricks Professional Digital Card"
                >
                  <img
                    src="/creator-card-qr.svg"
                    alt="QR code for Marc Diedricks Professional Digital Card"
                    width="88"
                    height="88"
                    className="block bg-white p-1.5 rounded-md"
                  />
                </a>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3">
                <a
                  href={CREATOR_CARD_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="min-h-[42px] px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 no-underline text-xs font-extrabold text-center flex items-center justify-center"
                >
                  VIEW DIGITAL CARD
                </a>
                <button
                  type="button"
                  onClick={handleCopyCreatorLink}
                  className="min-h-[42px] px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-extrabold cursor-pointer"
                >
                  COPY LINK
                </button>
              </div>

              {creatorCopyStatus && (
                <div role="status" className="mt-2 text-emerald-300 text-xs text-center">
                  {creatorCopyStatus}
                </div>
              )}
            </div>
          </div>
        </details>

        <HealthDrawer
          isValidated={isValidated}
          activeLanguage={activeLanguage}
          currentPack={currentPack}
          isLoading={isLoading}
          onSelectLanguage={setActiveLanguage}
        />

        <SearchForm onSearch={handleSearch} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <ServiceQueue
          queue={serviceQueue}
          activeHymnId={selectedHymn?.id}
          onSelectHymn={setSelectedHymn}
          onRemoveFromQueue={handleRemoveFromQueue}
          onClearQueue={handleClearQueue}
        />

        <HymnDisplay
          hymn={selectedHymn}
          isLoading={isLoading}
          isInQueue={isCurrentInQueue}
          onToggleQueue={handleToggleQueue}
        />
      </div>
    </div>
  );
}