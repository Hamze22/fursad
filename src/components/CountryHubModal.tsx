import React from 'react';
import { CountryStat, Opportunity } from '../types';
import { OpportunityCard } from './OpportunityCard';
import { 
  Globe2, 
  ShieldCheck, 
  MapPin, 
  FileText, 
  GraduationCap, 
  Coins, 
  X, 
  Plane, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';

interface CountryHubModalProps {
  countryStat: CountryStat | null;
  opportunities: Opportunity[];
  isOpen: boolean;
  onClose: () => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onViewDetails: (opportunity: Opportunity) => void;
  onTrackApplyClick: (id: string) => void;
}

export const CountryHubModal: React.FC<CountryHubModalProps> = ({
  countryStat,
  opportunities,
  isOpen,
  onClose,
  savedIds,
  onToggleSave,
  onViewDetails,
  onTrackApplyClick
}) => {
  if (!isOpen || !countryStat) return null;

  // Filter opportunities for this specific country
  const countryOpps = opportunities.filter(o => 
    o.country.toLowerCase().includes(countryStat.country.toLowerCase()) ||
    (countryStat.country.includes('Europe') && o.region === 'Europe') ||
    (countryStat.country.includes('Pan-African') && (o.region === 'Africa' || o.region === 'Global'))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in" id="country-hub-modal">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto">
        
        {/* Header Bar */}
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-purple-900 via-slate-900 to-blue-900 text-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-4xl sm:text-5xl">{countryStat.flag}</span>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase px-2 py-0.5 rounded bg-white/20 text-purple-200">
                  {countryStat.region}
                </span>
                <span className="text-xs text-slate-300 font-semibold">
                  Country Code: {countryStat.code}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {countryStat.country} Opportunities Hub
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            id="country-hub-close-btn"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-800 space-y-6">
          
          {/* Key Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-100 text-center">
              <span className="text-xl sm:text-2xl font-black text-purple-700 block">
                {countryStat.opportunityCount.toLocaleString()}
              </span>
              <span className="text-[11px] font-bold text-slate-600 uppercase">Active Records</span>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
              <span className="text-xl sm:text-2xl font-black text-emerald-700 block">
                {countryStat.fullyFundedCount.toLocaleString()}
              </span>
              <span className="text-[11px] font-bold text-slate-600 uppercase">Fully Funded</span>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100 text-center">
              <span className="text-xl sm:text-2xl font-black text-blue-700 block">100%</span>
              <span className="text-[11px] font-bold text-slate-600 uppercase">Verified Sources</span>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100 text-center">
              <span className="text-xl sm:text-2xl font-black text-blue-700 block">MOI</span>
              <span className="text-[11px] font-bold text-slate-600 uppercase">Exemption Accepted</span>
            </div>
          </div>

          {/* Consular Visa Guidance & Study Permit Protocol */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-black uppercase tracking-wider">
              <Plane className="w-4 h-4" />
              <span>Official Consular Visa & Mobility Protocol</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              {countryStat.visaGuide}
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px]">
              <span className="px-2.5 py-1 rounded-lg bg-white/10 text-slate-200 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                University Medium of Instruction (MOI) Valid
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 text-slate-200 flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                Official Embassy Acceptance Letter Required
              </span>
            </div>
          </div>

          {/* Top Flagship Scholarships for this Country */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Top Flagship Programs in {countryStat.country}
            </h4>
            <div className="flex flex-wrap gap-2">
              {countryStat.topScholarships.map((sch, i) => (
                <span 
                  key={i} 
                  className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-800 text-xs font-extrabold border border-purple-200 flex items-center gap-1.5"
                >
                  <GraduationCap className="w-4 h-4 text-purple-600" />
                  {sch}
                </span>
              ))}
            </div>
          </div>

          {/* Active Opportunities list */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-base font-extrabold text-slate-900">
                Verified Opportunities ({countryOpps.length})
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                Showing official records
              </span>
            </div>

            {countryOpps.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {countryOpps.map((opp) => (
                  <OpportunityCard
                    key={opp.id}
                    opportunity={opp}
                    isSaved={savedIds.includes(opp.id)}
                    onToggleSave={onToggleSave}
                    onViewDetails={onViewDetails}
                    onTrackApplyClick={onTrackApplyClick}
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-sm">
                No active deadline listings currently in this category. Check back during the upcoming sync cycle!
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close Country Hub
          </button>
        </div>

      </div>
    </div>
  );
};
