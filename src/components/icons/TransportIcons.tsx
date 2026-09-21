import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// 1. Shehzore Pickup (3.5 Tons)
export const ShehzorePickupIcon: React.FC<IconProps> = ({ className = 'w-7 h-7', size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Chassis & Cargo Bed */}
    <rect x="3" y="10" width="20" height="11" rx="2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.8" />
    <path d="M3 15H23M8 10V21M15 10V21" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    {/* Cabin */}
    <path
      d="M23 11H29.5L34 16V21H23V11Z"
      fill="currentColor"
      fillOpacity="0.35"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path d="M25 13H28.5L31.5 16H25V13Z" fill="currentColor" fillOpacity="0.75" />
    {/* Wheels */}
    <circle cx="9" cy="22" r="3.2" fill="#0f172a" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="9" cy="22" r="1.2" fill="#95d600" />
    <circle cx="28.5" cy="22" r="3.2" fill="#0f172a" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="28.5" cy="22" r="1.2" fill="#95d600" />
    <path d="M12.5 21H25" stroke="currentColor" strokeWidth="2" />
  </svg>
);

// 2. Mazda Commercial 6-Wheeler Truck (7.5 Tons)
export const MazdaTruckIcon: React.FC<IconProps> = ({ className = 'w-7 h-7', size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect x="2" y="8" width="22" height="13" rx="2.5" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.8" />
    <path d="M2 13.5H24M2 17.5H24" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 2" />
    <path
      d="M24 10H30.5L35.5 15V21H24V10Z"
      fill="currentColor"
      fillOpacity="0.4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path d="M26.5 12H29.5L33 15H26.5V12Z" fill="currentColor" fillOpacity="0.8" />
    <circle cx="8" cy="22" r="3.2" fill="#0f172a" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="8" cy="22" r="1.2" fill="#95d600" />
    <circle cx="29.5" cy="22" r="3.2" fill="#0f172a" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="29.5" cy="22" r="1.2" fill="#95d600" />
    <path d="M11.5 21H26" stroke="currentColor" strokeWidth="2" />
  </svg>
);

// 3. 10-Wheeler Rigid Goods Truck (18 Tons)
export const TenWheelerIcon: React.FC<IconProps> = ({ className = 'w-7 h-7', size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 42 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect x="2" y="7" width="25" height="14" rx="2.5" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.8" />
    <path d="M7 7V21M13 7V21M19 7V21" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M27 9.5H32.5L37 14.5V21H27V9.5Z"
      fill="currentColor"
      fillOpacity="0.45"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path d="M29 11.5H31.5L34.5 14.5H29V11.5Z" fill="currentColor" fillOpacity="0.85" />
    <circle cx="7" cy="22" r="2.8" fill="#0f172a" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="7" cy="22" r="1" fill="#95d600" />
    <circle cx="13" cy="22" r="2.8" fill="#0f172a" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="13" cy="22" r="1" fill="#95d600" />
    <circle cx="31.5" cy="22" r="2.8" fill="#0f172a" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="31.5" cy="22" r="1" fill="#95d600" />
    <path d="M16 21H28.5" stroke="currentColor" strokeWidth="2" />
  </svg>
);

// 4. 22-Wheeler Prime Mover Trailer (40 Tons)
export const Trailer22WheelerIcon: React.FC<IconProps> = ({ className = 'w-8 h-8', size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 44 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Trailer Cargo Body */}
    <rect x="2" y="6" width="27" height="15" rx="2.5" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.8" />
    <path d="M7 6V21M13 6V21M19 6V21M24 6V21" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.6" />
    {/* Prime Mover Tractor Cab */}
    <path
      d="M30 10H35.5L39.5 14.5V21H30V10Z"
      fill="currentColor"
      fillOpacity="0.45"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path d="M32 12H34.5L37.5 14.5H32V12Z" fill="currentColor" fillOpacity="0.85" />
    {/* Wheels */}
    <circle cx="6.5" cy="22.5" r="2.7" fill="#0f172a" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="6.5" cy="22.5" r="1" fill="#95d600" />
    <circle cx="12.5" cy="22.5" r="2.7" fill="#0f172a" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="12.5" cy="22.5" r="1" fill="#95d600" />
    <circle cx="18.5" cy="22.5" r="2.7" fill="#0f172a" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="18.5" cy="22.5" r="1" fill="#95d600" />
    <circle cx="34.5" cy="22.5" r="2.7" fill="#0f172a" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="34.5" cy="22.5" r="1" fill="#95d600" />
    <path d="M21.5 21H31.5" stroke="currentColor" strokeWidth="2" />
  </svg>
);

// 5. ISO Shipping Container (20ft / 40ft)
export const ContainerBoxIcon: React.FC<IconProps> = ({ className = 'w-7 h-7', size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 36 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect x="2" y="7" width="32" height="18" rx="3" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.8" />
    <path d="M7 7V25M12 7V25M17 7V25M22 7V25M27 7V25M31 7V25" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.6" />
    <path d="M18 7V25" stroke="currentColor" strokeWidth="2.4" />
    <rect x="15" y="14" width="6" height="4" rx="1" fill="currentColor" fillOpacity="0.8" />
  </svg>
);

// 6. Reefer Cold Chain (Insulated Refrigerated)
export const ReeferColdIcon: React.FC<IconProps> = ({ className = 'w-7 h-7', size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect x="2" y="8" width="23" height="13" rx="2.5" fill="#0284c7" fillOpacity="0.25" stroke="#0284c7" strokeWidth="1.8" />
    <path
      d="M25 10H31L35.5 14.5V21H25V10Z"
      fill="#0284c7"
      fillOpacity="0.45"
      stroke="#0284c7"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    {/* Snowflake */}
    <path d="M13.5 10.5V18.5M9.5 12.5L17.5 16.5M9.5 16.5L17.5 12.5" stroke="#0284c7" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="8" cy="22" r="2.8" fill="#0f172a" stroke="#0284c7" strokeWidth="1.8" />
    <circle cx="8" cy="22" r="1" fill="#38bdf8" />
    <circle cx="30" cy="22" r="2.8" fill="#0f172a" stroke="#0284c7" strokeWidth="1.8" />
    <circle cx="30" cy="22" r="1" fill="#38bdf8" />
    <path d="M11.5 21H27" stroke="#0284c7" strokeWidth="2" />
  </svg>
);

// 7. Verified Pakistani Transporter Badge
export const VerifiedTransporterBadge: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 2L15.09 4.26L18.9 4.38L20.24 7.96L23 10.64L22.09 14.36L23 18.08L20.24 20.76L18.9 24.34L15.09 24.46L12 26.72L8.91 24.46L5.1 24.34L3.76 20.76L1 18.08L1.91 14.36L1 10.64L3.76 7.96L5.1 4.38L8.91 4.26L12 2Z"
      fill="#95d600"
      fillOpacity="0.2"
      stroke="#65a30d"
      strokeWidth="1.5"
    />
    <path
      d="M8.5 12L11 14.5L16 9.5"
      stroke="#15803d"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 8. Urdu Audio Voice Assistant Speaker with Soundwaves
export const UrduVoiceSpeakerIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M11 5L6 9H2V15H6L11 19V5Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M15.5 8.5C16.5 9.5 17 10.7 17 12C17 13.3 16.5 14.5 15.5 15.5"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M19 5C21 7 22 9.5 22 12C22 14.5 21 17 19 19"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);
