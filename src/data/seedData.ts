import { Mentor, DataSource, SuccessStory, CountryStat, SyncLog } from '../types';

export const initialMentors: Mentor[] = [
  {
    id: 'mentor-1',
    name: 'Dr. Abdirahman Shire',
    role: 'DAAD Scholar & Research Fellow',
    organization: 'Technical University of Munich (TUM)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    country: 'Germany',
    flag: '🇩🇪',
    originCountry: 'Somalia',
    education: 'PhD in Renewable Energy & Engineering, TUM',
    languages: ['English', 'Somali', 'German'],
    expertise: ['DAAD Applications', 'German University Admissions', 'SOP & Motivation Letters', 'Engineering Master’s'],
    alumniOf: ['DAAD EPOS Fellow', 'TUM Alumni', 'Somali STEM Society'],
    rating: 4.98,
    reviewsCount: 47,
    price: 'Free / Community',
    bio: 'Won DAAD EPOS scholarship in 2020. I have mentored over 60 students from East Africa into fully-funded German & European Master’s and PhD programs with Medium of Instruction (MOI) certificates.',
    availableDays: ['Tuesdays', 'Thursdays', 'Saturdays']
  },
  {
    id: 'mentor-2',
    name: 'Dr. Fatima Zahra Hassan',
    role: 'Chevening Scholar & Public Policy Analyst',
    organization: 'Oxford University / Blavatnik School of Government',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    country: 'United Kingdom',
    flag: '🇬🇧',
    originCountry: 'Somalia / UK Diaspora',
    education: 'Master of Public Policy (MPP), University of Oxford',
    languages: ['English', 'Somali', 'Arabic'],
    expertise: ['Chevening Scholarship Essays', 'Oxford & Cambridge Admissions', 'Policy Fellowships', 'Interview Coaching'],
    alumniOf: ['Chevening 2021', 'Oxford Union', 'African Youth Leadership Council'],
    rating: 5.0,
    reviewsCount: 62,
    price: '$25 / 45min Session',
    bio: 'Specialist in crafting award-winning leadership essays for Chevening, Gates Cambridge, and Commonwealth awards. Over 18 of my direct mentees secured full awards in the 2024–2025 cohort.',
    availableDays: ['Mondays', 'Wednesdays', 'Sundays']
  },
  {
    id: 'mentor-3',
    name: 'Eng. Zakaria Nur',
    role: 'AI Researcher & Erasmus Mundus Alumnus',
    organization: 'KTH Royal Institute of Technology & Univ. of Madrid',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    country: 'Sweden',
    flag: '🇸🇪',
    originCountry: 'Somalia / Kenya',
    education: 'Joint Master in Machine Learning & Robotics (Erasmus Mundus)',
    languages: ['English', 'Somali', 'Swedish'],
    expertise: ['Erasmus Mundus EMJM', 'Tech & AI Fellowships', 'No-IELTS / MOI Pathways', 'CV Optimization'],
    alumniOf: ['Erasmus Mundus Scholar', 'KTH Stockholm', 'Google Developer Group'],
    rating: 4.95,
    reviewsCount: 38,
    price: '$15 / 30min Session',
    bio: 'Transferred from a local African university into an Erasmus Mundus Master’s studying in France, Spain, and Sweden on a full scholarship. I assist tech applicants in building winning portfolios.',
    availableDays: ['Fridays', 'Saturdays']
  },
  {
    id: 'mentor-4',
    name: 'Ilhan Warsame',
    role: 'UN Youth Delegate & International Conference Strategist',
    organization: 'United Nations Economic Commission for Africa',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    country: 'Switzerland',
    flag: '🇨🇭',
    originCountry: 'Somalia / US Diaspora',
    education: 'B.A. International Relations, Georgetown University',
    languages: ['English', 'Somali', 'French'],
    expertise: ['Youth Summit Delegate Applications', 'One Young World', 'UN Youth Assemblies', 'Travel Grant Applications'],
    alumniOf: ['One Young World Ambassador', 'World Youth Forum Delegate', 'UN Foundation Fellow'],
    rating: 4.92,
    reviewsCount: 51,
    price: 'Free / Community',
    bio: 'Secured full funding for 9 international summits across 7 countries. Passionate about empowering first-time conference delegates to win international travel grants and ace visa interviews.',
    availableDays: ['Wednesdays', 'Saturdays']
  }
];

