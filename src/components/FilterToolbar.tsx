import React from 'react';
import { FilterState, AgencyType } from '../types/carpark';
import { SINGAPORE_DISTRICTS } from '../data/singaporeCarparks';
import { Search, X, SlidersHorizontal, Zap, Gift, RotateCcw, ArrowUpDown } from 'lucide-react';

interface FilterToolbarProps {
  filters: FilterState;
  onChangeFilters: (newFilters: FilterState) => void;
  totalFilteredCount: number;
  totalCount: number;
  onLocateMe: () => void;
  isLocating: boolean;
  hasUserLocation: boolean;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  filters,
  onChangeFilters,
  totalFilteredCount,
  totalCount,
  onLocateMe,
  isLocating,
  hasUserLocation
}) => {
  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onChangeFilters({ ...filters, [key]: value });
  };

  const handleReset = () => {
    onChangeFilters({
      searchQuery: '',
      agency: 'ALL',
      vehicleType: 'car',
      district: 'All Districts',
      carparkType: 'ALL',
      minAvailableLots: 0,
      onlyWithEV: false,
      freeParkingOnly: false,
      minHeightMeters: 0,
      sortBy: 'available_lots'
    });
  };

  const isFiltered =
    filters.searchQuery !== '' ||
    filters.agency !== 'ALL' ||
    filters.vehicleType !== 'car' ||
    filters.district !== 'All Districts' ||
    filters.carparkType !== 'ALL' ||
    filters.minAvailableLots > 0 ||
    filters.onlyWithEV ||
    filters.freeParkingOnly ||
    filters.minHeightMeters > 0;

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 transition-colors">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Row 1: Search bar, District Selector, Locate Me, and Sort */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by carpark code (e.g. ACB, TE14), mall name, or road..."
              value={filters.searchQuery}
              onChange={(e) => updateFilter('searchQuery', e.target.value)}
              className="w-full pl-10 pr-9 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
            />
            {filters.searchQuery && (
              <button
                type="button"
                onClick={() => updateFilter('searchQuery', '')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* District Dropdown */}
          <div className="w-full md:w-56 shrink-0">
            <select
              value={filters.district}
              onChange={(e) => updateFilter('district', e.target.value)}
              className="w-full py-2 px-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
            >
              {SINGAPORE_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="w-full md:w-48 shrink-0 flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={filters.sortBy}
              onChange={(e) =>
                updateFilter('sortBy', e.target.value as FilterState['sortBy'])
              }
              className="w-full py-2 px-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
            >
              <option value="available_lots">Most Lots Available</option>
              <option value="distance">Nearest Distance</option>
              <option value="lowest_rate">Lowest Hourly Rate</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>

          {/* Locate Me button */}
          <button
            type="button"
            onClick={onLocateMe}
            disabled={isLocating}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg border transition-all whitespace-nowrap shrink-0 flex items-center justify-center gap-1.5 cursor-pointer ${
              hasUserLocation
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <span>{isLocating ? 'Locating...' : hasUserLocation ? 'GPS Located' : 'Use Current GPS'}</span>
          </button>
        </div>

        {/* Row 2: Agency segmented tabs & toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Agency Segmented Buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
            {(['ALL', 'HDB', 'URA', 'MALL'] as const).map((ag) => {
              const label = ag === 'ALL' ? 'All Operators' : ag === 'MALL' ? 'Shopping Malls' : ag;
              const active = filters.agency === ag;
              return (
                <button
                  key={ag}
                  type="button"
                  onClick={() => updateFilter('agency', ag)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Vehicle Segmented Toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
            <button
              type="button"
              onClick={() => updateFilter('vehicleType', 'car')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap cursor-pointer ${
                filters.vehicleType === 'car'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Cars
            </button>
            <button
              type="button"
              onClick={() => updateFilter('vehicleType', 'motorcycle')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap cursor-pointer ${
                filters.vehicleType === 'motorcycle'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Motorcycles
            </button>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => updateFilter('onlyWithEV', !filters.onlyWithEV)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                filters.onlyWithEV
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 font-semibold'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>EV Ready Only</span>
            </button>

            <button
              type="button"
              onClick={() => updateFilter('freeParkingOnly', !filters.freeParkingOnly)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                filters.freeParkingOnly
                  ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-300 font-semibold'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
              }`}
            >
              <Gift className="w-3.5 h-3.5 text-blue-500" />
              <span>Sunday / Free Schemes</span>
            </button>

            <button
              type="button"
              onClick={() =>
                updateFilter(
                  'minAvailableLots',
                  filters.minAvailableLots === 0 ? 20 : 0
                )
              }
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                filters.minAvailableLots > 0
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 font-semibold'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
              }`}
            >
              <span>{'>'} 20 Lots Free</span>
            </button>

            {isFiltered && (
              <button
                type="button"
                onClick={handleReset}
                className="px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
                title="Reset all filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
