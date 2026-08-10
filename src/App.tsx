import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HealthDrawer } from './components/HealthDrawer';
import { SearchForm } from './components/SearchForm';
import { HymnDisplay } from './components/HymnDisplay';
import { ServiceQueue } from './components/ServiceQueue';
import { hymnStore } from './data/hymnStore';
import { HymnPack, HymnRecord } from './types/hymn';

export default function App() {
  const [activeLanguage, setActiveLanguage] = useState<'en-ZA' | 'af-ZA'>('en-ZA');
  const [currentPack, setCurrentPack] = useState<HymnPack | null>(null);
  const [selectedHymn, setSelectedHymn] = useState<HymnRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isValidated, setIsValidated] = useState<boolean>(false);
  const [serviceQueue, setServiceQueue] = useState<HymnRecord[]>([]);

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

  const isCurrentInQueue = selectedHymn
    ? serviceQueue.some((item) => item.id === selectedHymn.id)
    : false;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        <Header />

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