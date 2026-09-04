import React, { useState, useEffect } from 'react';
import { UserProfile, Opportunity } from '../types';
import { api } from '../services/api';
import { OpportunityCard } from './OpportunityCard';
import { 
  Sparkles, 
  Bot, 
  CheckCircle2, 
  Sliders, 
  ArrowRight, 
  Loader2, 
  GraduationCap, 
  Languages, 
  Globe2, 
  ShieldCheck,
  UserCheck
} from 'lucide-react';

interface AIMatchingEngineViewProps {
  userProfile: UserProfile;
  onOpenProfile: () => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onViewDetails: (opportunity: Opportunity) => void;
  onTrackApplyClick: (id: string) => void;
}

export const AIMatchingEngineView: React.FC<AIMatchingEngineViewProps> = ({
  userProfile,
  onOpenProfile,
  savedIds,
  onToggleSave,
  onViewDetails,
  onTrackApplyClick
}) => {
  const [matchedOpportunities, setMatchedOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadMatches() {
      setIsLoading(true);
      try {
        const res = await api.matchProfileAI(userProfile);
        setMatchedOpportunities(res.topMatches);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    loadMatches();
  }, [userProfile]);

  return (
    <div className="w-full max-w-5xl mx-auto px-3.5 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8" id="ai-matching-view">
      
      {/* Top Banner */}
      <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-purple-900 via-slate-900 to-blue-900 text-white shadow-xl space-y-5 sm:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-blue-300 text-xs font-black uppercase tracking-wider border border-white/20">
              <Sparkles className="w-3.5 h-3.5" />
              Automated AI Opportunity Matching
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Personalized Opportunity Matches
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              We scored verified opportunities against your academic qualifications, MOI English exemption, and preferred target destinations.
            </p>
          </div>

          <button
            onClick={onOpenProfile}
            className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shrink-0"
          >
            <Sliders className="w-4 h-4" />
            <span>Edit Matching Preferences</span>
          </button>
        </div>

        {/* Profile Strength & Match Criteria Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-300 font-semibold block">Education & Field</span>
              <strong className="text-sm font-bold text-white truncate max-w-[200px] block">
                {userProfile.fieldOfStudy}
              </strong>
            </div>
            <GraduationCap className="w-6 h-6 text-purple-300" />
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-300 font-semibold block">English Proficiency</span>
              <strong className="text-sm font-bold text-emerald-300 block">
                {userProfile.hasMoiCertificate ? 'MOI Certificate (No IELTS)' : 'Standard IELTS'}
              </strong>
            </div>
            <Languages className="w-6 h-6 text-emerald-300" />
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-300 font-semibold block">Target Destinations</span>
              <strong className="text-sm font-bold text-cyan-300 block truncate max-w-[200px]">
                {userProfile.preferredCountries.slice(0, 3).join(', ')}...
              </strong>
            </div>
            <Globe2 className="w-6 h-6 text-cyan-300" />
          </div>
        </div>
      </div>

      {/* Matching Results Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span>High-Probability Match Results</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
              {matchedOpportunities.length} Verified Records
            </span>
          </h2>
        </div>

        {isLoading ? (
          <div className="p-16 text-center space-y-3 bg-white rounded-2xl border border-slate-200">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto" />
            <p className="text-sm font-bold text-slate-700">Evaluating opportunities against your profile credentials...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchedOpportunities.map((opp) => (
              <div key={opp.id} className="flex flex-col">
                <OpportunityCard
                  opportunity={opp}
                  isSaved={savedIds.includes(opp.id)}
                  onToggleSave={onToggleSave}
                  onViewDetails={onViewDetails}
                  onTrackApplyClick={onTrackApplyClick}
                />
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
