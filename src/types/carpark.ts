export type AgencyType = 'HDB' | 'URA' | 'LTA' | 'MALL';

export type CarparkType = 'MULTI-STOREY' | 'BASEMENT' | 'SURFACE' | 'MECHANIZED';

export type VehicleCategory = 'car' | 'motorcycle' | 'heavy';

export type OccupancyStatus = 'AVAILABLE' | 'MODERATE' | 'LIMITED' | 'FULL';

export interface LotDetails {
  total: number;
  available: number;
}

export interface EVChargerInfo {
  hasEV: boolean;
  operator?: string;
  count?: number;
  speeds?: string[]; // e.g. ['22kW AC Type 2', '50kW DC CCS2']
}

export interface ParkingRates {
  central_area: boolean;
  day_rate_text: string;
  day_rate_half_hour: number; // in SGD
  night_rate_text: string;
  sunday_ph_free: boolean;
  grace_period_mins: number;
}

export interface SingaporeCarpark {
  id: string; // e.g. "ACB", "TE14", "ION-ORCHARD"
  carpark_number: string;
  name: string;
  address: string;
  agency: AgencyType;
  district: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  carpark_type: CarparkType;
  parking_system: 'ELECTRONIC' | 'COUPON';
  gantry_height_m: number; // e.g. 2.15
  short_term_parking: string;
  free_parking: string;
  night_parking: boolean;
  lots: {
    car: LotDetails;
    motorcycle: LotDetails;
    heavy?: LotDetails;
  };
  ev_charging: EVChargerInfo;
  rates: ParkingRates;
  update_datetime: string;
  trend: 'INCREASING' | 'DECREASING' | 'STABLE';
  distanceKm?: number;
}

export interface FilterState {
  searchQuery: string;
  agency: 'ALL' | AgencyType;
  vehicleType: 'car' | 'motorcycle' | 'all';
  district: string;
  carparkType: 'ALL' | CarparkType;
  minAvailableLots: number; // 0, 10, 30
  onlyWithEV: boolean;
  freeParkingOnly: boolean;
  minHeightMeters: number; // 0, 1.9, 2.0, 2.1
  sortBy: 'available_lots' | 'distance' | 'lowest_rate' | 'name';
}

export interface BackendConfig {
  mode: 'SIMULATED' | 'CUSTOM_API' | 'DATA_GOV_SG';
  apiEndpoint: string;
  apiKey?: string;
  pollingIntervalSeconds: number; // e.g. 30
  isAutoPolling: boolean;
  lastSyncTime?: Date;
}
