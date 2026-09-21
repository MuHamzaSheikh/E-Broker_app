/// <reference types="@types/google.maps" />
import React, { useEffect, useRef, useState } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { useApp } from '../context/AppContext';
import {
  Layers,
  Maximize2,
  Minimize2,
  Key,
  ShieldCheck
} from 'lucide-react';

interface GoogleMapsTripMapProps {
  origin: { city: string; coords: [number, number] };
  destination: { city: string; coords: [number, number] };
  currentCoords?: [number, number];
  waypoints?: Array<[number, number]>;
  speedKmH?: number;
  vehicleReg?: string;
  driverName?: string;
  progressPercentage?: number;
  height?: string;
}

let isGoogleMapsOptionsConfigured = false;

export const GoogleMapsTripMap: React.FC<GoogleMapsTripMapProps> = ({
  origin,
  destination,
  currentCoords,
  waypoints = [],
  speedKmH = 68,
  vehicleReg = 'KHI-TL-8492',
  driverName = 'Ustad Muhammad Ramzan',
  progressPercentage = 42,
  height = '360px'
}) => {
  const { language } = useApp();
  const mapRef = useRef<HTMLDivElement>(null);

  // States
  const [mapType, setMapType] = useState<google.maps.MapTypeId | 'roadmap' | 'satellite' | 'terrain' | 'hybrid'>('roadmap');
  const [showTraffic, setShowTraffic] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [apiKey, setApiKey] = useState<string>(
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  );
  const [showKeyDialog, setShowKeyDialog] = useState(false);
  const [customKeyInput, setCustomKeyInput] = useState('');

  // Map instance references
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const trafficLayerRef = useRef<google.maps.TrafficLayer | null>(null);
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const traveledPolylineRef = useRef<google.maps.Polyline | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  // Load Google Maps Script
  useEffect(() => {
    let isMounted = true;

    const initMap = async () => {
      try {
        if (!isGoogleMapsOptionsConfigured) {
          setOptions({
            key: apiKey || '',
            v: 'weekly',
            language: language === 'ur' ? 'ur' : 'en',
            region: 'PK'
          });
          isGoogleMapsOptionsConfigured = true;
        }

        const { Map } = await importLibrary('maps');
        await importLibrary('marker');
        await importLibrary('geometry');

        if (!isMounted || !mapRef.current) return;

        const centerLat = currentCoords ? currentCoords[0] : (origin.coords[0] + destination.coords[0]) / 2;
        const centerLng = currentCoords ? currentCoords[1] : (origin.coords[1] + destination.coords[1]) / 2;

        const map = new Map(mapRef.current, {
          center: { lat: centerLat, lng: centerLng },
          zoom: 7,
          mapTypeId: mapType as google.maps.MapTypeId,
          disableDefaultUI: false,
          zoomControl: true,
          streetViewControl: true,
          fullscreenControl: false,
          mapTypeControl: false,
          gestureHandling: 'greedy',
          styles: [
            {
              featureType: 'administrative.country',
              elementType: 'geometry.stroke',
              stylers: [{ color: '#059669' }, { weight: 1.5 }]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{ color: '#f59e0b' }, { weight: 2 }]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#bae6fd' }]
            }
          ]
        });

        mapInstanceRef.current = map;
        infoWindowRef.current = new google.maps.InfoWindow();

        // Traffic layer
        const trafficLayer = new google.maps.TrafficLayer();
        trafficLayerRef.current = trafficLayer;
        if (showTraffic) {
          trafficLayer.setMap(map);
        }

        setMapLoaded(true);
      } catch (err) {
        console.warn('Google Maps loader warning:', err);
        setMapLoaded(false);
      }
    };

    initMap();

    return () => {
      isMounted = false;
    };
  }, [apiKey, language]);

  // Update Map Type
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setMapTypeId(mapType as google.maps.MapTypeId);
    }
  }, [mapType]);

  // Update Traffic Layer
  useEffect(() => {
    if (trafficLayerRef.current && mapInstanceRef.current) {
      trafficLayerRef.current.setMap(showTraffic ? mapInstanceRef.current : null);
    }
  }, [showTraffic]);

  // Update Markers, Route Polyline & Truck Tracking
  useEffect(() => {
    if (!mapInstanceRef.current || typeof google === 'undefined' || !google.maps) return;
    const map = mapInstanceRef.current;

    // Clear previous markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    // Clear previous polylines
    if (polylineRef.current) polylineRef.current.setMap(null);
    if (traveledPolylineRef.current) traveledPolylineRef.current.setMap(null);

    const originPos = { lat: origin.coords[0], lng: origin.coords[1] };
    const destPos = { lat: destination.coords[0], lng: destination.coords[1] };
    const truckPos = currentCoords
      ? { lat: currentCoords[0], lng: currentCoords[1] }
      : originPos;

    // 1. Origin Marker
    const originMarker = new google.maps.Marker({
      position: originPos,
      map,
      title: `Pickup: ${origin.city}`,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 9,
        fillColor: '#0284c7',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 3
      },
      label: {
        text: 'A',
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: '11px'
      }
    });

    originMarker.addListener('click', () => {
      if (infoWindowRef.current) {
        infoWindowRef.current.setContent(`
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 4px; color: #0f172a;">
            <div style="font-size: 10px; color: #0284c7; font-weight: 800; text-transform: uppercase;">Origin / Loading Terminal</div>
            <div style="font-size: 13px; font-weight: 800; margin-top: 2px;">${origin.city}</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Consignment Dispatched</div>
          </div>
        `);
        infoWindowRef.current.open(map, originMarker);
      }
    });
    markersRef.current.push(originMarker);

    // 2. Destination Marker
    const destMarker = new google.maps.Marker({
      position: destPos,
      map,
      title: `Destination: ${destination.city}`,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 9,
        fillColor: '#059669',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 3
      },
      label: {
        text: 'B',
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: '11px'
      }
    });

    destMarker.addListener('click', () => {
      if (infoWindowRef.current) {
        infoWindowRef.current.setContent(`
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 4px; color: #0f172a;">
            <div style="font-size: 10px; color: #059669; font-weight: 800; text-transform: uppercase;">Destination Warehouse</div>
            <div style="font-size: 13px; font-weight: 800; margin-top: 2px;">${destination.city}</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Receiving Hub</div>
          </div>
        `);
        infoWindowRef.current.open(map, destMarker);
      }
    });
    markersRef.current.push(destMarker);

    // 3. Live Truck Marker
    const truckMarker = new google.maps.Marker({
      position: truckPos,
      map,
      title: `${vehicleReg} - ${driverName}`,
      zIndex: 999,
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44">
            <circle cx="22" cy="22" r="18" fill="#10b981" fill-opacity="0.3">
              <animate attributeName="r" values="14;22;14" dur="2s" repeatCount="indefinite"/>
              <animate attributeName="fill-opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="22" cy="22" r="14" fill="#065f46" stroke="#ffffff" stroke-width="2.5"/>
            <path d="M14 24V18a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v6m-12 0h12m-12 0a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2m-12 0v2m12-2v2m-10-6h8" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" fill="none"/>
          </svg>
        `),
        anchor: new google.maps.Point(22, 22)
      }
    });

    truckMarker.addListener('click', () => {
      if (infoWindowRef.current) {
        infoWindowRef.current.setContent(`
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 6px; color: #0f172a; min-width: 170px;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
              <span style="font-size: 10px; font-weight: 800; background: #ecfdf5; color: #065f46; padding: 2px 6px; border-radius: 4px; border: 1px solid #a7f3d0;">LIVE GPS</span>
              <span style="font-size: 11px; font-weight: 800; color: #059669; font-family: monospace;">${speedKmH} KM/H</span>
            </div>
            <div style="font-size: 13px; font-weight: 900; margin-top: 4px; font-family: monospace;">${vehicleReg}</div>
            <div style="font-size: 11px; color: #475569; margin-top: 2px;">Driver: <b>${driverName}</b></div>
            <div style="font-size: 10px; color: #64748b; margin-top: 4px; border-top: 1px solid #e2e8f0; padding-top: 4px;">
              Highway Progress: <b>${progressPercentage}% Completed</b>
            </div>
          </div>
        `);
        infoWindowRef.current.open(map, truckMarker);
      }
    });
    markersRef.current.push(truckMarker);

    // 4. Route Polyline Path
    const fullPath = waypoints.length > 0
      ? waypoints.map((pt) => ({ lat: pt[0], lng: pt[1] }))
      : [originPos, destPos];

    // Background corridor glow
    const polyline = new google.maps.Polyline({
      path: fullPath,
      geodesic: true,
      strokeColor: '#059669',
      strokeOpacity: 0.3,
      strokeWeight: 6,
      map
    });
    polylineRef.current = polyline;

    // Active route line
    const traveledPath = fullPath.slice(0, Math.max(2, Math.floor((fullPath.length * progressPercentage) / 100)));
    const traveledPolyline = new google.maps.Polyline({
      path: traveledPath,
      geodesic: true,
      strokeColor: '#047857',
      strokeOpacity: 0.9,
      strokeWeight: 4,
      map
    });
    traveledPolylineRef.current = traveledPolyline;

    // Fit Bounds
    const bounds = new google.maps.LatLngBounds();
    fullPath.forEach((pt) => bounds.extend(pt));
    map.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });

  }, [origin, destination, currentCoords, waypoints, speedKmH, vehicleReg, driverName, progressPercentage, mapLoaded]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      className={`relative rounded-2xl overflow-hidden border-2 border-slate-200/90 shadow-sm transition-all ${
        isFullscreen
          ? 'fixed inset-3 sm:inset-6 z-50 rounded-3xl shadow-2xl border-slate-900'
          : ''
      }`}
      style={{ height: isFullscreen ? 'calc(100vh - 48px)' : height }}
    >
      {/* Google Maps Container */}
      <div ref={mapRef} className="w-full h-full bg-slate-100" />

      {/* Top Left Header Badge: Official Google Maps Live Radar */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2">
        <div className="bg-slate-950/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl border border-slate-800 shadow-md flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-black text-emerald-400 tracking-wider text-[11px] font-display">
            GOOGLE MAPS™ LIVE RADAR
          </span>
          <span className="text-slate-400 font-mono text-[10px]">&bull; {vehicleReg}</span>
        </div>

        {/* Live Speed & Progress Badge */}
        <div className="bg-emerald-950/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl border border-emerald-700 shadow-md flex items-center gap-2 text-xs font-mono">
          <span className="text-emerald-400 font-black">{speedKmH} KM/H</span>
          <span className="text-slate-300 text-[11px]">({progressPercentage}% Done)</span>
        </div>
      </div>

      {/* Top Right Controls Toolbar */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
        {/* Map Type Switcher */}
        <div className="bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-md border border-slate-200 flex items-center text-[11px] font-bold text-slate-700">
          <button
            type="button"
            onClick={() => setMapType('roadmap')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer font-display ${
              mapType === 'roadmap'
                ? 'bg-slate-900 text-white font-black'
                : 'hover:bg-slate-100'
            }`}
          >
            {language === 'ur' ? 'نقشہ (Road)' : 'Map'}
          </button>
          <button
            type="button"
            onClick={() => setMapType('satellite')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer font-display ${
              mapType === 'satellite'
                ? 'bg-slate-900 text-white font-black'
                : 'hover:bg-slate-100'
            }`}
          >
            {language === 'ur' ? 'سیٹلائٹ (Satellite)' : 'Satellite'}
          </button>
          <button
            type="button"
            onClick={() => setMapType('terrain')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer font-display ${
              mapType === 'terrain'
                ? 'bg-slate-900 text-white font-black'
                : 'hover:bg-slate-100'
            }`}
          >
            {language === 'ur' ? 'پہاڑی (Terrain)' : 'Terrain'}
          </button>
        </div>

        {/* Traffic Layer Toggle */}
        <button
          type="button"
          onClick={() => setShowTraffic(!showTraffic)}
          title="Toggle Google Live Traffic"
          className={`p-2 rounded-xl backdrop-blur-md shadow-md border transition-all cursor-pointer ${
            showTraffic
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-500/20'
              : 'bg-white/95 text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
        </button>

        {/* Fullscreen Toggle */}
        <button
          type="button"
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
          className="p-2 rounded-xl bg-white/95 backdrop-blur-md text-slate-700 shadow-md border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Bottom Live Route Footer */}
      <div className="absolute bottom-3 left-3 right-3 z-10 bg-slate-950/90 backdrop-blur-md text-white p-3 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-3 font-display">
          <div className="flex items-center gap-1.5 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>{origin.city}</span>
          </div>
          <span className="text-slate-500">&rarr;</span>
          <div className="flex items-center gap-1.5 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>{destination.city}</span>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 text-[11px] text-slate-300">
          <span>
            {language === 'ur' ? 'استاد:' : 'Driver:'} <b className="text-white font-display">{driverName}</b>
          </span>
          <button
            type="button"
            onClick={() => setShowKeyDialog(true)}
            className="flex items-center gap-1 text-[10px] text-emerald-400 hover:text-emerald-300 font-bold bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700 cursor-pointer"
          >
            <Key className="w-3 h-3" />
            <span>{apiKey ? 'API Key Configured' : 'Configure Maps API Key'}</span>
          </button>
        </div>
      </div>

      {/* Google Maps API Key Configurator Modal */}
      {showKeyDialog && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4 border border-slate-200 text-slate-900">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Key className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-black font-display">Google Maps Platform API Key</h4>
              </div>
              <button
                type="button"
                onClick={() => setShowKeyDialog(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              The application uses Google Maps JavaScript API. You can provide your Google Cloud Maps API key or use the built-in demo environment.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Enter Custom Google Maps API Key (Optional):
              </label>
              <input
                type="text"
                value={customKeyInput}
                onChange={(e) => setCustomKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-slate-900"
              />
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                To generate your free production key with $200 monthly credit, visit Google Cloud Console &rarr; Google Maps Platform &rarr; Credentials.
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowKeyDialog(false)}
                className="btn-secondary text-xs"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  if (customKeyInput.trim()) {
                    setApiKey(customKeyInput.trim());
                  }
                  setShowKeyDialog(false);
                }}
                className="btn-primary text-xs py-2 px-4 shadow-sm font-display"
              >
                Save & Reload Map
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
