import React, { useState, useEffect } from 'react';
import { HymnRecord } from '../types/hymn';

interface HymnDisplayProps {
  hymn: HymnRecord | null;
  isLoading: boolean;
  isInQueue?: boolean;
  onToggleQueue?: (hymn: HymnRecord) => void;
}

const cleanProjectionLine = (line: string) =>
  line.replace(/名/g, ' me').replace(/[\u4e00-\u9fff]/g, '');

export const HymnDisplay: React.FC<HymnDisplayProps> = ({
  hymn,
  isLoading,
  isInQueue = false,
  onToggleQueue,
}) => {
  const [activeSectionIndex, setActiveSectionIndex] = useState<number>(0);

  // Reset to Verse 1 when hymn changes
  useEffect(() => {
    setActiveSectionIndex(0);
  }, [hymn?.id]);

  // If the user returns from the mobile projector page, restore the verse
  // selected there without changing the rest of the operator interface.
  useEffect(() => {
    const restoreProjectorSection = () => {
      if (!hymn || !hymn.sections?.length) return;

      try {
        const rawState = localStorage.getItem('church_projection_state');
        if (!rawState) return;

        const savedState = JSON.parse(rawState);
        if (savedState.hymnId !== hymn.id) return;

        const savedIndex = Number(savedState.activeSectionIndex);
        if (!Number.isInteger(savedIndex)) return;

        const safeIndex = Math.min(
          Math.max(savedIndex, 0),
          hymn.sections.length - 1
        );
        setActiveSectionIndex(safeIndex);
      } catch {
        // Keep normal hymn operation working if local storage is unavailable.
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) restoreProjectorSection();
    };

    window.addEventListener('pageshow', restoreProjectorSection);
    window.addEventListener('focus', restoreProjectorSection);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('pageshow', restoreProjectorSection);
      window.removeEventListener('focus', restoreProjectorSection);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [hymn]);

  // Save the current hymn and all of its sections locally so a single mobile
  // phone can enter Projector Mode without needing a second operator window.
  // Continue broadcasting the active slide for existing dual-screen setups.
  useEffect(() => {
    if (!hymn || !hymn.sections?.length) return;

    const activeSection = hymn.sections[activeSectionIndex] || hymn.sections[0];
    const cleanedLines = activeSection.lines.map(cleanProjectionLine);

    try {
      localStorage.setItem(
        'church_projection_state',
        JSON.stringify({
          version: 1,
          hymnId: hymn.id,
          number: hymn.number,
          title: hymn.title,
          language: hymn.language_name,
          activeSectionIndex,
          sections: hymn.sections.map((section) => ({
            number: section.number,
            label: section.label || `Verse ${section.number ?? ''}`.trim(),
            lines: section.lines.map(cleanProjectionLine),
          })),
        })
      );
    } catch {
      // Projection can still use BroadcastChannel on supported desktop setups.
    }

    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel('church_projection');
      channel.postMessage({
        number: hymn.number,
        title: hymn.title,
        language: hymn.language_name,
        label: `${activeSection.label || `Verse ${activeSection.number}`} (${activeSectionIndex + 1}/${hymn.sections.length})`,
        lines: cleanedLines,
      });
      channel.close();
    }
  }, [hymn, activeSectionIndex]);

  // Keyboard navigation (Arrow Right / Space -> Next, Arrow Left -> Prev)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!hymn || !hymn.sections) return;

      if (['INPUT', 'TEXTAREA'].includes((event.target as HTMLElement)?.tagName)) {
        return;
      }

      if (event.key === 'ArrowRight' || event.key === ' ') {
        event.preventDefault();
        setActiveSectionIndex((prev) =>
          prev < hymn.sections.length - 1 ? prev + 1 : prev
        );
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setActiveSectionIndex((prev) => (prev > 0 ? prev - 1 : prev));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hymn]);

  if (isLoading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
        Loading local hymn dataset...
      </div>
    );
  }

  if (!hymn) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
        No hymn found matching your search.
      </div>
    );
  }

  const activeSection = hymn.sections[activeSectionIndex] || hymn.sections[0];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
      {/* Header Info & Setlist Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded text-xs font-bold">
              # Hymn {hymn.number}
            </span>
            <span className="text-slate-400 text-xs">{hymn.language_name}</span>

            {onToggleQueue && (
              <button
                onClick={() => onToggleQueue(hymn)}
                className={`ml-2 text-xs font-bold px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                  isInQueue
                    ? 'bg-rose-950/60 border border-rose-800 text-rose-300 hover:bg-rose-900/80'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                }`}
              >
                {isInQueue ? '✕ Remove from Setlist' : '📌 Pin to Setlist'}
              </button>
            )}
          </div>
          <h2 className="text-2xl font-bold text-white">{hymn.title}</h2>
        </div>

        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs text-slate-400">
          <div><strong className="text-slate-300">Text:</strong> {hymn.metadata.lyricist_author_translator || 'Unknown'}</div>
          <div><strong className="text-slate-300">Music:</strong> {hymn.metadata.composer || 'Unknown'}</div>
        </div>
      </div>

      {/* Section / Verse Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          {hymn.sections.map((sec, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSectionIndex(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeSectionIndex === idx
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {sec.label || `Verse ${sec.number}`}
            </button>
          ))}
        </div>

        <div className="text-[11px] text-slate-500 hidden sm:block">
          Tip: Use <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 border border-slate-700">←</kbd> and <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 border border-slate-700">→</kbd> arrow keys to switch verses
        </div>
      </div>

      {/* Active Verse / Refrain Text Box */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-center text-xs text-slate-500 border-b border-slate-900 pb-2">
          <span>{(activeSection.label || 'SECTION').toUpperCase()}</span>
          <span>SECTION {activeSectionIndex + 1} OF {hymn.sections.length}</span>
        </div>

        <div className="space-y-2 text-lg md:text-xl font-serif leading-relaxed text-slate-100">
          {activeSection.lines.map((line, lIdx) => (
            <p key={lIdx}>{cleanProjectionLine(line)}</p>
          ))}
        </div>
      </div>
    </div>
  );
};
