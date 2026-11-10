import React from 'react';
import { SingaporeCarpark } from '../types/carpark';
import { Car, Zap, ShieldCheck, Clock, MapPin } from 'lucide-react';

interface QuickStatsStripProps {
  carparks: SingaporeCarpark[];
  lastUpdated: Date;
  selectedDistrict: string;
  backendMode: 'SIMULATED' | 'LTA_DATAMALL' | 'CUSTOM_API' | 'DATA_GOV_SG';
  onOpenBackendModal: () => void;
}

export const QuickStatsStrip: React.FC<QuickStatsStripProps> = ({
  carparks,
  lastUpdated,
  selectedDistrict,
  backendMode,
  onOpenBackendModal
}) => {
  const totalAvailableCarLots = carparks.reduce((sum, c) => sum + c.lots.car.available, 0);
  const totalCarLots = carparks.reduce((sum, c) => sum + c.lots.car.total, 0);
  const overallOccupancyPct = totalCarLots > 0
    ? Math.round(((totalCarLots - totalAvailableCarLots) / totalCarLots) * 100)
    : 0;

  const evChargerCount = carparks.filter((c) => c.ev_charging.hasEV).length;
  const freeParkingCount = carparks.filter((c) => c.free_parking !== 'NO').length;

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-3 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-300">
        {/* Metric Cluster with clean unboxed text and typographic separators */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <div className="flex items-center gap-1.5 text-slate-900 dark:text-white font-medium">
            <Car className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Available Lots:</span>
            <span className="font-mono tabular-nums font-bold text-emerald-600 dark:text-emerald-400">
              {totalAvailableCarLots.toLocaleString()}
            </span>
            <span className="text-slate-400 font-normal">/ {totalCarLots.toLocaleString()}</span>
          </div>

          <span className="hidden sm:inline text-slate-300 dark:text-slate-700" aria-hidden="true">·</span>

          <div className="flex items-center gap-1.5">
            <span>Island Occupancy:</span>
            <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
              {overallOccupancyPct}%
            </span>
          </div>

          <span className="hidden sm:inline text-slate-300 dark:text-slate-700" aria-hidden="true">·</span>

          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>EV Hubs:</span>
            <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
              {evChargerCount}
            </span>
          </div>

          <span className="hidden sm:inline text-slate-300 dark:text-slate-700" aria-hidden="true">·</span>

          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            <span>Sunday/PH Free:</span>
            <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
              {freeParkingCount}
            </span>
          </div>
        </div>

        {/* Source status & Last sync */}
        <div className="flex items-center gap-3 shrink-0 ml-auto text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Synced:</span>
            <span className="font-mono tabular-nums">
              {lastUpdated.toLocaleTimeString('en-SG', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenBackendModal}
            className="hover:underline text-emerald-600 dark:text-emerald-400 font-medium cursor-pointer"
          >
            {backendMode === 'LTA_DATAMALL'
              ? 'LTA DataMall Active'
              : backendMode === 'SIMULATED'
              ? 'Seed Engine Active'
              : 'Custom API Connected'}
          </button>
        </div>
      </div>
    </div>
  );
};
