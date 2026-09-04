export type SupportedLanguage = 'so' | 'en' | 'ar' | 'fr';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export interface TranslationDict {
  // Navigation & Header
  nav: {
    home: string;
    saved: string;
    scholarships: string;
    internships: string;
    conferences: string;
    grants: string;
    mentorship: string;
    aiAssistant: string;
    tracker: string;
    profile: string;
    admin: string;
    login: string;
    logout: string;
    upgrade: string;
    proMember: string;
    notifications: string;
    searchPlaceholder: string;
  };

  // Hero Section
  hero: {
    greeting: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    filterButton: string;
    categories: {
      scholarships: string;
      internships: string;
      conferences: string;
      grants: string;
      fellowships: string;
      volunteering: string;
      mentorship: string;
      more: string;
    };
    badges: {
      studyAbroad: string;
      research: string;
      volunteering: string;
      fellowships: string;
    };
    stats: {
      verifiedOpps: string;
      fundingSecured: string;
      countries: string;
      acceptanceRate: string;
    };
  };

  // Feed & Filtering
  feed: {
    featuredOpportunities: string;
    allOpportunities: string;
    viewAll: string;
    filterBy: string;
    degreeLevel: string;
    fundingType: string;
    region: string;
    moiAcceptedOnly: string;
    noIeltsRequired: string;
    allCategories: string;
    allDegrees: string;
    allFunding: string;
    allRegions: string;
    noResults: string;
    noResultsDesc: string;
    clearFilters: string;
    showingResults: string;
    verifiedBadge: string;
  };

  // Opportunity Card
  card: {
    deadline: string;
    fullyFunded: string;
    paid: string;
    free: string;
    tuitionWaiver: string;
    moiBadge: string;
    match: string;
    save: string;
    saved: string;
    viewDetails: string;
    applyNow: string;
  };

  // Opportunity Detail
  detail: {
    backToFeed: string;
    overview: string;
    financialBenefits: string;
    eligibility: string;
    documentsRequired: string;
    languageReq: string;
    howToApply: string;
    aboutOrg: string;
    verifiedSource: string;
    reportIssue: string;
    applyOfficial: string;
    addToTracker: string;
    inTracker: string;
    shareOpportunity: string;
    deadlineNotice: string;
    deadlinePassed: string;
    tuitionCoverage: string;
    accommodation: string;
    travelSupport: string;
    monthlyStipend: string;
    ieltsNotRequired: string;
    ieltsRequired: string;
    moiAcceptedDesc: string;
    aboutOpportunity: string;
  };

  // Fursad AI
  ai: {
    title: string;
    tagline: string;
    groundedBadge: string;
    askPlaceholder: string;
    askButton: string;
    thinking: string;
    clearChat: string;
    welcomeMessage: string;
    suggestedTitle: string;
    suggestedSubtitle: string;
    quickPrompts: {
      fullyFundedEurope: { label: string; query: string };
      moiNoIelts: { label: string; query: string };
      sopMotivation: { label: string; query: string };
      youthFlights: { label: string; query: string };
      paidInternships: { label: string; query: string };
      checkEligibility: { label: string; query: string };
    };
    inputChips: Array<{ label: string; query: string }>;
    mentionedOpportunities: string;
  };

  // Application Tracker
  tracker: {
    title: string;
    subtitle: string;
    addApplication: string;
    emptyTitle: string;
    emptyDesc: string;
    stages: {
      saved: string;
      preparing: string;
      submitted: string;
      under_review: string;
      interview: string;
      accepted: string;
      rejected: string;
    };
    daysLeft: string;
    updateStatus: string;
    notes: string;
    addNotes: string;
  };

  // Profile View
  profile: {
    myProfile: string;
    savedOpportunities: string;
    applicationsSubmitted: string;
    shortlisted: string;
    profileStrength: string;
    myInterests: string;
    edit: string;
    notificationSettings: string;
    paymentPlans: string;
    helpSupport: string;
    inviteFriends: string;
    logOut: string;
    roleAdmin: string;
    roleScholar: string;
    selectLanguage: string;
    interests: {
      scholarships: string;
      internships: string;
      conferences: string;
      research: string;
      grants: string;
      volunteering: string;
    };
  };

  // Onboarding (3 pages)
  onboarding: {
    page1: {
      tag: string;
      title: string;
      desc: string;
      item1Title: string;
      item1Desc: string;
      item2Title: string;
      item2Desc: string;
      item3Title: string;
      item3Desc: string;
    };
    page2: {
      tag: string;
      title: string;
      desc: string;
      matchBadge: string;
      matchTitle: string;
      matchDesc: string;
      item1Title: string;
      item1Desc: string;
      item2Title: string;
      item2Desc: string;
    };
    page3: {
      tag: string;
      title: string;
      desc: string;
      step1Title: string;
      step1Desc: string;
      step2Title: string;
      step2Desc: string;
      step3Title: string;
      step3Desc: string;
    };
    next: string;
    back: string;
    skip: string;
    getStarted: string;
  };

  // Common UI
  common: {
    close: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    share: string;
    loading: string;
    verified: string;
    officialWebsite: string;
    copied: string;
    upgradeToPro: string;
    free: string;
    language: string;
  };
}
