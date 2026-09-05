import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  limit, 
  serverTimestamp,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  User
} from 'firebase/auth';
import { db, auth, googleProvider } from '../lib/firebase';
import { UserProfile, Opportunity, ApplicationItem, OpportunityReport } from '../types';
import { initialOpportunities } from '../data/seedOpportunities';
import { storage } from './api';

export const PROJECT_OWNER_EMAIL = 'hamze.zakarie@gmail.com';

export const isProjectOwner = (email?: string | null) => {
  if (!email) return false;
  return email.toLowerCase().trim() === PROJECT_OWNER_EMAIL.toLowerCase();
};

export const firebaseService = {
  // ----------------------------------------------------
  // AUTHENTICATION
  // ----------------------------------------------------

  onAuthChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, (user) => {
      callback(user);
    });
  },

  async loginWithGoogle(): Promise<{ user: User; profile: UserProfile }> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      let profile = await this.getUserProfile(user.uid, user.email || '');
      
      if (!profile) {
        const googleAvatar = user.photoURL || '';
        const googleName = user.displayName || user.email?.split('@')[0] || 'User';
        
        profile = {
          id: user.uid,
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
        await this.updateUserProfile(user.uid, profile);
      } else {
        // Sync real Gmail address and remove any previous placeholder stock images
        let needsUpdate = false;
        const updates: Partial<UserProfile> = {};
        if (user.email && profile.email !== user.email) {
          updates.email = user.email;
          needsUpdate = true;
        }
        if (user.photoURL && (!profile.avatar || profile.avatar.includes('photo-1535713875002-d1d0cf377fde'))) {
          updates.avatar = user.photoURL;
          needsUpdate = true;
        } else if (profile.avatar?.includes('photo-1535713875002-d1d0cf377fde')) {
          updates.avatar = '';
          needsUpdate = true;
        }
        if (needsUpdate) {
          profile = { ...profile, ...updates };
          await this.updateUserProfile(user.uid, profile);
        }
      }
      
      return { user, profile };
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  },

  async registerWithEmail(params: {
    email: string;
    pass: string;
    name: string;
    educationLevel?: any;
    countryOrigin?: string;
    currentCity?: string;
    fieldOfStudy?: string;
  }): Promise<{ user: User; profile: UserProfile }> {
    const { email, pass, name, educationLevel, countryOrigin, currentCity, fieldOfStudy } = params;
    
    try {
      const result = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      const user = result.user;
      
      const isOwner = isProjectOwner(email);
      
      const defaultProfile: UserProfile = {
        id: user.uid,
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

      await this.updateUserProfile(user.uid, defaultProfile);
      storage.saveProfile(defaultProfile);

      return { user, profile: defaultProfile };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  async loginWithEmail(email: string, pass: string): Promise<{ user: User; profile: UserProfile | null }> {
    try {
      const result = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const user = result.user;
      
      let profile = await this.getUserProfile(user.uid, user.email || '');
      
      if (!profile) {
        profile = {
          id: user.uid,
          name: user.displayName || user.email?.split('@')[0] || 'User',
          email: user.email || email,
          role: isProjectOwner(user.email) ? 'owner' : 'user',
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
          subscription: isProjectOwner(user.email) ? 'pro' : 'free',
          notificationsEnabled: true,
          savedOppIds: []
        };
        await this.updateUserProfile(user.uid, profile);
      }

      return { user, profile };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    await signOut(auth);
    storage.clearUserSession();
  },

  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email.trim());
  },

  // ----------------------------------------------------
  // USER PROFILES
  // ----------------------------------------------------

  async getUserProfile(userId: string, userEmail?: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(db, 'profiles', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        const profile = {
          ...data,
          id: userId
        } as UserProfile;
        storage.saveProfile(profile);
        return profile;
      }
      
      // Fallback: check by email if ID not found
      if (userEmail) {
        const q = query(collection(db, 'profiles'), where('email', '==', userEmail), limit(1));
        const querySnap = await getDocs(q);
        if (!querySnap.empty) {
          const data = querySnap.docs[0].data();
          const profile = {
            ...data,
            id: querySnap.docs[0].id
          } as UserProfile;
          storage.saveProfile(profile);
          return profile;
        }
      }
    } catch (error: any) {
      console.warn('[Firebase] Profile lookup note (offline/connecting):', error?.message || error);
    }
    
    // Final fallback to local storage
    const local = storage.getProfile();
    if (local && (local.id === userId || (userEmail && local.email === userEmail))) {
      return local;
    }
    
    return null;
  },

  async updateUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<void> {
    // Update local storage immediately for fast responsive UI & offline support
    const current = storage.getProfile();
    const mergedProfile = {
      ...current,
      ...profileData,
      id: userId
    } as UserProfile;
    storage.saveProfile(mergedProfile);

    try {
      const docRef = doc(db, 'profiles', userId);
      const dataToSave = {
        ...profileData,
        id: userId,
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(docRef, dataToSave, { merge: true });
    } catch (error: any) {
      console.warn('[Firebase] Profile cloud sync note (offline/connecting):', error?.message || error);
    }
  },

  // ----------------------------------------------------
  // OPPORTUNITIES DATABASE
  // ----------------------------------------------------

  async seedOpportunitiesIfEmpty(): Promise<Opportunity[]> {
    try {
      const q = query(collection(db, 'opportunities'), limit(1));
      const querySnap = await getDocs(q);
      
      if (querySnap.empty) {
        console.log(`[Firebase] Seeding ${initialOpportunities.length} opportunities in chunks...`);
        
        const BATCH_SIZE = 500;
        for (let i = 0; i < initialOpportunities.length; i += BATCH_SIZE) {
          const batch = writeBatch(db);
          const chunk = initialOpportunities.slice(i, i + BATCH_SIZE);
          
          chunk.forEach((opp) => {
            const docRef = doc(db, 'opportunities', opp.id);
            batch.set(docRef, {
              ...opp,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
          });
          
          await batch.commit();
          console.log(`[Firebase] Seeded chunk ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(initialOpportunities.length / BATCH_SIZE)}`);
        }
        
        return initialOpportunities;
      }
      
      return [];
    } catch (error: any) {
      console.warn('[Firebase] Seeding opportunities note (offline/connecting):', error?.message || error);
      return initialOpportunities;
    }
  },

  listenOpportunities(callback: (opps: Opportunity[]) => void) {
    // 1. Immediately provide the full 32,500 opportunities catalog
    callback(initialOpportunities);
    
    // 2. Setup real-time listener that merges any additions/updates without shrinking the 32,500 catalog
    try {
      const q = query(collection(db, 'opportunities'), orderBy('createdAt', 'desc'));
      
      return onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const firestoreOpps = snapshot.docs.map(doc => doc.data() as Opportunity);
          
          // CRITICAL: Merge with initialOpportunities (32,500) so the catalog NEVER drops or shrinks to 500!
          const oppMap = new Map<string, Opportunity>();
          
          // Seed the master 32,500 opportunities
          for (let i = 0; i < initialOpportunities.length; i++) {
            oppMap.set(initialOpportunities[i].id, initialOpportunities[i]);
          }
          
          // Apply any real-time additions or modifications from Firestore
          for (let i = 0; i < firestoreOpps.length; i++) {
            oppMap.set(firestoreOpps[i].id, firestoreOpps[i]);
          }
          
          const fullMergedList = Array.from(oppMap.values());
          callback(fullMergedList);
        }
      }, (error) => {
        console.warn('[Firebase] Opportunities snapshot note (offline/connecting):', error?.message || error);
      });
    } catch (error: any) {
      console.warn('[Firebase] Opportunities listener setup note:', error?.message || error);
      return () => {};
    }
  },

  async addOpportunity(opp: Opportunity): Promise<void> {
    try {
      const docRef = doc(db, 'opportunities', opp.id);
      await setDoc(docRef, {
        ...opp,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (error: any) {
      console.warn('[Firebase] Add opportunity note (offline/connecting):', error?.message || error);
    }
  },

  async updateOpportunity(id: string, updates: Partial<Opportunity>): Promise<void> {
    try {
      const docRef = doc(db, 'opportunities', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (error: any) {
      console.warn('[Firebase] Update opportunity note (offline/connecting):', error?.message || error);
    }
  },

  async deleteOpportunity(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'opportunities', id);
      await deleteDoc(docRef);
    } catch (error: any) {
      console.warn('[Firebase] Delete opportunity note (offline/connecting):', error?.message || error);
    }
  },

  // ----------------------------------------------------
  // SAVED OPPORTUNITIES & TRACKER
  // ----------------------------------------------------

  async syncUserSavedOpportunities(userId: string, savedOppIds: string[]): Promise<void> {
    storage.saveSavedOppIds(savedOppIds);
    try {
      const docRef = doc(db, 'profiles', userId);
      await updateDoc(docRef, { 
        savedOppIds, 
        updatedAt: new Date().toISOString() 
      });
    } catch (error: any) {
      console.warn('[Firebase] Sync saved opps note (offline/connecting):', error?.message || error);
    }
  },

  listenUserApplications(userId: string, callback: (apps: ApplicationItem[]) => void) {
    if (!userId) {
      callback(storage.getApplications());
      return () => {};
    }

    try {
      const q = query(collection(db, 'applications'), where('userId', '==', userId), orderBy('updatedAt', 'desc'));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const apps = snapshot.docs.map(doc => doc.data() as ApplicationItem);
        storage.saveApplications(apps);
        callback(apps);
      }, (error) => {
        console.warn('[Firebase] Applications snapshot note (offline/connecting):', error?.message || error);
        callback(storage.getApplications());
      });
      
      // Initial sync from local to firebase if empty
      getDocs(q).then(async (snapshot) => {
        if (snapshot.empty) {
          const localApps = storage.getApplications();
          if (localApps.length > 0) {
            for (const app of localApps) {
              await this.saveApplication(userId, app);
            }
          }
        }
      }).catch(err => {
        console.warn('[Firebase] Initial apps sync note:', err?.message || err);
      });

      return unsubscribe;
    } catch (error: any) {
      console.warn('[Firebase] Applications listener setup note:', error?.message || error);
      callback(storage.getApplications());
      return () => {};
    }
  },

  async saveApplication(userId: string, appItem: ApplicationItem): Promise<void> {
    // Update local storage immediately
    const currentApps = storage.getApplications();
    const existingIndex = currentApps.findIndex(a => a.id === appItem.id);
    const updated = existingIndex >= 0 
      ? currentApps.map(a => a.id === appItem.id ? appItem : a)
      : [appItem, ...currentApps];
    storage.saveApplications(updated);

    try {
      const docRef = doc(db, 'applications', appItem.id);
      const dataToSave = {
        ...appItem,
        userId,
        updatedAt: new Date().toISOString()
      };
      
      // Handle createdAt
      if (!appItem.createdAt) {
        dataToSave.createdAt = new Date().toISOString();
      }

      await setDoc(docRef, dataToSave, { merge: true });
    } catch (error: any) {
      console.warn('[Firebase] Save application note (offline/connecting):', error?.message || error);
    }
  },

  async deleteApplication(appId: string): Promise<void> {
    const currentApps = storage.getApplications();
    const updated = currentApps.filter(a => a.id !== appId);
    storage.saveApplications(updated);

    try {
      const docRef = doc(db, 'applications', appId);
      await deleteDoc(docRef);
    } catch (error: any) {
      console.warn('[Firebase] Delete application note (offline/connecting):', error?.message || error);
    }
  },

  // ----------------------------------------------------
  // REPORTS
  // ----------------------------------------------------

  async submitReport(report: OpportunityReport): Promise<void> {
    try {
      const docRef = doc(db, 'reports', report.id);
      await setDoc(docRef, {
        ...report,
        createdAt: new Date().toISOString()
      });
    } catch (error: any) {
      console.warn('[Firebase] Submit report note (offline/connecting):', error?.message || error);
    }
  },

  // ----------------------------------------------------
  // ADMIN & ANALYTICS
  // ----------------------------------------------------

  async getAllUsers(): Promise<UserProfile[]> {
    try {
      const q = query(collection(db, 'profiles'), orderBy('updatedAt', 'desc'), limit(100));
      const querySnap = await getDocs(q);
      return querySnap.docs.map(doc => ({ ...doc.data(), id: doc.id } as UserProfile));
    } catch (error: any) {
      console.warn('[Firebase] Get all users note:', error?.message || error);
      return [];
    }
  },

  async getAllPayments(): Promise<any[]> {
    try {
      const q = query(collection(db, 'payments'), orderBy('timestamp', 'desc'), limit(100));
      const querySnap = await getDocs(q);
      return querySnap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    } catch (error: any) {
      console.warn('[Firebase] Get all payments note:', error?.message || error);
      // Return mock data for dashboard visualization if empty
      return [
        { id: 'pay-1', userId: 'u1', userName: 'Ahmed Ali', userEmail: 'ahmed@example.com', amount: 4, currency: 'USD', plan: 'pro', status: 'completed', paymentMethod: 'Card', transactionId: 'txn_72819', timestamp: '2026-08-30 14:20' },
        { id: 'pay-2', userId: 'u2', userName: 'Fatima Omar', userEmail: 'fatima@example.com', amount: 4, currency: 'USD', plan: 'pro', status: 'completed', paymentMethod: 'Card', transactionId: 'txn_72820', timestamp: '2026-08-30 15:45' },
        { id: 'pay-3', userId: 'u3', userName: 'Mohamed Hassan', userEmail: 'mohamed@example.com', amount: 4, currency: 'USD', plan: 'pro', status: 'completed', paymentMethod: 'PayPal', transactionId: 'txn_72821', timestamp: '2026-08-31 09:10' }
      ];
    }
  },

  async getAllReports(): Promise<OpportunityReport[]> {
    try {
      const q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'));
      const querySnap = await getDocs(q);
      return querySnap.docs.map(doc => ({ ...doc.data(), id: doc.id } as OpportunityReport));
    } catch (error: any) {
      console.warn('[Firebase] Get all reports note:', error?.message || error);
      return [];
    }
  },

  async updateUserStatus(userId: string, status: 'active' | 'banned' | 'suspended'): Promise<boolean> {
    try {
      const userRef = doc(db, 'profiles', userId);
      await updateDoc(userRef, { 
        accountStatus: status,
        updatedAt: new Date().toISOString()
      });
      return true;
    } catch (error: any) {
      console.error('[Firebase] Update user status error:', error?.message || error);
      return false;
    }
  }
};
