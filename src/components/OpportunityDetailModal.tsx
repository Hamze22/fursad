import React, { useState } from 'react';
import { Opportunity, UserProfile } from '../types';
import { api } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';
import { ApplyWithFursadModal } from './ApplyWithFursadModal';
import { 
  ShieldCheck, 
  Bookmark, 
  Share2, 
  X, 
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
  MessageCircle
} from 'lucide-react';

interface OpportunityDetailModalProps {
  opportunity: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onTrackApplyClick: (id: string) => void;
  onAddToTracker: (opportunity: Opportunity) => void;
  onOpenReport: (opportunity: Opportunity) => void;
  userProfile: UserProfile;
}

export const OpportunityDetailModal: React.FC<OpportunityDetailModalProps> = ({
  opportunity,
  isOpen,
  onClose,
  isSaved,
  onToggleSave,
  onTrackApplyClick,
  onAddToTracker,
  onOpenReport,
  userProfile
}) => {
  const { language, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'sop_advisor'>('overview');
  const [sopDraft, setSopDraft] = useState<string>('');
  const [sopFeedback, setSopFeedback] = useState<any>(null);
  const [isEvaluatingSop, setIsEvaluatingSop] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [addedToTracker, setAddedToTracker] = useState<boolean>(false);
  const [isApplyFursadOpen, setIsApplyFursadOpen] = useState<boolean>(false);

  if (!isOpen || !opportunity) return null;

  // Format date display (e.g. 31 Dec 2025 or 2026-10-31)
  const formatDeadline = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString(isRTL ? 'ar-EG' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      }
    } catch {
      // fallback
    }
    return dateStr;
  };

  const getWhatsAppUrl = () => {
    if (!opportunity) return '#';
    const greetings = language === 'so'
      ? `Asc Team FURSAD! Waxaan doonayaa in laygala caawiyo codsiga fursaddan:`
      : language === 'ar'
      ? `مرحباً فريق فرصة! أود المساعدة في التقديم على هذه الفرصة:`
      : language === 'fr'
      ? `Bonjour l'équipe FURSAD ! Je souhaite de l'aide pour postuler à cette opportunité :`
      : `Hello FURSAD Team! I would like assistance applying for this opportunity:`;

    const details = `\n\n📌 *${opportunity.title}*\n🏛️ *Organization:* ${opportunity.organization} (${opportunity.country})\n💰 *Funding:* ${opportunity.fundingType === 'fully_funded' ? 'Fully Funded' : opportunity.fundingType}\n⏳ *Deadline:* ${opportunity.deadline}\n🔗 *Portal:* ${opportunity.applicationUrl || window.location.href}\n\n${
      language === 'so'
        ? 'Fadlan ila wadaaga tallaabooyinka diiwaangelinta iyo adeegga caawinta. Mahadsanidiin!'
        : 'Please guide me through the application assistance process. Thank you!'
    }`;

    return `https://api.whatsapp.com/send?text=${encodeURIComponent(greetings + details)}`;
  };

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in" id="opp-detail-modal">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-6 pb-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              🟢 Verified Opportunity
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 capitalize">
              {opportunity.category}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-800">
              {opportunity.flag} {opportunity.country}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
              title="Share Link"
              id="detail-share-btn"
            >
              {copiedLink ? <Check className="w-5 h-5 text-emerald-600" /> : <Share2 className="w-5 h-5" />}
            </button>

            <button
              onClick={() => onToggleSave(opportunity.id)}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isSaved ? 'text-purple-600 bg-purple-100' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'
              }`}
              title={isSaved ? 'Saved' : 'Save'}
              id="detail-save-btn"
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              id="detail-close-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab switcher: Overview vs AI SOP Advisor */}
        <div className="flex border-b border-slate-200 bg-white px-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
            id="tab-overview"
          >
            Overview & Eligibility
          </button>
          <button
            onClick={() => setActiveTab('sop_advisor')}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'sop_advisor'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
            id="tab-sop-advisor"
          >
            <Bot className="w-4 h-4 text-purple-600" />
            <span>AI Motivation Letter Advisor</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 font-bold">
              AI Tool
            </span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 text-slate-800 space-y-6">
          {activeTab === 'overview' ? (
            <>
              {/* Title & Organization Header */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <Building2 className="w-4 h-4 text-purple-600" />
                  <span>{opportunity.organization}</span>
                  {opportunity.city && <span>• {opportunity.city}</span>}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  {opportunity.title}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {opportunity.description}
                </p>
              </div>

              {/* WhatsApp Apply with FURSAD Team Callout */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/70 border border-emerald-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <MessageCircle className="w-5 h-5 fill-white text-emerald-700" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs sm:text-sm font-black text-emerald-950">
                        {language === 'so' ? 'Ka Codso Kooxda FURSAD (WhatsApp)' : language === 'ar' ? 'التقديم عبر فريق فرصة (واتساب)' : 'Apply with FURSAD Team'}
                      </h4>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white uppercase tracking-wider">
                        Direct Assistance
                      </span>
                    </div>
                    <p className="text-xs text-emerald-800 font-medium leading-relaxed">
                      {language === 'so' 
                        ? 'Ma u baahan tahay in lagugu caawiyo buuxinta foomka, diyaarinta SOP/CV, iyo gudbinta rasmiga ah? Kooxda FURSAD WhatsApp toos ugala xiriir.' 
                        : 'Need end-to-end guidance with your documents, motivation letter, and submission? Get 1-on-1 WhatsApp assistance.'}
                    </p>
                  </div>
                </div>
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onTrackApplyClick(opportunity.id)}
                  className="w-full sm:w-auto shrink-0 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                  id="apply-whatsapp-banner-btn"
                >
                  <MessageCircle className="w-4 h-4 fill-slate-950 text-[#25D366]" />
                  <span>{language === 'so' ? 'Kula Xiriir WhatsApp' : 'Apply via WhatsApp'}</span>
                </a>
              </div>

              {/* Source Transparency Box (Mandatory Trust & Verification) */}
              <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                    Source Verification Protocol
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    Last Verified: {opportunity.lastVerified}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Official Source Organization</span>
                    <span className="text-slate-200 font-semibold">{opportunity.sourceName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Official Application Portal</span>
                    <a 
                      href={opportunity.applicationUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-cyan-300 hover:text-cyan-200 underline font-semibold truncate block"
                    >
                      {opportunity.applicationUrl}
                    </a>
                  </div>
                </div>
              </div>

              {/* Financial & Benefits Grid */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Funding & Support Package
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-purple-50 border border-purple-100 space-y-1">
                    <span className="text-xs text-purple-700 font-bold flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5" /> Tuition
                    </span>
                    <p className="text-xs font-extrabold text-slate-900">{opportunity.tuitionCoverage}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 space-y-1">
                    <span className="text-xs text-blue-700 font-bold flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5" /> Monthly Stipend
                    </span>
                    <p className="text-xs font-extrabold text-slate-900">{opportunity.stipend}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-cyan-50 border border-cyan-100 space-y-1">
                    <span className="text-xs text-cyan-700 font-bold flex items-center gap-1">
                      <Plane className="w-3.5 h-3.5" /> Airfare / Travel
                    </span>
                    <p className="text-xs font-extrabold text-slate-900">{opportunity.travelSupport}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 space-y-1">
                    <span className="text-xs text-blue-700 font-bold flex items-center gap-1">
                      <Home className="w-3.5 h-3.5" /> Housing
                    </span>
                    <p className="text-xs font-extrabold text-slate-900">{opportunity.accommodation}</p>
                  </div>
                </div>
              </div>

              {/* Language & MOI Policy */}
              <div className="p-4 rounded-xl bg-purple-50/80 border border-purple-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                    <Languages className="w-4 h-4 text-purple-700" />
                    English Language Requirements & MOI Acceptance
                  </span>
                  {opportunity.moiAccepted ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-300">
                      MOI ACCEPTED (NO IELTS)
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
                      Exam Required
                    </span>
                  )}
                </div>
                <p className="text-xs text-purple-950 font-medium leading-relaxed">
                  {opportunity.languageDetails}
                </p>
              </div>

              {/* Eligibility Requirements */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Eligibility Criteria
                </h4>
                <div className="space-y-2">
                  {opportunity.eligibility.map((criterion, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs font-medium text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{criterion}</span>
                    </div>
                  ))}
                  {opportunity.ageRequirement && (
                    <div className="flex items-start gap-2 text-xs font-medium text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Age Requirement:</strong> {opportunity.ageRequirement}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Important Timeline */}
              <div className="p-3.5 rounded-xl bg-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-700 font-bold">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>Applications Open:</span>
                    <strong className="text-blue-700 font-extrabold text-sm">{opportunity.openingDate ? formatDeadline(opportunity.openingDate) : 'Now Open'}</strong>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 font-bold">
                    <Calendar className="w-4 h-4 text-rose-600" />
                    <span>Official Application Deadline:</span>
                    <strong className="text-rose-700 font-extrabold text-sm">{formatDeadline(opportunity.deadline)}</strong>
                  </div>
                </div>
                {opportunity.startDate && (
                  <div className="p-2 rounded-lg bg-white border border-slate-200">
                    <span className="text-slate-500 font-bold">Program Starts: {opportunity.startDate}</span>
                  </div>
                )}
              </div>

              {/* Anti-Scam Notice & Report button */}
              <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                <p className="text-[11px] leading-tight text-slate-400">
                  🛡️ <strong>Safety Guarantee:</strong> Always apply through the official organization application link. FURSAD does not charge application fees or guarantee admission.
                </p>
                <button
                  onClick={() => onOpenReport(opportunity)}
                  className="text-slate-400 hover:text-rose-600 flex items-center gap-1 text-[11px] font-bold cursor-pointer shrink-0 ml-2"
                  id="report-opp-btn"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>Report</span>
                </button>
              </div>
            </>
          ) : (
            /* AI Statement of Purpose Review Tab */
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 via-blue-50 to-cyan-50 border border-purple-200 text-slate-900 space-y-2">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-purple-600" />
                  <h3 className="text-sm font-extrabold text-slate-900">
                    FURSAD AI — Statement of Purpose & Motivation Essay Evaluator
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Paste your draft Motivation Letter or SOP for <strong>{opportunity.title}</strong>. Our AI admissions evaluator will analyze your strengths, highlight missed criteria, and suggest a powerful hook tailored to this specific program.
                </p>
              </div>

              {/* Input Draft Textarea */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Your Draft Motivation Letter / Personal Statement:
                </label>
                <textarea
                  rows={6}
                  value={sopDraft}
                  onChange={(e) => setSopDraft(e.target.value)}
                  placeholder="Paste your draft paragraphs here... (e.g. My background in engineering and community leadership makes me an ideal candidate for DAAD...)"
                  className="w-full p-3.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-slate-50 focus:bg-white leading-relaxed"
                />
              </div>

              {/* Action button */}
              <button
                type="button"
                onClick={handleRunSopReview}
                disabled={isEvaluatingSop || !sopDraft.trim()}
                className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-purple-600/20 transition-all cursor-pointer"
                id="run-sop-review-btn"
              >
                {isEvaluatingSop ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Evaluating Against Scholarship Criteria...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-blue-300" />
                    <span>Evaluate My Motivation Draft with FURSAD AI</span>
                  </>
                )}
              </button>

              {/* AI Feedback Output */}
              {sopFeedback && (
                <div className="p-4 rounded-2xl bg-white border border-purple-200 shadow-md space-y-4 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-500">Admissions Committee Score</span>
                    <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                      {sopFeedback.overallRating || 'Competitive (8.5/10)'}
                    </span>
                  </div>

                  {/* Strengths */}
                  <div className="space-y-1.5">
                    <h5 className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">
                      ✓ Key Strengths Identified
                    </h5>
                    <ul className="space-y-1 text-xs text-slate-700">
                      {sopFeedback.strengths?.map((s: string, i: number) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actionable Improvements */}
                  <div className="space-y-1.5">
                    <h5 className="text-xs font-extrabold text-blue-700 uppercase tracking-wider">
                      ⚡ Actionable Improvements for Higher Acceptance
                    </h5>
                    <ul className="space-y-1 text-xs text-slate-700">
                      {sopFeedback.areasForImprovement?.map((imp: string, i: number) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Suggested Hook */}
                  {sopFeedback.suggestedHook && (
                    <div className="p-3 rounded-xl bg-purple-50 border border-purple-100 space-y-1">
                      <span className="text-[11px] font-bold text-purple-900 uppercase">
                        Suggested Opening Hook:
                      </span>
                      <p className="text-xs italic text-slate-800 leading-relaxed">
                        {sopFeedback.suggestedHook}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={handleTrackerClick}
            className={`w-full sm:w-auto px-4 py-2.5 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              addedToTracker
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
            id="add-to-tracker-btn"
          >
            {addedToTracker ? <Check className="w-4 h-4 text-emerald-600" /> : <FileCheck2 className="w-4 h-4 text-blue-600" />}
            <span>{addedToTracker ? 'Added to Tracker!' : 'Track Application'}</span>
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            {/* 1. Apply with Fursad Assistance Modal Trigger (Requested Feature) */}
            <button
              type="button"
              onClick={() => setIsApplyFursadOpen(true)}
              className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 active:scale-98 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
              id="apply-with-fursad-modal-trigger-btn"
            >
              <div className="w-4 h-4 rounded-md overflow-hidden bg-white p-0.5 border border-white/20 shrink-0">
                <img src="/fursad-logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-sm" />
              </div>
              <span>{language === 'so' ? 'Codso FURSAD Caawin (Apply with Fursad)' : 'Apply with Fursad'}</span>
            </button>

            {/* 2. Direct Official Portal */}
            <a
              href={opportunity.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onTrackApplyClick(opportunity.id)}
              className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              id="official-apply-modal-btn"
            >
              <span>Official Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>

      {/* Apply with FURSAD Dedicated Service Modal */}
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
