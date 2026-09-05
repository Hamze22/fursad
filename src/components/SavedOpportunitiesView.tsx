import React, { useState } from 'react';
import { Opportunity } from '../types';
import { OpportunityCard } from './OpportunityCard';
import { Bookmark, Sparkles, ArrowRight, Search, Trash2 } from 'lucide-react';

interface SavedOpportunitiesViewProps {
  opportunities: Opportunity[];
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onViewDetails: (opportunity: Opportunity) => void;
  onTrackApplyClick: (id: string) => void;
  onExploreMore: () => void;
}

export const SavedOpportunitiesView: React.FC<SavedOpportunitiesViewProps> = ({
  opportunities,
  savedIds,
  onToggleSave,
  onViewDetails,
  onTrackApplyClick,
  onExploreMore
}) => {
  const [search, setSearch] = useState<string>('');
  const [selectedCat, setSelectedCat] = useState<string>('all');

  const savedList = opportunities.filter(o => savedIds.includes(o.id));
  
  const filtered = savedList.filter(o => {
    const matchesSearch = o.title.toLowerCase().includes(search.toLowerCase()) || o.country.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === 'all' || o.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="w-full mx-auto px-3.5 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8" id="saved-opportunities-view">
      {/* Banner */}
      <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-black uppercase tracking-wider border border-purple-400/30">
            <Bookmark className="w-3.5 h-3.5" />
            Bookmarked Opportunities
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Your Saved Opportunities ({savedList.length})
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl font-medium">
            Keep track of deadlines and easily access official application portals when you are ready to apply.
          </p>
        </div>

        <button
          onClick={onExploreMore}
          className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <span>Find More Opportunities</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {savedList.length > 0 ? (
        <div className="space-y-6">
          {/* Filter / Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
              {['all', 'scholarship', 'conference', 'internship', 'fellowship'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                    selectedCat === cat
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search saved items..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
              />
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(opp => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                isSaved={true}
                onToggleSave={onToggleSave}
                onViewDetails={onViewDetails}
                onTrackApplyClick={onTrackApplyClick}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
          <Bookmark className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-extrabold text-slate-800">No saved opportunities yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click the bookmark icon on any opportunity card to save it for later review and deadline tracking.
          </p>
          <button
            onClick={onExploreMore}
            className="px-6 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-md"
          >
            Explore Global Opportunities
          </button>
        </div>
      )}

    </div>
  );
};
