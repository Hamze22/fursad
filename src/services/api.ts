import { Opportunity, DataSource, SyncLog, OpportunityReport, Mentor, SuccessStory, CountryStat, UserProfile, ApplicationItem } from '../types';

export const api = {
  // Opportunities
  async getOpportunities(params?: {
    category?: string;
    region?: string;
    country?: string;
    degreeLevel?: string;
    fundingType?: string;
    search?: string;
    moiAccepted?: boolean;
    noIelts?: boolean;
    status?: string;
    featuredOnly?: boolean;
    limit?: number;
  }): Promise<{ total: number; opportunities: Opportunity[] }> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          searchParams.append(key, String(val));
        }
      });
    }
    const res = await fetch(`/api/opportunities?${searchParams.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch opportunities');
    return res.json();
  },

  async getOpportunity(id: string): Promise<{ opportunity: Opportunity; related: Opportunity[] }> {
    const res = await fetch(`/api/opportunities/${id}`);
    if (!res.ok) throw new Error('Failed to fetch opportunity');
    return res.json();
  },

  async trackApplyClick(id: string): Promise<{ success: boolean; applyClicks: number }> {
    const res = await fetch(`/api/opportunities/${id}/click-apply`, { method: 'POST' });
    return res.json();
  },

  async trackSave(id: string): Promise<{ success: boolean; savesCount: number }> {
    const res = await fetch(`/api/opportunities/${id}/save`, { method: 'POST' });
    return res.json();
  },

  async createOpportunity(data: Partial<Opportunity>): Promise<{ success: boolean; opportunity: Opportunity }> {
    const res = await fetch('/api/opportunities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create opportunity');
    return res.json();
  },

  async updateOpportunity(id: string, data: Partial<Opportunity>): Promise<{ success: boolean; opportunity: Opportunity }> {
    const res = await fetch(`/api/opportunities/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update opportunity');
    return res.json();
  },

  async deleteOpportunity(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/opportunities/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete opportunity');
    return res.json();
  },

  async bulkImportOpportunities(opportunities: Partial<Opportunity>[]): Promise<{ success: boolean; count: number; message: string }> {
    const res = await fetch('/api/opportunities/bulk-import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ opportunities })
    });
    if (!res.ok) throw new Error('Failed to bulk import opportunities');
    return res.json();
  },

  async batchActionOpportunities(ids: string[], action: 'delete' | 'verify' | 'expire'): Promise<{ success: boolean; affected: number; message: string }> {
    const res = await fetch('/api/opportunities/batch-action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids, action })
    });
    if (!res.ok) throw new Error('Failed to execute batch action');
    return res.json();
  },

  async reportOpportunity(id: string, data: { reason: string; details: string; userEmail?: string }): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`/api/opportunities/${id}/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to submit report');
    return res.json();
  },

  async getReports(): Promise<{ reports: OpportunityReport[] }> {
    const res = await fetch('/api/reports');
    if (!res.ok) throw new Error('Failed to fetch reports');
    return res.json();
  },

  async resolveReport(id: string, status: 'resolved' | 'dismissed'): Promise<{ success: boolean; report: OpportunityReport }> {
    const res = await fetch(`/api/reports/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to resolve report');
    return res.json();
  },

  // Sources & Sync Pipeline
  async getSources(): Promise<{ sources: DataSource[] }> {
    const res = await fetch('/api/sources');
    if (!res.ok) throw new Error('Failed to fetch sources');
    return res.json();
  },

  async triggerSync(sourceId?: string): Promise<{ success: boolean; message: string; logs: SyncLog[]; sources: DataSource[] }> {
    const res = await fetch('/api/sources/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceId })
    });
    if (!res.ok) throw new Error('Failed to trigger sync pipeline');
    return res.json();
  },

  async getSyncLogs(): Promise<{ logs: SyncLog[] }> {
    const res = await fetch('/api/sync-logs');
    if (!res.ok) throw new Error('Failed to fetch sync logs');
    return res.json();
  },

  // Mentors, Countries & Testimonials
  async getMentors(): Promise<{ mentors: Mentor[] }> {
    const res = await fetch('/api/mentors');
    if (!res.ok) throw new Error('Failed to fetch mentors');
    return res.json();
  },

  async getCountries(): Promise<{ countries: CountryStat[] }> {
    const res = await fetch('/api/countries');
    if (!res.ok) throw new Error('Failed to fetch countries');
    return res.json();
  },

  async getSuccessStories(): Promise<{ stories: SuccessStory[] }> {
    const res = await fetch('/api/success-stories');
    if (!res.ok) throw new Error('Failed to fetch success stories');
    return res.json();
  },

  // Subscriptions
  async subscribe(payload: {
    plan: string;
    paymentMethod: string;
    phoneNumber?: string;
    accountName?: string;
    promoCode?: string;
  }) {
    const res = await fetch('/api/user/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to complete subscription payment');
    return res.json();
  },

  // Gemini AI Assistant
  async askFursadAI(message: string, chatHistory: any[] = [], userProfile?: UserProfile, language: string = 'so'): Promise<{ response: string; matchedOpportunityIds: string[] }> {
    const res = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, chatHistory, userProfile, language })
    });
    if (!res.ok) throw new Error('Failed to connect to FURSAD AI');
    return res.json();
  },

  async matchProfileAI(userProfile: UserProfile, language: string = 'so'): Promise<{ topMatches: Opportunity[]; totalAnalyzed: number }> {
    const res = await fetch('/api/gemini/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userProfile, language })
    });
    if (!res.ok) throw new Error('Failed to evaluate AI matches');
    return res.json();
  },

  async reviewSOP(opportunityId: string, draftText: string, userProfile?: UserProfile, language: string = 'so') {
    const res = await fetch('/api/gemini/sop-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ opportunityId, draftText, userProfile, language })
    });
    if (!res.ok) throw new Error('Failed to review SOP');
    return res.json();
  }
};

