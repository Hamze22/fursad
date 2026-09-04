import React, { useState, useEffect } from 'react';
import { Sparkles, MapPin, ExternalLink, GraduationCap, CheckCircle2 } from 'lucide-react';

interface ScholarPin {
  id: string;
  name: string;
  avatar: string;
  country: string;
  flag: string;
  program: string;
  city: string;
  coords: { x: number; y: number }; // percentage on globe surface
  orbitAngle?: number; // angle for orbital positioning
  orbitRadiusX?: number;
  orbitRadiusY?: number;
}

const scholarsList: ScholarPin[] = [
  {
    id: 's1',
    name: 'Fatima H.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    country: 'United Kingdom',
    flag: '🇬🇧',
    city: 'Oxford',
    program: 'Chevening Scholar',
    coords: { x: 55, y: 25 },
    orbitAngle: 35,
    orbitRadiusX: 48,
    orbitRadiusY: 28
  },
  {
    id: 's2',
    name: 'Abdirahman M.',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80',
    country: 'Germany',
    flag: '🇩🇪',
    city: 'Munich',
    program: 'DAAD EPOS Fellow',
    coords: { x: 58, y: 32 },
    orbitAngle: 145,
    orbitRadiusX: 52,
    orbitRadiusY: 26
  },
  {
    id: 's3',
    name: 'Amina N.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    country: 'Canada',
    flag: '🇨🇦',
    city: 'Toronto',
    program: 'Vanier CGS Scholar',
    coords: { x: 26, y: 36 },
    orbitAngle: 215,
    orbitRadiusX: 50,
    orbitRadiusY: 24
  },
  {
    id: 's4',
    name: 'Khadar A.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    country: 'Turkey',
    flag: '🇹🇷',
    city: 'Istanbul',
    program: 'Türkiye Bursları',
    coords: { x: 67, y: 38 },
    orbitAngle: 305,
    orbitRadiusX: 54,
    orbitRadiusY: 30
  },
  {
    id: 's5',
    name: 'Zahra D.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    country: 'Qatar',
    flag: '🇶🇦',
    city: 'Doha',
    program: 'HBKU Merit Scholar',
    coords: { x: 74, y: 48 },
    orbitAngle: 80,
    orbitRadiusX: 46,
    orbitRadiusY: 22
  },
  {
    id: 's6',
    name: 'Yusuf K.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    country: 'Somalia',
    flag: '🇸🇴',
    city: 'Mogadishu',
    program: 'FURSAD Ambassador',
    coords: { x: 68, y: 64 },
    orbitAngle: 270,
    orbitRadiusX: 49,
    orbitRadiusY: 25
  }
];

interface GlobalScholarsGlobeProps {
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onScholarClick?: (scholar: ScholarPin) => void;
}

