import React from 'react';
import { GoogleMapsTripMap } from './GoogleMapsTripMap';

interface PakistanTripMapProps {
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

export const PakistanTripMap: React.FC<PakistanTripMapProps> = (props) => {
  return <GoogleMapsTripMap {...props} />;
};
