import { SingaporeCarpark } from '../types/carpark';

export const INITIAL_CARPARKS: SingaporeCarpark[] = [
  // ORCHARD & SOMERSET
  {
    id: 'MALL-ION',
    carpark_number: 'ION01',
    name: 'ION Orchard',
    address: '2 Orchard Turn, Singapore 238801',
    agency: 'MALL',
    district: 'Orchard / Somerset',
    coordinates: { lat: 1.3040, lng: 103.8318 },
    carpark_type: 'BASEMENT',
    parking_system: 'ELECTRONIC',
    gantry_height_m: 2.1,
    short_term_parking: 'WHOLE DAY',
    free_parking: 'NO',
    night_parking: true,
    lots: {
      car: { total: 540, available: 124 },
      motorcycle: { total: 60, available: 22 }
    },
    ev_charging: {
      hasEV: true,
      operator: 'SP Mobility',
      count: 6,
      speeds: ['22kW AC Type 2', '50kW DC CCS2']
    },
    rates: {
      central_area: true,
      day_rate_text: '$3.27 for 1st hour, $1.64 per subsequent 30 mins',
      day_rate_half_hour: 1.64,
      night_rate_text: '$5.45 per entry (6pm to 7:59am next day)',
      sunday_ph_free: false,
      grace_period_mins: 10
    },
    update_datetime: new Date().toISOString(),
    trend: 'DECREASING'
  },
  {
    id: 'MALL-PARAGON',
    carpark_number: 'PG01',
    name: 'Paragon Shopping Centre',
    address: '290 Orchard Road, Singapore 238859',
    agency: 'MALL',
    district: 'Orchard / Somerset',
    coordinates: { lat: 1.3038, lng: 103.8359 },
    carpark_type: 'BASEMENT',
    parking_system: 'ELECTRONIC',
    gantry_height_m: 1.95,
    short_term_parking: 'WHOLE DAY',
    free_parking: 'NO',
    night_parking: true,
    lots: {
      car: { total: 416, available: 42 },
      motorcycle: { total: 40, available: 14 }
    },
    ev_charging: {
      hasEV: true,
      operator: 'Charge+',
      count: 4,
      speeds: ['22kW AC Type 2']
    },
    rates: {
      central_area: true,
      day_rate_text: '$3.50 for 1st hour, $1.80 per subsequent 30 mins',
      day_rate_half_hour: 1.80,
      night_rate_text: '$4.80 per entry (5pm to 2:59am)',
      sunday_ph_free: false,
      grace_period_mins: 15
    },
    update_datetime: new Date().toISOString(),
    trend: 'STABLE'
  },
  {
    id: 'HDB-ACB',
    carpark_number: 'ACB',
    name: 'Angullia Park Off-Street Carpark',
    address: 'Angullia Park (behind Wheelock Place / Liat Towers)',
    agency: 'HDB',
    district: 'Orchard / Somerset',
    coordinates: { lat: 1.3048, lng: 103.8306 },
    carpark_type: 'SURFACE',
    parking_system: 'ELECTRONIC',
    gantry_height_m: 4.5,
    short_term_parking: 'WHOLE DAY',
    free_parking: 'NO',
    night_parking: true,
    lots: {
      car: { total: 98, available: 6 },
      motorcycle: { total: 20, available: 8 }
    },
    ev_charging: {
      hasEV: false
    },
    rates: {
      central_area: true,
      day_rate_text: '$1.20 per 30 mins (Central Area standard HDB rate)',
      day_rate_half_hour: 1.20,
      night_rate_text: '$0.60 per 30 mins (Capped at $5.00 from 10:30pm to 7am)',
      sunday_ph_free: false,
      grace_period_mins: 15
    },
    update_datetime: new Date().toISOString(),
    trend: 'DECREASING'
  },
  {
    id: 'MALL-313',
    carpark_number: 'SOM313',
    name: '313@Somerset',
    address: '313 Orchard Road, Singapore 238895',
    agency: 'MALL',
    district: 'Orchard / Somerset',
    coordinates: { lat: 1.3013, lng: 103.8384 },
    carpark_type: 'BASEMENT',
    parking_system: 'ELECTRONIC',
    gantry_height_m: 2.0,
    short_term_parking: 'WHOLE DAY',
    free_parking: 'NO',
    night_parking: true,
    lots: {
      car: { total: 218, available: 31 },
      motorcycle: { total: 35, available: 18 }
    },
    ev_charging: {
      hasEV: true,
      operator: 'CDG ENGIE',
      count: 2,
      speeds: ['50kW DC CCS2']
    },
    rates: {
      central_area: true,
      day_rate_text: '$3.30 for 1st hour, $1.65 per subsequent 30 mins',
      day_rate_half_hour: 1.65,
      night_rate_text: '$4.50 per entry (6pm to 5:59am)',
      sunday_ph_free: false,
      grace_period_mins: 10
    },
    update_datetime: new Date().toISOString(),
    trend: 'INCREASING'
  },
  {
    id: 'MALL-PS',
    carpark_number: 'PS01',
    name: 'Plaza Singapura',
    address: '68 Orchard Road, Singapore 238839',
    agency: 'MALL',
    district: 'Orchard / Somerset',
    coordinates: { lat: 1.3006, lng: 103.8451 },
    carpark_type: 'MULTI-STOREY',
    parking_system: 'ELECTRONIC',
    gantry_height_m: 2.1,
    short_term_parking: 'WHOLE DAY',
    free_parking: 'NO',
    night_parking: true,
    lots: {
      car: { total: 692, available: 210 },
      motorcycle: { total: 80, available: 45 }
    },
    ev_charging: {
      hasEV: true,
      operator: 'SP Mobility',
      count: 8,
      speeds: ['22kW AC Type 2', '60kW DC CCS2']
    },
    rates: {
      central_area: true,
      day_rate_text: '$2.80 for 1st hour, $0.70 per subsequent 15 mins',
      day_rate_half_hour: 1.40,
      night_rate_text: '$3.50 per entry (6pm to 11:59pm)',
      sunday_ph_free: false,
      grace_period_mins: 15
    },
    update_datetime: new Date().toISOString(),
    trend: 'STABLE'
  },

  // MARINA BAY & CBD / DOWNTOWN
  {
    id: 'MALL-MBS',
    carpark_number: 'MBS01',
    name: 'Marina Bay Sands',
    address: '10 Bayfront Avenue, Singapore 018956',
    agency: 'MALL',
    district: 'Marina Bay / CBD',
    coordinates: { lat: 1.2838, lng: 103.8587 },
    carpark_type: 'BASEMENT',
    parking_system: 'ELECTRONIC',
    gantry_height_m: 2.0,
    short_term_parking: 'WHOLE DAY',
    free_parking: 'NO',
    night_parking: true,
    lots: {
      car: { total: 1120, available: 382 },
      motorcycle: { total: 120, available: 58 }
    },
    ev_charging: {
      hasEV: true,
      operator: 'Tesla & SP Mobility',
      count: 12,
      speeds: ['250kW Supercharger', '22kW AC']
    },
    rates: {
      central_area: true,
      day_rate_text: '$14.00 for 1st hour, $1.50 per subsequent 30 mins (Max $36/day)',
      day_rate_half_hour: 1.50,
      night_rate_text: '$10.00 flat entry (7pm to 7am)',
      sunday_ph_free: false,
      grace_period_mins: 10
    },
    update_datetime: new Date().toISOString(),
    trend: 'INCREASING'
  },
  {
    id: 'MALL-SUNTEC',
    carpark_number: 'SUN01',
    name: 'Suntec City Mall & Convention',
    address: '3 Temasek Boulevard, Singapore 038983',
    agency: 'MALL',
    district: 'Marina Bay / CBD',
    coordinates: { lat: 1.2934, lng: 103.8572 },
    carpark_type: 'BASEMENT',
    parking_system: 'ELECTRONIC',
    gantry_height_m: 2.0,
    short_term_parking: 'WHOLE DAY',
    free_parking: 'NO',
    night_parking: true,
    lots: {
      car: { total: 3100, available: 890 },
      motorcycle: { total: 240, available: 130 }
    },
    ev_charging: {
      hasEV: true,
      operator: 'SP Mobility & Charge+',
      count: 16,
      speeds: ['22kW AC', '50kW DC']
    },
    rates: {
      central_area: true,
      day_rate_text: '$2.60 for 1st hour, $1.30 per subsequent 30 mins (7am-5pm)',
      day_rate_half_hour: 1.30,
      night_rate_text: '$3.50 per entry (5pm to 7am next day)',
      sunday_ph_free: false,
      grace_period_mins: 15
    },
    update_datetime: new Date().toISOString(),
    trend: 'STABLE'
  },
  {
    id: 'URA-TP01',
    carpark_number: 'URATP01',
    name: 'URA Tanjong Pagar / Craig Road',
    address: 'Craig Road / Duxton Road shophouses',
    agency: 'URA',
    district: 'Marina Bay / CBD',
    coordinates: { lat: 1.2785, lng: 103.8427 },
    carpark_type: 'SURFACE',
    parking_system: 'ELECTRONIC',
    gantry_height_m: 4.5,
    short_term_parking: 'WHOLE DAY',
    free_parking: 'SUN & PH',
    night_parking: true,
    lots: {
      car: { total: 84, available: 8 },
      motorcycle: { total: 16, available: 5 }
    },
    ev_charging: {
      hasEV: false
    },
    rates: {
      central_area: true,
      day_rate_text: '$1.20 per 30 mins (7am to 5pm)',
      day_rate_half_hour: 1.20,
      night_rate_text: '$0.60 per 30 mins (Max $5.00 overnight)',
      sunday_ph_free: true,
      grace_period_mins: 15
    },
    update_datetime: new Date().toISOString(),
    trend: 'DECREASING'
  },
  {
    id: 'HDB-PINNACLE',
    carpark_number: 'CTM1',
    name: 'The Pinnacle@Duxton (Cantonment Rd)',
    address: '1 Cantonment Road, Singapore 080001',
    agency: 'HDB',
    district: 'Marina Bay / CBD',
    coordinates: { lat: 1.2778, lng: 103.8406 },
    carpark_type: 'BASEMENT',
    parking_system: 'ELECTRONIC',
    gantry_height_m: 2.15,
    short_term_parking: 'WHOLE DAY',
    free_parking: 'NO',
    night_parking: true,
    lots: {
      car: { total: 680, available: 168 },
      motorcycle: { total: 110, available: 62 }
    },
    ev_charging: {
      hasEV: true,
      operator: 'CDG ENGIE',
      count: 4,
      speeds: ['22kW AC Type 2']
    },
    rates: {
      central_area: true,
      day_rate_text: '$1.20 per 30 mins (7am to 5pm, Central Area)',
      day_rate_half_hour: 1.20,
      night_rate_text: '$0.60 per 30 mins (Capped at $5.00)',
      sunday_ph_free: false,
      grace_period_mins: 15
    },
    update_datetime: new Date().toISOString(),
    trend: 'STABLE'
  },
  {
    id: 'URA-TELOK',
    carpark_number: 'URATA02',
    name: 'Telok Ayer / Amoy Street URA Carpark',
    address: 'Telok Ayer Street, Singapore 068598',
    agency: 'URA',
    district: 'Marina Bay / CBD',
    coordinates: { lat: 1.2809, lng: 103.8475 },
    carpark_type: 'SURFACE',
    parking_system: 'ELECTRONIC',
    gantry_height_m: 4.5,
    short_term_parking: '7AM-10.30PM',
    free_parking: 'SUN & PH',
    night_parking: false,
    lots: {
      car: { total: 64, available: 0 },
      motorcycle: { total: 12, available: 2 }
    },
    ev_charging: {
      hasEV: false
    },
    rates: {
      central_area: true,
      day_rate_text: '$1.20 per 30 mins (7am-5pm)',
      day_rate_half_hour: 1.20,
      night_rate_text: 'Season parking priority after 10.30pm',
      sunday_ph_free: true,
      grace_period_mins: 15
    },
    update_datetime: new Date().toISOString(),
    trend: 'STABLE'
  },

  // BUGIS & BRAS BASAH
  {
    id: 'MALL-BUGIS-JUNC',
    carpark_number: 'BJ01',
    name: 'Bugis Junction',
    address: '200 Victoria Street, Singapore 188021',
    agency: 'MALL',
    district: 'Bugis / Bras Basah',
    coordinates: { lat: 1.3001, lng: 103.8553 },
    carpark_type: 'BASEMENT',
    parking_system: 'ELECTRONIC',
    gantry_height_m: 1.9,
    short_term_parking: 'WHOLE DAY',
    free_parking: 'NO',
    night_parking: true,
    lots: {
      car: { total: 470, available: 65 },
      motorcycle: { total: 50, available: 16 }
    },
    ev_charging: {
      hasEV: true,
      operator: 'SP Mobility',
      count: 4,
      speeds: ['22kW AC Type 2']
    },
    rates: {
      central_area: true,
      day_rate_text: '$3.00 for 1st hour, $0.50 per subsequent 15 mins',
      day_rate_half_hour: 1.00,
      night_rate_text: '$3.50 per entry (5pm to 11:59pm)',
      sunday_ph_free: false,
      grace_period_mins: 15
    },
    update_datetime: new Date().toISOString(),
    trend: 'DECREASING'
  },
  {
    id: 'MALL-FUNAN',
    carpark_number: 'FN01',
    name: 'Funan Mall',
    address: '107 North Bridge Road, Singapore 179105',
    agency: 'MALL',
    district: 'Bugis / Bras Basah',
    coordinates: { lat: 1.2913, lng: 103.8499 },
    carpark_type: 'BASEMENT',
    parking_system: 'ELECTRONIC',
    gantry_height_m: 2.1,
    short_term_parking: 'WHOLE DAY',
    free_parking: 'NO',
    night_parking: true,
    lots: {
      car: { total: 390, available: 98 },
      motorcycle: { total: 60, available: 31 }
    },
    ev_charging: {
      hasEV: true,
      operator: 'Charge+',
      count: 6,
      speeds: ['22kW AC Type 2', '60kW DC CCS2']
    },
    rates: {
      central_area: true,
      day_rate_text: '$2.80 for 1st hour, $0.70 per subsequent 15 mins',
      day_rate_half_hour: 1.40,
      night_rate_text: '$3.50 per entry (6pm to 6am)',
      sunday_ph_free: false,
      grace_period_mins: 15
    },
    update_datetime: new Date().toISOString(),
    trend: 'STABLE'
  },
  {
    id: 'HDB-WATERLOO',
    carpark_number: 'WLC',
    name: 'Waterloo Centre HDB Carpark',
    address: 'Block 261 Waterloo Street, Singapore 180261',
    agency: 'HDB',
    district: 'Bugis / Bras Basah',
    coordinates: { lat: 1.2995, lng: 103.8524 },
    carpark_type: 'MULTI-STOREY',
    parking_system: 'ELECTRONIC',
    gantry_height_m: 2.05,
    short_term_parking: 'WHOLE DAY',
    free_parking: 'SUN & PH',
    night_parking: true,
    lots: {
      car: { total: 310, available: 82 },
      motorcycle: { total: 60, available: 29 }
    },
    ev_charging: {
      hasEV: true,
      operator: 'CDG ENGIE',
      count: 2,
      speeds: ['22kW AC Type 2']
    },
    rates: {
      central_area: true,
      day_rate_text: '$1.20 per 30 mins (Central HDB rate)',
      day_rate_half_hour: 1.20,
      night_rate_text: '$0.60 per 30 mins (Max $5.00 overnight)',
      sunday_ph_free: true,
      grace_period_mins: 15
    },
    update_datetime: new Date().toISOString(),
    trend: 'INCREASING'
  },

  // JURONG EAST & WEST
  {
    id: 'MALL-WESTGATE',
    carpark_number: 'WG01',
    name: 'Westgate & JEM Linked Carpark',
    address: '3 Gateway Drive, Singapore 608532',
    agency: 'MALL',
    district: 'Jurong East',
    coordinates: { lat: 1.3340, lng: 103.7428 },
    carpark_type: 'BASEMENT',
    parking_system: 'ELECTRONIC',
    gantry_height_m: 2.1,
    short_term_parking: 'WHOLE DAY',
    free_parking: 'NO',
    night_parking: true,
    lots: {
      car: { total: 610, available: 148 },
      motorcycle: { total: 80, available: 41 }
    },
    ev_charging: {
      hasEV: true,
      operator: 'SP Mobility',
      count: 6,
      speeds: ['22kW AC', '50kW DC']
    },
    rates: {
      central_area: false,
      day_rate_text: '$1.60 for 1st hour, $0.50 per subsequent 15 mins',
      day_rate_half_hour: 1.00,
      night_rate_text: '$2.80 per entry (6pm to 11:59pm)',
      sunday_ph_free: false,
      grace_period_mins: 15
    },
    update_datetime: new Date().toISOString(),
    trend: 'STABLE'
  },
  {
    id: 'MALL-IMM',
    carpark_number: 'IMM01',
    name: 'IMM Building Outlet Mall',
    address: '2 Jurong East Street 21, Singapore 609601',
    agency: 'MALL',
    district: 'Jurong East',
    coordinates: { lat: 1.3352, lng: 103.7469 },
    carpark_type: 'MULTI-STOREY',
    parking_system: 'ELECTRONIC',
    gantry_height_m: 2.15,
    short_term_parking: 'WHOLE DAY',
    free_parking: 'LUNCH',
    night_parking: true,
    lots: {
      car: { total: 1100, available: 320 },
      motorcycle: { total: 150, available: 75 }
    },
    ev_charging: {
      hasEV: true,
      operator: 'Charge+',
      count: 4,
      speeds: ['22kW AC Type 2']
    },
    rates: {
      central_area: false,
      day_rate_text: '1st hour FREE (Mon-Fri excl PH), $1.30 per subsequent hour',
      day_rate_half_hour: 0.65,
      night_rate_text: '$1.30 per entry after 6pm',
      sunday_ph_free: false,
      grace_period_mins: 15
    },
    update_datetime: new Date().toISOString(),
    trend: 'INCREASING'
  },
  {
    id: 'HDB-JM13',
    carpark_number: 'JM13',
    name: 'HDB Jurong East St 24 Blk 248',
    address: 'Block 248 Jurong East Street 24, Singapore 600248',
    agency: 'HDB',
    district: 'Jurong East',
    coordinates: { lat: 1.3421, lng: 103.7408 },
    carpark_type: 'MULTI-STOREY',
    parking_system: 'ELECTRONIC',
    gantry_height_m: 2.15,
    short_term_parking: 'WHOLE DAY',
    free_parking: 'SUN & PH',
    night_parking: true,
    lots: {
      car: { total: 420, available: 215 },
      motorcycle: { total: 70, available: 42 }
    },
    ev_charging: {
      hasEV: true,
      operator: 'CDG ENGIE',
      count: 3,
      speeds: ['22kW AC Type 2']
    },
    rates: {
      central_area: false,
      day_rate_text: '$0.60 per 30 mins (Non-central standard)',
      day_rate_half_hour: 0.60,
      night_rate_text: '$0.60 per 30 mins (Max $5.00 overnight)',
      sunday_ph_free: true,
      grace_period_mins: 20
    },
    update_datetime: new Date().toISOString(),
    trend: 'STABLE'
  },

  // TAMPINES & BEDOK (EAST)
  {
    id: 'HDB-TM01',
    carpark_number: 'OTH01',
    name: 'Our Tampines Hub (OTH)',
    address: '1 Tampines Walk, Singapore 528523',
    agency: 'HDB',
    district: 'Tampines & Bedok',
    coordinates: { lat: 1.3533, lng: 103.9398 },
    carpark_type: 'BASEMENT',
    parking_system: 'ELECTRONIC',
    gantry_height_m: 2.15,
    short_term_parking: 'WHOLE DAY',
    free_parking: 'NO',
    night_parking: true,
    lots: {
      car: { total: 1400, available: 412 },
      motorcycle: { total: 200, available: 110 }
    },
    ev_charging: {
      hasEV: true,
      operator: 'SP Mobility',
      count: 10,
      speeds: ['22kW AC', '50kW DC']
    },
    rates: {
      central_area: false,
      day_rate_text: '$0.60 per 30 mins (Mon-Sun 7am-12am)',
      day_rate_half_hour: 0.60,
      night_rate_text: '$2.40 per entry (12am-7am)',
      sunday_ph_free: false,
      grace_period_mins: 15
    },
    update_datetime: new Date().toISOString(),
    trend: 'INCREASING'
  },
  {
    id: 'HDB-TE14',
    carpark_number: 'TE14',
    name: 'HDB Tampines St 81 Blk 828',
    address: 'Block 828A Tampines Street 81, Singapore 521828',
    agency: 'HDB',
    district: 'Tampines & Bedok',
    coordinates: { lat: 1.3508, lng: 103.9341 },
    carpark_type: 'MULTI-STOREY',
    parking_system: 'ELECTRONIC',
    gantry_height_m: 2.15,
    short_term_parking: 'WHOLE DAY',
    free_parking: 'SUN & PH',
    night_parking: true,
    lots: {
      car: { total: 380, available: 164 },
      motorcycle: { total: 50, available: 28 }
    },
    ev_charging: {
      hasEV: true,
      operator: 'CDG ENGIE',
      count: 3,
      speeds: ['22kW AC Type 2']
    },
    rates: {
      central_area: false,
      day_rate_text: '$0.60 per 30 mins',
      day_rate_half_hour: 0.60,
      night_rate_text: '$0.60 per 30 mins (Capped at $5.00)',
      sunday_ph_free: true,
      grace_period_mins: 20
    },
    update_datetime: new Date().toISOString(),
    trend: 'STABLE'
  },
  {
    id: 'MALL-JEWEL',
    carpark_number: 'JWL01',
    name: 'Jewel Changi Airport (Carpark 2M / 2B)',
    address: '78 Airport Boulevard, Singapore 819666',
    agency: 'MALL',
    district: 'Tampines & Bedok',
    coordinates: { lat: 1.3602, lng: 103.9898 },
    carpark_type: 'BASEMENT',
    parking_system: 'ELECTRONIC',
    gantry_height_m: 2.1,
    short_term_parking: 'WHOLE DAY',
    free_parking: 'NO',
    night_parking: true,
    lots: {
      car: { total: 2500, available: 740 },
      motorcycle: { total: 180, available: 95 }
    },
    ev_charging: {
      hasEV: true,
      operator: 'SP Mobility & Tesla',
      count: 14,
      speeds: ['22kW AC', '50kW DC', '250kW Supercharger']
    },
    rates: {
      central_area: false,
      day_rate_text: 'B2M/B2: $0.04 per min (1st 90m), then $5/30m. General B3-B5: $0.04 per min ($2.40/h)',
      day_rate_half_hour: 1.20,
      night_rate_text: '$0.04 per min ($2.40/h) whole day rate',
      sunday_ph_free: false,
      grace_period_mins: 10
    },
    update_datetime: new Date().toISOString(),
    trend: 'STABLE'
  },
  {
    id: 'HDB-BM18',
    carpark_number: 'BM18',
    name: 'HDB Bedok Central MSCP Blk 207A',
    address: 'Block 207A New Upper Changi Road, Singapore 461207',
    agency: 'HDB',
    district: 'Tampines & Bedok',
    coordinates: { lat: 1.3255, lng: 103.9312 },
    carpark_type: 'MULTI-STOREY',
    parking_system: 'ELECTRONIC',
    gantry_height_m: 2.15,
    short_term_parking: 'WHOLE DAY',
    free_parking: 'SUN & PH',
    night_parking: true,
    lots: {
      car: { total: 520, available: 89 },
      motorcycle: { total: 90, available: 37 }
    },
    ev_charging: {
      hasEV: true,
      operator: 'Charge+',
      count: 4,
      speeds: ['22kW AC Type 2']
    },
    rates: {
      central_area: false,
      day_rate_text: '$0.60 per 30 mins',
      day_rate_half_hour: 0.60,
      night_rate_text: '$0.60 per 30 mins (Capped at $5.00)',
      sunday_ph_free: true,
      grace_period_mins: 20
    },
    update_datetime: new Date().toISOString(),
    trend: 'DECREASING'
  },

  // ANG MO KIO, BISHAN & TOA PAYOH (CENTRAL)
  {
    id: 'MALL-AMK-HUB',
    carpark_number: 'AMKH01',
    name: 'AMK Hub',
    address: '53 Ang Mo Kio Avenue 3, Singapore 569933',
    agency: 'MALL',
    district: 'Ang Mo Kio & Bishan',
    coordinates: { lat: 1.3693, lng: 103.8485 },
    carpark_type: 'BASEMENT',
    parking_system: 'ELECTRONIC',
    gantry_height_m: 2.0,
    short_term_parking: 'WHOLE DAY',
    free_parking: 'NO',
    night_parking: true,
    lots: {
      car: { total: 440, available: 52 },
      motorcycle: { total: 60, available: 20 }
    },
    ev_charging: {
      hasEV: true,
      operator: 'SP Mobility',
      count: 4,
      speeds: ['22kW AC Type 2']
    },
    rates: {
      central_area: false,
      day_rate_text: '$1.40 for 1st hour, $0.70 per subsequent 30 mins',
      day_rate_half_hour: 0.70,
      night_rate_text: '$2.50 per entry (6pm to 11:59pm)',
      sunday_ph_free: false,
      grace_period_mins: 15
    },
    update_datetime: new Date().toISOString(),
    trend: 'DECREASING'
  },
  {
    id: 'HDB-AK32',
    carpark_number: 'AK32',
    name: 'HDB Ang Mo Kio Ave 4 Blk 113',
    address: 'Block 113A Ang Mo Kio Avenue 4, Singapore 561113',
    agency: 'HDB',
    district: 'Ang Mo Kio & Bishan',
    coordinates: { lat: 1.3732, lng: 103.8368 },
    carpark_type: 'MULTI-STOREY',
    parking_system: 'ELECTRONIC',
    gantry_height_m: 2.15,
    short_term_parking: 'WHOLE DAY',
    free_parking: 'SUN & PH',
    night_parking: true,
    lots: {
      car: { total: 390, available: 198 },
      motorcycle: { total: 55, available: 32 }
    },
    ev_charging: {
      hasEV: true,
      operator: 'CDG ENGIE',
      count: 3,
      speeds: ['22kW AC Type 2']
    },
    rates: {
      central_area: false,
      day_rate_text: '$0.60 per 30 mins',
      day_rate_half_hour: 0.60,
      night_rate_text: '$0.60 per 30 mins (Capped at $5.00 overnight)',
      sunday_ph_free: true,
      grace_period_mins: 20
    },
    update_datetime: new Date().toISOString(),
    trend: 'STABLE'
  },
  {
    id: 'MALL-J8',
    carpark_number: 'J801',
    name: 'Junction 8 Bishan',
    address: '9 Bishan Place, Singapore 579837',
    agency: 'MALL',
    district: 'Ang Mo Kio & Bishan',
    coordinates: { lat: 1.3508, lng: 103.8488 },
    carpark_type: 'BASEMENT',
    parking_system: 'ELECTRONIC',
    gantry_height_m: 2.05,
    short_term_parking: 'WHOLE DAY',
    free_parking: 'NO',
    night_parking: true,
    lots: {
      car: { total: 310, available: 38 },
      motorcycle: { total: 40, available: 14 }
    },
    ev_charging: {
      hasEV: true,
      operator: 'Charge+',
      count: 2,
      speeds: ['22kW AC Type 2']
    },
    rates: {
      central_area: false,
      day_rate_text: '$1.50 for 1st hour, $0.40 per subsequent 15 mins',
      day_rate_half_hour: 0.80,
      night_rate_text: '$2.60 per entry after 6pm',
      sunday_ph_free: false,
      grace_period_mins: 15
    },
    update_datetime: new Date().toISOString(),
    trend: 'DECREASING'
  },
  {
    id: 'HDB-TPY01',
    carpark_number: 'TP51',
    name: 'Toa Payoh Central Hub MSCP',
    address: 'Block 178A Toa Payoh Central, Singapore 311178',
    agency: 'HDB',
    district: 'Ang Mo Kio & Bishan',
    coordinates: { lat: 1.3331, lng: 103.8499 },
    carpark_type: 'MULTI-STOREY',
    parking_system: 'ELECTRONIC',
    gantry_height_m: 2.15,
    short_term_parking: 'WHOLE DAY',
    free_parking: 'SUN & PH',
    night_parking: true,
    lots: {
      car: { total: 460, available: 112 },
      motorcycle: { total: 70, available: 33 }
    },
    ev_charging: {
      hasEV: true,
      operator: 'CDG ENGIE',
      count: 4,
      speeds: ['22kW AC Type 2']
    },
    rates: {
      central_area: false,
      day_rate_text: '$0.60 per 30 mins',
      day_rate_half_hour: 0.60,
      night_rate_text: '$0.60 per 30 mins (Capped at $5.00 overnight)',
      sunday_ph_free: true,
      grace_period_mins: 20
    },
    update_datetime: new Date().toISOString(),
    trend: 'INCREASING'
  },

  // WOODLANDS & NORTH
  {
    id: 'MALL-CP',
    carpark_number: 'CP01',
    name: 'Causeway Point Woodlands',
    address: '1 Woodlands Square, Singapore 738099',
    agency: 'MALL',
    district: 'Woodlands & North',
    coordinates: { lat: 1.4361, lng: 103.7865 },
    carpark_type: 'BASEMENT',
    parking_system: 'ELECTRONIC',
    gantry_height_m: 2.05,
    short_term_parking: 'WHOLE DAY',
    free_parking: 'NO',
    night_parking: true,
    lots: {
      car: { total: 780, available: 215 },
      motorcycle: { total: 100, available: 48 }
    },
    ev_charging: {
      hasEV: true,
      operator: 'SP Mobility',
      count: 6,
      speeds: ['22kW AC', '50kW DC']
    },
    rates: {
      central_area: false,
      day_rate_text: '$1.40 for 1st hour, $0.65 per subsequent 30 mins',
      day_rate_half_hour: 0.65,
      night_rate_text: '$2.50 per entry after 6pm',
      sunday_ph_free: false,
      grace_period_mins: 15
    },
    update_datetime: new Date().toISOString(),
    trend: 'STABLE'
  },
  {
    id: 'HDB-WCC',
    carpark_number: 'WL02',
    name: 'Woodlands Civic Centre HDB Carpark',
    address: '900 South Woodlands Drive, Singapore 730900',
    agency: 'HDB',
    district: 'Woodlands & North',
    coordinates: { lat: 1.4348, lng: 103.7877 },
    carpark_type: 'BASEMENT',
    parking_system: 'ELECTRONIC',
    gantry_height_m: 2.1,
    short_term_parking: 'WHOLE DAY',
    free_parking: 'SUN & PH',
    night_parking: true,
    lots: {
      car: { total: 340, available: 145 },
      motorcycle: { total: 50, available: 29 }
    },
    ev_charging: {
      hasEV: true,
      operator: 'CDG ENGIE',
      count: 2,
      speeds: ['22kW AC Type 2']
    },
    rates: {
      central_area: false,
      day_rate_text: '$0.60 per 30 mins',
      day_rate_half_hour: 0.60,
      night_rate_text: '$0.60 per 30 mins (Capped at $5.00 overnight)',
      sunday_ph_free: true,
      grace_period_mins: 20
    },
    update_datetime: new Date().toISOString(),
    trend: 'STABLE'
  },
  {
    id: 'MALL-NORTHPOINT',
    carpark_number: 'NPC01',
    name: 'Northpoint City (Yishun)',
    address: '930 Yishun Avenue 2, Singapore 769098',
    agency: 'MALL',
    district: 'Woodlands & North',
    coordinates: { lat: 1.4294, lng: 103.8362 },
    carpark_type: 'BASEMENT',
    parking_system: 'ELECTRONIC',
    gantry_height_m: 2.1,
    short_term_parking: 'WHOLE DAY',
    free_parking: 'NO',
    night_parking: true,
    lots: {
      car: { total: 1050, available: 284 },
      motorcycle: { total: 120, available: 62 }
    },
    ev_charging: {
      hasEV: true,
      operator: 'Charge+',
      count: 6,
      speeds: ['22kW AC Type 2', '60kW DC CCS2']
    },
    rates: {
      central_area: false,
      day_rate_text: '$1.40 for 1st hour, $0.70 per subsequent 30 mins',
      day_rate_half_hour: 0.70,
      night_rate_text: '$2.50 per entry after 6pm',
      sunday_ph_free: false,
      grace_period_mins: 15
    },
    update_datetime: new Date().toISOString(),
    trend: 'INCREASING'
  },

  // SOUTH & HARBOURFRONT / SENTOSA
  {
    id: 'MALL-VIVO',
    carpark_number: 'VC01',
    name: 'VivoCity & HarbourFront',
    address: '1 HarbourFront Walk, Singapore 098585',
    agency: 'MALL',
    district: 'HarbourFront & South',
    coordinates: { lat: 1.2644, lng: 103.8222 },
    carpark_type: 'MULTI-STOREY',
    parking_system: 'ELECTRONIC',
    gantry_height_m: 2.15,
    short_term_parking: 'WHOLE DAY',
    free_parking: 'NO',
    night_parking: true,
    lots: {
      car: { total: 2179, available: 618 },
      motorcycle: { total: 190, available: 94 }
    },
    ev_charging: {
      hasEV: true,
      operator: 'Tesla & SP Mobility',
      count: 14,
      speeds: ['250kW Supercharger', '22kW AC']
    },
    rates: {
      central_area: false,
      day_rate_text: '$1.80 for 1st hour, $0.90 per subsequent 30 mins (Mon-Fri 7am-6pm)',
      day_rate_half_hour: 0.90,
      night_rate_text: '$3.50 per entry after 6pm',
      sunday_ph_free: false,
      grace_period_mins: 15
    },
    update_datetime: new Date().toISOString(),
    trend: 'STABLE'
  },
  {
    id: 'MALL-RWS',
    carpark_number: 'RWS01',
    name: 'Resorts World Sentosa',
    address: '8 Sentosa Gateway, Singapore 098269',
    agency: 'MALL',
    district: 'HarbourFront & South',
    coordinates: { lat: 1.2562, lng: 103.8201 },
    carpark_type: 'BASEMENT',
    parking_system: 'ELECTRONIC',
    gantry_height_m: 2.0,
    short_term_parking: 'WHOLE DAY',
    free_parking: 'NO',
    night_parking: true,
    lots: {
      car: { total: 3200, available: 1240 },
      motorcycle: { total: 250, available: 160 }
    },
    ev_charging: {
      hasEV: true,
      operator: 'SP Mobility',
      count: 12,
      speeds: ['22kW AC Type 2', '50kW DC CCS2']
    },
    rates: {
      central_area: false,
      day_rate_text: '$6.50 for 1st hour, $1.10 per subsequent 30 mins (Max $28/day)',
      day_rate_half_hour: 1.10,
      night_rate_text: '$6.50 flat per entry after 7pm',
      sunday_ph_free: false,
      grace_period_mins: 15
    },
    update_datetime: new Date().toISOString(),
    trend: 'INCREASING'
  },
  {
    id: 'HDB-TB01',
    carpark_number: 'TBM01',
    name: 'HDB Tiong Bahru MSCP Blk 18A',
    address: 'Block 18A Jalan Membina, Singapore 161018',
    agency: 'HDB',
    district: 'HarbourFront & South',
    coordinates: { lat: 1.2849, lng: 103.8273 },
    carpark_type: 'MULTI-STOREY',
    parking_system: 'ELECTRONIC',
    gantry_height_m: 2.15,
    short_term_parking: 'WHOLE DAY',
    free_parking: 'SUN & PH',
    night_parking: true,
    lots: {
      car: { total: 440, available: 104 },
      motorcycle: { total: 60, available: 28 }
    },
    ev_charging: {
      hasEV: true,
      operator: 'CDG ENGIE',
      count: 4,
      speeds: ['22kW AC Type 2']
    },
    rates: {
      central_area: false,
      day_rate_text: '$0.60 per 30 mins',
      day_rate_half_hour: 0.60,
      night_rate_text: '$0.60 per 30 mins (Capped at $5.00 overnight)',
      sunday_ph_free: true,
      grace_period_mins: 20
    },
    update_datetime: new Date().toISOString(),
    trend: 'DECREASING'
  },

  // PUNGGOL & SENGKANG (NORTH-EAST)
  {
    id: 'MALL-WATERWAY',
    carpark_number: 'WPP01',
    name: 'Waterway Point (Punggol)',
    address: '83 Punggol Central, Singapore 828761',
    agency: 'MALL',
    district: 'Punggol & Sengkang',
    coordinates: { lat: 1.4067, lng: 103.9023 },
    carpark_type: 'BASEMENT',
    parking_system: 'ELECTRONIC',
    gantry_height_m: 2.1,
    short_term_parking: 'WHOLE DAY',
    free_parking: 'NO',
    night_parking: true,
    lots: {
      car: { total: 720, available: 182 },
      motorcycle: { total: 90, available: 45 }
    },
    ev_charging: {
      hasEV: true,
      operator: 'SP Mobility',
      count: 6,
      speeds: ['22kW AC', '50kW DC']
    },
    rates: {
      central_area: false,
      day_rate_text: '$1.40 for 1st hour, $0.70 per subsequent 30 mins',
      day_rate_half_hour: 0.70,
      night_rate_text: '$2.50 per entry after 6pm',
      sunday_ph_free: false,
      grace_period_mins: 15
    },
    update_datetime: new Date().toISOString(),
    trend: 'INCREASING'
  },
  {
    id: 'HDB-PG24',
    carpark_number: 'PG24',
    name: 'HDB Punggol Field MSCP Blk 168',
    address: 'Block 168A Punggol Field, Singapore 821168',
    agency: 'HDB',
    district: 'Punggol & Sengkang',
    coordinates: { lat: 1.3982, lng: 103.9091 },
    carpark_type: 'MULTI-STOREY',
    parking_system: 'ELECTRONIC',
    gantry_height_m: 2.15,
    short_term_parking: 'WHOLE DAY',
    free_parking: 'SUN & PH',
    night_parking: true,
    lots: {
      car: { total: 510, available: 260 },
      motorcycle: { total: 80, available: 48 }
    },
    ev_charging: {
      hasEV: true,
      operator: 'CDG ENGIE',
      count: 4,
      speeds: ['22kW AC Type 2']
    },
    rates: {
      central_area: false,
      day_rate_text: '$0.60 per 30 mins',
      day_rate_half_hour: 0.60,
      night_rate_text: '$0.60 per 30 mins (Capped at $5.00 overnight)',
      sunday_ph_free: true,
      grace_period_mins: 20
    },
    update_datetime: new Date().toISOString(),
    trend: 'STABLE'
  }
];

