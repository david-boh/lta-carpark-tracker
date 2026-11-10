import { INITIAL_CARPARKS } from '../data/singaporeCarparks';
import { BackendConfig, FilterState, OccupancyStatus, SingaporeCarpark } from '../types/carpark';

// Haversine formula to compute distance in km
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function computeOccupancyStatus(available: number, total: number): OccupancyStatus {
  if (available <= 0) return 'FULL';
  const ratio = available / total;
  if (available < 10 || ratio < 0.08) return 'LIMITED';
  if (available < 35 || ratio < 0.25) return 'MODERATE';
  return 'AVAILABLE';
}

export function getStatusColor(status: OccupancyStatus): {
  bg: string;
  text: string;
  border: string;
  pinBg: string;
} {
  switch (status) {
    case 'AVAILABLE':
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/40',
        text: 'text-emerald-700 dark:text-emerald-400',
        border: 'border-emerald-200 dark:border-emerald-800',
        pinBg: '#10b981' // emerald-500
      };
    case 'MODERATE':
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/40',
        text: 'text-amber-700 dark:text-amber-400',
        border: 'border-amber-200 dark:border-amber-800',
        pinBg: '#f59e0b' // amber-500
      };
    case 'LIMITED':
      return {
        bg: 'bg-orange-50 dark:bg-orange-950/40',
        text: 'text-orange-700 dark:text-orange-400',
        border: 'border-orange-200 dark:border-orange-800',
        pinBg: '#f97316' // orange-500
      };
    case 'FULL':
      return {
        bg: 'bg-rose-50 dark:bg-rose-950/40',
        text: 'text-rose-700 dark:text-rose-400',
        border: 'border-rose-200 dark:border-rose-800',
        pinBg: '#ef4444' // rose-500
      };
  }
}

// Simulates real-time lot changes across the dataset
export function simulateRealtimeJitter(carparks: SingaporeCarpark[]): SingaporeCarpark[] {
  return carparks.map((cp) => {
    // Only ~30% of carparks change on each tick for realistic pacing
    if (Math.random() > 0.35) return cp;

    const delta = Math.floor(Math.random() * 5) - 2; // -2 to +2
    const currentCar = cp.lots.car.available;
    const totalCar = cp.lots.car.total;
    const newCar = Math.max(0, Math.min(totalCar, currentCar + delta));

    let trend: 'INCREASING' | 'DECREASING' | 'STABLE' = 'STABLE';
    if (newCar > currentCar) trend = 'INCREASING';
    if (newCar < currentCar) trend = 'DECREASING';

    return {
      ...cp,
      lots: {
        ...cp.lots,
        car: {
          ...cp.lots.car,
          available: newCar
        }
      },
      update_datetime: new Date().toISOString(),
      trend
    };
  });
}

// Client-side filter and sort
export function filterAndSortCarparks(
  carparks: SingaporeCarpark[],
  filters: FilterState,
  userLocation: { lat: number; lng: number } | null
): SingaporeCarpark[] {
  let list = carparks.map((cp) => {
    let distanceKm = cp.distanceKm;
    if (userLocation) {
      distanceKm = calculateDistanceKm(
        userLocation.lat,
        userLocation.lng,
        cp.coordinates.lat,
        cp.coordinates.lng
      );
    }
    return { ...cp, distanceKm };
  });

  // Query filter
  if (filters.searchQuery.trim()) {
    const q = filters.searchQuery.toLowerCase().trim();
    list = list.filter(
      (cp) =>
        cp.name.toLowerCase().includes(q) ||
        cp.carpark_number.toLowerCase().includes(q) ||
        cp.address.toLowerCase().includes(q) ||
        cp.district.toLowerCase().includes(q)
    );
  }

  // Agency filter
  if (filters.agency !== 'ALL') {
    list = list.filter((cp) => cp.agency === filters.agency);
  }

  // District filter
  if (filters.district && filters.district !== 'All Districts') {
    list = list.filter((cp) => cp.district === filters.district);
  }

  // Carpark Type
  if (filters.carparkType !== 'ALL') {
    list = list.filter((cp) => cp.carpark_type === filters.carparkType);
  }

  // Min Available Lots
  if (filters.minAvailableLots > 0) {
    list = list.filter((cp) => {
      const avail = filters.vehicleType === 'motorcycle'
        ? cp.lots.motorcycle.available
        : cp.lots.car.available;
      return avail >= filters.minAvailableLots;
    });
  }

  // EV Charging
  if (filters.onlyWithEV) {
    list = list.filter((cp) => cp.ev_charging.hasEV);
  }

  // Free Parking
  if (filters.freeParkingOnly) {
    list = list.filter((cp) => cp.free_parking !== 'NO');
  }

  // Gantry clearance
  if (filters.minHeightMeters > 0) {
    list = list.filter((cp) => cp.gantry_height_m >= filters.minHeightMeters);
  }

  // Sort
  list.sort((a, b) => {
    switch (filters.sortBy) {
      case 'available_lots': {
        const aLots = filters.vehicleType === 'motorcycle' ? a.lots.motorcycle.available : a.lots.car.available;
        const bLots = filters.vehicleType === 'motorcycle' ? b.lots.motorcycle.available : b.lots.car.available;
        return bLots - aLots;
      }
      case 'distance': {
        const distA = a.distanceKm ?? 999;
        const distB = b.distanceKm ?? 999;
        return distA - distB;
      }
      case 'lowest_rate':
        return a.rates.day_rate_half_hour - b.rates.day_rate_half_hour;
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return list;
}

// Calculate parking fee estimation in SGD
export function estimateParkingFee(
  carpark: SingaporeCarpark,
  durationMinutes: number,
  isSundayOrPH: boolean = false
): {
  totalFee: number;
  breakdown: string;
  isGracePeriod: boolean;
} {
  if (durationMinutes <= carpark.rates.grace_period_mins) {
    return {
      totalFee: 0,
      breakdown: `Grace period (${carpark.rates.grace_period_mins} mins) applied. No parking charge.`,
      isGracePeriod: true
    };
  }

  if (isSundayOrPH && carpark.rates.sunday_ph_free) {
    return {
      totalFee: 0,
      breakdown: `Free parking active on Sundays & Public Holidays!`,
      isGracePeriod: false
    };
  }

  // Round up to half hour blocks
  const chargeableMins = durationMinutes;
  const halfHourBlocks = Math.ceil(chargeableMins / 30);
  const total = Math.round(halfHourBlocks * carpark.rates.day_rate_half_hour * 100) / 100;

  return {
    totalFee: total,
    breakdown: `${halfHourBlocks} x 30-min block(s) @ $${carpark.rates.day_rate_half_hour.toFixed(2)}/block`,
    isGracePeriod: false
  };
}
