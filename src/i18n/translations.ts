import { SupportedLanguage, LanguageOption, TranslationDict } from './types';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'so',
    name: 'Somali',
    nativeName: 'Soomaali',
    flag: '',
    dir: 'ltr'
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '',
    dir: 'ltr'
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '',
    dir: 'rtl'
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '',
    dir: 'ltr'
  }
];

export const translations: Record<SupportedLanguage, TranslationDict> = {
  // ==========================================
  // SOMALI (SO)
  // ==========================================
  so: {
    nav: {
      home: 'Bogga Hore',
      saved: 'La Keydiyay',
      scholarships: 'Deeqaha Waxbarasho',
      internships: 'Tababarrada',
      conferences: 'Shirarka',
      grants: 'Maalgelinta',
      mentorship: 'La-talinta',
      aiAssistant: 'FURSAD AI',
      tracker: 'Tracker',
      profile: 'Koontada & Xogta',
      admin: 'Maamulka',
      login: 'Login',
      logout: 'Ka Bax',
      upgrade: 'Kordhi ($4)',
      proMember: 'Xubin PRO',
      notifications: 'Ogeysiisyada',
      searchPlaceholder: 'Raadi deeqo, tababarro, shirar, waddamo...'
    },
    hero: {
      greeting: 'Ku soo dhawoow',
      title: 'Hel Fursaddaada Caalamiga ah ee Xigta',
      subtitle: 'Baadh deeqaha waxbarasho, tababarrada mushaharka leh, iyo shirarka caalamiga ah ee 100% la xaqiijiyay.',
      searchPlaceholder: 'Raadi deeqaha waxbarasho, tababarrada, deeqaha maaliyadeed...',
      filterButton: 'Kala Saar',
      categories: {
        scholarships: 'Deeqaha',
        internships: 'Tababarrada',
        conferences: 'Shirarka',
        grants: 'Maalgelinta',
        fellowships: 'Fellowships',
        volunteering: 'Tabarucaadka',
        mentorship: 'La-talinta',
        more: 'Dheeraad'
      },
      badges: {
        studyAbroad: 'Waxbarasho Dibadda ah',
        research: 'Cilmi-baaris',
        volunteering: 'Tabarucaad',
        fellowships: 'Wehelnimo'
      },
      stats: {
        verifiedOpps: 'Fursado La Xaqiijiyay',
        fundingSecured: 'Lacagaha Deeqaha',
        countries: 'Waddamo Caalami ah',
        acceptanceRate: 'Heerka Guusha'
      }
    },
    feed: {
      featuredOpportunities: 'Fursadaha La Xushay',
      allOpportunities: 'Dhammaan Fursadaha',
      viewAll: 'Eeg Dhammaan',
      filterBy: 'Kala Sooc',
      degreeLevel: 'Heerka Waxbarashada',
      fundingType: 'Nooca Maalgelinta',
      region: 'Gobolka',
      moiAcceptedOnly: 'English MOI (Bilaa IELTS)',
      noIeltsRequired: 'Bilaa IELTS Loo Baahan Yahay',
      allCategories: 'Dhammaan Qaybaha',
      allDegrees: 'Dhammaan Heerarka',
      allFunding: 'Dhammaan Noocyada Maalgelinta',
      allRegions: 'Dhammaan Gobollada',
      noResults: 'Lama helin wax fursado ah oo u dhigma baaritaankaaga',
      noResultsDesc: 'Fadlan tijaabi ereyo kale ama debci shuruudaha shaandhaynta.',
      clearFilters: 'Tirtir Shaandhaynta',
      showingResults: 'Muujinaya',
      verifiedBadge: 'La Xaqiijiyay'
    },
    card: {
      deadline: 'Waqtiga:',
      fullyFunded: 'Fully Funded',
      paid: 'Mushahar Leh',
      free: 'Bilaash',
      tuitionWaiver: 'Kharash Dhaaf',
      moiBadge: 'MOI',
      match: 'Kalsooni',
      save: 'Keydso',
      saved: 'Waa La Keydiyay',
      viewDetails: 'Faahfaahin',
      applyNow: 'Codso Hadda'
    },
    detail: {
      backToFeed: 'Dib ugu Noqo Liiska',
      overview: 'Dulmar Guud',
      financialBenefits: 'Faa\'iidooyinka Maaliyadeed',
      eligibility: 'Shuruudaha & U-qalmitaanka',
      documentsRequired: 'Dukumiintiyada Loo Baahan Yahay',
      languageReq: 'Shuruudaha Luuqadda & MOI',
      howToApply: 'Sida Loo Codsado',
      aboutOrg: 'Ku Saabsan Jaamacadda / Hay\'adda',
      verifiedSource: 'Isha Xogta La Xaqiijiyay',
      reportIssue: 'Soo Sheeg Cilad',
      applyOfficial: 'Ka Codso Portal-ka Rasmiga ah',
      addToTracker: 'Ku Dar Raad-raaca',
      inTracker: 'Ku Jira Raad-raaca',
      shareOpportunity: 'La Wadaag',
      deadlineNotice: 'Waqtiga kama dambaysta ah',
      deadlinePassed: 'Waqtigu wuu dhacay',
      tuitionCoverage: 'Daboolidda Waxbarashada',
      accommodation: 'Hoyga & Degenaanshaha',
      travelSupport: 'Tikidhada Diyaaradda',
      monthlyStipend: 'Gunnada Bisha',
      ieltsNotRequired: 'IELTS Looma Baahna',
      ieltsRequired: 'IELTS / TOEFL Waa Loo Baahan Yahay',
      moiAcceptedDesc: 'Jaamacaddani waxay aqbashaa Shahaadada Luuqadda Ingiriiska ee Jaamacaddaadii hore (Medium of Instruction - MOI).',
      aboutOpportunity: 'Ku saabsan Fursaddan'
    },
    ai: {
      title: 'FURSAD AI Caawiyaha',
      tagline: 'Caqliga Macmalka ah ee Deeqaha & Fursadaha Caalamiga ah',
      groundedBadge: 'Xog-ururin Toos ah & Rasmi ah',
      askPlaceholder: 'Qor su\'aal ku saabsan deeqaha, MOI, waraaqda SOP, ama codsiyada...',
      askButton: 'Weydii AI',
      thinking: 'FURSAD AI waxay baareysaa fursadaha xaqiijisan...',
      clearChat: 'Dib u Bilow',
      welcomeMessage: 'Kusoo dhawoow! Waxaan ahay FURSAD AI, caawiyahaaga caqliga macmalka ah ee deeqaha waxbarasho iyo fursadaha caalamiga ah. Sideen kugu caawin karaa maanta?',
      suggestedTitle: 'Su\'aalaha La Soo Jeediyay',
      suggestedSubtitle: 'Guji mid ka mid ah si aad si toos ah ugu weydiiso',
      quickPrompts: {
        fullyFundedEurope: { label: "Fully Funded Master's", query: "Ii hel deeqaha waxbarasho ee Master-ka ee Fully Funded ah ee Yurub (Turkiye Burslari, DAAD, Chevening)" },
        moiNoIelts: { label: "MOI Accepted (No IELTS)", query: "Waa kuwee deeqaha iyo jaamacadaha aqbala shahaadada English MOI iyadoo aan loo baahnayn IELTS ama TOEFL?" },
        sopMotivation: { label: "SOP & Motivation Letter", query: "Sideen u qoraa Statement of Purpose (SOP) iyo Motivation Letter heersare ah oo aqbalitaan lagu helo?" },
        youthFlights: { label: "Youth Summits & Flights", query: "Ii hel shirarka iyo fursadaha caalamiga ah ee dhalinyarada ee bixinaya tikidhada diyaaradda iyo degenaanshaha" },
        paidInternships: { label: "Paid Internships & CERN", query: "I tusi fursadaha tababarrada mushaharka leh (Paid Internships) iyo barnaamijyada cilmi-baarista caalamiga ah" },
        checkEligibility: { label: "Check My Eligibility", query: "Qiimee fursadaha aan u qalmo anigoo haysta aqoontayda iyo shahaadada MOI." }
      },
      inputChips: [
        { label: "🎓 Fully Funded Yurub", query: "Ii hel deeqaha waxbarasho ee Master-ka ee Fully Funded ah ee Yurub" },
        { label: "🌐 MOI (Bilaa IELTS)", query: "Waa kuwee deeqaha aqbala English MOI iyadoo aan loo baahnayn IELTS?" },
        { label: "✍️ Qorista SOP", query: "Sideen u qoraa Statement of Purpose (SOP) adag oo deeq waxbarasho lagu helo?" },
        { label: "✈️ Shirarka Safarka Bilaashka ah", query: "Ii tusi shirarka caalamiga ah ee bixiya tikidhada diyaaradda iyo huteelka" },
        { label: "⏱️ Deadlines-ka Soo Dhaw", query: "Waa kuwee fursadaha ugu muhiimsan ee waqtigoodu dhowyahay?" }
      ],
      mentionedOpportunities: 'Fursadaha La Xaqiijiyay ee La Xusay:'
    },
    tracker: {
      title: 'Application Tracker',
      subtitle: 'La soco marxalad kasta oo ka mid ah codsiyadaada deeqaha waxbarasho iyo fursadaha.',
      addApplication: 'Ku Dar Codsi Cusub',
      emptyTitle: 'Wali kuma aadan darin wax codsiyo ah',
      emptyDesc: 'Marka aad hesho fursad aad jeceshahay, guji "Ku Dar Raad-raaca" si aad halkan ugala socoto.',
      stages: {
        saved: 'La Keydiyay',
        preparing: 'Diyaarinta Dukumiintiyada',
        submitted: 'Waa La Gudbiyay',
        under_review: 'Dib u Eegis Ku Jira',
        interview: 'Wareysi',
        accepted: 'Waa La Aqbalay 🎉',
        rejected: 'Lama Aqbalin'
      },
      daysLeft: 'maalmood ayaa ka haray',
      updateStatus: 'Beddel Marxaladda',
      notes: 'Xusuusinno',
      addNotes: 'Ku dar xusuusin gaar ah...'
    },
    profile: {
      myProfile: 'Xogtayda Shakhsiga ah',
      savedOpportunities: 'Fursadaha La Keydiyay',
      applicationsSubmitted: 'Codsiyada La Gudbiyay',
      shortlisted: 'Liiska Gaarka ah',
      profileStrength: 'Awoodda Xogtaada',
      myInterests: 'Danooyinkayga',
      edit: 'Wax Ka Beddel',
      notificationSettings: 'Habaynta Ogeysiisyada',
      paymentPlans: 'Qorshayaasha & Lacag-bixinta',
      helpSupport: 'Caawin & Taageero',
      inviteFriends: 'Ku Martiqaad Saaxiibbadaa',
      logOut: 'Ka Bax Koontada',
      roleAdmin: 'Maamule',
      roleScholar: 'Aqoonyahan',
      selectLanguage: 'Dooro Luuqadda / Language',
      interests: {
        scholarships: 'Deeqaha Waxbarasho',
        internships: 'Tababarrada',
        conferences: 'Shirarka',
        research: 'Cilmi-baaris',
        grants: 'Maalgelinta',
        volunteering: 'Tabarucaadka'
      }
    },
    onboarding: {
      page1: {
        tag: 'Bogga 1 / 3 • Fursadaha Caalamiga ah',
        title: 'Deeqaha & Fursadaha La Xaqiijiyay',
        desc: 'Hel deeqaha waxbarasho ee adduunka ugu caansan (Scholarships), tababarrada (Internships), shirarka dhalinyarada, iyo maalgelinta cilmi-baarista ee 100% laga xaqiijiyay ilaha rasmiga ah.',
        item1Title: 'Fully Funded Scholarships',
        item1Desc: 'Deeqo daboolaya waxbarashada, hoyga, tikidhada diyaaradda, iyo gunnada bisha.',
        item2Title: '100% Xog Rasmi ah & Verified',
        item2Desc: 'Isku xirnaan toos ah oo ku xireysa boggaga rasmiga ah ee jaamacadaha iyo safaaradaha.',
        item3Title: 'Shirarka & Tababarrada Global-ka',
        item3Desc: 'CERN, UN Volunteers, World Youth Forum, iyo tababarro bixiya kharashka oo dhan.'
      },
      page2: {
        tag: 'Bogga 2 / 3 • Caqliga Macmalka ah',
        title: 'FURSAD AI & Deeqaha Bilaa IELTS (MOI)',
        desc: 'Caawiyaha FURSAD AI wuxuu kugu caawinayaa inaad hesho deeqaha iyo jaamacadaha aqbala shahaadada English MOI adigoon qaadan imtixaanka IELTS ama TOEFL.',
        matchBadge: '98% Match',
        matchTitle: 'FURSAD AI Profile Match',
        matchDesc: 'Waxay falanqaynaysaa takhasuskaaga, GPA-gaaga, iyo fursadaha aad tooska ugu qalanto.',
        item1Title: 'English MOI Acceptance',
        item1Desc: 'Kala sooc jaamacadaha aqbala shahaadada luuqadda ee jaamacaddaada ama dugsigaaga sare.',
        item2Title: 'Qorista SOP & Motivation Letter',
        item2Desc: 'Hel tilmaamo iyo hage ku saabsan sida loo qoro qoraal cajiib ah oo lagu helo deeqda.'
      },
      page3: {
        tag: 'Bogga 3 / 3 • Raad-raaca & Codsiga',
        title: 'Raad-raac Codsiyada & Horumarkaaga',
        desc: 'Ha lumin fursad qaali ah. Ku keydso fursadaha aad xiiseyneyso hal meel, la soco waqtiyada kama dambeysta ah, oo toos uga codso boggaga rasmiga ah.',
        step1Title: 'Xulo oo Keydso Fursadaha',
        step1Desc: 'Riix calaamadda Bookmark si aad u diyaariso liiskaaga shakhsiga ah.',
        step2Title: 'La Soco Deadline-ka & Documents-ka',
        step2Desc: 'Diyaari shahaadooyinka, recommendation letters-ka, iyo waraaqda dhiirrigelinta.',
        step3Title: 'Toos uga Codso Portal-ka Rasmiga ah',
        step3Desc: 'Guji badhanka Apply Online si aad ugu gudubto nidaamka jaamacadda ama hay\'adda.'
      },
      next: 'Xiga (Next)',
      back: 'Dib u Noqo',
      skip: 'Ka Gudub',
      getStarted: 'Bilow Hadda (Get Started)'
    },
    common: {
      close: 'Xir',
      save: 'Keydso',
      cancel: 'Ka Noqo',
      delete: 'Tirtir',
      edit: 'Wax Ka Beddel',
      share: 'La Wadaag',
      loading: 'Fadlan sug...',
      verified: 'La Xaqiijiyay',
      officialWebsite: 'Websaytka Rasmiga ah',
      copied: 'Waa La Koobiyeeyay!',
      upgradeToPro: 'Noqo Xubin PRO',
      free: 'Bilaash',
      language: 'Luuqadda'
    }
  },

  // ==========================================
  // ENGLISH (EN)
  // ==========================================
  en: {
    nav: {
      home: 'Home',
      saved: 'Saved',
      scholarships: 'Scholarships',
      internships: 'Internships',
      conferences: 'Conferences',
      grants: 'Grants',
      mentorship: 'Mentorship',
      aiAssistant: 'FURSAD AI',
      tracker: 'Tracker',
      profile: 'My Profile',
      admin: 'Admin',
      login: 'Login',
      logout: 'Sign Out',
      upgrade: 'Upgrade ($4)',
      proMember: 'PRO Member',
      notifications: 'Notifications',
      searchPlaceholder: 'Search scholarships, internships, conferences, countries...'
    },
    hero: {
      greeting: 'Hello',
      title: 'Find Your Next Global Opportunity',
      subtitle: 'Discover 100% verified fully funded scholarships, paid internships, global youth summits, and research grants worldwide.',
      searchPlaceholder: 'Search scholarships, internships, grants...',
      filterButton: 'Filter',
      categories: {
        scholarships: 'Scholarships',
        internships: 'Internships',
        conferences: 'Conferences',
        grants: 'Grants',
        fellowships: 'Fellowships',
        volunteering: 'Volunteering',
        mentorship: 'Mentorship',
        more: 'More'
      },
      badges: {
        studyAbroad: 'Study Abroad',
        research: 'Research',
        volunteering: 'Volunteering',
        fellowships: 'Fellowships'
      },
      stats: {
        verifiedOpps: 'Verified Opportunities',
        fundingSecured: 'Scholarship Funding',
        countries: 'Global Destinations',
        acceptanceRate: 'Acceptance Rate'
      }
    },
    feed: {
      featuredOpportunities: 'Featured Opportunities',
      allOpportunities: 'All Opportunities',
      viewAll: 'View all',
      filterBy: 'Filter By',
      degreeLevel: 'Degree Level',
      fundingType: 'Funding Type',
      region: 'Region',
      moiAcceptedOnly: 'English MOI (No IELTS)',
      noIeltsRequired: 'No IELTS Required',
      allCategories: 'All Categories',
      allDegrees: 'All Degrees',
      allFunding: 'All Funding Types',
      allRegions: 'All Regions',
      noResults: 'No opportunities match your current search or filter criteria',
      noResultsDesc: 'Try adjusting your search terms or clearing your active filters.',
      clearFilters: 'Clear All Filters',
      showingResults: 'Showing',
      verifiedBadge: 'Verified'
    },
    card: {
      deadline: 'Deadline:',
      fullyFunded: 'Fully Funded',
      paid: 'Paid Position',
      free: 'Free',
      tuitionWaiver: 'Tuition Waiver',
      moiBadge: 'MOI',
      match: 'Match',
      save: 'Save',
      saved: 'Saved',
      viewDetails: 'View Details',
      applyNow: 'Apply Now'
    },
    detail: {
      backToFeed: 'Back to Opportunities',
      overview: 'Overview',
      financialBenefits: 'Financial Benefits & Coverage',
      eligibility: 'Eligibility & Requirements',
      documentsRequired: 'Required Application Documents',
      languageReq: 'Language Proficiency & MOI',
      howToApply: 'Step-by-Step Application Guide',
      aboutOrg: 'About the Host Organization / University',
      verifiedSource: 'Verified Official Source',
      reportIssue: 'Report an Issue',
      applyOfficial: 'Apply on Official Portal',
      addToTracker: 'Add to Application Tracker',
      inTracker: 'In Your Tracker',
      shareOpportunity: 'Share Opportunity',
      deadlineNotice: 'Application Deadline',
      deadlinePassed: 'Deadline has passed',
      tuitionCoverage: 'Tuition Fee Coverage',
      accommodation: 'Accommodation & Housing',
      travelSupport: 'Airfare & Travel Support',
      monthlyStipend: 'Monthly Living Allowance',
      ieltsNotRequired: 'IELTS / TOEFL Not Required',
      ieltsRequired: 'IELTS / TOEFL Required',
      moiAcceptedDesc: 'This institution officially accepts an English Medium of Instruction (MOI) certificate from your previous school or university in place of IELTS.',
      aboutOpportunity: 'About this Opportunity'
    },
    ai: {
      title: 'FURSAD AI Advisor',
      tagline: 'Intelligent Guidance for Global Scholarships & Careers',
      groundedBadge: 'Grounded in Real Database',
      askPlaceholder: 'Ask about scholarships, MOI certificates, SOP tips, or deadlines...',
      askButton: 'Ask AI',
      thinking: 'FURSAD AI is analyzing verified opportunities...',
      clearChat: 'Reset Chat',
      welcomeMessage: 'Welcome! I am FURSAD AI, your intelligent advisor for global scholarships, internships, and youth opportunities. How can I assist your global journey today?',
      suggestedTitle: 'Recommended Prompts',
      suggestedSubtitle: 'Click any prompt to ask instantly',
      quickPrompts: {
        fullyFundedEurope: { label: "Fully Funded Master's", query: "Find fully funded Master's scholarships in Europe (Turkiye Burslari, DAAD, Chevening)" },
        moiNoIelts: { label: "MOI Accepted (No IELTS)", query: "Which scholarships and universities accept English Medium of Instruction (MOI) without IELTS or TOEFL?" },
        sopMotivation: { label: "SOP & Motivation Letter", query: "How do I write a winning Statement of Purpose (SOP) and Motivation Letter for scholarship selection?" },
        youthFlights: { label: "Youth Summits & Flights", query: "Find global youth conferences offering fully funded round-trip airfare and hotel accommodation" },
        paidInternships: { label: "Paid Internships & CERN", query: "Show me paid international internships and scientific research fellowships (like CERN, UN)" },
        checkEligibility: { label: "Check My Eligibility", query: "Evaluate which global opportunities I qualify for based on my background and MOI certificate." }
      },
      inputChips: [
        { label: "🎓 Fully Funded Europe", query: "Find fully funded Master's scholarships in Europe" },
        { label: "🌐 MOI (No IELTS)", query: "Which scholarships accept English MOI without IELTS?" },
        { label: "✍️ Write Great SOP", query: "How do I write a compelling Statement of Purpose (SOP)?" },
        { label: "✈️ Free Flights Summits", query: "Show me international conferences with free flights and hotel" },
        { label: "⏱️ Approaching Deadlines", query: "Which top opportunities have deadlines coming up soon?" }
      ],
      mentionedOpportunities: 'Verified Opportunities Mentioned:'
    },
    tracker: {
      title: 'Application Tracker',
      subtitle: 'Keep track of every stage in your scholarship and career applications.',
      addApplication: 'Add Application',
      emptyTitle: 'No applications tracked yet',
      emptyDesc: 'When you find an opportunity you love, click "Add to Tracker" to monitor your progress here.',
      stages: {
        saved: 'Saved',
        preparing: 'Preparing Documents',
        submitted: 'Submitted',
        under_review: 'Under Review',
        interview: 'Interview Stage',
        accepted: 'Accepted 🎉',
        rejected: 'Not Selected'
      },
      daysLeft: 'days remaining',
      updateStatus: 'Update Status',
      notes: 'Personal Notes',
      addNotes: 'Add personal notes...'
    },
    profile: {
      myProfile: 'My Profile',
      savedOpportunities: 'Saved Opportunities',
      applicationsSubmitted: 'Applications Submitted',
      shortlisted: 'Shortlisted',
      profileStrength: 'Profile Strength',
      myInterests: 'My Interests',
      edit: 'Edit',
      notificationSettings: 'Notification Settings',
      paymentPlans: 'Payment & Plans',
      helpSupport: 'Help & Support',
      inviteFriends: 'Invite Friends',
      logOut: 'Log Out',
      roleAdmin: 'Administrator',
      roleScholar: 'Global Scholar',
      selectLanguage: 'Select Language',
      interests: {
        scholarships: 'Scholarships',
        internships: 'Internships',
        conferences: 'Conferences',
        research: 'Research',
        grants: 'Grants',
        volunteering: 'Volunteering'
      }
    },
    onboarding: {
      page1: {
        tag: 'Page 1 / 3 • Global Discovery',
        title: 'Verified Global Opportunities',
        desc: 'Discover world-class scholarships, paid internships, international conferences, and research grants verified directly from official institutions.',
        item1Title: 'Fully Funded Scholarships',
        item1Desc: 'Scholarships covering full tuition, accommodation, flights, and monthly stipends.',
        item2Title: '100% Verified & Official',
        item2Desc: 'Direct links leading to official university portals and government embassies.',
        item3Title: 'Global Youth Conferences',
        item3Desc: 'CERN, UN Volunteers, World Youth Forum, and events providing full travel grants.'
      },
      page2: {
        tag: 'Page 2 / 3 • Artificial Intelligence',
        title: 'FURSAD AI & MOI (No IELTS)',
        desc: 'FURSAD AI helps you find top universities that accept English Medium of Instruction (MOI) certificates without requiring costly IELTS or TOEFL exams.',
        matchBadge: '98% Match',
        matchTitle: 'AI Profile Matching',
        matchDesc: 'Analyzes your major, GPA, and goals to instantly match you with ideal programs.',
        item1Title: 'English MOI Acceptance',
        item1Desc: 'Filter universities accepting language certificates from your previous university or high school.',
        item2Title: 'SOP & Motivation Letter Guidance',
        item2Desc: 'Get actionable tips and structures on crafting high-impact scholarship essays.'
      },
      page3: {
        tag: 'Page 3 / 3 • Application Pipeline',
        title: 'Track Applications & Succeed',
        desc: 'Never miss an important deadline. Save your favorite opportunities, prepare documents efficiently, and apply directly through official portals.',
        step1Title: 'Save & Bookmark',
        step1Desc: 'Click the Bookmark icon to curate your personal target list.',
        step2Title: 'Prepare Documents & Deadlines',
        step2Desc: 'Gather transcripts, recommendation letters, and motivation statements in advance.',
        step3Title: 'Apply on Official Portals',
        step3Desc: 'Click the Apply Online button to submit your application on official websites.'
      },
      next: 'Next',
      back: 'Back',
      skip: 'Skip',
      getStarted: 'Get Started'
    },
    common: {
      close: 'Close',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      share: 'Share',
      loading: 'Loading...',
      verified: 'Verified',
      officialWebsite: 'Official Website',
      copied: 'Copied to clipboard!',
      upgradeToPro: 'Upgrade to PRO',
      free: 'Free',
      language: 'Language'
    }
  },

  // ==========================================
  // ARABIC (AR) - RTL
  // ==========================================
  ar: {
    nav: {
      home: 'الرئيسية',
      saved: 'المحفوظات',
      scholarships: 'المنح الدراسية',
      internships: 'التدريب المهني',
      conferences: 'المؤتمرات',
      grants: 'المنح المالية',
      mentorship: 'الإرشاد والتوجيه',
      aiAssistant: 'فرصة AI',
      tracker: 'Tracker',
      profile: 'ملفي الشخصي',
      admin: 'لوحة التحكم',
      login: 'تسجيل الدخول',
      logout: 'تسجيل الخروج',
      upgrade: 'ترقية ($4)',
      proMember: 'عضوية PRO',
      notifications: 'الإشعارات',
      searchPlaceholder: 'ابحث عن منح، تدريب، مؤتمرات، دول...'
    },
    hero: {
      greeting: 'مرحباً',
      title: 'اعثر على فرصتك العالمية القادمة',
      subtitle: 'اكتشف منحاً دراسية ممولة بالكامل، وفرص تدريب مدفوعة، ومؤتمرات شبابية عالمية موثقة 100%.',
      searchPlaceholder: 'ابحث عن منح دراسية، تدريب مهني، منح مالية...',
      filterButton: 'تصفية',
      categories: {
        scholarships: 'المنح الدراسية',
        internships: 'التدريب المهني',
        conferences: 'المؤتمرات',
        grants: 'المنح المالية',
        fellowships: 'الزمالات',
        volunteering: 'التطوع',
        mentorship: 'الإرشاد',
        more: 'المزيد'
      },
      badges: {
        studyAbroad: 'الدراسة بالخارج',
        research: 'البحث العلمي',
        volunteering: 'العمل التطوعي',
        fellowships: 'برامج الزمالة'
      },
      stats: {
        verifiedOpps: 'فرصة موثقة',
        fundingSecured: 'تمويل المنح',
        countries: 'وجهة عالمية',
        acceptanceRate: 'نسبة القبول'
      }
    },
    feed: {
      featuredOpportunities: 'الفرص المميزة',
      allOpportunities: 'جميع الفرص',
      viewAll: 'عرض الكل',
      filterBy: 'تصفية حسب',
      degreeLevel: 'المستوى الأكاديمي',
      fundingType: 'نوع التمويل',
      region: 'المنطقة الجغرافية',
      moiAcceptedOnly: 'قبول شهادة لغة الجامعة (بدون IELTS)',
      noIeltsRequired: 'لا يشترط IELTS',
      allCategories: 'جميع الفئات',
      allDegrees: 'جميع المراحل الدراسية',
      allFunding: 'جميع أنواع التمويل',
      allRegions: 'جميع المناطق',
      noResults: 'لم يتم العثور على فرص تطابق معايير البحث الحالية',
      noResultsDesc: 'يرجى تجربة كلمات بحث أخرى أو إلغاء بعض عوامل التصفية.',
      clearFilters: 'إلغاء جميع الفلاتر',
      showingResults: 'عرض',
      verifiedBadge: 'موثق'
    },
    card: {
      deadline: 'الموعد النهائي:',
      fullyFunded: 'ممولة بالكامل',
      paid: 'مدفوعة الأجر',
      free: 'مجاني',
      tuitionWaiver: 'إعفاء من الرسوم',
      moiBadge: 'شهادة MOI',
      match: 'توافق',
      save: 'حفظ',
      saved: 'تم الحفظ',
      viewDetails: 'عرض التفاصيل',
      applyNow: 'قدّم الآن'
    },
    detail: {
      backToFeed: 'العودة إلى قائمة الفرص',
      overview: 'نظرة عامة',
      financialBenefits: 'المزايا المالية والتمويل',
      eligibility: 'شروط القبول والمعايير',
      documentsRequired: 'المستندات المطلوبة للتقديم',
      languageReq: 'متطلبات اللغة وشهادة MOI',
      howToApply: 'طريقة وخطوات التقديم',
      aboutOrg: 'عن الجامعة / المنظمة المضيفة',
      verifiedSource: 'المصدر الرسمي الموثق',
      reportIssue: 'الإبلاغ عن مشكلة',
      applyOfficial: 'التقديم عبر البوابة الرسمية',
      addToTracker: 'إضافة إلى متابعة الطلبات',
      inTracker: 'موجود في متابعة الطلبات',
      shareOpportunity: 'مشاركة الفرصة',
      deadlineNotice: 'آخر موعد للتقديم',
      deadlinePassed: 'انتهت فترة التقديم',
      tuitionCoverage: 'تغطية الرسوم الدراسية',
      accommodation: 'السكن والإقامة',
      travelSupport: 'تذاكر الطيران وتكاليف السفر',
      monthlyStipend: 'الراتب الشهري',
      ieltsNotRequired: 'اختبار IELTS غير مطلوب',
      ieltsRequired: 'اختبار IELTS / TOEFL مطلوب',
      moiAcceptedDesc: 'تقبل هذه المؤسسة شهادة لغة التدريس الإنجليزية (MOI) الصادرة من جامعتك أو مدرستك السابقة كبديل لاختبار الآيلتس.',
      aboutOpportunity: 'حول هذه الفرصة'
    },
    ai: {
      title: 'مستشار فرصة الذكي (FURSAD AI)',
      tagline: 'الذكاء الاصطناعي للمنح الدراسية والفرص العالمية',
      groundedBadge: 'مستند إلى قاعدة بيانات رسمية وموثقة',
      askPlaceholder: 'اسأل عن المنح، شهادة MOI، كتابة خطاب الغرض SOP، أو المواعيد النهائية...',
      askButton: 'اسأل الذكاء الاصطناعي',
      thinking: 'يقوم مساعد فرصة بالبحث في قاعدة البيانات الموثقة...',
      clearChat: 'بدء محادثة جديدة',
      welcomeMessage: 'مرحباً بك! أنا مساعد فرصة الذكي (FURSAD AI)، مرشدك المتخصص في المنح الدراسية والفرص العالمية. كيف يمكنني مساعدتك في مسيرتك اليوم؟',
      suggestedTitle: 'أسئلة مقترحة',
      suggestedSubtitle: 'اضغط على أي سؤال لطرحه مباشرة',
      quickPrompts: {
        fullyFundedEurope: { label: "منح الماجستير الممولة بالكامل", query: "ابحث لي عن منح ماجستير ممولة بالكامل في أوروبا (المنحة التركية، داد الألمانية، تشيفنينج البريطانية)" },
        moiNoIelts: { label: "منح تقبل شهادة MOI (بدون IELTS)", query: "ما هي المنح والجامعات التي تقبل شهادة لغة التدريس الإنجليزية MOI بدون الحاجة إلى شهادة IELTS أو TOEFL؟" },
        sopMotivation: { label: "كتابة خطاب الغرض SOP والدافع", query: "كيف أكتب خطاب الغرض من الدراسة (Statement of Purpose) وخطاب الدافع بشكل احترافي يضمن القبول؟" },
        youthFlights: { label: "مؤتمرات الشباب وتذاكر مجانية", query: "ابحث لي عن مؤتمرات دولية للشباب توفر تذاكر طيران وإقامة مجانية بالكامل" },
        paidInternships: { label: "فرص تدريب وبحوث مدفوعة (CERN)", query: "أرني فرص التدريب الدولي المدفوع وبرامج الزمالة العلمية في المنظمات العالمية مثل سيرن والأمم المتحدة" },
        checkEligibility: { label: "تقييم أهليتي للمنح", query: "قيّم الفرص التي أستحق التقديم عليها بناءً على مؤهلي الدراسي ومعدلي وشهادة MOI." }
      },
      inputChips: [
        { label: "🎓 منح ممولة بالكامل في أوروبا", query: "ابحث لي عن منح ماجستير ممولة بالكامل في أوروبا" },
        { label: "🌐 بدون آيلتس (شهادة MOI)", query: "ما هي المنح التي تقبل شهادة English MOI بدون آيلتس؟" },
        { label: "✍️ كيفية كتابة خطاب SOP", query: "كيف أكتب خطاب غرض SOP قوي للقبول بالمنحة؟" },
        { label: "✈️ مؤتمرات مع تذاكر طيران", query: "أرني مؤتمرات دولية تقدم تذاكر طيران وفنادق مجانية" },
        { label: "⏱️ منح قاربت مواعيدها على الانتهاء", query: "ما هي أهم المنح التي ينتهي التقديم عليها قريباً؟" }
      ],
      mentionedOpportunities: 'الفرص الموثقة المذكورة في الإجابة:'
    },
    tracker: {
      title: 'Application Tracker',
      subtitle: 'تابع جميع مراحل طلباتك للمنح الدراسية والفرص في مكان واحد منظم.',
      addApplication: 'إضافة طلب جديد',
      emptyTitle: 'لم تقم بإضافة أي طلبات حتى الآن',
      emptyDesc: 'عندما تعجبك فرصة معينة، اضغط على "إضافة إلى متابعة الطلبات" لمراقبة تقدمك هنا.',
      stages: {
        saved: 'محفوظ',
        preparing: 'تجهيز المستندات',
        submitted: 'تم إرسال الطلب',
        under_review: 'قيد المراجعة',
        interview: 'مرحلة المقابلة',
        accepted: 'تم القبول بنجاح 🎉',
        rejected: 'لم يتم الاختيار'
      },
      daysLeft: 'أيام متبقية',
      updateStatus: 'تحديث المرحلة',
      notes: 'الملاحظات الشخصية',
      addNotes: 'أضف ملاحظاتك الخاصة...'
    },
    profile: {
      myProfile: 'الملف الشخصي',
      savedOpportunities: 'الفرص المحفوظة',
      applicationsSubmitted: 'الطلبات المقدمة',
      shortlisted: 'القائمة المختصرة',
      profileStrength: 'اكتمال الملف',
      myInterests: 'اهتماماتي',
      edit: 'تعديل',
      notificationSettings: 'إعدادات الإشعارات',
      paymentPlans: 'الخطط والاشتراكات',
      helpSupport: 'المساعدة والدعم',
      inviteFriends: 'دعوة الأصدقاء',
      logOut: 'تسجيل الخروج',
      roleAdmin: 'مسؤول النظام',
      roleScholar: 'باحث أكاديمي',
      selectLanguage: 'اختر اللغة / Select Language',
      interests: {
        scholarships: 'المنح الدراسية',
        internships: 'التدريب المهني',
        conferences: 'المؤتمرات',
        research: 'البحث العلمي',
        grants: 'المنح المالية',
        volunteering: 'العمل التطوعي'
      }
    },
    onboarding: {
      page1: {
        tag: 'الصفحة 1 / 3 • الاستكشاف العالمي',
        title: 'منح وفرص عالمية موثقة',
        desc: 'اكتشف أفضل المنح الدراسية، وفرص التدريب المهني المدفوع، والمؤتمرات الدولية الموثقة مباشرة من الجهات والجامعات الرسمية.',
        item1Title: 'منح دراسية ممولة بالكامل',
        item1Desc: 'تغطي الرسوم الدراسية كاملة، السكن الجامعي، تذاكر الطيران، والراتب الشهري.',
        item2Title: 'روابط رسمية موثقة 100%',
        item2Desc: 'روابط مباشرة تنقلك إلى بوابات الجامعات والسفارات الرسمية دون وسطاء.',
        item3Title: 'مؤتمرات وتدريب دولي',
        item3Desc: 'منظمة سيرن، متطوعو الأمم المتحدة، منتدى شباب العالم، وتدريب مدفوع الأجر.'
      },
      page2: {
        tag: 'الصفحة 2 / 3 • الذكاء الاصطناعي',
        title: 'مساعد فرصة والمنح بدون آيلتس (MOI)',
        desc: 'يساعدك مستشار فرصة الذكي في العثور على الجامعات التي تقبل شهادة لغة التدريس السابقة (MOI) كبديل لاختبارات الآيلتس والتوفل المكلفة.',
        matchBadge: 'توافق 98%',
        matchTitle: 'مطابقة الملف الشخصي بالذكاء الاصطناعي',
        matchDesc: 'يحلل تخصصك ومعدلك التراكمي ليرشح لك البرامج الأنسب فوراً.',
        item1Title: 'قبول شهادة MOI باللغة الإنجليزية',
        item1Desc: 'تصفية الجامعات التي تقبل شهادة إتمام الدراسة بالإنجليزية من جامعتك السابقة.',
        item2Title: 'إرشادات كتابة خطاب الغرض SOP',
        item2Desc: 'احصل على نماذج ونصائح قوية لصياغة خطابات دافع متميزة تزيد فرص قبولك.'
      },
      page3: {
        tag: 'الصفحة 3 / 3 • خطة التقديم والمتابعة',
        title: 'تابع طلباتك واضمن نجاحك',
        desc: 'لا تفوت المواعيد النهائية المهمة. احفظ الفرص المفضلة لديك، جهز أوراقك بكفاءة، وقدّم مباشرة عبر البوابات الرسمية.',
        step1Title: 'احفظ الفرص المناسبة',
        step1Desc: 'اضغط على أيقونة الحفظ لإنشاء قائمتك المستهدفة.',
        step2Title: 'جهّز المستندات والمواعيد',
        step2Desc: 'اجمع كشوف الدرجات، خطابات التوصية، وخطاب الدافع مسبقاً.',
        step3Title: 'قدّم عبر البوابة الرسمية',
        step3Desc: 'اضغط على زر التقديم عبر الإنترنت للانتقال المباشر لبوابة التقديم.'
      },
      next: 'التالي',
      back: 'رجوع',
      skip: 'تخطي',
      getStarted: 'ابدأ الآن'
    },
    common: {
      close: 'إغلاق',
      save: 'حفظ',
      cancel: 'إلغاء',
      delete: 'حذف',
      edit: 'تعديل',
      share: 'مشاركة',
      loading: 'جاري التحميل...',
      verified: 'موثق',
      officialWebsite: 'الموقع الرسمي',
      copied: 'تم النسخ إلى الحافظة!',
      upgradeToPro: 'الترقية إلى باقة PRO',
      free: 'مجاني',
      language: 'اللغة'
    }
  },

  // ==========================================
  // FRENCH (FR)
  // ==========================================
  fr: {
    nav: {
      home: 'Accueil',
      saved: 'Enregistrés',
      scholarships: 'Bourses d\'études',
      internships: 'Stages',
      conferences: 'Conférences',
      grants: 'Subventions',
      mentorship: 'Mentorat',
      aiAssistant: 'FURSAD AI',
      tracker: 'Tracker',
      profile: 'Mon Profil',
      admin: 'Administration',
      login: 'Se connecter',
      logout: 'Se déconnecter',
      upgrade: 'Mettre à niveau ($4)',
      proMember: 'Membre PRO',
      notifications: 'Notifications',
      searchPlaceholder: 'Rechercher des bourses, stages, conférences, pays...'
    },
    hero: {
      greeting: 'Bonjour',
      title: 'Trouvez Votre Prochaine Opportunité Mondiale',
      subtitle: 'Découvrez des bourses entièrement financées, des stages rémunérés et des sommets internationaux de la jeunesse 100% vérifiés.',
      searchPlaceholder: 'Rechercher des bourses, stages, subventions...',
      filterButton: 'Filtrer',
      categories: {
        scholarships: 'Bourses',
        internships: 'Stages',
        conferences: 'Conférences',
        grants: 'Subventions',
        fellowships: 'Bourses de recherche',
        volunteering: 'Bénévolat',
        mentorship: 'Mentorat',
        more: 'Plus'
      },
      badges: {
        studyAbroad: 'Étudier à l\'étranger',
        research: 'Recherche',
        volunteering: 'Bénévolat',
        fellowships: 'Bourses de recherche'
      },
      stats: {
        verifiedOpps: 'Opportunités Vérifiées',
        fundingSecured: 'Financements Alloués',
        countries: 'Destinations Mondiales',
        acceptanceRate: 'Taux de Réussite'
      }
    },
    feed: {
      featuredOpportunities: 'Opportunités à la Une',
      allOpportunities: 'Toutes les Opportunités',
      viewAll: 'Tout voir',
      filterBy: 'Filtrer par',
      degreeLevel: 'Niveau d\'études',
      fundingType: 'Type de financement',
      region: 'Région',
      moiAcceptedOnly: 'Attestation MOI (Sans IELTS)',
      noIeltsRequired: 'IELTS non requis',
      allCategories: 'Toutes les catégories',
      allDegrees: 'Tous les niveaux',
      allFunding: 'Tous les financements',
      allRegions: 'Toutes les régions',
      noResults: 'Aucune opportunité ne correspond à vos critères de recherche',
      noResultsDesc: 'Essayez de modifier vos termes de recherche ou de réinitialiser vos filtres.',
      clearFilters: 'Effacer les filtres',
      showingResults: 'Affichage de',
      verifiedBadge: 'Vérifié'
    },
    card: {
      deadline: 'Date limite:',
      fullyFunded: 'Entièrement Financé',
      paid: 'Poste Rémunéré',
      free: 'Gratuit',
      tuitionWaiver: 'Exonération des frais',
      moiBadge: 'MOI',
      match: 'Correspondance',
      save: 'Enregistrer',
      saved: 'Enregistré',
      viewDetails: 'Détails',
      applyNow: 'Postuler'
    },
    detail: {
      backToFeed: 'Retour aux opportunités',
      overview: 'Aperçu général',
      financialBenefits: 'Avantages financiers & Couverture',
      eligibility: 'Critères d\'éligibilité & Conditions',
      documentsRequired: 'Documents requis pour postuler',
      languageReq: 'Exigences linguistiques & Certificat MOI',
      howToApply: 'Guide de candidature étape par étape',
      aboutOrg: 'À propos de l\'université / Organisation',
      verifiedSource: 'Source officielle vérifiée',
      reportIssue: 'Signaler un problème',
      applyOfficial: 'Postuler sur le portail officiel',
      addToTracker: 'Ajouter au suivi des candidatures',
      inTracker: 'Dans votre suivi',
      shareOpportunity: 'Partager l\'opportunité',
      deadlineNotice: 'Date limite de candidature',
      deadlinePassed: 'La date limite est dépassée',
      tuitionCoverage: 'Frais de scolarité couverts',
      accommodation: 'Logement & Hébergement',
      travelSupport: 'Billets d\'avion & Transport',
      monthlyStipend: 'Allocation mensuelle de subsistance',
      ieltsNotRequired: 'IELTS / TOEFL non requis',
      ieltsRequired: 'IELTS / TOEFL requis',
      moiAcceptedDesc: 'Cette institution accepte officiellement une attestation de langue anglaise (Medium of Instruction - MOI) de votre université précédente au lieu de l\'IELTS.',
      aboutOpportunity: 'À propos de cette opportunité'
    },
    ai: {
      title: 'Conseiller FURSAD AI',
      tagline: 'Intelligence Artificielle pour Bourses & Opportunités Mondiales',
      groundedBadge: 'Basé sur une base de données vérifiée',
      askPlaceholder: 'Posez une question sur les bourses, certificats MOI, lettres SOP...',
      askButton: 'Demander à l\'IA',
      thinking: 'FURSAD AI analyse les opportunités vérifiées...',
      clearChat: 'Réinitialiser',
      welcomeMessage: 'Bienvenue ! Je suis FURSAD AI, votre conseiller intelligent pour les bourses internationales, les stages et les opportunités pour la jeunesse. Comment puis-je vous aider aujourd\'hui ?',
      suggestedTitle: 'Suggestions de questions',
      suggestedSubtitle: 'Cliquez sur une question pour la poser directement',
      quickPrompts: {
        fullyFundedEurope: { label: "Bourses Master Entièrement Financées", query: "Trouve-moi des bourses de Master entièrement financées en Europe (Turkiye Burslari, DAAD, Chevening)" },
        moiNoIelts: { label: "Acceptation MOI (Sans IELTS)", query: "Quelles bourses et universités acceptent l'attestation English MOI sans exiger d'examen IELTS ou TOEFL ?" },
        sopMotivation: { label: "Rédaction SOP & Lettre de motivation", query: "Comment rédiger un Statement of Purpose (SOP) et une lettre de motivation percutante pour obtenir une bourse ?" },
        youthFlights: { label: "Sommets Jeunesse & Billets Gratuits", query: "Trouve-moi des conférences internationales pour jeunes offrant des billets d'avion et l'hôtel gratuits" },
        paidInternships: { label: "Stages Rémunérés & CERN", query: "Montre-moi des opportunités de stages internationaux rémunérés et des programmes de recherche (CERN, ONU)" },
        checkEligibility: { label: "Évaluer mon éligibilité", query: "Évalue les opportunités auxquelles je suis éligible en fonction de mon profil et de mon certificat MOI." }
      },
      inputChips: [
        { label: "🎓 Bourses Master Europe", query: "Trouve-moi des bourses de Master entièrement financées en Europe" },
        { label: "🌐 Sans IELTS (Certificat MOI)", query: "Quelles bourses acceptent le certificat MOI sans IELTS ?" },
        { label: "✍️ Rédiger une SOP", query: "Comment rédiger un bon Statement of Purpose (SOP) pour une bourse ?" },
        { label: "✈️ Conférences avec vols gratuits", query: "Montre-moi des conférences internationales avec vols et hôtel gratuits" },
        { label: "⏱️ Dates limites proches", query: "Quelles sont les opportunités importantes dont la date limite approche ?" }
      ],
      mentionedOpportunities: 'Opportunités vérifiées mentionnées :'
    },
    tracker: {
      title: 'Application Tracker',
      subtitle: 'Suivez chaque étape de vos candidatures aux bourses et programmes internationaux.',
      addApplication: 'Ajouter une candidature',
      emptyTitle: 'Aucune candidature suivie pour le moment',
      emptyDesc: 'Lorsque vous trouvez une opportunité qui vous intéresse, cliquez sur "Ajouter au suivi" pour la retrouver ici.',
      stages: {
        saved: 'Enregistré',
        preparing: 'Préparation des documents',
        submitted: 'Candidature soumise',
        under_review: 'En cours d\'examen',
        interview: 'Entretien',
        accepted: 'Admis avec succès 🎉',
        rejected: 'Non retenu'
      },
      daysLeft: 'jours restants',
      updateStatus: 'Mettre à jour le statut',
      notes: 'Notes personnelles',
      addNotes: 'Ajouter une note personnelle...'
    },
    profile: {
      myProfile: 'Mon Profil',
      savedOpportunities: 'Opportunités Enregistrées',
      applicationsSubmitted: 'Candidatures Soumises',
      shortlisted: 'Présélectionné',
      profileStrength: 'Force du Profil',
      myInterests: 'Mes Centres d\'Intérêt',
      edit: 'Modifier',
      notificationSettings: 'Paramètres des notifications',
      paymentPlans: 'Abonnements & Forfaits',
      helpSupport: 'Aide & Support',
      inviteFriends: 'Inviter des amis',
      logOut: 'Se Déconnecter',
      roleAdmin: 'Administrateur',
      roleScholar: 'Étudiant International',
      selectLanguage: 'Choisir la langue / Select Language',
      interests: {
        scholarships: 'Bourses d\'études',
        internships: 'Stages',
        conferences: 'Conférences',
        research: 'Recherche',
        grants: 'Subventions',
        volunteering: 'Bénévolat'
      }
    },
    onboarding: {
      page1: {
        tag: 'Page 1 / 3 • Découverte Mondiale',
        title: 'Opportunités Mondiales Vérifiées',
        desc: 'Découvrez des bourses d\'études de renommée mondiale, des stages rémunérés, des conférences jeunesse et des subventions de recherche vérifiés directement auprès des institutions officielles.',
        item1Title: 'Bourses Entièrement Financées',
        item1Desc: 'Couvrant l\'intégralité des frais de scolarité, le logement, les billets d\'avion et une allocation mensuelle.',
        item2Title: '100% Officiel & Vérifié',
        item2Desc: 'Des liens directs vous reliant aux portails officiels des universités et des ambassades.',
        item3Title: 'Conférences & Stages Internationaux',
        item3Desc: 'CERN, Volontaires de l\'ONU, Forum mondial de la jeunesse et événements avec prise en charge totale.'
      },
      page2: {
        tag: 'Page 2 / 3 • Intelligence Artificielle',
        title: 'FURSAD AI & Bourses Sans IELTS (MOI)',
        desc: 'FURSAD AI vous aide à trouver des universités prestigieuses qui acceptent les attestations de langue anglaise (MOI) sans passer les coûteux examens IELTS ou TOEFL.',
        matchBadge: '98% Match',
        matchTitle: 'Matching de Profil par IA',
        matchDesc: 'Analyse votre spécialité, votre moyenne et vos objectifs pour vous proposer les programmes idéaux.',
        item1Title: 'Acceptation du Certificat MOI',
        item1Desc: 'Filtrez les universités acceptant les attestations linguistiques de votre université ou lycée précédent.',
        item2Title: 'Conseils pour la SOP & Lettre de motivation',
        item2Desc: 'Obtenez des conseils concrets pour rédiger des lettres de motivation percutantes.'
      },
      page3: {
        tag: 'Page 3 / 3 • Pipeline de Candidature',
        title: 'Suivez vos Candidatures & Réussissez',
        desc: 'Ne manquez aucune date limite importante. Enregistrez vos opportunités préférées, préparez vos documents et postulez directement sur les portails officiels.',
        step1Title: 'Sélectionnez & Enregistrez',
        step1Desc: 'Cliquez sur l\'icône Enregistrer pour créer votre liste cible personnalisée.',
        step2Title: 'Suivez les Délais & Préparez les Documents',
        step2Desc: 'Rassemblez vos relevés de notes, lettres de recommandation et lettres de motivation.',
        step3Title: 'Postulez sur le Portail Officiel',
        step3Desc: 'Cliquez sur le bouton Postuler en ligne pour soumettre votre dossier sur le site officiel.'
      },
      next: 'Suivant',
      back: 'Retour',
      skip: 'Passer',
      getStarted: 'Commencer'
    },
    common: {
      close: 'Fermer',
      save: 'Enregistrer',
      cancel: 'Annuler',
      delete: 'Supprimer',
      edit: 'Modifier',
      share: 'Partager',
      loading: 'Chargement...',
      verified: 'Vérifié',
      officialWebsite: 'Site Officiel',
      copied: 'Copié dans le presse-papiers !',
      upgradeToPro: 'Passer à la formule PRO',
      free: 'Gratuit',
      language: 'Langue'
    }
  }
};
