import React from 'react';
import { Opportunity } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { 
  Bookmark, 
  MapPin, 
  Clock, 
  Sparkles
} from 'lucide-react';

interface OpportunityCardProps {
  opportunity: Opportunity;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onViewDetails: (opportunity: Opportunity) => void;
  onTrackApplyClick: (id: string) => void;
  onAddToTracker?: (opportunity: Opportunity) => void;
  layoutMode?: 'horizontal' | 'grid';
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  isSaved,
  onToggleSave,
  onViewDetails,
}) => {
  const { t, isRTL } = useLanguage();

  // Category tags styling matching the mockup
  const getCategoryTag = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'scholarship':
        return { text: t.hero.categories.scholarships, style: 'bg-blue-600 text-white' };
      case 'internship':
        return { text: t.hero.categories.internships, style: 'bg-sky-600 text-white' };
      case 'grant':
        return { text: t.hero.categories.grants, style: 'bg-emerald-600 text-white' };
      case 'conference':
        return { text: t.hero.categories.conferences, style: 'bg-purple-600 text-white' };
      case 'fellowship':
        return { text: t.hero.categories.fellowships, style: 'bg-indigo-600 text-white' };
      case 'volunteer':
        return { text: t.hero.categories.volunteering, style: 'bg-blue-600 text-white' };
      default:
        return { text: cat.toUpperCase(), style: 'bg-slate-800 text-white' };
    }
  };

  // Funding badge styling matching the mockup pills
  const getFundingBadge = () => {
    if (opportunity.fundingType === 'fully_funded') {
      return { label: t.card.fullyFunded, style: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 font-bold' };
    }
    if (opportunity.fundingType === 'paid') {
      return { label: t.card.paid, style: 'bg-blue-50 text-blue-800 border-blue-200/80 font-bold' };
    }
    if (opportunity.fundingAmount && (opportunity.fundingAmount.includes('€') || opportunity.fundingAmount.includes('$'))) {
      return { label: opportunity.fundingAmount.split(',')[0], style: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 font-bold' };
    }
    if (opportunity.category === 'volunteer' || opportunity.category === 'internship') {
      return { label: t.card.paid, style: 'bg-blue-50 text-blue-800 border-blue-200/80 font-bold' };
    }
    return { label: t.card.fullyFunded, style: 'bg-blue-50 text-blue-700 border-blue-200/80 font-bold' };
  };

  // Curated high quality thumbnail images
  const getThumbnail = () => {
    if (opportunity.imageUrl) return opportunity.imageUrl;
    
    const titleLower = opportunity.title.toLowerCase();
    const orgLower = opportunity.organization.toLowerCase();
    const idLower = opportunity.id.toLowerCase();

    // Specific famous opportunities
    if (idLower.includes('cern') || titleLower.includes('cern')) {
      return "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=400&auto=format&fit=crop&q=80";
    }
    if (idLower.includes('oxford') || titleLower.includes('oxford')) {
      return "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&auto=format&fit=crop&q=80";
    }
    if (idLower.includes('chevening') || titleLower.includes('chevening')) {
      return "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&auto=format&fit=crop&q=80";
    }
    if (idLower.includes('daad') || titleLower.includes('daad')) {
      return "https://images.unsplash.com/photo-1527866959252-deab85ef7d1b?w=400&auto=format&fit=crop&q=80";
    }
    if (idLower.includes('un-') || titleLower.includes('volunteer') || orgLower.includes('united nations') || titleLower.includes('un ')) {
      return "https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=400&auto=format&fit=crop&q=80";
    }
    if (idLower.includes('turkiye') || titleLower.includes('turkey') || titleLower.includes('türkiye')) {
      return "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&auto=format&fit=crop&q=80";
    }
    if (idLower.includes('mext') || titleLower.includes('japan')) {
      return "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&auto=format&fit=crop&q=80";
    }
    if (idLower.includes('climate') || titleLower.includes('grant') || titleLower.includes('innovation')) {
      return "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&auto=format&fit=crop&q=80";
    }

    // By category
    if (opportunity.category === 'scholarship') {
      return "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&auto=format&fit=crop&q=80";
    }
    if (opportunity.category === 'internship') {
      return "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&auto=format&fit=crop&q=80";
    }
    if (opportunity.category === 'grant') {
      return "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=400&auto=format&fit=crop&q=80";
    }
    if (opportunity.category === 'conference') {
      return "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&auto=format&fit=crop&q=80";
    }
    return "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&auto=format&fit=crop&q=80";
  };

  const tag = getCategoryTag(opportunity.category);
  const funding = getFundingBadge();
  const thumbUrl = getThumbnail();

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

  // Determine if it is currently open
  const isCurrentlyOpen = () => {
    if (!opportunity.openingDate) return true;
    const now = new Date();
    const open = new Date(opportunity.openingDate);
    return now >= open;
  };

  const isOpen = isCurrentlyOpen();

  return (
    <div 
      className={`group bg-white rounded-2xl border ${!isOpen ? 'border-amber-200 bg-amber-50/10' : 'border-slate-200/90'} hover:border-blue-400 p-3 sm:p-4 transition-colors duration-150 hover:shadow-md relative overflow-hidden flex flex-row lg:flex-col gap-3 sm:gap-4 lg:gap-3 items-start select-none`}
      id={`opp-card-${opportunity.id}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Left Thumbnail Image (Top on Laptop) */}
      <div 
        onClick={() => onViewDetails(opportunity)}
        className="w-20 h-20 sm:w-24 sm:h-24 lg:w-full lg:h-48 aspect-square lg:aspect-video rounded-xl sm:rounded-2xl lg:rounded-xl overflow-hidden shrink-0 relative bg-slate-100 cursor-pointer shadow-2xs"
      >
        <img
          src={thumbUrl}
          alt={opportunity.title}
          className="w-full h-full object-cover transform-gpu transition-transform duration-300 ease-out group-hover:scale-105"
          loading="lazy"
        />
        {/* Country Flag Badge over Image */}
        {opportunity.flag && (
          <span className="absolute bottom-1.5 start-1.5 text-xs bg-white/95 backdrop-blur-xs px-1.5 py-0.5 rounded-md shadow-2xs border border-white/80 leading-none pointer-events-none">
            {opportunity.flag}
          </span>
        )}
      </div>

      {/* Right Content / Information Block (Bottom on Laptop) */}
      <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch space-y-1 lg:space-y-2">
        
        {/* Top Line: Category Tag Pill + Matching Tag + Bookmark Button */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider shadow-2xs ${tag.style}`}>
              {tag.text}
            </span>

            {opportunity.moiAccepted && (
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-extrabold bg-purple-50 text-purple-700 border border-purple-200">
                MOI
              </span>
            )}

            {opportunity.matchScore && (
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-blue-500" />
                <span>{opportunity.matchScore}% {t.card.match}</span>
              </span>
            )}
          </div>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(opportunity.id);
            }}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
              isSaved
                ? 'text-blue-600 bg-blue-50'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            title={isSaved ? t.card.saved : t.card.save}
            id={`bookmark-btn-${opportunity.id}`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Opportunity Title */}
        <h3
          onClick={() => onViewDetails(opportunity)}
          className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 cursor-pointer leading-snug"
        >
          {opportunity.title}
        </h3>

        {/* Organization and Location with Location Pin */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium flex-wrap">
          <span className="flex items-center gap-1 truncate max-w-[200px] sm:max-w-xs">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-700 font-semibold">{opportunity.organization}</span>
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-600 font-normal">
            {opportunity.country}
          </span>
        </div>

        {/* Bottom Row: Deadline on Left + Actions/Status on Right */}
        <div className="pt-1.5 flex items-center justify-between gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 font-medium text-[11px] sm:text-xs">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{t.card.deadline}</span>
            <strong className="text-slate-900 font-bold">{formatDeadline(opportunity.deadline)}</strong>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {!isOpen && (
              <span className="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-100 text-[9px] sm:text-[10px] font-black flex items-center gap-1 shadow-xs whitespace-nowrap">
                <Clock className="w-2.5 h-2.5" />
                <span>OPENS: {formatDeadline(opportunity.openingDate!)}</span>
              </span>
            )}
            <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] border font-bold ${funding.style} whitespace-nowrap`}>
              {funding.label}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
