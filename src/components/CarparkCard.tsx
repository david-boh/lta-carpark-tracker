import React from 'react';
import { SingaporeCarpark, OccupancyStatus } from '../types/carpark';
import { computeOccupancyStatus, getStatusColor } from '../services/carparkService';
import {
  Zap,
  Navigation,
  MapPin,
  TrendingDown,
  TrendingUp,
  Minus,
  Star,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface CarparkCardProps {
  carpark: SingaporeCarpark;
  isSelected: boolean;
  onSelect: () => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
  vehicleType: 'car' | 'motorcycle' | 'all';
}

export const CarparkCard: React.FC<CarparkCardProps> = ({
  carpark,
  isSelected,
  onSelect,
  isFavorite,
  onToggleFavorite,
  vehicleType
}) => {
  const lots = vehicleType === 'motorcycle' ? carpark.lots.motorcycle : carpark.lots.car;
  const status: OccupancyStatus = computeOccupancyStatus(lots.available, lots.total);
  const statusStyles = getStatusColor(status);

  const occupancyRatio = lots.total > 0
    ? Math.min(100, Math.round(((lots.total - lots.available) / lots.total) * 100))
    : 0;

  const handleNavigateGoogleMaps = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `https://www.google.com/maps/dir/?api=1&destination=${carpark.coordinates.lat},${carpark.coordinates.lng}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      onClick={onSelect}
      className={`group relative bg-white dark:bg-slate-900 rounded-xl p-4 border transition-all cursor-pointer ${
        isSelected
          ? 'border-emerald-600 dark:border-emerald-500 shadow-md ring-1 ring-emerald-600/20 dark:ring-emerald-500/20'
          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs'
      }`}
    >
      {/* Top Header Row: Clean unboxed metadata with typographic separators */}
      <div className="flex items-center justify-between gap-2 mb-2 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5 font-medium">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {carpark.agency}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono text-slate-500 dark:text-slate-400">
            {carpark.carpark_number}
          </span>
          {carpark.distanceKm !== undefined && (
            <>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-0.5 text-slate-600 dark:text-slate-400 font-mono tabular-nums">
                <MapPin className="w-3 h-3 text-slate-400" />
                {carpark.distanceKm} km
              </span>
            </>
          )}
        </div>

        {/* Favorite toggle button */}
        <button
          type="button"
          onClick={onToggleFavorite}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className="p-1 text-slate-400 hover:text-amber-500 transition-colors"
        >
          <Star
            className={`w-4 h-4 ${
              isFavorite
                ? 'fill-amber-400 text-amber-500'
                : 'text-slate-300 dark:text-slate-600'
            }`}
          />
        </button>
      </div>

      {/* Carpark Name & Address */}
      <h3 className="text-base font-semibold text-slate-900 dark:text-white leading-tight mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
        {carpark.name}
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mb-3">
        {carpark.address}
      </p>

      {/* Primary Metric: Big Tabular Lots & Status */}
      <div className="flex items-baseline justify-between mb-2">
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white tracking-tight">
            {lots.available}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            / {lots.total} {vehicleType === 'motorcycle' ? 'moto lots' : 'car lots'}
          </span>
        </div>

        {/* Trend Indicator */}
        <div className="flex items-center gap-1 text-xs">
          {carpark.trend === 'INCREASING' && (
            <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5" /> Lots opening
            </span>
          )}
          {carpark.trend === 'DECREASING' && (
            <span className="inline-flex items-center gap-0.5 text-orange-600 dark:text-orange-400 font-medium">
              <TrendingDown className="w-3.5 h-3.5" /> Filling up
            </span>
          )}
          {carpark.trend === 'STABLE' && (
            <span className="inline-flex items-center gap-0.5 text-slate-400">
              <Minus className="w-3 h-3" /> Steady
            </span>
          )}
        </div>
      </div>

      {/* Occupancy Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            status === 'AVAILABLE'
              ? 'bg-emerald-500'
              : status === 'MODERATE'
              ? 'bg-amber-500'
              : status === 'LIMITED'
              ? 'bg-orange-500'
              : 'bg-rose-500'
          }`}
          style={{ width: `${occupancyRatio}%` }}
        />
      </div>

      {/* Quiet Key Features Text */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 dark:text-slate-400 mb-3 pt-1 border-t border-slate-100 dark:border-slate-800/80">
        <span>${carpark.rates.day_rate_half_hour.toFixed(2)}/30m</span>
        <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
        <span>Height {carpark.gantry_height_m}m</span>
        {carpark.ev_charging.hasEV && (
          <>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 font-medium">
              <Zap className="w-3 h-3 text-amber-500" />
              {carpark.ev_charging.count ?? 2} EV Plugs
            </span>
          </>
        )}
        {carpark.free_parking !== 'NO' && (
          <>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              Free Sun/PH
            </span>
          </>
        )}
      </div>

      {/* Action Strip */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1 group-hover:underline">
          <span>Rates & Details</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>

        <button
          type="button"
          onClick={handleNavigateGoogleMaps}
          className="p-1.5 text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
          title="Open Directions in Google Maps"
        >
          <Navigation className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
