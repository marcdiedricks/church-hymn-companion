import React from 'react';
import { HymnRecord } from '../types/hymn';

interface ServiceQueueProps {
  queue: HymnRecord[];
  activeHymnId?: string;
  onSelectHymn: (hymn: HymnRecord) => void;
  onRemoveFromQueue: (hymnId: string) => void;
  onClearQueue: () => void;
}

export const ServiceQueue: React.FC<ServiceQueueProps> = ({
  queue,
  activeHymnId,
  onSelectHymn,
  onRemoveFromQueue,
  onClearQueue,
}) => {
  if (queue.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center text-xs text-slate-500 flex items-center justify-between">
        <span>📌 <strong>Service Setlist Queue:</strong> No hymns pinned yet. Search a hymn and click "Pin to Setlist" to stage it here.</span>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
      <div className="flex justify-between items-center text-xs border-b border-slate-800 pb-2">
        <span className="font-bold text-slate-300 flex items-center gap-2">
          📋 SERVICE SETLIST QUEUE
          <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded text-[10px]">
            {queue.length} Pinned
          </span>
        </span>
        <button
          onClick={onClearQueue}
          className="text-slate-500 hover:text-rose-400 text-[11px] transition-colors"
        >
          Clear Setlist
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {queue.map((hymn, index) => {
          const isActive = hymn.id === activeHymnId;

          return (
            <div
              key={hymn.id}
              className={`relative group p-2.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between min-h-[72px] ${
                isActive
                  ? 'bg-amber-500/10 border-amber-500 text-white shadow-md'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
              }`}
              onClick={() => onSelectHymn(hymn)}
            >
              <div className="flex justify-between items-start gap-1">
                <span className="text-[10px] font-bold text-slate-400">
                  #{index + 1} • {hymn.language_name === 'English' ? 'EN' : 'AF'} #{hymn.number}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFromQueue(hymn.id);
                  }}
                  className="text-slate-500 hover:text-rose-400 text-xs px-1 rounded hover:bg-slate-800"
                  title="Remove from queue"
                >
                  ✕
                </button>
              </div>

              <div className="text-xs font-semibold truncate mt-1">
                {hymn.title}
              </div>

              {isActive && (
                <span className="mt-1 text-[9px] font-bold text-amber-400 tracking-wider">
                  ● LIVE NOW
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};