import { supabase, isSupabaseConfigured, PROJECT_OWNER_EMAIL, isProjectOwner } from '../supabase';
import { UserProfile, Opportunity, ApplicationItem, OpportunityReport } from '../types';
import { initialOpportunities } from '../data/seedOpportunities';
import { storage } from './api';

export const supabaseService = {
  // ----------------------------------------------------
  // AUTHENTICATION
  // ----------------------------------------------------

  onAuthChange(callback: (user: any | null) => void) {
    if (!isSupabaseConfigured) {
      const localProfile = storage.getProfile();
      if (localProfile && localProfile.email) {
        callback({ id: localProfile.id, email: localProfile.email, user_metadata: { name: localProfile.name } });
      } else {
        callback(null);
      }
      return () => {};
    }

    // Check existing session immediately on startup (supports OAuth redirect tokens in URL)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        callback(session.user);
      }
    });

    // Listen to Supabase Auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        callback(session.user);
      } else {
        callback(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  },

  async loginWithGoogle(): Promise<{ user: any; profile: UserProfile }> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
      
      // In OAuth popup/redirect, session will trigger onAuthChange
      const { data: { user } } = await supabase.auth.getUser();
      
      let profile: UserProfile | null = null;
      if (user) {
        // Try to get profile from DB
        profile = await this.getUserProfile(user.id, user.email);
        
        // If no profile in DB, create one from Google data
        if (!profile) {
          const googleAvatar = user.user_metadata?.avatar_url || user.user_metadata?.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.id}`;
          const googleName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Scholar User';
          
          profile = {
            id: user.id,
            name: googleName,
            email: user.email || '',
            role: isProjectOwner(user.email) ? 'owner' : 'user',
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
            careerGoals: '',
            profileStrength: 75,
            subscription: isProjectOwner(user.email) ? 'pro' : 'free',
            notificationsEnabled: true,
            savedOppIds: []
          };
          await this.updateUserProfile(user.id, profile);
        }
      }
      
      return { user, profile: profile || storage.getProfile() };
    } else {
      throw new Error(
        'Google OAuth requires Supabase database credentials. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Settings / Environment Variables.'
      );
    }
  },

  async getCurrentUser(): Promise<any | null> {
    if (!isSupabaseConfigured) {
      const local = storage.getProfile();
      return local.email ? { id: local.id, email: local.email } : null;
    }
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async registerWithEmail(params: {
    email: string;
    pass: string;
    name: string;
    educationLevel?: any;
    countryOrigin?: string;
    currentCity?: string;
    fieldOfStudy?: string;
  }): Promise<{ user: any; profile: UserProfile }> {
    const { email, pass, name, educationLevel, countryOrigin, currentCity, fieldOfStudy } = params;
    const isOwner = email.toLowerCase().trim() === PROJECT_OWNER_EMAIL.toLowerCase();

    let userId = `usr_${Date.now()}`;
    let authUser: any = { id: userId, email: email.trim() };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: pass,
        options: {
          data: {
            name: name.trim(),
            display_name: name.trim()
          }
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.user) {
        userId = data.user.id;
        authUser = data.user;
      }
    }

    const defaultProfile: UserProfile = {
      id: userId,
      name: name.trim() || 'Scholar User',
      email: email.trim(),
      role: isOwner ? 'owner' : 'user',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name || email)}`,
      countryOrigin: countryOrigin || 'Somalia',
      currentCountry: countryOrigin || 'Somalia',
      currentCity: currentCity || 'Mogadishu',
      educationLevel: educationLevel || 'bachelor',
      fieldOfStudy: fieldOfStudy || 'Computer Science & Technology',
      graduationYear: 2026,
      skills: ['Academic Research', 'Leadership', 'English Writing'],
      languages: ['Somali', 'English', 'Arabic'],
      hasIelts: false,
      hasToefl: false,
      hasMoiCertificate: true,
      preferredCountries: ['Turkey', 'Germany', 'United Kingdom', 'Canada', 'United States'],
      preferredCategories: ['scholarship', 'fellowship', 'internship'],
      fundingPreference: 'fully_funded',
      careerGoals: 'Seeking global graduate scholarships & tech fellowship opportunities.',
      profileStrength: 85,
      subscription: isOwner ? 'pro' : 'free',
      notificationsEnabled: true,
      savedOppIds: []
    };

    // Save profile to Supabase or localStorage
    await this.updateUserProfile(userId, defaultProfile);
    storage.saveProfile(defaultProfile);

    return { user: authUser, profile: defaultProfile };
  },

  async loginWithEmail(email: string, pass: string): Promise<{ user: any; profile: UserProfile | null }> {
    const isOwner = email.toLowerCase().trim() === PROJECT_OWNER_EMAIL.toLowerCase();

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: pass
      });

      if (error) {
        throw new Error(error.message);
      }

      const user = data.user;
      let profile = await this.getUserProfile(user.id, user.email || '');

      if (!profile) {
        profile = {
          id: user.id,
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          email: user.email || email,
          role: isOwner ? 'owner' : 'user',
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.email || 'user')}`,
          countryOrigin: 'Somalia',
          currentCountry: 'Somalia',
          currentCity: 'Mogadishu',
          educationLevel: 'bachelor',
          fieldOfStudy: 'Computer Science',
          graduationYear: 2026,
          skills: ['Research', 'Leadership'],
          languages: ['Somali', 'English'],
          hasIelts: false,
          hasToefl: false,
          hasMoiCertificate: true,
          preferredCountries: ['Turkey', 'Germany', 'United Kingdom', 'Canada'],
          preferredCategories: ['scholarship', 'fellowship'],
          fundingPreference: 'fully_funded',
          careerGoals: 'Pursuing global scholarships & leadership opportunities.',
          profileStrength: 80,
          subscription: isOwner ? 'pro' : 'free',
          notificationsEnabled: true,
          savedOppIds: []
        };
        await this.updateUserProfile(user.id, profile);
      }

      return { user, profile };
    } else {
      // Local fallback mode
      const existing = storage.getProfile();
      const profile: UserProfile = {
        ...existing,
        id: existing.id || `usr_${Date.now()}`,
        email: email.trim(),
        role: isOwner ? 'owner' : existing.role || 'user',
        subscription: isOwner ? 'pro' : existing.subscription || 'free'
      };
      storage.saveProfile(profile);
      return { user: { id: profile.id, email: profile.email }, profile };
    }
  },

  async logout(): Promise<void> {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    storage.clearUserSession();
  },

  async resetPassword(email: string): Promise<void> {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: window.location.origin
      });
      if (error) throw error;
    }
  },

  // ----------------------------------------------------
  // USER PROFILES
  // ----------------------------------------------------

  async getUserProfile(userId: string, userEmail?: string): Promise<UserProfile | null> {
    const isOwner = isProjectOwner(userEmail);

    if (isSupabaseConfigured) {
      try {
        // Try to find by ID first, then by email
        let { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (!data && userEmail) {
          const { data: emailData } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', userEmail)
            .maybeSingle();
          data = emailData;
        }

        if (data) {
          const profile: UserProfile = {
            id: data.id,
            name: data.name || '',
            email: data.email || userEmail || '',
            role: isProjectOwner(data.email || userEmail) ? 'owner' : (data.role || 'user'),
            avatar: data.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(data.email || 'user')}`,
            countryOrigin: data.country_origin || data.countryOrigin || 'Somalia',
            currentCountry: data.current_country || data.currentCountry || 'Somalia',
            currentCity: data.current_city || data.currentCity || 'Mogadishu',
            educationLevel: data.education_level || data.educationLevel || 'bachelor',
            fieldOfStudy: data.field_of_study || data.fieldOfStudy || 'Computer Science',
            graduationYear: data.graduation_year || data.graduationYear || 2026,
            skills: Array.isArray(data.skills) ? data.skills : ['Academic Research', 'Leadership'],
            languages: Array.isArray(data.languages) ? data.languages : ['Somali', 'English'],
            hasIelts: data.has_ielts ?? data.hasIelts ?? false,
            hasToefl: data.has_toefl ?? data.hasToefl ?? false,
            hasMoiCertificate: data.has_moi_certificate ?? data.hasMoiCertificate ?? true,
            preferredCountries: Array.isArray(data.preferred_countries) ? data.preferred_countries : (data.preferredCountries || ['Turkey', 'Germany', 'Canada']),
            preferredCategories: Array.isArray(data.preferred_categories) ? data.preferred_categories : (data.preferredCategories || ['scholarship', 'fellowship']),
            fundingPreference: data.funding_preference || data.fundingPreference || 'fully_funded',
            careerGoals: data.career_goals || data.careerGoals || '',
            profileStrength: data.profile_strength || data.profileStrength || 80,
            subscription: isProjectOwner(data.email || userEmail) ? 'pro' : (data.subscription || 'free'),
            notificationsEnabled: data.notifications_enabled ?? data.notificationsEnabled ?? true,
            savedOppIds: Array.isArray(data.saved_opp_ids) ? data.saved_opp_ids : (data.savedOppIds || [])
          };
          
          // If we found it by email but ID was different (e.g. old supabase user), update ID to firebase UID
          if (data.id !== userId && isSupabaseConfigured) {
            await this.updateUserProfile(userId, profile);
          }
          
          return profile;
        }
      } catch (err) {
        console.error('Error getting profile from Supabase:', err);
      }
    }

    const local = storage.getProfile();
    if (local && (local.id === userId || (userEmail && local.email === userEmail))) {
      if (isProjectOwner(local.email || userEmail)) {
        local.role = 'owner';
        local.subscription = 'pro';
      }
      return local;
    }
    return null;
  },

  async updateUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<void> {
    const isOwner = isProjectOwner(profileData.email);
    const finalRole = isOwner ? 'owner' : (profileData.role || 'user');
    const finalSub = isOwner ? 'pro' : (profileData.subscription || 'free');

    const dbRow: Record<string, any> = {
      id: userId,
      name: profileData.name || 'Scholar User',
      email: profileData.email || '',
      role: finalRole,
      avatar: profileData.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(profileData.email || 'user')}`,
      country_origin: profileData.countryOrigin || profileData.currentCountry || 'Somalia',
      current_country: profileData.currentCountry || 'Somalia',
      current_city: profileData.currentCity || 'Mogadishu',
      education_level: profileData.educationLevel || 'bachelor',
      field_of_study: profileData.fieldOfStudy || 'Computer Science & Technology',
      graduation_year: profileData.graduationYear || 2026,
      skills: profileData.skills || ['Academic Research', 'Leadership'],
      languages: profileData.languages || ['Somali', 'English'],
      has_ielts: profileData.hasIelts ?? false,
      has_toefl: profileData.hasToefl ?? false,
      has_moi_certificate: profileData.hasMoiCertificate ?? true,
      preferred_countries: profileData.preferredCountries || ['Turkey', 'Germany', 'United Kingdom', 'Canada'],
      preferred_categories: profileData.preferredCategories || ['scholarship', 'fellowship'],
      funding_preference: profileData.fundingPreference || 'fully_funded',
      career_goals: profileData.careerGoals || '',
      profile_strength: profileData.profileStrength || 80,
      subscription: finalSub,
      notifications_enabled: profileData.notificationsEnabled ?? true,
      saved_opp_ids: profileData.savedOppIds || [],
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('profiles')
          .upsert(dbRow, { onConflict: 'id' });

        if (error) {
          console.warn('Supabase profile update warning:', error);
        }
      } catch (err) {
        console.error('Error updating profile in Supabase:', err);
      }
    }

    const current = storage.getProfile();
    storage.saveProfile({
      ...current,
      ...profileData,
      id: userId,
      role: finalRole,
      subscription: finalSub
    } as UserProfile);
  },

  // ----------------------------------------------------
  // OPPORTUNITIES DATABASE
  // ----------------------------------------------------

  async seedOpportunitiesIfEmpty(): Promise<Opportunity[]> {
    if (!isSupabaseConfigured) {
      return initialOpportunities;
    }

    const mapRowToOpp = (row: any): Opportunity => ({
      ...row,
      fundingType: row.funding_type || row.fundingType || 'fully_funded',
      degreeLevel: row.degree_level || row.degreeLevel || 'bachelor',
      field: Array.isArray(row.field_of_study) ? row.field_of_study[0] : (row.field || 'All Fields'),
      applicationUrl: row.application_url || row.applicationUrl || '',
      sourceUrl: row.source_url || row.sourceUrl || '',
      moiAccepted: row.accepts_moi || row.moiAccepted || false,
      ieltsRequired: row.requires_ielts || row.ieltsRequired || false,
      verificationStatus: row.verified ? 'verified' : (row.verificationStatus || 'needs_review'),
      featured: row.featured || false,
      summary: row.summary || '',
      description: row.description || '',
      eligibility: row.eligibility || [],
      financialBenefits: row.benefits || [],
      requiredDocuments: row.requirements || []
    });

    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .limit(20);

      if (error) {
        console.warn('Supabase opportunities read warning:', error);
        return initialOpportunities;
      }

      if (!data || data.length === 0) {
        console.log('[Supabase] Seeding opportunities table...');
        const toInsert = initialOpportunities.map(opp => {
          const dbRow = {
            id: opp.id,
            title: opp.title,
            organization: opp.organization,
            category: opp.category,
            country: opp.country,
            city: opp.city || '',
            funding_type: opp.fundingType,
            degree_level: Array.isArray(opp.degreeLevel) ? opp.degreeLevel : [opp.degreeLevel],
            field_of_study: Array.isArray(opp.field) ? opp.field : [opp.field],
            summary: opp.summary,
            description: opp.description,
            eligibility: opp.eligibility || [],
            benefits: opp.financialBenefits || [],
            requirements: opp.requiredDocuments || [],
            deadline: opp.deadline,
            application_url: opp.applicationUrl,
            source_url: opp.sourceUrl,
            accepts_moi: opp.moiAccepted || opp.acceptsEnglishMoi || false,
            requires_ielts: opp.ieltsRequired || false,
            verified: opp.verificationStatus === 'verified',
            featured: opp.featured || false,
            created_at: new Date().toISOString()
          };
          return dbRow;
        });
        await supabase.from('opportunities').upsert(toInsert, { onConflict: 'id' });
        return initialOpportunities;
      }

      return data.map(mapRowToOpp);
    } catch (e) {
      console.warn('Supabase opportunities fetch error:', e);
      return initialOpportunities;
    }
  },

  listenOpportunities(callback: (opps: Opportunity[]) => void) {
    // Immediate fallback to local data so the UI never shows 0 while loading
    callback(initialOpportunities);

    if (!isSupabaseConfigured) {
      return () => {};
    }

    const mapRowToOpp = (row: any): Opportunity => ({
      ...row,
      fundingType: row.funding_type || row.fundingType || 'fully_funded',
      degreeLevel: row.degree_level || row.degreeLevel || 'bachelor',
      field: Array.isArray(row.field_of_study) ? row.field_of_study[0] : (row.field || 'All Fields'),
      applicationUrl: row.application_url || row.applicationUrl || '',
      sourceUrl: row.source_url || row.sourceUrl || '',
      moiAccepted: row.accepts_moi || row.moiAccepted || false,
      ieltsRequired: row.requires_ielts || row.ieltsRequired || false,
      verificationStatus: row.verified ? 'verified' : (row.verificationStatus || 'needs_review'),
      featured: row.featured || false,
      summary: row.summary || '',
      description: row.description || '',
      eligibility: row.eligibility || [],
      financialBenefits: row.benefits || [],
      requiredDocuments: row.requirements || []
    });

    this.seedOpportunitiesIfEmpty().then((initial) => {
      callback(initial);
    });

    const channel = supabase
      .channel('public:opportunities')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'opportunities' }, async () => {
        const { data } = await supabase.from('opportunities').select('*').order('created_at', { ascending: false });
        if (data && data.length > 0) {
          callback(data.map(mapRowToOpp));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  async addOpportunity(opp: Opportunity): Promise<void> {
    if (isSupabaseConfigured) {
      const dbRow = {
        id: opp.id,
        title: opp.title,
        organization: opp.organization,
        category: opp.category,
        country: opp.country,
        city: opp.city || '',
        funding_type: opp.fundingType,
        degree_level: Array.isArray(opp.degreeLevel) ? opp.degreeLevel : [opp.degreeLevel],
        field_of_study: Array.isArray(opp.field) ? opp.field : [opp.field],
        summary: opp.summary,
        description: opp.description,
        eligibility: opp.eligibility || [],
        benefits: opp.financialBenefits || [],
        requirements: opp.requiredDocuments || [],
        deadline: opp.deadline,
        application_url: opp.applicationUrl,
        source_url: opp.sourceUrl,
        accepts_moi: opp.moiAccepted || opp.acceptsEnglishMoi || false,
        requires_ielts: opp.ieltsRequired || false,
        verified: opp.verificationStatus === 'verified',
        featured: opp.featured || false,
        created_at: new Date().toISOString()
      };
      await supabase.from('opportunities').insert(dbRow);
    }
  },

  async updateOpportunity(id: string, updates: Partial<Opportunity>): Promise<void> {
    if (isSupabaseConfigured) {
      const dbUpdates: Record<string, any> = {
        updated_at: new Date().toISOString()
      };
      
      if (updates.title) dbUpdates.title = updates.title;
      if (updates.organization) dbUpdates.organization = updates.organization;
      if (updates.category) dbUpdates.category = updates.category;
      if (updates.country) dbUpdates.country = updates.country;
      if (updates.city) dbUpdates.city = updates.city;
      if (updates.fundingType) dbUpdates.funding_type = updates.fundingType;
      if (updates.degreeLevel) dbUpdates.degree_level = Array.isArray(updates.degreeLevel) ? updates.degreeLevel : [updates.degreeLevel];
      if (updates.field) dbUpdates.field_of_study = Array.isArray(updates.field) ? updates.field : [updates.field];
      if (updates.summary) dbUpdates.summary = updates.summary;
      if (updates.description) dbUpdates.description = updates.description;
      if (updates.eligibility) dbUpdates.eligibility = updates.eligibility;
      if (updates.financialBenefits) dbUpdates.benefits = updates.financialBenefits;
      if (updates.requiredDocuments) dbUpdates.requirements = updates.requiredDocuments;
      if (updates.deadline) dbUpdates.deadline = updates.deadline;
      if (updates.applicationUrl) dbUpdates.application_url = updates.applicationUrl;
      if (updates.sourceUrl) dbUpdates.source_url = updates.sourceUrl;
      if (updates.moiAccepted !== undefined) dbUpdates.accepts_moi = updates.moiAccepted;
      if (updates.ieltsRequired !== undefined) dbUpdates.requires_ielts = updates.ieltsRequired;
      if (updates.verificationStatus) dbUpdates.verified = updates.verificationStatus === 'verified';
      if (updates.featured !== undefined) dbUpdates.featured = updates.featured;

      await supabase.from('opportunities').update(dbUpdates).eq('id', id);
    }
  },

  async deleteOpportunity(id: string): Promise<void> {
    if (isSupabaseConfigured) {
      await supabase.from('opportunities').delete().eq('id', id);
    }
  },

  // ----------------------------------------------------
  // SAVED OPPORTUNITIES & TRACKER
  // ----------------------------------------------------

  async syncUserSavedOpportunities(userId: string, savedOppIds: string[]): Promise<void> {
    if (isSupabaseConfigured && userId) {
      try {
        await supabase
          .from('profiles')
          .update({ savedOppIds, updated_at: new Date().toISOString() })
          .eq('id', userId);
      } catch (e) {
        console.error('Failed to sync saved opportunities in Supabase:', e);
      }
    }
    storage.saveSavedOppIds(savedOppIds);
  },

  listenUserApplications(userId: string, callback: (apps: ApplicationItem[]) => void) {
    if (!isSupabaseConfigured || !userId) {
      callback(storage.getApplications());
      return () => {};
    }

    const mapRowToApp = (row: any): ApplicationItem => ({
      id: row.id,
      opportunityId: row.opportunity_id || row.opportunityId || row.id,
      opportunityTitle: row.opportunity_title || row.opportunityTitle || 'Opportunity',
      organization: row.organization || '',
      country: row.country || 'Global',
      flag: row.flag || '🌍',
      category: row.category || 'scholarship',
      fundingType: row.funding_type || row.fundingType || 'fully_funded',
      deadline: row.deadline || '',
      applicationUrl: row.application_url || row.applicationUrl || '',
      status: row.status || 'interested',
      notes: row.notes || '',
      checklist: Array.isArray(row.checklist) ? row.checklist : (typeof row.checklist === 'string' ? JSON.parse(row.checklist) : []),
      createdAt: row.created_at || row.createdAt || new Date().toISOString(),
      updatedAt: row.updated_at || row.updatedAt || new Date().toISOString()
    });

    // Fetch initial list
    supabase
      .from('applications')
      .select('*')
      .eq('user_id', userId)
      .then(async ({ data, error }) => {
        if (!error && data && data.length > 0) {
          const apps = data.map(mapRowToApp);
          storage.saveApplications(apps);
          callback(apps);
        } else {
          // If Supabase has no records yet, sync existing local applications to user's Supabase account
          const localApps = storage.getApplications();
          if (localApps && localApps.length > 0) {
            for (const localApp of localApps) {
              await this.saveApplication(userId, localApp);
            }
            callback(localApps);
          } else {
            callback([]);
          }
        }
      });

    // Realtime channel
    const channel = supabase
      .channel(`user_apps_${userId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'applications',
        filter: `user_id=eq.${userId}`
      }, async () => {
        const { data } = await supabase
          .from('applications')
          .select('*')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false });
        if (data && data.length > 0) {
          const mapped = data.map(mapRowToApp);
          storage.saveApplications(mapped);
          callback(mapped);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  async saveApplication(userId: string, appItem: ApplicationItem): Promise<void> {
    if (isSupabaseConfigured && userId) {
      try {
        const dbAppRow = {
          id: appItem.id,
          user_id: userId,
          opportunity_id: appItem.opportunityId || appItem.id,
          opportunity_title: appItem.opportunityTitle || '',
          organization: appItem.organization || '',
          country: appItem.country || '',
          flag: appItem.flag || '🌍',
          category: appItem.category || 'scholarship',
          funding_type: appItem.fundingType || 'fully_funded',
          deadline: appItem.deadline || '',
          application_url: appItem.applicationUrl || '',
          status: appItem.status || 'interested',
          checklist: appItem.checklist || [],
          notes: appItem.notes || '',
          updated_at: new Date().toISOString()
        };

        await supabase.from('applications').upsert(dbAppRow, { onConflict: 'id' });
      } catch (err) {
        console.error('Failed to save application to Supabase:', err);
      }
    }
    const currentApps = storage.getApplications();
    const existingIndex = currentApps.findIndex(a => a.id === appItem.id);
    const updated = existingIndex >= 0 
      ? currentApps.map(a => a.id === appItem.id ? appItem : a)
      : [appItem, ...currentApps];
    storage.saveApplications(updated);
  },

  async deleteApplication(appId: string): Promise<void> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('applications').delete().eq('id', appId);
      } catch (err) {
        console.error('Failed to delete application in Supabase:', err);
      }
    }
    const currentApps = storage.getApplications();
    const updated = currentApps.filter(a => a.id !== appId);
    storage.saveApplications(updated);
  },

  // ----------------------------------------------------
  // REPORTS
  // ----------------------------------------------------

  async submitReport(report: OpportunityReport): Promise<void> {
    if (isSupabaseConfigured) {
      try {
        const dbReportRow = {
          id: report.id,
          opportunity_id: report.opportunityId,
          opportunity_title: report.opportunityTitle,
          reason: report.reason,
          details: report.details || '',
          reporter_email: report.userEmail || '',
          status: report.status || 'pending',
          created_at: report.timestamp || new Date().toISOString()
        };
        await supabase.from('reports').insert(dbReportRow);
      } catch (err) {
        console.error('Failed to submit report to Supabase:', err);
      }
    }
  }
};