// Local storage management for user preferences, saved items, and application tracker
const STORAGE_KEYS = {
  PROFILE: 'fursad_user_profile',
  SAVED_IDS: 'fursad_saved_opp_ids',
  APPLICATIONS: 'fursad_applications',
  ONBOARDED: 'fursad_onboarding_completed'
};

export const defaultProfile: UserProfile = {
  id: 'usr-guest-scholar',
  name: 'Scholar Guest',
  email: 'guest@fursad.com',
  avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=guest',
  countryOrigin: 'Somalia',
  currentCountry: 'Somalia',
  currentCity: 'Mogadishu',
  educationLevel: 'bachelor',
  fieldOfStudy: 'Computer Science & Information Technology',
  graduationYear: 2024,
  skills: ['Software Engineering', 'Python', 'Community Leadership', 'Project Planning'],
  languages: ['English (Fluent / MOI)', 'Somali (Native)', 'Arabic (Intermediate)'],
  hasIelts: false,
  hasToefl: false,
  hasMoiCertificate: true,
  preferredCountries: ['Germany', 'United Kingdom', 'Canada', 'Turkey', 'Sweden'],
  preferredCategories: ['scholarship', 'conference', 'internship', 'fellowship'],
  fundingPreference: 'fully_funded',
  careerGoals: 'To build scalable AI technology and public health data systems that empower African youth communities.',
  profileStrength: 85,
  subscription: 'free',
  notificationsEnabled: true
};