export const GlobalScholarsGlobe: React.FC<GlobalScholarsGlobeProps> = ({
  size = 'md',
  interactive = true,
  onScholarClick
}) => {
  const [activeScholar, setActiveScholar] = useState<ScholarPin | null>(scholarsList[0]);
  const [autoRotateIndex, setAutoRotateIndex] = useState<number>(0);

  // Auto cycle active scholar tooltip every 3.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setAutoRotateIndex((prev) => {
        const next = (prev + 1) % scholarsList.length;
        setActiveScholar(scholarsList[next]);
        return next;
      });
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  const sizeClasses = {
    sm: 'w-28 h-28 sm:w-36 sm:h-36',
    md: 'w-32 h-32 sm:w-48 sm:h-48 md:w-56 md:h-56',
    lg: 'w-48 h-48 sm:w-64 sm:h-64 md:w-76 md:h-76'
  };

  return (
    <div className={`relative ${sizeClasses[size]} flex items-center justify-center select-none group`} id="global-scholars-globe-container">
      {/* Outer ambient blue glow matching the realistic blue sphere */}
      <div className="absolute inset-2 bg-gradient-to-tr from-blue-600/30 via-cyan-400/25 to-blue-300/10 rounded-full blur-2xl animate-pulse pointer-events-none" />

      {/* Main 3D Earth Globe SVG closely matching the uploaded image */}
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full relative z-10 drop-shadow-2xl overflow-visible"
      >
        <defs>
          {/* Deep Ocean 3D Spherical Radial Gradient (matching the uploaded image) */}
          <radialGradient id="earthOceanDeep" cx="62%" cy="38%" r="68%" fx="55%" fy="32%">
            <stop offset="0%" stopColor="#bae6fd" />
            <stop offset="18%" stopColor="#38bdf8" />
            <stop offset="42%" stopColor="#0284c7" />
            <stop offset="70%" stopColor="#0369a1" />
            <stop offset="90%" stopColor="#075985" />
            <stop offset="100%" stopColor="#082f49" />
          </radialGradient>

          {/* Continents Shading Gradient (Bright crisp white-cyan with high contrast) */}
          <linearGradient id="continentShine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="45%" stopColor="#f0fdf4" stopOpacity="0.98" />
            <stop offset="75%" stopColor="#e0f2fe" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.92" />
          </linearGradient>

          {/* Africa continent crisp gradient */}
          <radialGradient id="africaGradient" cx="45%" cy="35%" r="75%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#f8fafc" />
            <stop offset="75%" stopColor="#e0f2fe" />
            <stop offset="100%" stopColor="#bae6fd" />
          </radialGradient>

          {/* Continent Crisp Border Stroke */}
          <linearGradient id="continentStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.8" />
          </linearGradient>

          {/* Spherical Gloss Specular Highlight (Upper-Right 3D Dome light) */}
          <radialGradient id="specularGloss" cx="65%" cy="32%" r="45%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.18" />
            <stop offset="80%" stopColor="#ffffff" stopOpacity="0.0" />
          </radialGradient>

          {/* Dark spherical shadow vignette along bottom-left border */}
          <radialGradient id="sphereShadow" cx="30%" cy="75%" r="75%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.0" />
            <stop offset="70%" stopColor="#082f49" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#021f36" stopOpacity="0.75" />
          </radialGradient>

          {/* Atmosphere outer rim glow gradient */}
          <linearGradient id="atmosphereGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0369a1" stopOpacity="0.9" />
          </linearGradient>

          {/* Orbital path glowing gradient */}
          <linearGradient id="orbitGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.85" />
          </linearGradient>

          <linearGradient id="orbitGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
          </linearGradient>

          {/* Drop shadow filter for continent layers */}
          <filter id="continentShadow" x="-10%" y="-10%" width="125%" height="125%">
            <feDropShadow dx="1" dy="1.5" stdDeviation="2" floodColor="#042742" floodOpacity="0.7" />
          </filter>

          {/* Pin glow filter */}
          <filter id="pinGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Outer Orbit Ring 1 (Tilted Perspective with located scholars) */}
        <g className="animate-[spin_45s_linear_infinite] origin-center">
          <ellipse
            cx="200"
            cy="200"
            rx="182"
            ry="75"
            transform="rotate(-28 200 200)"
            fill="none"
            stroke="url(#orbitGrad1)"
            strokeWidth="1.8"
            strokeDasharray="6 6"
            className="opacity-75"
          />
        </g>

        {/* 2. Outer Orbit Ring 2 (Cross-angle orbit) */}
        <g className="animate-[spin_55s_linear_infinite_reverse] origin-center">
          <ellipse
            cx="200"
            cy="200"
            rx="175"
            ry="85"
            transform="rotate(35 200 200)"
            fill="none"
            stroke="url(#orbitGrad2)"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            className="opacity-60"
          />
        </g>

        {/* Atmosphere Outer Rim Aura */}
        <circle
          cx="200"
          cy="200"
          r="142"
          fill="none"
          stroke="url(#atmosphereGlow)"
          strokeWidth="3.5"
          className="opacity-80"
        />

        {/* 3. Base Earth 3D Blue Sphere */}
        <circle
          cx="200"
          cy="200"
          r="140"
          fill="url(#earthOceanDeep)"
        />

        {/* Latitude & Longitude Geodesic Grid (Subtle realistic 3D depth lines) */}
        <g className="opacity-25">
          <ellipse cx="200" cy="200" rx="140" ry="50" fill="none" stroke="#e0f2fe" strokeWidth="0.8" strokeDasharray="3 4" />
          <ellipse cx="200" cy="200" rx="140" ry="95" fill="none" stroke="#e0f2fe" strokeWidth="0.8" strokeDasharray="3 4" />
          <ellipse cx="200" cy="200" rx="65" ry="140" fill="none" stroke="#e0f2fe" strokeWidth="0.8" strokeDasharray="3 4" />
          <ellipse cx="200" cy="200" rx="115" ry="140" fill="none" stroke="#e0f2fe" strokeWidth="0.8" strokeDasharray="3 4" />
          <line x1="60" y1="200" x2="340" y2="200" stroke="#e0f2fe" strokeWidth="0.8" opacity="0.5" />
          <line x1="200" y1="60" x2="200" y2="340" stroke="#e0f2fe" strokeWidth="0.8" opacity="0.5" />
        </g>

        {/* 4. Highly Visible, Detailed Continent Vector Shapes matching the image */}
        <g filter="url(#continentShadow)" stroke="url(#continentStroke)" strokeWidth="1" strokeLinejoin="round" className="transition-transform duration-500">
          
          {/* Greenland (Top Center-Left) */}
          <path
            d="M145,70 C162,60 188,68 195,85 C200,98 194,116 178,124 C162,130 142,120 138,102 C135,88 140,75 145,70 Z
               M130,92 C138,86 142,92 138,98 C132,102 128,96 130,92 Z"
            fill="url(#continentShine)"
          />

          {/* North America (Alaska, Canada, USA, Florida, Mexico) */}
          <path
            d="M85,98 C95,80 120,88 135,102 C142,110 138,125 130,135 C138,142 145,152 135,168 C128,180 115,190 102,194 C92,196 85,182 88,165 C85,150 78,135 85,120 C78,110 80,102 85,98 Z
               M112,192 C118,205 130,220 135,232 C138,242 128,245 122,236 C116,225 110,208 112,192 Z
               M145,215 C155,218 152,226 145,224 C140,222 142,216 145,215 Z
               M128,148 C135,155 130,165 122,160 C118,154 122,148 128,148 Z"
            fill="url(#continentShine)"
          />

          {/* South America (Brazil, Horn, Andes, Patagonia) */}
          <path
            d="M125,245 C145,235 168,248 185,265 C198,282 196,315 182,342 C168,365 152,372 142,355 C132,328 122,290 118,268 C115,255 120,248 125,245 Z"
            fill="url(#continentShine)"
          />

          {/* Europe & Scandinavia (British Isles, France, Germany, Scandinavia, Mediterranean) */}
          <path
            d="M198,92 C212,82 232,95 242,110 C248,122 235,138 222,142 C210,145 198,132 196,118 C194,105 195,95 198,92 Z
               M175,120 C184,112 190,122 185,132 C178,136 172,128 175,120 Z
               M215,130 C238,124 255,138 248,152 C240,162 222,164 212,152 C208,142 212,132 215,130 Z
               M255,102 C275,98 288,115 280,132 C270,142 252,136 255,102 Z"
            fill="url(#continentShine)"
          />

          {/* Africa (Sahara, West Africa, Somalia/Horn of Africa, Great Lakes, South Africa) */}
          <path
            d="M178,172 C210,160 258,168 285,182 C302,202 308,232 288,260 C278,285 268,312 248,348 C238,360 225,350 216,322 C204,288 176,252 170,220 C166,192 172,178 178,172 Z"
            fill="url(#africaGradient)"
          />

          {/* Madagascar */}
          <path
            d="M292,290 C302,285 305,310 295,324 C288,328 285,312 292,290 Z"
            fill="url(#continentShine)"
          />

          {/* Middle East & Arabian Peninsula */}
          <path
            d="M270,180 C290,174 308,188 322,208 C328,228 315,244 298,245 C285,242 278,222 274,202 C272,190 268,184 270,180 Z"
            fill="url(#continentShine)"
          />

          {/* Eurasia / Asia Coastline & Indian Subcontinent */}
          <path
            d="M290,132 C320,126 348,145 358,175 C364,202 348,228 332,234 C318,230 305,208 296,182 C290,160 285,142 290,132 Z
               M312,215 C328,218 335,242 324,260 C314,264 308,248 312,215 Z"
            fill="url(#continentShine)"
          />

        </g>

        {/* 5. 3D Spherical Specular Light & Shadow Dome Overlays */}
        {/* Specular gloss glow on upper-right quadrant */}
        <circle
          cx="200"
          cy="200"
          r="140"
          fill="url(#specularGloss)"
          className="pointer-events-none"
        />

        {/* Bottom-left spherical edge shadow */}
        <circle
          cx="200"
          cy="200"
          r="140"
          fill="url(#sphereShadow)"
          className="pointer-events-none"
        />

        {/* Subtle glass reflection highlight crescent */}
        <path
          d="M 120,95 A 140,140 0 0 1 315,140 A 130,120 0 0 0 120,95 Z"
          fill="#ffffff"
          opacity="0.35"
          className="pointer-events-none"
        />

        {/* 6. Scholar Location Pins directly mapped on the Globe (Wareegyo Dad ku yaal) */}
        {scholarsList.map((scholar, idx) => {
          // Convert percentage coordinates into 400x400 viewBox
          const pinX = (scholar.coords.x / 100) * 400;
          const pinY = (scholar.coords.y / 100) * 400;
          const isActive = activeScholar?.id === scholar.id;

          return (
            <g
              key={scholar.id}
              className="cursor-pointer transition-all duration-300"
              onClick={() => {
                setActiveScholar(scholar);
                if (onScholarClick) onScholarClick(scholar);
              }}
              onMouseEnter={() => setActiveScholar(scholar)}
            >
              {/* Pulsing Radar Ring on Geographic Location */}
              <circle
                cx={pinX}
                cy={pinY}
                r={isActive ? 16 : 9}
                fill={isActive ? '#38bdf8' : '#60a5fa'}
                opacity={isActive ? 0.45 : 0.25}
                className="animate-ping origin-center"
              />

              {/* Geographic anchor dot */}
              <circle
                cx={pinX}
                cy={pinY}
                r="4.5"
                fill="#ffffff"
                stroke="#0284c7"
                strokeWidth="2"
                filter="url(#pinGlow)"
              />

              {/* Floating Orbit Pod with Person Avatar */}
              <g transform={`translate(${pinX}, ${pinY - 14})`}>
                {/* Connector line from surface to avatar pod */}
                <line x1="0" y1="14" x2="0" y2="4" stroke="#bae6fd" strokeWidth="1.5" strokeDasharray="2 2" />

                {/* Avatar Circle Container */}
                <circle
                  cx="0"
                  cy="0"
                  r={isActive ? "13" : "10"}
                  fill="#ffffff"
                  stroke={isActive ? "#38bdf8" : "#0284c7"}
                  strokeWidth={isActive ? "2.5" : "1.8"}
                  className="shadow-lg transition-all duration-200"
                />

                {/* Flag emoji badge next to avatar */}
                <text
                  x="7"
                  y="-5"
                  fontSize={isActive ? "11" : "9"}
                  textAnchor="middle"
                  className="select-none"
                >
                  {scholar.flag}
                </text>
              </g>
            </g>
          );
        })}

        {/* Animated Flight Path lines connecting scholars across continents */}
        <path
          d="M 220,100 Q 180,120 104,144"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="1.2"
          strokeDasharray="4 4"
          className="opacity-70 animate-[pulse_2s_infinite]"
        />
        <path
          d="M 232,128 Q 255,180 272,256"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="1.2"
          strokeDasharray="4 4"
          className="opacity-70 animate-[pulse_3s_infinite]"
        />
        <path
          d="M 272,256 Q 285,210 296,192"
          fill="none"
          stroke="#60a5fa"
          strokeWidth="1.2"
          strokeDasharray="3 3"
          className="opacity-60"
        />

        {/* Airplane on Flight Path */}
        <g transform="translate(160, 115) rotate(-18)">
          <path d="M 0,-6 L 2,-1 L 7,0 L 2,1 L 0,6 L -1,3 L -1,-3 Z" fill="#ffffff" stroke="#0369a1" strokeWidth="0.7" />
        </g>
      </svg>

      {/* Floating Interactive Scholar Card / Tooltip Popup */}
      {activeScholar && (
        <div 
          className="absolute -bottom-5 sm:-bottom-7 right-0 sm:left-1/2 sm:-translate-x-1/2 z-30 bg-slate-950/95 backdrop-blur-md text-white px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl border border-blue-400/40 shadow-xl flex items-center gap-2 max-w-[180px] sm:max-w-[220px] md:max-w-[240px] animate-in fade-in zoom-in-95 duration-200 pointer-events-none sm:pointer-events-auto"
          id="globe-active-scholar-card"
        >
          <img
            src={activeScholar.avatar}
            alt={activeScholar.name}
            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover border border-blue-400 shrink-0"
          />
          <div className="text-left min-w-0 flex-1 overflow-hidden">
            <div className="flex items-center gap-1 leading-none mb-0.5">
              <span className="text-[10px] sm:text-xs font-black text-white truncate">
                {activeScholar.name}
              </span>
              <span className="text-[10px] sm:text-xs shrink-0">{activeScholar.flag}</span>
            </div>
            <p className="text-[9px] sm:text-[10px] text-blue-300 font-bold truncate leading-tight">
              {activeScholar.program}
            </p>
            <p className="text-[8px] sm:text-[9px] text-slate-400 font-medium truncate leading-tight">
              📍 {activeScholar.city}
            </p>
          </div>
        </div>
      )}

      {/* Mini Scholars Counter Badge at top right */}
      <div className="absolute -top-2 -right-2 z-20 bg-blue-600/90 text-white backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] font-black border border-white/20 shadow-md flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>150+ Countries</span>
      </div>
    </div>
  );
};
