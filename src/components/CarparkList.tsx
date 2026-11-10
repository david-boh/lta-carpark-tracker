import React, { useState } from 'react';
import { SingaporeCarpark } from '../types/carpark';
import { CarparkCard } from './CarparkCard';
import { Star, AlertCircle, RotateCcw } from 'lucide-react';

interface CarparkListProps {
  carparks: SingaporeCarpark[];
  selectedCarpark: SingaporeCarpark | null;
  onSelectCarpark: (carpark: SingaporeCarpark) => void;
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  vehicleType: 'car' | 'motorcycle' | 'all';
  onResetFilters: () => void;
}

export const CarparkList: React.FC<CarparkListProps> = ({
  carparks,
  selectedCarpark,
  onSelectCarpark,
  favorites,
  onToggleFavorite,
  vehicleType,
  onResetFilters
}) => {
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const displayedCarparks = showFavoritesOnly
    ? carparks.filter((cp) => favorites.includes(cp.id))
    : carparks;

  return (
    <div className="space-y-4">
      {/* List Header and Favorite Quick Filter */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <div>
          Showing{' '}
          <span className="font-semibold text-slate-900 dark:text-white font-mono tabular-nums">
            {displayedCarparks.length}
          </span>{' '}
          carparks
        </div>

        <button
          type="button"
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
            showFavoritesOnly
              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
              : 'hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Star
            className={`w-3.5 h-3.5 ${
              showFavoritesOnly
                ? 'fill-amber-400 text-amber-500'
                : 'text-slate-400'
            }`}
          />
          <span>Favorites Only ({favorites.length})</span>
        </button>
      </div>

      {/* Carpark Cards Grid */}
      {displayedCarparks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {displayedCarparks.map((cp) => (
            <CarparkCard
              key={cp.id}
              carpark={cp}
              isSelected={selectedCarpark?.id === cp.id}
              onSelect={() => onSelectCarpark(cp)}
              isFavorite={favorites.includes(cp.id)}
              onToggleFavorite={(e) => onToggleFavorite(cp.id, e)}
              vehicleType={vehicleType}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
            {showFavoritesOnly ? 'No Favorite Carparks Saved' : 'No Carparks Found'}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-5">
            {showFavoritesOnly
              ? 'Click the star icon on any carpark to save it to your favorites list for quick one-tap tracking.'
              : 'Try broadening your search query, selecting "All Districts", or loosening availability filters.'}
          </p>
          <button
            type="button"
            onClick={showFavoritesOnly ? () => setShowFavoritesOnly(false) : onResetFilters}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-emerald-600 rounded-lg hover:bg-slate-800 dark:hover:bg-emerald-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{showFavoritesOnly ? 'Show All Carparks' : 'Reset All Filters'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