export const INITIAL_APPLICATIONS: ApplicationItem[] = [
  {
    id: 'app-1',
    opportunityId: 'opp-daad-epos-2026',
    opportunityTitle: 'DAAD EPOS Development-Related Postgraduate Scholarship',
    organization: 'German Academic Exchange Service (DAAD)',
    country: 'Germany',
    flag: '🇩🇪',
    category: 'scholarship',
    fundingType: 'fully_funded',
    deadline: '2026-10-31',
    applicationUrl: 'https://www.daad.de/en/study-and-research-in-germany/scholarships/daad-scholarships/',
    status: 'preparing',
    notes: 'Requested university Medium of Instruction (MOI) verification letter. Working on motivation essay draft.',
    checklist: [
      { id: 'c1', title: 'Bachelor Degree Transcripts & Certificate', completed: true },
      { id: 'c2', title: 'Medium of Instruction (MOI) Certificate', completed: true },
      { id: 'c3', title: 'Curriculum Vitae (Europass Format)', completed: true },
      { id: 'c4', title: 'Letter of Motivation (2 pages max)', completed: false },
      { id: 'c5', title: 'Two Professional Recommendation Letters', completed: false }
    ],
    reminderDate: '2026-10-15',
    createdAt: '2026-08-20',
    updatedAt: '2026-08-29'
  },
  {
    id: 'app-2',
    opportunityId: 'opp-world-youth-forum-egypt',
    opportunityTitle: 'World Youth Forum & Global Youth Summit 2026',
    organization: 'World Youth Forum Foundation',
    country: 'Egypt',
    flag: '🇪🇬',
    category: 'conference',
    fundingType: 'fully_funded',
    deadline: '2026-09-30',
    applicationUrl: 'https://register.wyfegypt.com/',
    status: 'applied',
    notes: 'Submitted application on official portal. Awaiting flight confirmation email.',
    checklist: [
      { id: 'w1', title: 'Passport Bio-page Scan', completed: true },
      { id: 'w2', title: 'Social Impact Essay (300 words)', completed: true },
      { id: 'w3', title: 'Official Registration Submission', completed: true }
    ],
    reminderDate: '2026-09-20',
    createdAt: '2026-08-15',
    updatedAt: '2026-08-28'
  },
  {
    id: 'app-3',
    opportunityId: 'opp-chevening-uk-2026',
    opportunityTitle: 'Chevening UK Government Master\'s Scholarships 2026/2027',
    organization: 'Foreign, Commonwealth & Development Office (FCDO)',
    country: 'United Kingdom',
    flag: '🇬🇧',
    category: 'scholarship',
    fundingType: 'fully_funded',
    deadline: '2026-11-05',
    applicationUrl: 'https://www.chevening.org/scholarship/somalia/',
    status: 'interested',
    notes: 'Drafting the 4 core Chevening leadership & networking essays.',
    checklist: [
      { id: 'ch1', title: 'Leadership & Influence Essay (500 words)', completed: false },
      { id: 'ch2', title: 'Relationship Building Essay (500 words)', completed: false },
      { id: 'ch3', title: 'Studying in the UK Essay (500 words)', completed: false },
      { id: 'ch4', title: 'Career Plan Essay (500 words)', completed: false },
      { id: 'ch5', title: 'Select 3 UK Master Degree Courses', completed: true }
    ],
    reminderDate: '2026-10-25',
    createdAt: '2026-08-25',
    updatedAt: '2026-08-30'
  }
];

export const storage = {
  getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? JSON.parse(data) : defaultProfile;
    } catch {
      return defaultProfile;
    }
  },

  saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error(e);
    }
  },

  getSavedOppIds(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_IDS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return ['opp-daad-epos-2026', 'opp-chevening-uk-2026', 'opp-world-youth-forum-egypt'];
    } catch {
      return ['opp-daad-epos-2026', 'opp-chevening-uk-2026'];
    }
  },

  saveSavedOppIds(ids: string[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SAVED_IDS, JSON.stringify(ids));
    } catch (e) {
      console.error(e);
    }
  },

  toggleSavedOppId(id: string): string[] {
    const saved = storage.getSavedOppIds();
    const updated = saved.includes(id) ? saved.filter(item => item !== id) : [...saved, id];
    try {
      localStorage.setItem(STORAGE_KEYS.SAVED_IDS, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    return updated;
  },

  getApplications(): ApplicationItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_APPLICATIONS;
  },

  resetToDefaultApplications(): ApplicationItem[] {
    try {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(INITIAL_APPLICATIONS));
    } catch (e) {
      console.error(e);
    }
    return INITIAL_APPLICATIONS;
  },

  saveApplications(apps: ApplicationItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
    } catch (e) {
      console.error(e);
    }
  },

  clearUserSession(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.PROFILE);
      localStorage.removeItem(STORAGE_KEYS.SAVED_IDS);
      localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
    } catch (e) {
      console.error(e);
    }
  },

  isOnboardingCompleted(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEYS.ONBOARDED) === 'true';
    } catch {
      return false;
    }
  },

  setOnboardingCompleted(val: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ONBOARDED, val ? 'true' : 'false');
    } catch (e) {
      console.error(e);
    }
  },

  clear(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    } catch (e) {
      console.error(e);
    }
  }
};
