import React, { useState, useEffect } from 'react';
import { Opportunity, UserProfile } from '../types';
import { api } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';
import { ApplyWithFursadModal } from './ApplyWithFursadModal';
import { 
  ShieldCheck, 
  Bookmark, 
  Share2, 
  ArrowLeft, 
  ExternalLink, 
  Building2, 
  Calendar, 
  MapPin, 
  Coins, 
  Plane, 
  Home, 
  BookOpen, 
  Languages, 
  CheckCircle2, 
  Sparkles, 
  Bot, 
  FileCheck2, 
  AlertTriangle, 
  Flag,
  Send,
  Loader2,
  Check,
  Award,
  Clock,
  Briefcase,
  HelpCircle,
  ChevronRight,
  MessageCircle,
  Bell
} from 'lucide-react';

interface OpportunityDetailViewProps {
  opportunity: Opportunity;
  onBack: () => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onTrackApplyClick: (id: string) => void;
  onAddToTracker: (opportunity: Opportunity) => void;
  onOpenReport: (opportunity: Opportunity) => void;
  onOpenAIWithContext?: (query: string) => void;
  userProfile: UserProfile;
}

export const OpportunityDetailView: React.FC<OpportunityDetailViewProps> = ({
  opportunity,
  onBack,
  isSaved,
  onToggleSave,
  onTrackApplyClick,
  onAddToTracker,
  onOpenReport,
  onOpenAIWithContext,
  userProfile
}) => {
  const { t, language, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'requirements' | 'sop_advisor'>('overview');
  const [sopDraft, setSopDraft] = useState<string>('');
  const [sopFeedback, setSopFeedback] = useState<any>(null);
  const [isEvaluatingSop, setIsEvaluatingSop] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [addedToTracker, setAddedToTracker] = useState<boolean>(false);
  const [isApplyFursadOpen, setIsApplyFursadOpen] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [opportunity.id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleRunSopReview = async () => {
    if (!sopDraft.trim()) return;
    setIsEvaluatingSop(true);
    try {
      const res = await api.reviewSOP(opportunity.id, sopDraft, userProfile);
      setSopFeedback(res.feedback);
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluatingSop(false);
    }
  };

  const handleTrackerClick = () => {
    onAddToTracker(opportunity);
    setAddedToTracker(true);
    setTimeout(() => setAddedToTracker(false), 2500);
  };

  // Helper calculation for days left
  const calculateDaysLeft = (deadlineStr: string) => {
    const deadline = new Date(deadlineStr);
    const now = new Date();
    const diff = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const daysLeft = calculateDaysLeft(opportunity.deadline);

  return (
    <div className="w-full max-w-[1600px] mx-auto px-3.5 sm:px-6 py-6 sm:py-8 space-y-6 animate-in fade-in duration-200" id="opportunity-detail-page-view">
      
      {/* Top Breadcrumb Bar with Back Button */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
          id="detail-back-button"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Opportunities</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-xs font-bold shadow-xs transition-all cursor-pointer"
            id="detail-share-btn"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Link Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share</span>
              </>
            )}
          </button>

          <button
            onClick={() => onToggleSave(opportunity.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer ${
              isSaved
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            id="detail-save-btn"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Main Opportunity Hero Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
        {/* Cover / Header section */}
        <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white relative">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Verified Official Program
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-500/30 text-blue-200 uppercase tracking-wider">
              {opportunity.category}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white">
              {opportunity.flag} {opportunity.country}
            </span>
            {opportunity.acceptsEnglishMoi && (
              <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-600 text-white">
                MOI Accepted (No IELTS)
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight mb-3">
            {opportunity.title}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed mb-6 font-medium">
            {opportunity.organization} • {opportunity.country}
          </p>

          {/* Quick Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10">
            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
              <div className="flex items-center gap-1.5 text-slate-300 text-xs font-semibold mb-1">
                <Coins className="w-3.5 h-3.5 text-blue-400" />
                <span>Funding Type</span>
              </div>
              <span className="font-extrabold text-white text-xs sm:text-sm capitalize">
                {opportunity.fundingType}
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
              <div className="flex items-center gap-1.5 text-slate-300 text-xs font-semibold mb-1">
                <Award className="w-3.5 h-3.5 text-cyan-400" />
                <span>Degree Level</span>
              </div>
              <span className="font-extrabold text-white text-xs sm:text-sm capitalize">
                {opportunity.degreeLevel || 'All Levels'}
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
              <div className="flex items-center gap-1.5 text-slate-300 text-xs font-semibold mb-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>Deadline</span>
              </div>
              <span className="font-extrabold text-white text-xs sm:text-sm">
                {new Date(opportunity.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
              <div className="flex items-center gap-1.5 text-slate-300 text-xs font-semibold mb-1">
                <Clock className="w-3.5 h-3.5 text-rose-400" />
                <span>Time Remaining</span>
              </div>
              <span className="font-extrabold text-blue-300 text-xs sm:text-sm">
                {daysLeft > 0 ? `${daysLeft} Days Left` : 'Closing Soon'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto">
            {/* 1. Official Portal Link */}
            <a
              href={opportunity.applicationUrl || opportunity.officialApplyUrl || opportunity.officialUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onTrackApplyClick(opportunity.id)}
              className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm shadow-md shadow-blue-600/20 inline-flex items-center gap-2 transition-all cursor-pointer"
              id="detail-apply-official-btn"
            >
              <span>Apply on Official Portal</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            {/* 2. Apply with Fursad Button (Requested Feature) */}
            <button
              type="button"
              onClick={() => setIsApplyFursadOpen(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-600/20 inline-flex items-center gap-2 transition-all cursor-pointer active:scale-98"
              id="detail-apply-with-fursad-btn"
            >
              <div className="w-5 h-5 rounded-lg overflow-hidden border border-white/20 bg-white p-0.5 shrink-0">
                <img src="/fursad-logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-md" />
              </div>
              <span>{language === 'so' ? 'Codso FURSAD Caawin (Apply with Fursad)' : 'Apply with Fursad'}</span>
            </button>

            {/* 3. Add to Tracker Pipeline */}
            <button
              onClick={handleTrackerClick}
              className={`px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm border transition-all cursor-pointer inline-flex items-center gap-2 ${
                addedToTracker
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-xs'
              }`}
              id="detail-add-tracker-btn"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{addedToTracker ? 'Added to Tracker' : 'Add to Application Pipeline'}</span>
            </button>
          </div>

          <button
            onClick={() => onOpenReport(opportunity)}
            className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Report Outdated Info</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-slate-200 px-6 bg-white flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Program Overview & Benefits
          </button>

          <button
            onClick={() => setActiveTab('requirements')}
            className={`py-3.5 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'requirements'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Eligibility & Required Documents
          </button>

          <button
            onClick={() => setActiveTab('sop_advisor')}
            className={`py-3.5 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'sop_advisor'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>AI SOP & Essay Reviewer</span>
          </button>
        </div>

        {/* Tab Content Section */}
        <div className="p-6 sm:p-8 space-y-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Detailed Description */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    {t.detail.aboutOpportunity}
                  </h3>
                  {opportunity.country === 'France' && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-black">
                      <Bell className="w-3 h-3" />
                      <span>FRANCE ALARM</span>
                    </div>
                  )}
                </div>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal">
                  {opportunity.description}
                </p>
              </div>

              {/* Financial Benefits Checklist */}
              {opportunity.financialBenefits && opportunity.financialBenefits.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                    <Coins className="w-5 h-5 text-blue-500" />
                    <span>Coverage & Financial Benefits</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {opportunity.financialBenefits.map((benefit, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm font-semibold text-emerald-950">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Apply with Fursad Service Highlight Card */}
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 uppercase tracking-wider">
                      <div className="w-3.5 h-3.5 rounded-sm overflow-hidden border border-emerald-400/30 bg-white p-0.5">
                        <img src="/fursad-logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-[1px]" />
                      </div>
                      <span>{language === 'so' ? 'Adeegga Caawinta Codsiga' : 'Direct Application Support'}</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-white">
                      {language === 'so' ? 'Ma doonaysaa in FURSAD kugu caawiso codsigan?' : 'Need 1-on-1 Assistance to Apply for This?'}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsApplyFursadOpen(true)}
                    className="px-5 py-3 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] active:scale-98 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition-all cursor-pointer shrink-0"
                    id="overview-apply-fursad-cta-btn"
                  >
                    <MessageCircle className="w-4 h-4 fill-slate-950 text-[#25D366]" />
                    <span>{language === 'so' ? 'Apply with Fursad (WhatsApp)' : 'Apply with Fursad'}</span>
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-medium">
                  {language === 'so'
                    ? 'Khubarada aqoonta iyo waxbarashada ee FURSAD waxay kugu caawinayaan qorista SOP-ga, hubinta dukumentiyada, diyaarinta CV-ga heerka caalamiga ah, iyo buuxinta tooska ah ee bogga rasmiga ah.'
                    : 'Get dedicated admissions guidance: Statement of Purpose drafting, academic credential evaluation, CV tailoring, and direct portal submission.'}
                </p>
              </div>

              {/* Verified Host Institution Info */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  Official Host & Verification Details
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  <strong>Organization:</strong> {opportunity.organization} ({opportunity.country})<br />
                  <strong>Application Route:</strong> 100% Direct Official Portal. No intermediate agent fees are required for this verified posting.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'requirements' && (
            <div className="space-y-8">
              {/* Eligibility Criteria */}
              {opportunity.eligibility && (
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                    <span>Eligibility Criteria</span>
                  </h3>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed space-y-2">
                    {Array.isArray(opportunity.eligibility) ? (
                      <ul className="space-y-1.5 list-disc list-inside">
                        {opportunity.eligibility.map((crit, idx) => (
                          <li key={idx} className="text-slate-800 font-medium">{crit}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>{opportunity.eligibility}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Required Documents Checklist */}
              {opportunity.requiredDocuments && opportunity.requiredDocuments.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                    <FileCheck2 className="w-5 h-5 text-blue-600" />
                    <span>Required Application Documents Checklist</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {opportunity.requiredDocuments.map((doc, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {idx + 1}
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-slate-800">
                          {doc}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Language / MOI Guidance Box */}
              <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                  <Languages className="w-4 h-4 text-blue-700" />
                  Language & English MOI Status
                </h4>
                <p className="text-xs sm:text-sm text-blue-900 leading-relaxed font-medium">
                  {opportunity.acceptsEnglishMoi
                    ? '✅ This program accepts an English Medium of Instruction (MOI) certificate from your previous university in place of IELTS/TOEFL!'
                    : 'ℹ️ Standard language certification (IELTS / TOEFL / Duolingo / Host Language) is recommended or required by the institution.'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'sop_advisor' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
                <div className="flex items-center gap-2 text-purple-900 font-extrabold text-sm">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>AI Application Essay & SOP Advisor</span>
                </div>
                <p className="text-xs text-purple-800 leading-relaxed">
                  Paste your draft Statement of Purpose (SOP) or Motivation Letter below. FURSAD AI will evaluate your fit against <strong>{opportunity.title}</strong>, pinpoint missing academic achievements, and provide specific improvement prompts.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Your Draft SOP / Motivation Letter:
                </label>
                <textarea
                  value={sopDraft}
                  onChange={(e) => setSopDraft(e.target.value)}
                  placeholder="Paste your motivation letter, research proposal outline, or personal statement here..."
                  rows={6}
                  className="w-full p-4 rounded-2xl border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50"
                  id="sop-draft-textarea"
                />
              </div>

              <button
                onClick={handleRunSopReview}
                disabled={!sopDraft.trim() || isEvaluatingSop}
                className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-blue-600/20 disabled:opacity-40 transition-all cursor-pointer flex items-center gap-2"
                id="evaluate-sop-btn"
              >
                {isEvaluatingSop ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Evaluating Against Requirements...</span>
                  </>
                ) : (
                  <>
                    <Bot className="w-4 h-4" />
                    <span>Run AI Essay Evaluation</span>
                  </>
                )}
              </button>

              {/* SOP Evaluation Feedback Results */}
              {sopFeedback && (
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-md space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                      AI Feedback Analysis
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                      Score: {sopFeedback.score || 85}/100
                    </span>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                      {sopFeedback.summary || 'Your draft demonstrates strong academic intent and alignment with the program objectives.'}
                    </p>

                    {sopFeedback.strengths && (
                      <div className="space-y-1">
                        <strong className="text-xs text-emerald-700 font-bold block">Key Strengths:</strong>
                        <ul className="text-xs text-slate-600 list-disc list-inside space-y-0.5">
                          {sopFeedback.strengths.map((s: string, i: number) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {sopFeedback.recommendations && (
                      <div className="space-y-1">
                        <strong className="text-xs text-blue-700 font-bold block">Suggested Enhancements:</strong>
                        <ul className="text-xs text-slate-600 list-disc list-inside space-y-0.5">
                          {sopFeedback.recommendations.map((r: string, i: number) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Apply with FURSAD Service Page Modal */}
      <ApplyWithFursadModal
        opportunity={opportunity}
        isOpen={isApplyFursadOpen}
        onClose={() => setIsApplyFursadOpen(false)}
        userProfile={userProfile}
        onTrackApplyClick={onTrackApplyClick}
      />

    </div>
  );
};