export const SINGAPORE_DISTRICTS = [
  'All Districts',
  'Orchard / Somerset',
  'Marina Bay / CBD',
  'Bugis / Bras Basah',
  'Jurong East',
  'Tampines & Bedok',
  'Ang Mo Kio & Bishan',
  'Woodlands & North',
  'HarbourFront & South',
  'Punggol & Sengkang'
];

export const DISTRICT_MAP_CENTERS: Record<string, { lat: number; lng: number; zoom: number }> = {
  'All Districts': { lat: 1.3400, lng: 103.8400, zoom: 12 },
  'Orchard / Somerset': { lat: 1.3030, lng: 103.8360, zoom: 15 },
  'Marina Bay / CBD': { lat: 1.2820, lng: 103.8520, zoom: 15 },
  'Bugis / Bras Basah': { lat: 1.2990, lng: 103.8540, zoom: 15 },
  'Jurong East': { lat: 1.3340, lng: 103.7440, zoom: 14 },
  'Tampines & Bedok': { lat: 1.3520, lng: 103.9450, zoom: 14 },
  'Ang Mo Kio & Bishan': { lat: 1.3580, lng: 103.8480, zoom: 14 },
  'Woodlands & North': { lat: 1.4330, lng: 103.8050, zoom: 14 },
  'HarbourFront & South': { lat: 1.2650, lng: 103.8240, zoom: 14 },
  'Punggol & Sengkang': { lat: 1.4020, lng: 103.9050, zoom: 14 }
};