export const initialDataSources: DataSource[] = [
  {
    id: 'src-eu-funding',
    name: 'European Commission (EU Funding & Tenders API)',
    type: 'api',
    status: 'active',
    lastSync: '2026-08-30 00:15 UTC',
    lastSynced: '2026-08-30 00:15 UTC',
    recordsImported: 4120,
    totalIngested: 4120,
    activeOpportunities: 284,
    endpointUrl: 'https://api.tech.ec.europa.eu/funding-tenders/v1/opportunities',
    url: 'https://api.tech.ec.europa.eu/funding-tenders/v1/opportunities',
    description: 'Official API feed for Erasmus+, Horizon Europe, Youth in Action, and European Solidarity Corps funding programmes.',
    syncFrequencyHours: 6,
    syncFrequency: 'Every 6 hours'
  },
  {
    id: 'src-grants-gov',
    name: 'Grants.gov & Simpler.Grants.gov Official Feed',
    type: 'api',
    status: 'active',
    lastSync: '2026-08-30 00:10 UTC',
    lastSynced: '2026-08-30 00:10 UTC',
    recordsImported: 8930,
    totalIngested: 8930,
    activeOpportunities: 195,
    endpointUrl: 'https://api.grants.gov/v1/opportunities/search',
    url: 'https://api.grants.gov/v1/opportunities/search',
    description: 'Direct federal US government opportunities, State Department academic exchanges, and international youth leadership grants.',
    syncFrequencyHours: 6,
    syncFrequency: 'Every 6 hours'
  },
  {
    id: 'src-reliefweb-api',
    name: 'ReliefWeb API (UN OCHA)',
    type: 'api',
    status: 'active',
    lastSync: '2026-08-29 23:45 UTC',
    lastSynced: '2026-08-29 23:45 UTC',
    recordsImported: 6240,
    totalIngested: 6240,
    activeOpportunities: 312,
    endpointUrl: 'https://api.reliefweb.int/v1/jobs?appname=fursad-youth',
    url: 'https://api.reliefweb.int/v1/jobs?appname=fursad-youth',
    description: 'UN and international humanitarian organizations fellowship, entry-level internship, and training opportunities worldwide.',
    syncFrequencyHours: 6,
    syncFrequency: 'Every 6 hours'
  },
  {
    id: 'src-daad-official',
    name: 'DAAD & German Academic Exchange Feeds',
    type: 'curated_feed',
    status: 'active',
    lastSync: '2026-08-30 00:00 UTC',
    lastSynced: '2026-08-30 00:00 UTC',
    recordsImported: 1840,
    totalIngested: 1840,
    activeOpportunities: 148,
    endpointUrl: 'https://www2.daad.de/deutschland/stipendien/datenbank/feed',
    url: 'https://www2.daad.de/deutschland/stipendien/datenbank/feed',
    description: 'Verified German university development scholarships, EPOS programs, Helmut Schmidt programmes, and research stipends.',
    syncFrequencyHours: 12,
    syncFrequency: 'Every 12 hours'
  },
  {
    id: 'src-chevening-uk',
    name: 'UK FCDO & Commonwealth Scholarship Registry',
    type: 'curated_feed',
    status: 'active',
    lastSync: '2026-08-29 22:30 UTC',
    lastSynced: '2026-08-29 22:30 UTC',
    recordsImported: 1420,
    totalIngested: 1420,
    activeOpportunities: 116,
    endpointUrl: 'https://www.chevening.org/api/v1/scholarships-catalog',
    url: 'https://www.chevening.org/api/v1/scholarships-catalog',
    description: 'UK government international postgraduate awards, Commonwealth fellowships, and GREAT scholarships.',
    syncFrequencyHours: 12,
    syncFrequency: 'Every 12 hours'
  },
  {
    id: 'src-un-volunteers',
    name: 'United Nations Unified Volunteering Platform (UVP)',
    type: 'api',
    status: 'active',
    lastSync: '2026-08-30 00:05 UTC',
    lastSynced: '2026-08-30 00:05 UTC',
    recordsImported: 3560,
    totalIngested: 3560,
    activeOpportunities: 230,
    endpointUrl: 'https://app.unv.org/api/v2/opportunities',
    url: 'https://app.unv.org/api/v2/opportunities',
    description: 'UN Youth Volunteer and national/international youth deployments across UNDP, UNICEF, UNHCR, WHO, and WFP.',
    syncFrequencyHours: 6,
    syncFrequency: 'Every 6 hours'
  }
];

