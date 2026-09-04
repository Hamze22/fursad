import React, { useState, useEffect, useMemo } from 'react';
import { Opportunity, CountryStat, Mentor, SuccessStory, UserProfile, ApplicationItem, DegreeLevel } from './types';
import { api, storage } from './services/api';
import { firebaseService } from './services/firebaseService';
import { initialOpportunities } from './data/seedOpportunities';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { FursadLogo } from './components/FursadLogo';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { OpportunityCard } from './components/OpportunityCard';
import { OpportunityDetailView } from './components/OpportunityDetailView';
import { WorldMapSection } from './components/WorldMapSection';
import { CountryHubModal } from './components/CountryHubModal';
import { FursadAIAssistant } from './components/FursadAIAssistant';
import { FursadAISectionView } from './components/FursadAISectionView';
import { ApplicationTrackerView } from './components/ApplicationTrackerView';
import { SavedOpportunitiesView } from './components/SavedOpportunitiesView';
import { MentorshipView } from './components/MentorshipView';
import { PricingView } from './components/PricingView';
import { ProfileSettingsView } from './components/ProfileSettingsView';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { ReportModal } from './components/ReportModal';
import { ProfileView } from './components/ProfileView';
import { OnboardingModal } from './components/OnboardingModal';
import { AuthModal } from './components/AuthModal';
import { AuthView } from './components/AuthView';
import { AppIconOverlayModal } from './components/AppIconOverlayModal';
import { MobileBottomNav } from './components/MobileBottomNav';

import { 
  Sparkles, 
  Bot, 
  ArrowRight, 
  CheckCircle2, 
  Filter, 
  Loader2,
} from 'lucide-react';

