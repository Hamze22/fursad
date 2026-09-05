import React, { useState } from 'react';
import { CountryStat, Region } from '../types';
import { Globe2, ArrowRight, ShieldCheck, Sparkles, MapPin, Search, Users } from 'lucide-react';
import { GlobalScholarsGlobe } from './GlobalScholarsGlobe';

interface WorldMapSectionProps {
  countries: CountryStat[];
  onSelectCountry: (country: CountryStat) => void;
}

export const WorldMapSection: React.FC<WorldMapSectionProps> = ({
  countries,
  onSelectCountry
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const regions = ['All', 'Europe', 'North America', 'Africa', 'Middle East', 'Global'];

  const filteredCountries = countries.filter(c => {
    const matchRegion = selectedRegion === 'All' || c.region === selectedRegion || (selectedRegion === 'Global' && c.region === 'Global');
    const matchSearch = c.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchRegion && matchSearch;
  });

  return (
    <section className="py-8 sm:py-14 bg-white border-b border-slate-200/80" id="world-explore-section">
      <div className="w-full mx-auto px-3 sm:px-6 space-y-6 sm:space-y-8">
        
        {/* Section Header with 3D Globe & Scholars Located */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-2xl sm:rounded-3xl p-5 sm:p-10 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
          <div className="space-y-4 max-w-xl text-left z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-extrabold uppercase tracking-wider border border-blue-400/30">
              <Globe2 className="w-3.5 h-3.5" />
              Global Scholars Network
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Explore 150+ Countries with Located Scholars
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Real-time interactive globe mapping fully funded scholarships, research fellowships, and youth leadership conferences across Europe, North America, Middle East, Asia, and Africa.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-2">
                <span className="w-7 h-7 rounded-full bg-blue-600 border-2 border-slate-900 flex items-center justify-center text-xs">🇬🇧</span>
                <span className="w-7 h-7 rounded-full bg-emerald-600 border-2 border-slate-900 flex items-center justify-center text-xs">🇩🇪</span>
                <span className="w-7 h-7 rounded-full bg-amber-600 border-2 border-slate-900 flex items-center justify-center text-xs">🇨🇦</span>
                <span className="w-7 h-7 rounded-full bg-purple-600 border-2 border-slate-900 flex items-center justify-center text-xs">🇸🇴</span>
              </div>
              <span className="text-xs text-blue-200 font-bold">12,400+ active scholars tracked globally</span>
            </div>
          </div>

          {/* Interactive 3D Blue Earth Globe with Located Scholars */}
          <div className="z-10 shrink-0 py-2">
            <GlobalScholarsGlobe size="lg" />
          </div>
        </div>

        {/* Global Statistics Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 max-w-6xl mx-auto text-center">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-2xl sm:text-3xl font-black text-blue-600 block">150+</span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Countries Represented</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-2xl sm:text-3xl font-black text-blue-700 block">3,400+</span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fully Funded Awards</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 block">Hargeisa</span>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Somaliland Hub Capital</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-2xl sm:text-3xl font-black text-blue-600 block">100%</span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Verified Official Portals</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-2xl sm:text-3xl font-black text-blue-600 block">Free</span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">MOI Guidance & Checklists</span>
          </div>
        </div>

        {/* Filters & Country Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-5xl mx-auto pt-2">
          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {regions.map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedRegion === reg
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destination country..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Dynamic Country Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 max-w-7xl mx-auto">
          {filteredCountries.map((stat) => (
            <div
              key={stat.code}
              onClick={() => onSelectCountry(stat)}
              className="group p-5 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4"
              id={`country-card-${stat.code}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{stat.flag}</span>
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900 group-hover:text-purple-700 transition-colors">
                      {stat.country}
                    </h4>
                    <span className="text-[11px] font-semibold text-slate-500">{stat.region}</span>
                  </div>
                </div>
                <span className="text-xs font-black px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  {stat.code}
                </span>
              </div>

              {/* Dynamic stats */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span className="text-slate-500">Active Opportunities:</span>
                  <span className="text-purple-700 font-extrabold">{stat.opportunityCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between font-semibold text-slate-600">
                  <span className="text-slate-400">Fully Funded:</span>
                  <span className="text-emerald-700 font-bold">{stat.fullyFundedCount.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs font-bold text-purple-700 group-hover:translate-x-0.5 transition-transform">
                <span>View Country Hub</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
