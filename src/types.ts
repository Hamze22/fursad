export type OpportunityCategory = 
  | 'scholarship'
  | 'internship'
  | 'conference'
  | 'fellowship'
  | 'mentorship'
  | 'grant'
  | 'job'
  | 'exchange'
  | 'volunteer'
  | 'mobility';

export type DegreeLevel = 'high_school' | 'bachelor' | 'master' | 'phd' | 'postdoc' | 'any';

export type FundingType = 'fully_funded' | 'partially_funded' | 'paid' | 'grant' | 'tuition_waiver';

export type VerificationStatus = 'verified' | 'needs_review' | 'expired' | 'source_error';

export type LocationType = 'in_person' | 'remote' | 'hybrid';

export type Region = 'Africa' | 'Europe' | 'North America' | 'Asia' | 'Middle East' | 'Oceania' | 'Latin America' | 'Global';

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  summary: string;
  university?: string; // Host university or university consortium
  organization: string; // Provider / funding agency / government
  organizationLogo?: string;
  organizationWebsite: string;
  sourceName: string;
  sourceUrl: string;
  applicationUrl: string; // Direct official application portal
  officialApplyUrl?: string; // Explicit alias for clarity
  country: string;
  countryCode: string;
  flag: string;
  city?: string;
  destination?: string;
  region: Region;
  category: OpportunityCategory;
  subCategory?: string;
  degreeLevel: DegreeLevel;
  field: string;
  fundingType: FundingType;
  fundingAmount?: string;
  tuitionCoverage: string;
  accommodation: string;
  travelSupport: string;
  stipend: string;
  healthInsurance?: string;
  ieltsRequired: boolean;
  toeflRequired: boolean;
  moiAccepted: boolean; // Medium of Instruction certificate accepted in lieu of IELTS
  minGpa?: string; // Minimum GPA (e.g. "2.8/4.0", "3.0/4.0", "None")
  languageDetails: string;
  eligibility: string[];
  ageRequirement?: string;
  targetNationalities?: string[];
  openingDate?: string; // YYYY-MM-DD
  deadline: string; // YYYY-MM-DD
  applicationFee?: string; // e.g. "$0 (Free)", "No Fee", "Fee Waiver Available"
  requiredDocuments?: string[]; // e.g. Transcripts, Recommendation Letters, SOP, CV, Proposal
  startDate?: string;
  endDate?: string;
  locationType: LocationType;
  status: 'active' | 'archived' | 'expired';
  verificationStatus: VerificationStatus;
  lastVerified: string;
  featured?: boolean;
  viewsCount: number;
  savesCount: number;
  applyClicks: number;
  tags: string[];
  imageUrl?: string;
  financialBenefits?: string[];
  acceptsEnglishMoi?: boolean;
  officialUrl?: string;
  matchScore?: number;
  matchReasons?: string[];
}

export type SubscriptionPlan = 'free' | 'basic_premium' | 'premium' | 'pro' | 'enterprise';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role?: 'owner' | 'admin' | 'user';
  avatar?: string;
  countryOrigin: string;
  currentCountry: string;
  currentCity?: string;
  educationLevel: DegreeLevel;
  targetDegree?: DegreeLevel;
  fieldOfStudy: string;
  gpa?: string; // e.g. "3.5", "3.8", "85%"
  graduationYear: number;
  skills: string[];
  languages: string[];
  hasIelts: boolean;
  ieltsBand?: number;
  hasToefl: boolean;
  toeflScore?: number;
  hasMoiCertificate: boolean; // Medium of instruction certificate
  preferredCountries: string[];
  preferredCategories: OpportunityCategory[];
  fundingPreference: string;
  careerGoals: string;
  profileStrength: number;
  subscription: SubscriptionPlan;
  subscriptionExpiry?: string;
  notificationsEnabled: boolean;
  accountStatus?: 'active' | 'banned' | 'suspended';
  savedOppIds?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export type ApplicationStatus = 
  | 'interested'
  | 'saved'
  | 'preparing'
  | 'applied'
  | 'interview'
  | 'accepted'
  | 'rejected';

export interface ApplicationItem {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  organization: string;
  country: string;
  flag: string;
  category: OpportunityCategory;
  fundingType: FundingType;
  deadline: string;
  applicationUrl: string;
  imageUrl?: string;
  status: ApplicationStatus;
  notes: string;
  checklist: { id: string; title: string; completed: boolean }[];
  reminderDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  organization: string;
  avatar: string;
  country: string;
  flag: string;
  originCountry: string;
  education: string;
  languages: string[];
  expertise: string[];
  alumniOf: string[];
  rating: number;
  reviewsCount: number;
  price: string;
  bio: string;
  availableDays: string[];
}

export interface DataSource {
  id: string;
  name: string;
  type: 'api' | 'rss' | 'curated_feed' | 'partner';
  status: 'active' | 'syncing' | 'error' | 'disabled' | 'healthy';
  lastSync: string;
  lastSynced?: string;
  recordsImported: number;
  totalIngested?: number;
  activeOpportunities: number;
  endpointUrl: string;
  url?: string;
  description: string;
  syncFrequencyHours: number;
  syncFrequency?: string;
}

export interface SyncLog {
  id: string;
  timestamp: string;
  sourceId: string;
  sourceName: string;
  status: 'success' | 'warning' | 'failed';
  newRecords: number;
  updatedRecords: number;
  expiredFlagged: number;
  duplicatesSkipped: number;
  durationMs: number;
}

export interface SuccessStory {
  id: string;
  name: string;
  avatar: string;
  originCountry: string;
  destinationCountry: string;
  opportunityWon: string;
  organization: string;
  category: OpportunityCategory;
  year: string;
  quote: string;
  advice: string;
}

export interface CountryStat {
  country: string;
  code: string;
  flag: string;
  region: Region;
  opportunityCount: number;
  fullyFundedCount: number;
  topScholarships: string[];
  visaGuide: string;
}

export interface Payment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  currency: string;
  plan: SubscriptionPlan;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId: string;
  timestamp: string;
}

export interface OpportunityReport {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  reason: 'scam' | 'expired' | 'broken_link' | 'incorrect_info' | 'duplicate';
  details: string;
  userEmail?: string;
  timestamp: string;
  status: 'pending' | 'resolved' | 'dismissed';
}
