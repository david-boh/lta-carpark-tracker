import React from 'react';
import { RefreshCw, Moon, Sun, Database } from 'lucide-react';

interface TopBarProps {
  activeView: 'map' | 'directory' | 'ev';
  onSelectView: (view: 'map' | 'directory' | 'ev') => void;
  onOpenRatesGuide: () => void;
  onOpenBackendModal: () => void;
  onRefreshData: () => void;
  isRefreshing: boolean;
  lastUpdated: Date;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  backendMode: 'SIMULATED' | 'CUSTOM_API' | 'DATA_GOV_SG';
}

export const TopBar: React.FC<TopBarProps> = ({
  activeView,
  onSelectView,
  onOpenRatesGuide,
  onOpenBackendModal,
  onRefreshData,
  isRefreshing,
  lastUpdated,
  darkMode,
  onToggleDarkMode,
  backendMode
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single line text element) */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSelectView('map');
            }}
            className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              SG
            </span>
            <span>ParkPulse</span>
          </a>
          <span className="hidden sm:inline-block text-xs font-mono text-slate-400 dark:text-slate-500 border-l border-slate-200 dark:border-slate-700 pl-3">
            Singapore Live Availability
          </span>
        </div>

        {/* Zone 2: 4-5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            type="button"
            onClick={() => onSelectView('map')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              activeView === 'map'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600 dark:border-emerald-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Live Map
          </button>
          <button
            type="button"
            onClick={() => onSelectView('directory')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              activeView === 'directory'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600 dark:border-emerald-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Carpark Directory
          </button>
          <button
            type="button"
            onClick={() => onSelectView('ev')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              activeView === 'ev'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600 dark:border-emerald-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            EV Charging Hubs
          </button>
          <button
            type="button"
            onClick={onOpenRatesGuide}
            className="whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 hover:text-slate-900 dark:hover:text-white"
          >
            HDB/URA Rates Guide
          </button>
          <button
            type="button"
            onClick={onOpenBackendModal}
            className="whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white"
          >
            <Database className="w-3.5 h-3.5 text-slate-400" />
            <span>Backend Integration</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action + theme toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleDarkMode}
            aria-label="Toggle color theme"
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onRefreshData}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 disabled:opacity-70 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync Live Lots</span>
          </button>
        </div>
      </div>
    </header>
  );
};
