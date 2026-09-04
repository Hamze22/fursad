import React from 'react';
import { Home, Bookmark, Bot, ShieldCheck, User } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface MobileBottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  savedCount: number;
  applicationCount: number;
  onOpenProfile: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onTabChange,
  savedCount,
  applicationCount,
}) => {
  const { t, isRTL } = useLanguage();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-lg" id="mobile-bottom-nav" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* 1. Home */}
        <button
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors cursor-pointer ${
            currentTab === 'home' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
          id="mobile-nav-home"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">{t.nav.home}</span>
        </button>

        {/* 2. Saved */}
        <button
          onClick={() => onTabChange('saved')}
          className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors cursor-pointer ${
            currentTab === 'saved' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
          id="mobile-nav-saved"
        >
          <Bookmark className="w-5 h-5" />
          <span className="text-[10px]">{t.nav.saved}</span>
          {savedCount > 0 && (
            <span className="absolute top-0.5 end-2 bg-blue-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
              {savedCount}
            </span>
          )}
        </button>

        {/* 3. FURSAD AI Advisor */}
        <button
          onClick={() => onTabChange('ai-assistant')}
          className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors cursor-pointer ${
            currentTab === 'ai-assistant' || currentTab === 'matching'
              ? 'text-blue-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          id="mobile-nav-ai-assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-blue-600" />
            <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-[7px] font-black px-1 rounded-full">
              AI
            </span>
          </div>
          <span className="text-[10px]">FURSAD AI</span>
        </button>

        {/* 4. Applications Tracker */}
        <button
          onClick={() => onTabChange('tracker')}
          className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors cursor-pointer ${
            currentTab === 'tracker' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
          id="mobile-nav-applications"
        >
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[10px]">{t.nav.tracker}</span>
          {applicationCount > 0 && (
            <span className="absolute top-0.5 end-2 bg-emerald-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
              {applicationCount}
            </span>
          )}
        </button>

        {/* 5. Profile */}
        <button
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors cursor-pointer ${
            currentTab === 'profile' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
          id="mobile-nav-profile"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">{t.nav.profile}</span>
        </button>
      </div>
    </nav>
  );
};
