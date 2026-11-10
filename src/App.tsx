import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { TopBar } from './components/TopBar';
import { QuickStatsStrip } from './components/QuickStatsStrip';
import { FilterToolbar } from './components/FilterToolbar';
import { CarparkMap } from './components/CarparkMap';
import { CarparkList } from './components/CarparkList';
import { CarparkDetailModal } from './components/CarparkDetailModal';
import { BackendIntegrationModal } from './components/BackendIntegrationModal';
import { RatesGuideModal } from './components/RatesGuideModal';
import { INITIAL_CARPARKS } from './data/singaporeCarparks';
import {
  SingaporeCarpark,
  FilterState,
  BackendConfig
} from './types/carpark';
import {
  filterAndSortCarparks,
  simulateRealtimeJitter,
  fetchLTACarparks
} from './services/carparkService';
import { Map as MapIcon, ListFilter, Zap, Navigation2 } from 'lucide-react';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('sg_parkpulse_theme') === 'dark' ||
        window.matchMedia('(prefers-color-scheme: dark)').matches
      );
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('sg_parkpulse_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('sg_parkpulse_theme', 'light');
    }
  }, [darkMode]);

  // Carpark data state
  const [carparks, setCarparks] = useState<SingaporeCarpark[]>(INITIAL_CARPARKS);
  const [selectedCarpark, setSelectedCarpark] = useState<SingaporeCarpark | null>(null);
  const [activeView, setActiveView] = useState<'map' | 'directory' | 'ev'>('map');
  const [mobileSplitView, setMobileSplitView] = useState<'map' | 'list'>('map');

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sg_parkpulse_favorites');
      return saved ? JSON.parse(saved) : ['MALL-ION', 'HDB-ACB', 'MALL-SUNTEC'];
    } catch {
      return ['MALL-ION', 'HDB-ACB'];
    }
  });

  useEffect(() => {
    localStorage.setItem('sg_parkpulse_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = useCallback((id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  // User Geolocation
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  const handleLocateMe = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        },
        () => {
          setIsLocating(false);
          // Fallback to Singapore central location (City Hall / Raffles Place)
          setUserLocation({ lat: 1.2930, lng: 103.8520 });
        },
        { timeout: 8000 }
      );
    } else {
      setIsLocating(false);
      setUserLocation({ lat: 1.2930, lng: 103.8520 });
    }
  };

  // Backend config & Polling state
  const [backendConfig, setBackendConfig] = useState<BackendConfig>(() => {
    try {
      const saved = localStorage.getItem('sg_parkpulse_backend_cfg');
      return saved
        ? JSON.parse(saved)
        : {
            mode: 'SIMULATED',
            apiEndpoint: 'http://localhost:8000/api/carparks',
            apiKey: '',
            pollingIntervalSeconds: 30,
            isAutoPolling: true
          };
    } catch {
      return {
        mode: 'SIMULATED',
        apiEndpoint: 'http://localhost:8000/api/carparks',
        apiKey: '',
        pollingIntervalSeconds: 30,
        isAutoPolling: true
      };
    }
  });

  useEffect(() => {
    localStorage.setItem('sg_parkpulse_backend_cfg', JSON.stringify(backendConfig));
  }, [backendConfig]);

  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
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

  // When switching to EV view, automatically toggle onlyWithEV
  useEffect(() => {
    if (activeView === 'ev') {
      setFilters((prev) => ({ ...prev, onlyWithEV: true }));
    }
  }, [activeView]);

  // Modals
  const [showBackendModal, setShowBackendModal] = useState<boolean>(false);
  const [showRatesGuide, setShowRatesGuide] = useState<boolean>(false);

  // Manual & Automated Refresh Handler
  const handleRefreshData = useCallback(async () => {
    setIsRefreshing(true);
    if (backendConfig.mode === 'LTA_DATAMALL') {
      const result = await fetchLTACarparks(backendConfig.apiKey);
      if (result.success && result.carparks && result.carparks.length > 0) {
        setCarparks(result.carparks);
      } else {
        setCarparks((prev) => simulateRealtimeJitter(prev));
      }
      setLastUpdated(new Date());
      setIsRefreshing(false);
    } else {
      setTimeout(() => {
        setCarparks((prev) => simulateRealtimeJitter(prev));
        setLastUpdated(new Date());
        setIsRefreshing(false);
      }, 400);
    }
  }, [backendConfig.mode, backendConfig.apiKey]);

  // Background Auto-polling interval
  useEffect(() => {
    if (!backendConfig.isAutoPolling) return;
    const intervalMs = Math.max(10, backendConfig.pollingIntervalSeconds) * 1000;
    const timer = setInterval(() => {
      if (backendConfig.mode === 'LTA_DATAMALL') {
        fetchLTACarparks(backendConfig.apiKey).then((res) => {
          if (res.success && res.carparks && res.carparks.length > 0) {
            setCarparks(res.carparks);
          } else {
            setCarparks((prev) => simulateRealtimeJitter(prev));
          }
          setLastUpdated(new Date());
        });
      } else {
        setCarparks((prev) => simulateRealtimeJitter(prev));
        setLastUpdated(new Date());
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [backendConfig.isAutoPolling, backendConfig.pollingIntervalSeconds, backendConfig.mode, backendConfig.apiKey]);

  // Computed filtered list
  const filteredCarparks = useMemo(() => {
    return filterAndSortCarparks(carparks, filters, userLocation);
  }, [carparks, filters, userLocation]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* 1. Global Navigation TopBar */}
      <TopBar
        activeView={activeView}
        onSelectView={(v) => {
          setActiveView(v);
          if (v === 'ev') {
            setFilters((prev) => ({ ...prev, onlyWithEV: true }));
          }
        }}
        onOpenRatesGuide={() => setShowRatesGuide(true)}
        onOpenBackendModal={() => setShowBackendModal(true)}
        onRefreshData={handleRefreshData}
        isRefreshing={isRefreshing}
        lastUpdated={lastUpdated}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        backendMode={backendConfig.mode}
      />

      {/* 2. Island-wide Statistics Strip */}
      <QuickStatsStrip
        carparks={carparks}
        lastUpdated={lastUpdated}
        selectedDistrict={filters.district}
        backendMode={backendConfig.mode}
        onOpenBackendModal={() => setShowBackendModal(true)}
      />

      {/* 3. Filter & Search Controls */}
      <FilterToolbar
        filters={filters}
        onChangeFilters={setFilters}
        totalFilteredCount={filteredCarparks.length}
        totalCount={carparks.length}
        onLocateMe={handleLocateMe}
        isLocating={isLocating}
        hasUserLocation={userLocation !== null}
      />

      {/* Mobile Map / List Segmented Switcher (visible on small screens) */}
      {activeView === 'map' && (
        <div className="lg:hidden p-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex justify-center">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-full max-w-xs">
            <button
              type="button"
              onClick={() => setMobileSplitView('map')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mobileSplitView === 'map'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map View</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileSplitView('list')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mobileSplitView === 'list'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>List View ({filteredCarparks.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. Main Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:px-6 lg:px-8 py-6">
        {/* VIEW A: Interactive Map View with Side-by-Side Cards (1440px Desktop Baseline) */}
        {activeView === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Map Column */}
            <div
              className={`lg:col-span-7 xl:col-span-8 lg:sticky lg:top-24 h-[650px] ${
                mobileSplitView === 'list' ? 'hidden lg:block' : 'block'
              }`}
            >
              <CarparkMap
                carparks={filteredCarparks}
                selectedCarpark={selectedCarpark}
                onSelectCarpark={(cp) => setSelectedCarpark(cp)}
                selectedDistrict={filters.district}
                vehicleType={filters.vehicleType}
                userLocation={userLocation}
                darkMode={darkMode}
              />
            </div>

            {/* List Column */}
            <div
              className={`lg:col-span-5 xl:col-span-4 ${
                mobileSplitView === 'map' ? 'hidden lg:block' : 'block'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
                  <span className="font-medium">
                    {filteredCarparks.length} Carparks Available
                  </span>
                  <span className="text-[11px]">Click card to view tariffs &amp; directions</span>
                </div>

                <div className="space-y-3.5 max-h-[640px] overflow-y-auto pr-1">
                  {filteredCarparks.map((cp) => (
                    <div key={cp.id}>
                      <CarparkList
                        carparks={[cp]}
                        selectedCarpark={selectedCarpark}
                        onSelectCarpark={() => setSelectedCarpark(cp)}
                        favorites={favorites}
                        onToggleFavorite={(id, e) => toggleFavorite(id, e)}
                        vehicleType={filters.vehicleType}
                        onResetFilters={() => {}}
                      />
                    </div>
                  ))}
                  {filteredCarparks.length === 0 && (
                    <div className="p-8 text-center text-xs text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                      No carparks match current filters.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW B: Comprehensive Carpark Directory (Grid View) */}
        {activeView === 'directory' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Singapore Carpark Directory
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Real-time availability, EPS gantry clearance, and rates across HDB, URA, and major shopping destinations.
                </p>
              </div>
            </div>

            <CarparkList
              carparks={filteredCarparks}
              selectedCarpark={selectedCarpark}
              onSelectCarpark={(cp) => setSelectedCarpark(cp)}
              favorites={favorites}
              onToggleFavorite={(id, e) => toggleFavorite(id, e)}
              vehicleType={filters.vehicleType}
              onResetFilters={() =>
                setFilters({
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
                })
              }
            />
          </div>
        )}

        {/* VIEW C: EV Charging Hubs Spotlight */}
        {activeView === 'ev' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <span>Singapore EV Charging Network Tracker</span>
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Carparks equipped with high-speed AC Type 2 and DC Fast Chargers (SP Mobility, CDG ENGIE, Charge+).
                </p>
              </div>
            </div>

            <CarparkList
              carparks={filteredCarparks}
              selectedCarpark={selectedCarpark}
              onSelectCarpark={(cp) => setSelectedCarpark(cp)}
              favorites={favorites}
              onToggleFavorite={(id, e) => toggleFavorite(id, e)}
              vehicleType={filters.vehicleType}
              onResetFilters={() =>
                setFilters((prev) => ({ ...prev, searchQuery: '', district: 'All Districts' }))
              }
            />
          </div>
        )}
      </main>

      {/* 5. Minimalist Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 transition-colors mt-auto text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">SG ParkPulse</span>
            <span aria-hidden="true">·</span>
            <span>Frontend Ready for DataMall / GovTech Backend Integration</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setShowRatesGuide(true)}
              className="hover:underline hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              Parking Regulations
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setShowBackendModal(true)}
              className="hover:underline hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              API Endpoints &amp; Schema
            </button>
          </div>
        </div>
      </footer>

      {/* 6. Carpark Detail Modal Drawer */}
      {selectedCarpark && (
        <CarparkDetailModal
          carpark={selectedCarpark}
          onClose={() => setSelectedCarpark(null)}
          isFavorite={favorites.includes(selectedCarpark.id)}
          onToggleFavorite={() => toggleFavorite(selectedCarpark.id)}
          allCarparks={carparks}
          onSelectAlternative={(alt) => setSelectedCarpark(alt)}
        />
      )}

      {/* 7. Backend Integration Modal */}
      {showBackendModal && (
        <BackendIntegrationModal
          config={backendConfig}
          onUpdateConfig={setBackendConfig}
          onClose={() => setShowBackendModal(false)}
        />
      )}

      {/* 8. Rates & Policy Guide Modal */}
      {showRatesGuide && (
        <RatesGuideModal onClose={() => setShowRatesGuide(false)} />
      )}
    </div>
  );
}
