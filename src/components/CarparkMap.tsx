import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { SingaporeCarpark, OccupancyStatus } from '../types/carpark';
import { computeOccupancyStatus } from '../services/carparkService';
import { DISTRICT_MAP_CENTERS } from '../data/singaporeCarparks';
import { Layers } from 'lucide-react';

interface CarparkMapProps {
  carparks: SingaporeCarpark[];
  selectedCarpark: SingaporeCarpark | null;
  onSelectCarpark: (carpark: SingaporeCarpark) => void;
  selectedDistrict: string;
  vehicleType: 'car' | 'motorcycle' | 'all';
  userLocation: { lat: number; lng: number } | null;
  darkMode: boolean;
}

export type BaseMapStyle = 'onemap-default' | 'onemap-night' | 'onemap-grey' | 'osm';

export const CarparkMap: React.FC<CarparkMapProps> = ({
  carparks,
  selectedCarpark,
  onSelectCarpark,
  selectedDistrict,
  vehicleType,
  userLocation,
  darkMode
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // User-selected basemap style (defaults to onemap-night in dark mode, onemap-default in light mode)
  const [baseMapStyle, setBaseMapStyle] = useState<BaseMapStyle>(
    darkMode ? 'onemap-night' : 'onemap-default'
  );
  const [showStyleMenu, setShowStyleMenu] = useState(false);

  // Sync with darkMode if user hasn't explicitly chosen a special style
  useEffect(() => {
    if (darkMode && baseMapStyle === 'onemap-default') {
      setBaseMapStyle('onemap-night');
    } else if (!darkMode && baseMapStyle === 'onemap-night') {
      setBaseMapStyle('onemap-default');
    }
  }, [darkMode]);

  const getTileConfig = (style: BaseMapStyle) => {
    switch (style) {
      case 'onemap-night':
        return {
          url: 'https://www.onemap.gov.sg/maps/tiles/Night/{z}/{x}/{y}.png',
          attribution:
            '&copy; <a href="https://www.onemap.gov.sg/" target="_blank">OneMap</a> &copy; Singapore Land Authority',
          maxZoom: 19
        };
      case 'onemap-grey':
        return {
          url: 'https://www.onemap.gov.sg/maps/tiles/Grey/{z}/{x}/{y}.png',
          attribution:
            '&copy; <a href="https://www.onemap.gov.sg/" target="_blank">OneMap</a> &copy; Singapore Land Authority',
          maxZoom: 19
        };
      case 'osm':
        return {
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        };
      case 'onemap-default':
      default:
        return {
          url: 'https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png',
          attribution:
            '&copy; <a href="https://www.onemap.gov.sg/" target="_blank">OneMap</a> &copy; Singapore Land Authority',
          maxZoom: 19
        };
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Centered over Singapore
    const map = L.map(mapContainerRef.current, {
      center: [1.3521, 103.8198],
      zoom: 12,
      minZoom: 11,
      maxZoom: 19,
      zoomControl: false
    });

    // Add zoom control at bottom right for clean UX
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const initialConfig = getTileConfig(baseMapStyle);
    const tileLayer = L.tileLayer(initialConfig.url, {
      attribution: initialConfig.attribution,
      maxZoom: initialConfig.maxZoom
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      tileLayerRef.current = null;
    };
  }, []);

  // Update tile layer URL dynamically when style changes
  useEffect(() => {
    if (!tileLayerRef.current) return;
    const config = getTileConfig(baseMapStyle);
    tileLayerRef.current.setUrl(config.url);
  }, [baseMapStyle]);

  // Pan to selected district if changed
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const targetCenter = DISTRICT_MAP_CENTERS[selectedDistrict];
    if (targetCenter) {
      mapInstanceRef.current.flyTo(
        [targetCenter.lat, targetCenter.lng],
        targetCenter.zoom,
        { duration: 1.2 }
      );
    }
  }, [selectedDistrict]);

  // Pan to selected carpark if selected from list or external
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedCarpark) return;
    mapInstanceRef.current.flyTo(
      [selectedCarpark.coordinates.lat, selectedCarpark.coordinates.lng],
      15,
      { duration: 0.8 }
    );
  }, [selectedCarpark?.id]);

  // Handle User Location Marker
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (userLocation) {
      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
      } else {
        const userIcon = L.divIcon({
          className: 'user-gps-marker',
          html: `
            <div style="position: relative; width: 22px; height: 22px;">
              <div style="position: absolute; inset: 0; border-radius: 9999px; background: rgba(59, 130, 246, 0.35); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
              <div style="position: absolute; inset: 3px; border-radius: 9999px; background: #2563eb; border: 2px solid #ffffff; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>
            </div>
          `,
          iconSize: [22, 22],
          iconAnchor: [11, 11]
        });

        userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
          icon: userIcon,
          zIndexOffset: 1000
        })
          .addTo(mapInstanceRef.current)
          .bindPopup('<div class="p-2 text-xs font-semibold text-slate-800">Your Current Location</div>');
      }
    } else if (userMarkerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(userMarkerRef.current);
      userMarkerRef.current = null;
    }
  }, [userLocation]);

  // Render Carpark Markers with live lots
  useEffect(() => {
    if (!markersLayerRef.current || !mapInstanceRef.current) return;

    markersLayerRef.current.clearLayers();

    carparks.forEach((cp) => {
      const avail =
        vehicleType === 'motorcycle'
          ? cp.lots.motorcycle.available
          : cp.lots.car.available;
      const total =
        vehicleType === 'motorcycle'
          ? cp.lots.motorcycle.total
          : cp.lots.car.total;

      const status: OccupancyStatus = computeOccupancyStatus(avail, total);

      // Pin Color Mapping
      let bgHex = '#10b981'; // Green (Available)
      if (status === 'MODERATE') bgHex = '#f59e0b'; // Amber
      if (status === 'LIMITED') bgHex = '#f97316'; // Orange
      if (status === 'FULL') bgHex = '#ef4444'; // Red

      const isSelected = selectedCarpark?.id === cp.id;

      // Custom marker icon showing live lot count
      const customIcon = L.divIcon({
        className: 'custom-carpark-pin',
        html: `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: ${bgHex};
            color: #ffffff;
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            font-weight: 700;
            padding: 2px 6px;
            border-radius: 8px;
            border: 2px solid ${isSelected ? '#0f172a' : '#ffffff'};
            box-shadow: 0 4px 10px rgba(0,0,0,0.22);
            white-space: nowrap;
            transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'};
            transition: transform 0.15s ease-out;
            cursor: pointer;
          ">
            <span>${avail}</span>
          </div>
        `,
        iconSize: [42, 26],
        iconAnchor: [21, 13]
      });

      const marker = L.marker([cp.coordinates.lat, cp.coordinates.lng], {
        icon: customIcon,
        zIndexOffset: isSelected ? 500 : 100
      });

      // Marker click opens details
      marker.on('click', () => {
        onSelectCarpark(cp);
      });

      // Quick hover popup
      const popupHtml = `
        <div style="padding: 10px 14px; min-width: 200px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 4px;">
            <span style="font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase;">${cp.agency} · ${cp.carpark_number}</span>
            <span style="font-size: 11px; font-family: monospace; font-weight: 700; color: ${bgHex};">${avail} Lots</span>
          </div>
          <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 4px; line-height: 1.2;">${cp.name}</div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">${cp.rates.day_rate_text}</div>
          <div style="font-size: 10px; color: #059669; font-weight: 600;">Click pin to view rates & calculate fee</div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        offset: [0, -10],
        closeButton: false
      });

      marker.addTo(markersLayerRef.current!);
    });
  }, [carparks, selectedCarpark?.id, vehicleType]);

  return (
    <div className="relative w-full h-full min-h-[480px] bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Map Legend (Top Left) */}
      <div className="absolute top-4 left-4 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg shadow-md text-xs text-slate-700 dark:text-slate-200 pointer-events-auto">
        <div className="font-semibold text-[11px] text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
          Lot Availability
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="font-medium text-[11px]">&gt; 35 Lots</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
            <span className="font-medium text-[11px]">10-35</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" />
            <span className="font-medium text-[11px]">&lt; 10</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
            <span className="font-medium text-[11px]">Full</span>
          </div>
        </div>
      </div>

      {/* Basemap Switcher (Top Right) */}
      <div className="absolute top-4 right-4 z-10">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowStyleMenu(!showStyleMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-lg shadow-md text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>
              {baseMapStyle === 'onemap-default'
                ? 'OneMap SLA'
                : baseMapStyle === 'onemap-night'
                ? 'OneMap Night'
                : baseMapStyle === 'onemap-grey'
                ? 'OneMap Grey'
                : 'OpenStreetMap'}
            </span>
          </button>

          {showStyleMenu && (
            <div className="absolute right-0 mt-1.5 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg py-1 z-20 text-xs">
              <div className="px-3 py-1 font-semibold text-[10px] uppercase text-slate-400 tracking-wider">
                Singapore Basemaps
              </div>
              <button
                type="button"
                onClick={() => {
                  setBaseMapStyle('onemap-default');
                  setShowStyleMenu(false);
                }}
                className={`w-full px-3 py-1.5 text-left transition-colors cursor-pointer flex items-center justify-between ${
                  baseMapStyle === 'onemap-default'
                    ? 'font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>OneMap SLA (Default)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setBaseMapStyle('onemap-night');
                  setShowStyleMenu(false);
                }}
                className={`w-full px-3 py-1.5 text-left transition-colors cursor-pointer flex items-center justify-between ${
                  baseMapStyle === 'onemap-night'
                    ? 'font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>OneMap Night (Dark)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setBaseMapStyle('onemap-grey');
                  setShowStyleMenu(false);
                }}
                className={`w-full px-3 py-1.5 text-left transition-colors cursor-pointer flex items-center justify-between ${
                  baseMapStyle === 'onemap-grey'
                    ? 'font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>OneMap Grey (Minimal)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setBaseMapStyle('osm');
                  setShowStyleMenu(false);
                }}
                className={`w-full px-3 py-1.5 text-left transition-colors cursor-pointer flex items-center justify-between border-t border-slate-100 dark:border-slate-800 mt-1 pt-1.5 ${
                  baseMapStyle === 'osm'
                    ? 'font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>OpenStreetMap</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* District Quick-Bar at bottom left of map */}
      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-md">
        <span className="text-[11px] text-slate-500 dark:text-slate-400 px-2 font-medium">Quick Jump:</span>
        {['Orchard / Somerset', 'Marina Bay / CBD', 'Jurong East', 'Tampines & Bedok'].map((dist) => (
          <button
            key={dist}
            type="button"
            onClick={() => {
              const target = DISTRICT_MAP_CENTERS[dist];
              if (target && mapInstanceRef.current) {
                mapInstanceRef.current.flyTo([target.lat, target.lng], target.zoom, { duration: 1 });
              }
            }}
            className="px-2 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors cursor-pointer"
          >
            {dist.split('/')[0].trim()}
          </button>
        ))}
      </div>
    </div>
  );
};
