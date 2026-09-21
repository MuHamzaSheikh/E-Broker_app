export interface CityInfo {
  name: string;
  province: string;
  coords: [number, number]; // [lat, lng]
  hubType: 'Port' | 'Industrial Hub' | 'Agricultural Center' | 'Dry Port' | 'Commercial Capital';
  popularAddresses: string[];
}

export const PAKISTAN_CITIES: Record<string, CityInfo> = {
  'Karachi': {
    name: 'Karachi',
    province: 'Sindh',
    coords: [24.8607, 67.0011],
    hubType: 'Port',
    popularAddresses: [
      'Port Qasim Authority, Container Terminal Area',
      'Karachi Port Trust (KPT) West Wharf, Keamari',
      'SITE Industrial Area, Manghopir Road',
      'Korangi Industrial & Export Processing Zone',
      'Landhi Industrial Park, Super Highway Hub'
    ]
  },
  'Lahore': {
    name: 'Lahore',
    province: 'Punjab',
    coords: [31.5204, 74.3587],
    hubType: 'Dry Port',
    popularAddresses: [
      'Mughalpura Dry Port, Freight Terminal',
      'Sundar Industrial Estate, Raiwind Road',
      'Quaid-e-Azam Industrial Estate, Kot Lakhpat',
      'Multan Road Logistics Terminal, Thokar Niaz Baig',
      'Badami Bagh Goods Transport Market'
    ]
  },
  'Faisalabad': {
    name: 'Faisalabad',
    province: 'Punjab',
    coords: [31.4504, 73.1350],
    hubType: 'Industrial Hub',
    popularAddresses: [
      'M-3 Industrial City, FIEDMC Sahianwala',
      'Sargodha Road Textile Processing Cluster',
      'Jaranwala Road Grain & Yarn Market',
      'Value Addition City, Khurrianwala'
    ]
  },
  'Islamabad': {
    name: 'Islamabad',
    province: 'Federal Capital',
    coords: [33.6844, 73.0479],
    hubType: 'Commercial Capital',
    popularAddresses: [
      'I-9 / I-10 Industrial Sector Logistics Yard',
      'Rawat Logistics Hub, GT Road Corridor',
      'CPEC Logistics Center, Tarnol Bypass'
    ]
  },
  'Rawalpindi': {
    name: 'Rawalpindi',
    province: 'Punjab',
    coords: [33.5651, 73.0169],
    hubType: 'Commercial Capital',
    popularAddresses: [
      'Pirwadhai Goods Transport Terminal',
      'Chaklala Freight Terminal',
      'GT Road Mandra Industrial Corridor'
    ]
  },
  'Multan': {
    name: 'Multan',
    province: 'Punjab',
    coords: [30.1575, 71.5249],
    hubType: 'Agricultural Center',
    popularAddresses: [
      'Multan Industrial Estate Phase II',
      'Khanewal Road Agricultural Warehouse Depot',
      'Vehari Road Cotton & Mango Cold Hub'
    ]
  },
  'Gujranwala': {
    name: 'Gujranwala',
    province: 'Punjab',
    coords: [32.1877, 74.1945],
    hubType: 'Industrial Hub',
    popularAddresses: [
      'Small Industrial Estate II, Pasrur Road',
      'G.T. Road Climax Ceramics Cluster',
      'Kamoke Rice Mills & Storage Hub'
    ]
  },
  'Peshawar': {
    name: 'Peshawar',
    province: 'Khyber Pakhtunkhwa',
    coords: [34.0151, 71.5249],
    hubType: 'Commercial Capital',
    popularAddresses: [
      'Hayatabad Industrial Estate',
      'Chamkani Ring Road Logistics Terminal',
      'Torkham Border Cargo Staging Depot'
    ]
  },
  'Quetta': {
    name: 'Quetta',
    province: 'Balochistan',
    coords: [30.1798, 66.9750],
    hubType: 'Commercial Capital',
    popularAddresses: [
      'Sirki Road Goods Forwarding Adda',
      'Hazar Ganji Commercial Market Hub',
      'Chaman Transit Freight Yard'
    ]
  },
  'Sukkur': {
    name: 'Sukkur',
    province: 'Sindh',
    coords: [27.7052, 68.8574],
    hubType: 'Agricultural Center',
    popularAddresses: [
      'Sukkur Industrial Trade Zone',
      'Rohri Junction Freight Handling Point',
      'N-5 National Highway Transport Bypass'
    ]
  },
  'Hyderabad': {
    name: 'Hyderabad',
    province: 'Sindh',
    coords: [25.3960, 68.3578],
    hubType: 'Industrial Hub',
    popularAddresses: [
      'Kotri Industrial Zone',
      'SITE Industrial Area, Tando Adam Road',
      'Hala Naka Transport Goods Forwarding'
    ]
  },
  'Sialkot': {
    name: 'Sialkot',
    province: 'Punjab',
    coords: [32.4945, 74.5229],
    hubType: 'Industrial Hub',
    popularAddresses: [
      'Sialkot Dry Port Trust, Sambrial',
      'Export Processing Zone, Daska Road',
      'Wazirabad Cutlery & Surgical Corridor'
    ]
  },
  'Gwadar': {
    name: 'Gwadar',
    province: 'Balochistan',
    coords: [25.1264, 62.3225],
    hubType: 'Port',
    popularAddresses: [
      'Gwadar Free Zone Phase I',
      'Gwadar Port Deep Sea Container Berth',
      'East Bay Expressway Logistics Hub'
    ]
  },
  'Rahim Yar Khan': {
    name: 'Rahim Yar Khan',
    province: 'Punjab',
    coords: [28.4212, 70.2989],
    hubType: 'Agricultural Center',
    popularAddresses: [
      'Chak 75 NP Industrial Area',
      'Fatima Fertilizer Staging Depot',
      'Sadiqabad National Highway Junction'
    ]
  }
};

/**
 * Calculates road distance using Haversine formula and adds road curvature factor (~1.28x)
 */
export function calculateRoadDistance(origin: [number, number], dest: [number, number]): { distanceKm: number; hours: number } {
  const R = 6371; // Earth radius in km
  const dLat = (dest[0] - origin[0]) * (Math.PI / 180);
  const dLon = (dest[1] - origin[1]) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(origin[0] * (Math.PI / 180)) *
      Math.cos(dest[0] * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightDist = R * c;
  
  const roadMultiplier = 1.28;
  const distanceKm = Math.round(straightDist * roadMultiplier);
  const hours = Math.round((distanceKm / 52) * 10) / 10;

  return { distanceKm: Math.max(distanceKm, 25), hours: Math.max(hours, 1.5) };
}

/**
 * Generates realistic interpolated GPS route waypoints between two coordinates
 */
export function generateRouteWaypoints(origin: [number, number], dest: [number, number], steps: number = 20): Array<[number, number]> {
  const waypoints: Array<[number, number]> = [];
  
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    let lat = origin[0] + (dest[0] - origin[0]) * t;
    let lng = origin[1] + (dest[1] - origin[1]) * t;

    if (i > 0 && i < steps) {
      const curveFactor = Math.sin(t * Math.PI) * 0.08;
      lat += curveFactor * (Math.cos(t * 4) * 0.15);
      lng += curveFactor * (Math.sin(t * 3) * 0.2);
    }

    waypoints.push([parseFloat(lat.toFixed(5)), parseFloat(lng.toFixed(5))]);
  }

  return waypoints;
}
