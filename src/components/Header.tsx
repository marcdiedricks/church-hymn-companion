import React from 'react';

export const Header: React.FC = () => {
  const handleOpenProjector = () => {
    window.open(
      '/projector.html',
      'ChurchProjectorWindow',
      'width=1280,height=720,menubar=no,toolbar=no,location=no,status=no'
    );
  };

  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold text-xl shadow">
          📖
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-white tracking-wide">
              CHURCH HYMN COMPANION
            </h1>
            <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-1.5 py-0.5 rounded">
              TM
            </span>
          </div>
          <p className="text-xs text-slate-400">
            South Africa • Mobile & Projector Operator
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleOpenProjector}
        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition-colors shadow flex items-center gap-2 shrink-0 cursor-pointer"
      >
        📺 LAUNCH PROJECTOR WINDOW
      </button>
    </header>
  );
};