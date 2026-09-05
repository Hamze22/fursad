import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  SlidersHorizontal, 
  X, 
  GraduationCap, 
  Briefcase, 
  Users, 
  Coins, 
  Grid, 
  CheckCircle2, 
  Bot
} from 'lucide-react';
import { UserProfile } from '../types';
import { GlobalScholarsGlobe } from './GlobalScholarsGlobe';
import { useLanguage } from '../i18n/LanguageContext';

interface HeroSectionProps {
  userProfile?: UserProfile;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedDegree: string;
  onDegreeChange: (deg: string) => void;
  selectedFunding: string;
  onFundingChange: (fund: string) => void;
  selectedRegion: string;
  onRegionChange: (reg: string) => void;
  moiOnly: boolean;
  onMoiOnlyChange: (val: boolean) => void;
  onOpenAI: () => void;
  totalActiveCount: number;
  onOpenAllCategories?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  userProfile,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedDegree,
  onDegreeChange,
  selectedFunding,
  onFundingChange,
  selectedRegion,
  onRegionChange,
  moiOnly,
  onMoiOnlyChange,
  onOpenAI,
  totalActiveCount,
}) => {
  const { t, isRTL, language } = useLanguage();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  const [showMoreCategories, setShowMoreCategories] = useState<boolean>(false);

  const userName = userProfile?.name ? userProfile.name.split(' ')[0] : 'Scholar';

  const quickCategories = [
    { id: 'scholarship', label: t.hero.categories.scholarships, icon: GraduationCap },
    { id: 'internship', label: t.hero.categories.internships, icon: Briefcase },
    { id: 'conference', label: t.hero.categories.conferences, icon: Users },
    { id: 'grant', label: t.hero.categories.grants, icon: Coins },
    { id: 'more', label: t.hero.categories.more, icon: Grid }
  ];

  const topCategoryPills = [
    { id: 'scholarship', label: t.hero.badges.studyAbroad, count: '35K+', bg: 'bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100' },
    { id: 'fellowship', label: t.hero.badges.research, count: '3.2K+', bg: 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100' },
    { id: 'internship', label: t.hero.categories.internships, count: '2.4K+', bg: 'bg-blue-50 text-blue-800 border-blue-100 hover:bg-blue-100' },
    { id: 'grant', label: t.hero.categories.grants, count: '1.2K+', bg: 'bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-100' },
    { id: 'conference', label: t.hero.categories.conferences, count: '850+', bg: 'bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100' },
  ];

  const allCategoriesList = [
    { id: 'scholarship', label: t.hero.categories.scholarships, desc: t.card.fullyFunded },
    { id: 'internship', label: t.hero.categories.internships, desc: t.card.paid },
    { id: 'conference', label: t.hero.categories.conferences, desc: t.hero.categories.conferences },
    { id: 'grant', label: t.hero.categories.grants, desc: t.hero.categories.grants },
    { id: 'fellowship', label: t.hero.categories.fellowships, desc: t.hero.categories.fellowships },
    { id: 'volunteer', label: t.hero.categories.volunteering, desc: t.hero.categories.volunteering },
  ];

  const hasActiveFilters = selectedDegree !== 'all' || selectedFunding !== 'all' || selectedRegion !== 'all' || moiOnly;

  return (
    <section className="bg-white border-b border-slate-200/80 pt-3 sm:pt-6 pb-5 sm:pb-6 px-3 sm:px-6 md:px-12 lg:px-20 xl:px-24" id="hero-section" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="w-full mx-auto space-y-4 sm:space-y-8">
        
        {/* Top Greeting & Globe Illustration Header */}
        <div className="flex flex-row items-center justify-between gap-4 sm:gap-12 pb-4 sm:pb-6">
          <div className="flex-1 space-y-2 sm:space-y-4 text-left min-w-0">
            <p className="text-[11px] sm:text-base font-bold text-black flex items-center gap-1.5 uppercase tracking-wider animate-in fade-in slide-in-from-left-2">
              <span>{t.hero.greeting}, {userName}</span>
              <span className="text-sm sm:text-xl">👋</span>
            </p>
            <h1 className="text-xl sm:text-5xl lg:text-7xl font-black text-black tracking-tight leading-[1.2] sm:leading-[1.05]">
              {language === 'so' ? (
                <>
                  Hel <span className="text-blue-600">Fursaddaada Caalamiga ah</span> ee Xigta
                </>
              ) : (
                <>
                  Find Your Next <span className="text-blue-600">Global Opportunity</span>
                </>
              )}
            </h1>
            <p className="text-[11px] sm:text-base text-slate-500 font-medium hidden sm:block max-w-lg">
              {t.hero.subtitle}
            </p>
          </div>

          {/* 3D Blue Earth Globe with Located Scholars */}
          <div className="shrink-0 flex justify-end">
            <div className="relative group">
              <GlobalScholarsGlobe size="md" className="scale-100 sm:scale-110 lg:scale-125 xl:scale-135 transition-transform duration-500" />
              {/* Optional ambient glow for laptop view */}
              <div className="absolute inset-0 bg-blue-400/10 blur-3xl -z-10 rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        {/* Search Bar Container */}
        <div className="bg-slate-100/90 rounded-2xl p-1.5 sm:p-2 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute start-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t.hero.searchPlaceholder}
                className="w-full ps-11 pe-9 py-3 text-xs sm:text-sm rounded-xl bg-white border border-slate-200/80 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium shadow-xs"
                id="main-search-input"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute end-3 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`p-3 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                hasActiveFilters || showAdvancedFilters
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title={t.hero.filterButton}
              id="filter-toggle-btn"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>

            {/* AI Advisor Button */}
            <button
              type="button"
              onClick={onOpenAI}
              className="hidden sm:flex items-center gap-1.5 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-xs hover:from-blue-700 hover:to-indigo-700 transition-all cursor-pointer shrink-0"
              id="hero-ai-advisor-btn"
            >
              <Bot className="w-4 h-4" />
              <span>{t.ai.askButton}</span>
            </button>
          </div>

          {/* Quick Natural Language Search Suggestions */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-left scrollbar-none">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 shrink-0 flex items-center gap-1">
              <div className="w-4 h-4 rounded-md overflow-hidden border border-slate-200 bg-white p-0.5 shrink-0">
                <img src="/fursad-logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-sm" />
              </div>
              Try:
            </span>
            {[
              { label: '🇬🇧 UK Master’s without IELTS', q: 'UK Master without IELTS' },
              { label: '📍 Hargeisa, Somaliland Scholars', q: 'Somaliland' },
              { label: '🇩🇪 Germany DAAD Fully Funded', q: 'Germany DAAD fully funded' },
              { label: '🇹🇷 Turkey Undergraduate + Housing', q: 'Turkey undergraduate stipend' },
              { label: '🇺🇸 USA Fulbright 100% Covered', q: 'USA Fulbright fully funded' },
              { label: '🇪🇺 Erasmus Mundus Multi-Country', q: 'Erasmus Mundus Master' },
              { label: '🇸🇦 KAUST STEM $20K+ Stipend', q: 'KAUST STEM Fellowship' }
            ].map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => onSearchChange(chip.q)}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200/90 hover:border-blue-400 hover:bg-blue-50/50 text-[11px] font-bold text-slate-700 hover:text-blue-700 transition-colors whitespace-nowrap shrink-0 shadow-2xs cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Advanced Filters Drawer */}
          {showAdvancedFilters && (
            <div className="pt-2 px-1 pb-1 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 animate-in fade-in slide-in-from-top-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">{t.feed.degreeLevel}</label>
                <select
                  value={selectedDegree}
                  onChange={(e) => onDegreeChange(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white font-semibold text-slate-800"
                >
                  <option value="all">{t.feed.allDegrees}</option>
                  <option value="high_school">High School / Secondary</option>
                  <option value="bachelor">Bachelor's Degree</option>
                  <option value="master">Master's Degree</option>
                  <option value="phd">PhD / Doctorate</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">{t.feed.fundingType}</label>
                <select
                  value={selectedFunding}
                  onChange={(e) => onFundingChange(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white font-semibold text-slate-800"
                >
                  <option value="all">{t.feed.allFunding}</option>
                  <option value="fully_funded">🟢 Fully Funded</option>
                  <option value="paid">💼 Paid Position</option>
                  <option value="grant">💰 Grant Support</option>
                  <option value="partially_funded">🟡 Partial Waiver</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">{t.feed.region}</label>
                <select
                  value={selectedRegion}
                  onChange={(e) => onRegionChange(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white font-semibold text-slate-800"
                >
                  <option value="all">{t.feed.allRegions}</option>
                  <option value="Europe">Europe</option>
                  <option value="North America">North America</option>
                  <option value="Africa">Africa</option>
                  <option value="Middle East">Middle East</option>
                  <option value="Asia">Asia</option>
                </select>
              </div>

              <div className="flex flex-col justify-end">
                <button
                  type="button"
                  onClick={() => onMoiOnlyChange(!moiOnly)}
                  className={`w-full py-1.5 px-2.5 rounded-lg border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    moiOnly
                      ? 'bg-blue-50 text-blue-700 border-blue-400'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>{t.feed.moiAcceptedOnly}</span>
                  <CheckCircle2 className={`w-3.5 h-3.5 ${moiOnly ? 'text-blue-600' : 'text-slate-300'}`} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 5 Quick Category Buttons Grid (Scholarships, Internships, Conferences, Grants, More) */}
        <div className="grid grid-cols-5 gap-2 sm:gap-3 pt-1">
          {quickCategories.map((item) => {
            const isSelected = selectedCategory === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'more') {
                    setShowMoreCategories(!showMoreCategories);
                  } else {
                    onCategoryChange(item.id);
                  }
                }}
                className={`p-2 sm:p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-102'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200/80 shadow-xs'
                }`}
                id={`quick-cat-${item.id}`}
              >
                <div className={`p-2 rounded-xl ${isSelected ? 'bg-white/20 text-white' : 'bg-blue-100/70 text-blue-600'}`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[11px] sm:text-xs font-bold leading-tight truncate max-w-full text-center">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* More Categories Drawer */}
        {showMoreCategories && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 animate-in fade-in space-y-3 text-left">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">{t.feed.allCategories}</h3>
              <button onClick={() => setShowMoreCategories(false)} className="text-xs text-slate-500 font-bold hover:text-slate-800">
                {t.common.close} ✕
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {allCategoriesList.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onCategoryChange(cat.id);
                    setShowMoreCategories(false);
                  }}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="font-bold">{cat.label}</p>
                  <p className={`text-[10px] truncate ${selectedCategory === cat.id ? 'text-blue-100' : 'text-slate-500'}`}>{cat.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Top Categories Row with Pastel Pills & Counts */}
        <div className="space-y-2 pt-1 text-left">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black text-slate-700 uppercase tracking-wider">
              {t.feed.allCategories}
            </h2>
            <span className="text-[11px] font-semibold text-slate-400">
              {totalActiveCount}+ {t.hero.stats.verifiedOpps}
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {topCategoryPills.map((pill) => (
              <button
                key={pill.label}
                onClick={() => onCategoryChange(pill.id)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold flex items-center gap-1.5 whitespace-nowrap transition-transform active:scale-95 cursor-pointer shrink-0 ${pill.bg}`}
              >
                <span>{pill.label}</span>
                <span className="opacity-75 font-semibold text-[11px]">{pill.count}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
