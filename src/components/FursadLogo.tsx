import React from 'react';

interface FursadLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  lightMode?: boolean;
  onClick?: () => void;
}

export const FursadLogo: React.FC<FursadLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  lightMode = false,
  onClick
}) => {
  const emblemSizes = {
    xs: 'w-6 h-6 rounded-md',
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl',
    lg: 'w-14 h-14 sm:w-16 sm:h-16 rounded-2xl',
    xl: 'w-20 h-20 sm:w-24 sm:h-24 rounded-3xl'
  };

  return (
    <div 
      className={`flex items-center gap-2.5 sm:gap-3 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`} 
      id="fursad-brand-logo"
      onClick={onClick}
    >
      {/* Official Fursad App Icon Emblem */}
      <div className={`relative ${emblemSizes[size]} shrink-0 overflow-hidden shadow-xs border border-slate-200/80 bg-white ring-1 ring-slate-950/5 group`}>
        <img
          src="/fursad-logo.jpg"
          alt="FURSAD Brand Identity"
          className="w-full h-full object-cover select-none transition-transform duration-300 group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="eager"
        />
      </div>

      {/* Official Brand Typography */}
      {showText && (
        <div className="flex flex-col text-left leading-tight">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-tight ${size === 'lg' ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'} ${lightMode ? 'text-white' : 'text-[#0A2540]'}`}>
              FURSAD
            </span>
            <span className="text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded bg-blue-600 text-white tracking-wider uppercase shadow-xs">
              GLOBAL
            </span>
          </div>
          <span className="text-[9px] sm:text-[10px] font-extrabold tracking-widest text-blue-700 uppercase flex items-center gap-1">
            <span className="opacity-60">—</span> YOUTH OPPORTUNITY <span className="opacity-60">—</span>
          </span>
          <span className={`text-[8px] font-bold tracking-tight hidden md:inline ${lightMode ? 'text-blue-200' : 'text-slate-500'}`}>
            Scholarships • Fellowships • Internships
          </span>
        </div>
      )}
    </div>
  );
};

