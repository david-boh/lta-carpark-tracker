import React, { useState } from 'react';
import { SingaporeCarpark, OccupancyStatus } from '../types/carpark';
import { computeOccupancyStatus, getStatusColor } from '../services/carparkService';
import { FeeCalculator } from './FeeCalculator';
import {
  X,
  MapPin,
  Car,
  Zap,
  Navigation,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Minus,
  Star,
  Info,
  Clock
} from 'lucide-react';

interface CarparkDetailModalProps {
  carpark: SingaporeCarpark | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  allCarparks: SingaporeCarpark[];
  onSelectAlternative: (carpark: SingaporeCarpark) => void;
}

export const CarparkDetailModal: React.FC<CarparkDetailModalProps> = ({
  carpark,
  onClose,
  isFavorite,
  onToggleFavorite,
  allCarparks,
  onSelectAlternative
}) => {
  const [copied, setCopied] = useState(false);

  if (!carpark) return null;

  const carLots = carpark.lots.car;
  const motoLots = carpark.lots.motorcycle;
  const status: OccupancyStatus = computeOccupancyStatus(carLots.available, carLots.total);
  const statusStyle = getStatusColor(status);

  // Find nearby alternatives in the same district
  const alternatives = allCarparks
    .filter((c) => c.district === carpark.district && c.id !== carpark.id)
    .sort((a, b) => b.lots.car.available - a.lots.car.available)
    .slice(0, 3);

  const handleCopyDetails = () => {
    const text = `${carpark.name} (${carpark.carpark_number})\nAddress: ${carpark.address}\nCoordinates: ${carpark.coordinates.lat}, ${carpark.coordinates.lng}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${carpark.coordinates.lat},${carpark.coordinates.lng}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleOpenWaze = () => {
    const url = `https://waze.com/ul?ll=${carpark.coordinates.lat},${carpark.coordinates.lng}&navigate=yes`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4">
          <div>
            {/* Metadata with typographic separators */}
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-medium">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {carpark.agency}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">{carpark.carpark_number}</span>
              <span aria-hidden="true">·</span>
              <span>{carpark.district}</span>
              <span aria-hidden="true">·</span>
              <span>{carpark.carpark_type}</span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
              {carpark.name}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{carpark.address}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onToggleFavorite}
              aria-label="Toggle favorite"
              className="p-2 text-slate-400 hover:text-amber-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Star
                className={`w-5 h-5 ${
                  isFavorite
                    ? 'fill-amber-400 text-amber-500'
                    : 'text-slate-300 dark:text-slate-600'
                }`}
              />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Real-Time Lots Breakdown Cluster */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Car Lots */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span className="flex items-center gap-1 font-medium">
                  <Car className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Car Lots
                </span>
                <span className="font-mono text-[11px]">
                  {Math.round(((carLots.total - carLots.available) / carLots.total) * 100)}% filled
                </span>
              </div>
              <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                {carLots.available}
                <span className="text-xs font-normal text-slate-400 ml-1">/ {carLots.total}</span>
              </div>
              <div className="mt-1 flex items-center gap-1 text-[11px]">
                {carpark.trend === 'INCREASING' && (
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> Lots freeing up
                  </span>
                )}
                {carpark.trend === 'DECREASING' && (
                  <span className="text-orange-600 dark:text-orange-400 flex items-center gap-0.5">
                    <TrendingDown className="w-3 h-3" /> Lots filling fast
                  </span>
                )}
                {carpark.trend === 'STABLE' && (
                  <span className="text-slate-400 flex items-center gap-0.5">
                    <Minus className="w-3 h-3" /> Stable occupancy
                  </span>
                )}
              </div>
            </div>

            {/* Motorcycle Lots */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span className="font-medium">Motorcycle</span>
                <span className="font-mono text-[11px]">EPS Rate $0.65/day</span>
              </div>
              <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                {motoLots.available}
                <span className="text-xs font-normal text-slate-400 ml-1">/ {motoLots.total}</span>
              </div>
              <div className="mt-1 text-[11px] text-slate-500">
                White &amp; Concession Lots
              </div>
            </div>

            {/* EV Charging Station */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span className="flex items-center gap-1 font-medium text-amber-700 dark:text-amber-400">
                  <Zap className="w-3.5 h-3.5 text-amber-500" /> EV Chargers
                </span>
                <span className="font-mono text-[11px]">
                  {carpark.ev_charging.hasEV ? carpark.ev_charging.operator : 'None'}
                </span>
              </div>
              <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                {carpark.ev_charging.hasEV ? carpark.ev_charging.count : 0}
                <span className="text-xs font-normal text-slate-400 ml-1">plugs</span>
              </div>
              <div className="mt-1 text-[11px] text-slate-500 truncate">
                {carpark.ev_charging.speeds?.join(', ') || 'No chargers installed'}
              </div>
            </div>
          </div>

          {/* Interactive Fee Calculator */}
          <FeeCalculator carpark={carpark} />

          {/* Rates and Regulations Grid */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              Official Parking Rates &amp; Policy
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="text-slate-500 dark:text-slate-400 font-medium mb-0.5">Day Rate:</div>
                <div className="font-semibold text-slate-900 dark:text-white">{carpark.rates.day_rate_text}</div>
                {carpark.rates.central_area && (
                  <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">
                    Central Area rate applied (HDB $1.20 / 30 mins)
                  </div>
                )}
              </div>

              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="text-slate-500 dark:text-slate-400 font-medium mb-0.5">Night Parking Scheme:</div>
                <div className="font-semibold text-slate-900 dark:text-white">{carpark.rates.night_rate_text}</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  10:30pm to 7:00am next morning
                </div>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="text-slate-500 dark:text-slate-400 font-medium mb-0.5">Gantry Clearance &amp; System:</div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  {carpark.gantry_height_m}m · {carpark.parking_system} (EPS Gantry)
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  ERP IU / CashCard / EZ-Link / NETS FlashPay
                </div>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="text-slate-500 dark:text-slate-400 font-medium mb-0.5">Free Parking &amp; Grace:</div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  {carpark.free_parking} · {carpark.rates.grace_period_mins} mins grace
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {carpark.rates.sunday_ph_free ? 'Free on Sunday & Public Holidays' : 'Standard tariffs on Sunday'}
                </div>
              </div>
            </div>
          </div>

          {/* Alternative Carparks in Same District */}
          {alternatives.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2">
                Nearby Alternatives in {carpark.district}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {alternatives.map((alt) => (
                  <button
                    key={alt.id}
                    type="button"
                    onClick={() => onSelectAlternative(alt)}
                    className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500 text-left transition-colors cursor-pointer"
                  >
                    <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {alt.name}
                    </div>
                    <div className="flex items-center justify-between text-[11px] mt-1 text-slate-500">
                      <span>{alt.carpark_number}</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {alt.lots.car.available} lots
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleCopyDetails}
            className="px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg border border-slate-300 dark:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Details' : 'Copy Carpark Code'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenWaze}
              className="px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Waze</span>
            </button>
            <button
              type="button"
              onClick={handleOpenGoogleMaps}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Start Navigation in Google Maps</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