export const initialSyncLogs: SyncLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-08-30 00:15:22 UTC',
    sourceId: 'src-eu-funding',
    sourceName: 'EU Funding & Tenders API',
    status: 'success',
    newRecords: 14,
    updatedRecords: 38,
    expiredFlagged: 6,
    duplicatesSkipped: 82,
    durationMs: 1420
  },
  {
    id: 'log-2',
    timestamp: '2026-08-30 00:10:04 UTC',
    sourceId: 'src-grants-gov',
    sourceName: 'Grants.gov Feed',
    status: 'success',
    newRecords: 9,
    updatedRecords: 22,
    expiredFlagged: 3,
    duplicatesSkipped: 110,
    durationMs: 2180
  },
  {
    id: 'log-3',
    timestamp: '2026-08-29 23:45:19 UTC',
    sourceId: 'src-reliefweb-api',
    sourceName: 'ReliefWeb API',
    status: 'success',
    newRecords: 18,
    updatedRecords: 45,
    expiredFlagged: 8,
    duplicatesSkipped: 140,
    durationMs: 1650
  }
];

export const initialSuccessStories: SuccessStory[] = [
  {
    id: 'story-1',
    name: 'Khadra Mohamud',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    originCountry: 'Somalia',
    destinationCountry: 'Germany',
    opportunityWon: 'DAAD EPOS Full Master’s Scholarship in Renewable Systems',
    organization: 'Technical University of Berlin',
    category: 'scholarship',
    year: '2025 Winner',
    quote: 'FURSAD showed me that my university Medium of Instruction (MOI) was completely accepted by German universities without having to spend $250 on an IELTS test. Today I am studying in Berlin with a full monthly stipend!',
    advice: 'Never assume you are disqualified before checking the official MOI rules. Highlight your local community problem-solving in your motivation letter.'
  },
  {
    id: 'story-2',
    name: 'Hamza Osman',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    originCountry: 'Somalia (Mogadishu)',
    destinationCountry: 'United Kingdom',
    opportunityWon: 'Chevening UK Master’s Scholarship in Public Health',
    organization: 'London School of Hygiene & Tropical Medicine',
    category: 'scholarship',
    year: '2024 Winner',
    quote: 'The FURSAD application tracker and AI essay reviewer helped me structure my 4 Chevening essays clearly. When my interview invitation came, I was ready and confident.',
    advice: 'Treat every section of your application with intentionality. Quantify the impact you created in your home country.'
  },
  {
    id: 'story-3',
    name: 'Amina Jama',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    originCountry: 'Kenya / Somali Diaspora',
    destinationCountry: 'Egypt & Switzerland',
    opportunityWon: 'World Youth Forum & One Young World Fully Funded Delegate',
    organization: 'One Young World & WYF',
    category: 'conference',
    year: '2025 Delegate',
    quote: 'I secured 100% funded flight tickets and hotel accommodations to represent youth innovation at two international summits. FURSAD is an absolute lifesaver for young leaders.',
    advice: 'Apply early for conference travel bursaries. Organizers allocate flight funding to the top 10% of well-articulated social impact applicants.'
  }
];