function AppContent() {
  const { t, isRTL } = useLanguage();

  // Navigation & View state
  const [currentTab, setCurrentTab] = useState<string>('home');
  
  // Data state
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [countries, setCountries] = useState<CountryStat[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // User state
  const [userProfile, setUserProfile] = useState<UserProfile>(() => storage.getProfile());
  const [savedOppIds, setSavedOppIds] = useState<string[]>(() => storage.getSavedOppIds());
  const [applications, setApplications] = useState<ApplicationItem[]>(() => storage.getApplications());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const profile = storage.getProfile();
    // Use a more robust check for guest status
    return !!profile && profile.id !== 'usr-guest-scholar' && profile.email !== 'guest@fursad.com';
  });
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDegree, setSelectedDegree] = useState<string>('all');
  const [selectedFunding, setSelectedFunding] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [moiOnly, setMoiOnly] = useState<boolean>(false);

  // Modals state
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [selectedCountryStat, setSelectedCountryStat] = useState<CountryStat | null>(null);
  const [isAIModalOpen, setIsAIModalOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [reportingOpportunity, setReportingOpportunity] = useState<Opportunity | null>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => !storage.isOnboardingCompleted());
  const [isAppIconModalOpen, setIsAppIconModalOpen] = useState<boolean>(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Scroll to top whenever tab, view, or selected opportunity changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [currentTab, selectedOpportunity, selectedCountryStat]);

  // Firebase Auth listener and data initialization
  useEffect(() => {
    let unsubscribeApps = () => {};

    const unsubscribeAuth = firebaseService.onAuthChange(async (authUser) => {
      if (authUser) {
        const userId = authUser.uid;
        try {
          let remoteProfile = await firebaseService.getUserProfile(userId, authUser.email || '');
          if (remoteProfile) {
            // CRITICAL: Always ensure email matches the active authenticated Gmail!
            if (authUser.email && remoteProfile.email !== authUser.email) {
              remoteProfile = { ...remoteProfile, email: authUser.email };
              firebaseService.updateUserProfile(userId, { email: authUser.email });
            }
            // Remove stock man photo if it was previously cached in profile
            if (remoteProfile.avatar?.includes('photo-1535713875002-d1d0cf377fde')) {
              remoteProfile = { ...remoteProfile, avatar: authUser.photoURL || '' };
              firebaseService.updateUserProfile(userId, { avatar: authUser.photoURL || '' });
            }
            setUserProfile(remoteProfile);
            storage.saveProfile(remoteProfile);
            setIsLoggedIn(true);
            
            const sids = remoteProfile.savedOppIds || [];
            setSavedOppIds(sids);
            storage.saveSavedOppIds(sids);
          } else {
            // If logged in but no profile in DB yet (e.g. from Google OAuth), initialize it
            const googleName = authUser.displayName || authUser.email?.split('@')[0] || 'Scholar User';
            const googleAvatar = authUser.photoURL || '';
            const newProfile: UserProfile = {
              id: userId,
              name: googleName,
              email: authUser.email || '',
              role: (authUser.email === 'somfxstore@gmail.com' || authUser.email === 'hamze.zakarie@gmail.com') ? 'owner' : 'user',
              avatar: googleAvatar,
              countryOrigin: 'Somalia',
              currentCountry: 'Somalia',
              currentCity: 'Mogadishu',
              educationLevel: 'bachelor',
              fieldOfStudy: 'Computer Science',
              graduationYear: 2026,
              skills: ['Academic Research', 'Leadership'],
              languages: ['Somali', 'English'],
              hasIelts: false,
              hasToefl: false,
              hasMoiCertificate: true,
              preferredCountries: ['Turkey', 'Germany', 'United Kingdom', 'Canada'],
              preferredCategories: ['scholarship', 'fellowship'],
              fundingPreference: 'fully_funded',
              careerGoals: 'Pursuing global scholarships & leadership opportunities.',
              profileStrength: 80,
              subscription: (authUser.email === 'somfxstore@gmail.com' || authUser.email === 'hamze.zakarie@gmail.com') ? 'pro' : 'free',
              notificationsEnabled: true,
              savedOppIds: []
            };
            await firebaseService.updateUserProfile(userId, newProfile);
            setUserProfile(newProfile);
            storage.saveProfile(newProfile);
            setIsLoggedIn(true);
            setSavedOppIds([]);
            storage.saveSavedOppIds([]);
          }
          
          // Listen to applications in real time
          unsubscribeApps = firebaseService.listenUserApplications(userId, (apps) => {
            setApplications(apps || []);
            storage.saveApplications(apps || []);
          });
        } catch (error) {
          console.error("Profile sync error:", error);
        }
      } else {
        setIsLoggedIn(false);
        const currentProfile = storage.getProfile();
        // Reset to guest if the current profile in storage is not guest
        if (currentProfile && currentProfile.id !== 'usr-guest-scholar') {
          storage.clearUserSession();
        }
        setUserProfile(storage.getProfile());
      }
      setIsAuthLoading(false);
    });

    // Load initial opportunities & data using Supabase direct connection with local fallback
    const initData = async () => {
      try {
        setIsLoading(true);
        
        // Load static data from local API first
        const [countriesData, mentorsData, storiesData] = await Promise.all([
          api.getCountries().catch(() => ({ countries: [] })),
          api.getMentors().catch(() => ({ mentors: [] })),
          api.getSuccessStories().catch(() => ({ stories: [] }))
        ]);
        
        setCountries(countriesData.countries || []);
        setMentors(mentorsData.mentors || []);
        setSuccessStories(storiesData.stories || []);

        // Load opportunities using the Firebase service with full 32,500 catalog protection
        const unsubscribeOpps = firebaseService.listenOpportunities((opps) => {
          // Robust merge strategy to ensure the 32,500 base count NEVER shrinks
          const oppMap = new Map<string, Opportunity>();
          
          // 1. Start with the local 32,500 seeds
          for (let i = 0; i < initialOpportunities.length; i++) {
            oppMap.set(initialOpportunities[i].id, initialOpportunities[i]);
          }
          
          // 2. Overlay Firestore updates/new items
          if (opps && opps.length > 0) {
            for (let i = 0; i < opps.length; i++) {
              oppMap.set(opps[i].id, opps[i]);
            }
          }
          
          const finalOpps = Array.from(oppMap.values());
          setOpportunities(finalOpps);
          setIsLoading(false);
        });

        return unsubscribeOpps;
      } catch (err) {
        console.error('Error fetching initial data:', err);
        setIsLoading(false);
      }
    };

    let unsubscribeOppsPromise = initData();

    return () => {
      unsubscribeAuth();
      unsubscribeApps();
      unsubscribeOppsPromise.then(unsub => unsub && unsub());
    };
  }, []);

  const [visibleCount, setVisibleCount] = useState<number>(30);

  // Reset pagination on filter or search changes
  useEffect(() => {
    setVisibleCount(30);
  }, [searchQuery, selectedCategory, selectedDegree, selectedFunding, selectedRegion, moiOnly, currentTab]);

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    setSelectedOpportunity(null);
    if (tab === 'scholarships') {
      setSelectedCategory('scholarship');
    } else if (tab === 'internships') {
      setSelectedCategory('internship');
    } else if (tab === 'fellowships') {
      setSelectedCategory('fellowship');
    } else if (tab === 'grants') {
      setSelectedCategory('grant');
    } else if (tab === 'conferences') {
      setSelectedCategory('conference');
    } else if (tab === 'exchanges') {
      setSelectedCategory('exchange');
    } else if (tab === 'home') {
      setSelectedCategory('all');
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const handleToggleSave = async (id: string) => {
    const isSaved = savedOppIds.includes(id);
    let updated: string[];
    if (isSaved) {
      updated = savedOppIds.filter(item => item !== id);
      showToast(t.card.save);
    } else {
      updated = [id, ...savedOppIds];
      showToast(t.card.saved);
    }
    setSavedOppIds(updated);
    storage.saveSavedOppIds(updated);

    if (isLoggedIn && userProfile.id) {
      await firebaseService.syncUserSavedOpportunities(userProfile.id, updated);
    }
  };

  const handleTrackApplyClick = async (oppId: string) => {
    try {
      await api.trackApplyClick(oppId);
    } catch (e) {
      // ignore
    }
  };

  const handleAddToTracker = async (opp: Opportunity) => {
    const exists = applications.find(a => a.opportunityId === opp.id);
    if (!exists) {
      const newApp: ApplicationItem = {
        id: `app-${Date.now()}`,
        opportunityId: opp.id,
        opportunityTitle: opp.title,
        organization: opp.organization,
        country: opp.country,
        flag: opp.flag || '🌍',
        category: opp.category,
        fundingType: opp.fundingType,
        deadline: opp.deadline,
        applicationUrl: opp.applicationUrl || opp.sourceUrl || '',
        status: 'interested',
        notes: 'Added from directory',
        checklist: [
          { id: '1', title: 'Review Eligibility & Requirements', completed: true },
          { id: '2', title: 'Prepare Passport & Academic Transcripts', completed: false },
          { id: '3', title: 'Draft Statement of Purpose (SOP)', completed: false },
          { id: '4', title: 'Request Letters of Recommendation', completed: false },
          { id: '5', title: 'Submit Official Online Application', completed: false }
        ],
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      const updated = [newApp, ...applications];
      setApplications(updated);
      storage.saveApplications(updated);
      if (isLoggedIn && userProfile.id) {
        await firebaseService.saveApplication(userProfile.id, newApp);
      }
      showToast(`Added "${opp.title}" to Tracker!`);
    } else {
      showToast(`"${opp.title}" is already in your Tracker.`);
    }
  };

  const handleLogout = async () => {
    try {
      await firebaseService.logout();
      setIsLoggedIn(false);
      const emptyProfile = storage.getProfile();
      setUserProfile(emptyProfile);
      setSavedOppIds([]);
      setApplications([]);
      setCurrentTab('home');
      showToast('You have been signed out.');
    } catch (e) {
      console.error(e);
    }
  };

  // Filtered opportunities calculation
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(opp => {
      // 1. Search text
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = opp.title.toLowerCase().includes(q);
        const matchOrg = opp.organization.toLowerCase().includes(q);
        const matchCountry = opp.country.toLowerCase().includes(q);
        const matchDesc = opp.description.toLowerCase().includes(q);
        const matchCat = opp.category.toLowerCase().includes(q);
        if (!matchTitle && !matchOrg && !matchCountry && !matchDesc && !matchCat) {
          return false;
        }
      }

      // 2. Category
      if (selectedCategory !== 'all' && opp.category !== selectedCategory) {
        return false;
      }

      // 3. Degree Level
      if (selectedDegree !== 'all') {
        if (!opp.degreeLevel.includes(selectedDegree as DegreeLevel)) {
          return false;
        }
      }

      // 4. Funding Type
      if (selectedFunding !== 'all' && opp.fundingType !== selectedFunding) {
        return false;
      }

      // 5. Region
      if (selectedRegion !== 'all' && opp.region !== selectedRegion && selectedRegion !== 'Global') {
        return false;
      }

      // 6. MOI Only
      if (moiOnly && !opp.moiAccepted) {
        return false;
      }

      return true;
    });
  }, [opportunities, searchQuery, selectedCategory, selectedDegree, selectedFunding, selectedRegion, moiOnly]);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-blue-400" />
          </div>
        </div>
        <div className="text-center space-y-1">
          <p className="text-base font-black text-slate-900 tracking-tight">FURSAD</p>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Verifying Identity...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900 selection:bg-blue-200 selection:text-blue-900 overflow-x-hidden" id="fursad-root-app" dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Toast message popup */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white text-xs sm:text-sm font-bold px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        currentTab={currentTab}
        onTabChange={handleTabChange}
        savedCount={savedOppIds.length}
        applicationCount={applications.length}
        userProfile={userProfile}
        onOpenPricing={() => handleTabChange('pricing')}
        onOpenProfile={() => handleTabChange('profile')}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        onOpenAIModal={() => setIsAIModalOpen(true)}
        isLoggedIn={isLoggedIn}
        onOpenAuth={() => {
          setAuthModalMode('login');
          handleTabChange('auth');
        }}
        onOpenAppIcon={() => setIsAppIconModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Primary Content View Switcher */}
      <main className="flex-1">
        {selectedOpportunity ? (
          <OpportunityDetailView
            opportunity={selectedOpportunity}
            onBack={() => {
              setSelectedOpportunity(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            isSaved={savedOppIds.includes(selectedOpportunity.id)}
            onToggleSave={handleToggleSave}
            onTrackApplyClick={handleTrackApplyClick}
            onAddToTracker={handleAddToTracker}
            onOpenReport={(opp) => setReportingOpportunity(opp)}
            userProfile={userProfile}
          />
        ) : currentTab === 'home' || currentTab === 'scholarships' || currentTab === 'internships' || currentTab === 'conferences' || currentTab === 'fellowships' || currentTab === 'grants' || currentTab === 'exchanges' ? (
          <>
            {/* Hero Search Section */}
            <HeroSection
              userProfile={userProfile}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedDegree={selectedDegree}
              onDegreeChange={setSelectedDegree}
              selectedFunding={selectedFunding}
              onFundingChange={setSelectedFunding}
              selectedRegion={selectedRegion}
              onRegionChange={setSelectedRegion}
              moiOnly={moiOnly}
              onMoiOnlyChange={setMoiOnly}
              onOpenAI={() => setIsAIModalOpen(true)}
              totalActiveCount={opportunities.length}
            />

            {/* Featured Opportunities Feed & Directory */}
            <section className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 py-5 sm:py-8 space-y-4" id="opportunities-feed">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight">
                    {t.feed.featuredOpportunities}
                  </h2>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    {filteredOpportunities.length.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedDegree('all');
                    setSelectedFunding('all');
                    setSelectedRegion('all');
                    setMoiOnly(false);
                    setSearchQuery('');
                    setCurrentTab('home');
                    setVisibleCount(40);
                    const feedElement = document.getElementById('opportunities-feed');
                    if (feedElement) {
                      feedElement.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer flex items-center gap-1"
                  id="view-all-opportunities-btn"
                >
                  <span>{t.feed.viewAll}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Active Filter Chips */}
              {(searchQuery || selectedCategory !== 'all' || selectedDegree !== 'all' || selectedFunding !== 'all' || selectedRegion !== 'all' || moiOnly) && (
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="text-slate-400 font-medium">{t.feed.filterBy}:</span>
                  {selectedCategory !== 'all' && (
                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-bold flex items-center gap-1">
                      <span>{selectedCategory}</span>
                      <button onClick={() => setSelectedCategory('all')} className="hover:text-blue-900 cursor-pointer">×</button>
                    </span>
                  )}
                  {selectedDegree !== 'all' && (
                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-bold flex items-center gap-1">
                      <span>{selectedDegree}</span>
                      <button onClick={() => setSelectedDegree('all')} className="hover:text-blue-900 cursor-pointer">×</button>
                    </span>
                  )}
                  {selectedFunding !== 'all' && (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold flex items-center gap-1">
                      <span>{selectedFunding}</span>
                      <button onClick={() => setSelectedFunding('all')} className="hover:text-emerald-900 cursor-pointer">×</button>
                    </span>
                  )}
                  {moiOnly && (
                    <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 font-bold flex items-center gap-1">
                      <span>MOI ({t.feed.noIeltsRequired})</span>
                      <button onClick={() => setMoiOnly(false)} className="hover:text-purple-900 cursor-pointer">×</button>
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setSelectedDegree('all');
                      setSelectedFunding('all');
                      setSelectedRegion('all');
                      setMoiOnly(false);
                    }}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 underline cursor-pointer ml-1"
                  >
                    {t.feed.clearFilters}
                  </button>
                </div>
              )}

              {/* Opportunities List */}
              {isLoading ? (
                <div className="p-16 text-center space-y-3 bg-white rounded-3xl border border-slate-200">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                  <p className="text-sm font-bold text-slate-700">{t.common.loading}</p>
                </div>
              ) : filteredOpportunities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {filteredOpportunities.slice(0, visibleCount).map((opp) => (
                    <OpportunityCard
                      key={opp.id}
                      opportunity={opp}
                      isSaved={savedOppIds.includes(opp.id)}
                      onToggleSave={handleToggleSave}
                      onViewDetails={(opportunity) => setSelectedOpportunity(opportunity)}
                      onTrackApplyClick={handleTrackApplyClick}
                      onAddToTracker={handleAddToTracker}
                    />
                  ))}

                  {/* High performance pagination & Load More */}
                  {filteredOpportunities.length > visibleCount && (
                    <div className="pt-4 pb-2 text-center space-y-3.5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs" id="pagination-bottom-controls">
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-slate-600">
                          Showing <strong className="text-slate-950 font-black">{Math.min(visibleCount, filteredOpportunities.length).toLocaleString()}</strong> of <strong className="text-blue-700 font-black">{filteredOpportunities.length.toLocaleString()}</strong> verified opportunities
                        </p>
                        <div className="w-full max-w-xs mx-auto bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-blue-600 h-full rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, (visibleCount / filteredOpportunities.length) * 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-2.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => setVisibleCount(prev => Math.min(filteredOpportunities.length, prev + 40))}
                          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-black shadow-md shadow-blue-600/20 transition-all cursor-pointer flex items-center gap-2"
                          id="btn-load-more-40"
                        >
                          <Sparkles className="w-4 h-4 text-cyan-300" />
                          <span>Load More (+40)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setVisibleCount(prev => Math.min(filteredOpportunities.length, prev + 150))}
                          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 border border-slate-200 text-xs font-bold transition-all cursor-pointer"
                          id="btn-load-more-150"
                        >
                          <span>Load +150 More</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 active:scale-95 text-slate-600 border border-slate-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                          id="btn-scroll-to-top"
                        >
                          <span>↑ Top</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3 max-w-md mx-auto">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                    <Filter className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">{t.feed.noResults}</h3>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setSelectedDegree('all');
                      setSelectedFunding('all');
                      setSelectedRegion('all');
                      setMoiOnly(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-xs"
                  >
                    {t.feed.viewAll}
                  </button>
                </div>
              )}
            </section>

            {/* World Map & Country Hubs Explorer Section */}
            {currentTab === 'home' && (
              <WorldMapSection
                countries={countries}
                onSelectCountry={(country) => setSelectedCountryStat(country)}
              />
            )}

            {/* AI Advisor Promotion Banner */}
            {currentTab === 'home' && (
              <section className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 py-8">
                <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-3 max-w-xl text-left">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-blue-300 text-xs font-black uppercase tracking-wider border border-white/20">
                      <Sparkles className="w-3.5 h-3.5" />
                      {t.ai.groundedBadge}
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {t.ai.title}
                    </h3>
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
                      {t.ai.welcomeMessage}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                    <button
                      onClick={() => handleTabChange('matching')}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-blue-950 font-black text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>{t.nav.aiAssistant}</span>
                      <ArrowRight className="w-4 h-4 text-blue-700" />
                    </button>

                    <button
                      onClick={() => setIsAIModalOpen(true)}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm border border-blue-400/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Bot className="w-4 h-4" />
                      <span>{t.ai.askButton}</span>
                    </button>
                  </div>
                </div>
              </section>
            )}
          </>
        ) : currentTab === 'world' ? (
          <WorldMapSection
            countries={countries}
            onSelectCountry={(country) => setSelectedCountryStat(country)}
          />
        ) : currentTab === 'matching' || currentTab === 'ai-assistant' ? (
          <FursadAISectionView
            userProfile={userProfile}
            opportunities={opportunities}
            savedIds={savedOppIds}
            onToggleSave={handleToggleSave}
            onViewDetails={(opp) => setSelectedOpportunity(opp)}
            onTrackApplyClick={handleTrackApplyClick}
            onOpenProfile={() => handleTabChange('profile-settings')}
          />
        ) : currentTab === 'tracker' ? (
          <ApplicationTrackerView
            applications={applications}
            isLoggedIn={isLoggedIn}
            onUpdateApplication={async (app) => {
              await firebaseService.saveApplication(userProfile.id, app);
              // State will be updated by listenUserApplications if configured,
              // but we also update local state for immediate response
              setApplications(prev => prev.map(a => a.id === app.id ? app : a));
            }}
            onDeleteApplication={async (id) => {
              await firebaseService.deleteApplication(id);
              setApplications(prev => prev.filter(a => a.id !== id));
            }}
            onExploreMore={() => handleTabChange('home')}
          />
        ) : currentTab === 'saved' ? (
          <SavedOpportunitiesView
            opportunities={opportunities}
            savedIds={savedOppIds}
            onToggleSave={handleToggleSave}
            onViewDetails={(opp) => setSelectedOpportunity(opp)}
            onTrackApplyClick={handleTrackApplyClick}
            onExploreMore={() => handleTabChange('home')}
          />
        ) : currentTab === 'pricing' ? (
          <PricingView
            userProfile={userProfile}
            onProfileUpdated={(updated) => {
              setUserProfile(updated);
              storage.saveProfile(updated);
            }}
            onBack={() => handleTabChange('home')}
          />
        ) : currentTab === 'auth' ? (
          <AuthView
            onBack={() => handleTabChange('home')}
            onAuthSuccess={(profile) => {
              setUserProfile(profile);
              storage.saveProfile(profile);
              setIsLoggedIn(true);
              handleTabChange('profile');
              showToast(`Welcome to FURSAD, ${profile.name}!`);
            }}
            initialMode={authModalMode}
          />
        ) : currentTab === 'profile-settings' ? (
          <ProfileSettingsView
            userProfile={userProfile}
            onProfileUpdated={(updated) => {
              setUserProfile(updated);
              storage.saveProfile(updated);
            }}
            onBack={() => handleTabChange('profile')}
            onNavigateToPricing={() => handleTabChange('pricing')}
            onLogout={handleLogout}
          />
        ) : currentTab === 'profile' ? (
          <ProfileView
            userProfile={userProfile}
            onProfileUpdated={(updated) => {
              setUserProfile(updated);
              storage.saveProfile(updated);
            }}
            savedCount={savedOppIds.length}
            applications={applications}
            onBack={() => handleTabChange('home')}
            onOpenPricing={() => handleTabChange('pricing')}
            onOpenProfileSettings={() => handleTabChange('profile-settings')}
            onOpenAdmin={() => setIsAdminModalOpen(true)}
            onNavigateToTab={handleTabChange}
            isLoggedIn={isLoggedIn}
            onOpenAuth={(mode) => {
              setAuthModalMode(mode || 'login');
              handleTabChange('auth');
            }}
            onLogout={handleLogout}
          />
        ) : currentTab === 'mentorship' ? (
          <MentorshipView
            mentors={mentors}
            stories={successStories}
            userProfile={userProfile}
          />
        ) : null}
      </main>

      {/* Footer */}
      {currentTab !== 'profile' && currentTab !== 'profile-settings' && currentTab !== 'pricing' && currentTab !== 'auth' && currentTab !== 'ai-assistant' && currentTab !== 'matching' && (
        <footer className="bg-slate-950 text-white pt-14 pb-24 lg:pb-12 border-t border-slate-800" id="fursad-footer">
          <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 space-y-10">
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
              {/* Brand column */}
              <div className="space-y-4 md:col-span-1">
                <FursadLogo 
                  size="md" 
                  lightMode={true} 
                  onClick={() => setIsAppIconModalOpen(true)}
                  className="cursor-pointer"
                />
                <p className="text-xs text-slate-400 leading-relaxed">
                  Empowering global youth with verified scholarships, fellowships, conferences, internships, and mentorships.
                </p>
                <div className="text-blue-400 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>YOUR FUTURE HAS NO BORDERS</span>
                </div>
              </div>

              {/* Quick Links */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">{t.nav.scholarships}</h4>
                <ul className="space-y-2 text-xs text-slate-300 font-medium">
                  <li><button onClick={() => handleTabChange('scholarships')} className="hover:text-white cursor-pointer">{t.hero.categories.scholarships} ({t.card.fullyFunded})</button></li>
                  <li><button onClick={() => handleTabChange('internships')} className="hover:text-white cursor-pointer">{t.hero.categories.internships}</button></li>
                  <li><button onClick={() => handleTabChange('conferences')} className="hover:text-white cursor-pointer">{t.hero.categories.conferences}</button></li>
                  <li><button onClick={() => handleTabChange('world')} className="hover:text-white cursor-pointer">{t.feed.allRegions}</button></li>
                </ul>
              </div>

              {/* Key Tools */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">{t.nav.aiAssistant}</h4>
                <ul className="space-y-2 text-xs text-slate-300 font-medium">
                  <li><button onClick={() => setIsAIModalOpen(true)} className="hover:text-white cursor-pointer">{t.ai.title}</button></li>
                  <li><button onClick={() => handleTabChange('matching')} className="hover:text-white cursor-pointer">AI Match</button></li>
                  <li><button onClick={() => handleTabChange('tracker')} className="hover:text-white cursor-pointer">{t.nav.tracker}</button></li>
                  <li><button onClick={() => handleTabChange('profile')} className="hover:text-white cursor-pointer">{t.nav.profile}</button></li>
                </ul>
              </div>

              {/* Trust & Safety */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">{t.onboarding.page1.item2Title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {t.onboarding.page1.item2Desc}
                </p>
                <div className="pt-1 flex items-center gap-2">
                  <button
                    onClick={() => setIsAdminModalOpen(true)}
                    className="text-xs text-blue-400 hover:text-blue-300 font-bold underline cursor-pointer"
                  >
                    {t.nav.admin}
                  </button>
                  <span className="text-slate-600">•</span>
                  <button
                    onClick={() => handleTabChange('pricing')}
                    className="text-xs text-blue-400 hover:text-blue-300 font-bold cursor-pointer"
                  >
                    {t.nav.upgrade}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <p>© 2026 FURSAD. All rights reserved. Building borderless global pathways for youth.</p>
              <div className="flex items-center gap-4">
                <span>Mogadishu • London • Berlin • Nairobi</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">100% Verified Opportunities</span>
              </div>
            </div>

          </div>
        </footer>
      )}

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        currentTab={currentTab}
        onTabChange={handleTabChange}
        savedCount={savedOppIds.length}
        applicationCount={applications.length}
        onOpenProfile={() => handleTabChange('profile')}
      />

      {/* MODALS */}
      {/* 1. Onboarding Modal for first-time visitors */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onProfileUpdated={(updated) => setUserProfile(updated)}
      />

      {/* 2. Country Hub Modal */}
      <CountryHubModal
        countryStat={selectedCountryStat}
        opportunities={opportunities}
        isOpen={!!selectedCountryStat}
        onClose={() => setSelectedCountryStat(null)}
        savedIds={savedOppIds}
        onToggleSave={handleToggleSave}
        onViewDetails={(opp) => setSelectedOpportunity(opp)}
        onTrackApplyClick={handleTrackApplyClick}
      />

      {/* 4. Ask FURSAD AI Assistant Modal */}
      <FursadAIAssistant
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        userProfile={userProfile}
        opportunities={opportunities}
        onViewOpportunity={(opp) => {
          setIsAIModalOpen(false);
          setSelectedOpportunity(opp);
        }}
      />

      {/* 6. Admin Dashboard Modal */}
      <AdminDashboardModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        opportunities={opportunities}
        onOpportunityCreated={(newOpp) => setOpportunities([newOpp, ...opportunities])}
        onOpportunityDeleted={(id) => setOpportunities(opportunities.filter(o => o.id !== id))}
      />

      {/* 7. Report / Safety Modal */}
      <ReportModal
        opportunity={reportingOpportunity}
        isOpen={!!reportingOpportunity}
        onClose={() => setReportingOpportunity(null)}
      />

      {/* 8. Authentication & Registration Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(profile) => {
          setUserProfile(profile);
          storage.saveProfile(profile);
          setIsLoggedIn(true);
          showToast(`Welcome back, ${profile.name}!`);
        }}
        initialMode={authModalMode}
      />

      {/* 9. FURSAD Brand Identity & Overlay Modal */}
      <AppIconOverlayModal
        isOpen={isAppIconModalOpen}
        onClose={() => setIsAppIconModalOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