export const initialCountryStats: CountryStat[] = [
  {
    country: 'Germany',
    code: 'DE',
    flag: '🇩🇪',
    region: 'Europe',
    opportunityCount: 1240,
    fullyFundedCount: 420,
    topScholarships: ['DAAD EPOS', 'Deutschlandstipendium', 'Heinrich Böll Foundation', 'Konrad-Adenauer'],
    visaGuide: 'Requires admission letter, German health insurance, and either scholarship confirmation or Blocked Account (Sperrkonto). MOI accepted for many English-taught degrees.'
  },
  {
    country: 'United Kingdom',
    code: 'GB',
    flag: '🇬🇧',
    region: 'Europe',
    opportunityCount: 980,
    fullyFundedCount: 310,
    topScholarships: ['Chevening Scholarships', 'Commonwealth Awards', 'Gates Cambridge', 'Rhodes Oxford'],
    visaGuide: 'Student Route (CAS) requires unconditional offer letter, English proficiency verification, and Tuberculosis clearance certificate.'
  },
  {
    country: 'United States',
    code: 'US',
    flag: '🇺🇸',
    region: 'North America',
    opportunityCount: 1100,
    fullyFundedCount: 380,
    topScholarships: ['Fulbright Foreign Student Program', 'SUSI for Leaders', 'Hubert H. Humphrey', 'Knight-Hennessy'],
    visaGuide: 'F-1 or J-1 exchange visa requires Form I-20 / DS-2019, SEVIS I-901 fee receipt, and consular embassy interview.'
  },
  {
    country: 'Canada',
    code: 'CA',
    flag: '🇨🇦',
    region: 'North America',
    opportunityCount: 750,
    fullyFundedCount: 210,
    topScholarships: ['Vanier Canada Graduate Scholarships', 'Mastercard Foundation at McGill/UBC', 'Trudeau Foundation'],
    visaGuide: 'Study Permit requires Provincial Attestation Letter (PAL), Letter of Acceptance (LOA), and proof of funds.'
  },
  {
    country: 'Turkey',
    code: 'TR',
    flag: '🇹🇷',
    region: 'Middle East',
    opportunityCount: 620,
    fullyFundedCount: 290,
    topScholarships: ['Türkiye Bursları (YTB)', 'TÜBİTAK International Research Fellowship', 'IsDB-Turkey Joint Award'],
    visaGuide: 'Full scholarship winners receive direct student visa approval upon presenting official YTB award letter at Turkish Embassy.'
  },
  {
    country: 'Switzerland',
    code: 'CH',
    flag: '🇨🇭',
    region: 'Europe',
    opportunityCount: 410,
    fullyFundedCount: 180,
    topScholarships: ['Swiss Government Excellence Scholarships', 'CERN Fellowships', 'EPFL Excellence Fellowships'],
    visaGuide: 'National Visa D application via Swiss Embassy with certified diplomas, university confirmation, and financial guarantee.'
  },
  {
    country: 'Romania',
    code: 'RO',
    flag: '🇷🇴',
    region: 'Europe',
    opportunityCount: 340,
    fullyFundedCount: 160,
    topScholarships: ['Romanian MFA Government Scholarships', 'ARICE Scholarships', 'Study in Romania EU Awards'],
    visaGuide: 'Long-stay visa for studies (symbol D/SD) granted on basis of Romanian Ministry of Education Acceptance Letter.'
  },
  {
    country: 'Pan-African & Global',
    code: 'INT',
    flag: '🌍',
    region: 'Africa',
    opportunityCount: 890,
    fullyFundedCount: 450,
    topScholarships: ['African Union Mwalimu Nyerere', 'Mastercard Foundation Africa Hubs', 'AIMS Full Fellowships', 'AfDB Youth'],
    visaGuide: 'Intra-African mobility supported through African Union passport protocols and university host agreements.'
  },
  {
    country: 'Egypt',
    code: 'EG',
    flag: '🇪🇬',
    region: 'Middle East',
    opportunityCount: 280,
    fullyFundedCount: 130,
    topScholarships: ['World Youth Forum Fellowship', 'Al-Azhar University Awards', 'AUC Graduate Fellowships'],
    visaGuide: 'Delegates and students receive official Egyptian visa facilitation letters from event organizers or Ministry of Higher Education.'
  },
  {
    country: 'Sweden',
    code: 'SE',
    flag: '🇸🇪',
    region: 'Europe',
    opportunityCount: 520,
    fullyFundedCount: 190,
    topScholarships: ['Swedish Institute (SI) Scholarships for Global Professionals', 'Erasmus Mundus Sweden Tracks', 'KTH India/Global'],
    visaGuide: 'Residence permit for higher education issued via Swedish Migration Agency (Migrationsverket).'
  },
  {
    country: 'Somaliland',
    code: 'SL',
    flag: '',
    region: 'Africa',
    opportunityCount: 15,
    fullyFundedCount: 10,
    topScholarships: ['Fursad Somaliland Scholars', 'Hargeisa Hub Fellowships', 'Chevening Somaliland'],
    visaGuide: 'Direct scholarship facilitation via Hargeisa local partners and international host universities.'
  }
];
