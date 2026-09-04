import React, { useState } from 'react';
import { UserProfile, ApplicationItem, Opportunity } from '../types';
import { UserAvatar } from './UserAvatar';
import { 
  ArrowLeft, 
  Settings, 
  Camera, 
  CheckCircle2, 
  MapPin, 
  Mail, 
  Bookmark, 
  FileText, 
  Star, 
  Bell, 
  CreditCard, 
  HelpCircle, 
  UserPlus, 
  LogOut, 
  ChevronRight, 
  Edit3, 
  ShieldCheck,
  Crown,
  Share2,
  Database
} from 'lucide-react';

interface ProfileViewProps {
  userProfile: UserProfile;
  onProfileUpdated: (profile: UserProfile) => void;
  savedCount: number;
  applications: ApplicationItem[];
  onBack: () => void;
  onOpenPricing: () => void;
  onOpenProfileSettings: () => void;
  onOpenAdmin: () => void;
  onNavigateToTab: (tab: string) => void;
  isLoggedIn?: boolean;
  onOpenAuth?: (mode?: 'login' | 'register') => void;
  onLogout?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userProfile,
  onProfileUpdated,
  savedCount,
  applications,
  onBack,
  onOpenPricing,
  onOpenProfileSettings,
  onOpenAdmin,
  onNavigateToTab,
  isLoggedIn = true,
  onOpenAuth,
  onLogout
}) => {
  const [notificationsActive, setNotificationsActive] = useState<boolean>(true);
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);

  const submittedCount = applications.filter(a => a.status === 'applied' || a.status === 'accepted' || a.status === 'interview').length || 0;
  const shortlistedCount = applications.filter(a => a.status === 'interview' || a.status === 'accepted').length || 0;

  // If user is not logged in, display the Login & Register welcoming profile state
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-white text-slate-900 pb-24 lg:pb-12" id="profile-view-screen">
        <div className="w-full max-w-4xl mx-auto px-3.5 sm:px-4 py-6 sm:py-10 space-y-6">
          
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-2">
            <button
              onClick={onBack}
              className="p-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors border border-slate-200 shadow-xs cursor-pointer"
              id="profile-back-btn"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-base font-extrabold text-slate-900 tracking-wide">
              Scholar Profile
            </h1>
            <div className="w-9" /> {/* Spacer */}
          </div>

          {/* Guest Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-xs">
            <div className="w-20 h-20 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mx-auto shadow-xs">
              <UserPlus className="w-9 h-9" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-2xl font-black text-slate-900">
                Welcome to FURSAD
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Sign in or create your account to sync saved opportunities, track application deadlines, and access AI profile matching.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => onOpenAuth && onOpenAuth('login')}
                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                id="profile-login-btn"
              >
                <Mail className="w-4 h-4" />
                <span>Sign In</span>
              </button>

              <button
                onClick={() => onOpenAuth && onOpenAuth('register')}
                className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs border border-slate-200 transition-all cursor-pointer flex items-center justify-center gap-2"
                id="profile-register-btn"
              >
                <UserPlus className="w-4 h-4 text-blue-600" />
                <span>Create New Account</span>
              </button>
            </div>

            {/* Features Highlight */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-left">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center gap-1.5 text-blue-600 text-xs font-bold">
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Saved Bookmarks</span>
                </div>
                <p className="text-[11px] text-slate-500">Save scholarships and access them anytime.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Tracker</span>
                </div>
                <p className="text-[11px] text-slate-500">Monitor deadlines, checklist & outcomes.</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    );
  }

  const defaultInterests = [
    { label: 'Scholarships', bg: 'bg-blue-600 text-white' },
    { label: 'Internships', bg: 'bg-blue-500 text-white' },
    { label: 'Conferences', bg: 'bg-indigo-500 text-white' },
    { label: 'Research', bg: 'bg-blue-700 text-white' },
    { label: 'Grants', bg: 'bg-blue-800 text-white' },
    { label: 'Volunteering', bg: 'bg-blue-600 text-white' }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-24 lg:pb-12" id="profile-view-screen">
      <div className="w-full max-w-4xl mx-auto px-3.5 sm:px-6 py-5 sm:py-8 space-y-6">
        
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors border border-slate-200 shadow-xs cursor-pointer"
            id="profile-back-btn"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            My Profile
          </h1>

          <button
            onClick={onOpenProfileSettings}
            className="p-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors border border-slate-200 shadow-xs cursor-pointer"
            title="Profile Settings"
            id="profile-settings-btn"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* User Identity Card (Clean White) */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-xs">
          <div className="relative inline-block mx-auto">
            <UserAvatar
              avatar={userProfile.avatar}
              name={userProfile.name}
              email={userProfile.email}
              size="xl"
              className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-slate-50 shadow-md text-3xl"
            />
            <button
              onClick={onOpenProfileSettings}
              className="absolute bottom-0 right-0 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md cursor-pointer"
              title="Change Photo"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-center gap-1.5">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {userProfile.name || (userProfile.email ? userProfile.email.split('@')[0] : 'Scholar User')}
              </h2>
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
            </div>

            <p className="text-xs sm:text-sm text-slate-500 font-medium flex items-center justify-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{userProfile.currentCity ? `${userProfile.currentCity}, ` : ''}{userProfile.countryOrigin || 'Somalia'}</span>
            </p>

            <p className="text-xs sm:text-sm text-slate-600 font-semibold flex items-center justify-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-600" />
              <span>{userProfile.email || 'No email attached'}</span>
            </p>
          </div>
        </div>

        {/* 4 Quick Stat Boxes in a Horizontal Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {/* 1. Saved Opportunities */}
          <button
            onClick={() => onNavigateToTab('saved')}
            className="p-4 rounded-2xl bg-white border border-slate-100 hover:border-blue-300 hover:shadow-xs text-center space-y-1.5 transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Bookmark className="w-4 h-4" />
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-tight">Saved Opportunities</p>
            <p className="text-lg font-black text-slate-900">{savedCount}</p>
          </button>

          {/* 2. Applications Submitted */}
          <button
            onClick={() => onNavigateToTab('tracker')}
            className="p-4 rounded-2xl bg-white border border-slate-100 hover:border-emerald-300 hover:shadow-xs text-center space-y-1.5 transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <FileText className="w-4 h-4" />
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-tight">Applications</p>
            <p className="text-lg font-black text-slate-900">{submittedCount}</p>
          </button>

          {/* 3. Shortlisted */}
          <button
            onClick={() => onNavigateToTab('tracker')}
            className="p-4 rounded-2xl bg-white border border-slate-100 hover:border-blue-300 hover:shadow-xs text-center space-y-1.5 transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Star className="w-4 h-4" />
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-tight">Shortlisted</p>
            <p className="text-lg font-black text-slate-900">{shortlistedCount}</p>
          </button>

          {/* 4. Profile Strength */}
          <div className="p-4 rounded-2xl bg-white border border-slate-100 text-center space-y-1.5">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent flex items-center justify-center mx-auto text-emerald-700 text-[10px] font-black">
              {userProfile.profileStrength || 85}%
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-tight">Profile Strength</p>
            <p className="text-lg font-black text-emerald-600">{userProfile.profileStrength || 85}%</p>
          </div>
        </div>

        {/* My Interests Section */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">My Interests</h3>
            <button
              onClick={onOpenProfileSettings}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Edit</span>
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {defaultInterests.map((item) => (
              <span
                key={item.label}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold ${item.bg} shadow-xs`}
              >
                {item.label}
              </span>
            ))}
          </div>
        </div>

        {/* Action Menu List */}
        <div className="p-2 rounded-3xl bg-white border border-slate-100 shadow-xs divide-y divide-slate-100">
          
          {/* 1. Notification Settings */}
          <button
            onClick={() => setNotificationsActive(!notificationsActive)}
            className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-50 text-slate-700 border border-slate-100">
                <Bell className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-800">Notification Settings</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-600">{notificationsActive ? 'Enabled' : 'Muted'}</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </button>

          {/* 2. Payment & Plans */}
          <button
            onClick={onOpenPricing}
            className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-semibold text-slate-800 block">Payment & Plans</span>
                <span className="text-[11px] text-blue-700 font-medium">Core Plan ($4 / year)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 uppercase">
                {userProfile.subscription}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </button>

          {/* 3. Help & Support */}
          <a
            href="mailto:support@fursad.org?subject=FURSAD%20Scholar%20Support"
            className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
                <HelpCircle className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-800">Help & Support</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </a>

          {/* 4. Invite Friends */}
          <button
            onClick={() => setShowInviteModal(true)}
            className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <UserPlus className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-800">Invite Friends</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-purple-600 font-bold">Share Link</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </button>

          {/* 5. Admin & Data Ingestion Shortcut */}
          <button
            onClick={onOpenAdmin}
            className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Database className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-800">Admin & Data Pipeline</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* 6. Log Out */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left hover:bg-rose-50 rounded-2xl transition-colors cursor-pointer text-rose-600"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                <LogOut className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-rose-700">Log Out</span>
            </div>
            <ChevronRight className="w-4 h-4 text-rose-400" />
          </button>

        </div>

        {/* Bottom Tagline */}
        <div className="text-center pt-2 text-xs text-slate-400 font-medium">
          <p>FURSAD v2.4 • Mogadishu, London, Berlin</p>
          <p className="text-blue-600 font-bold uppercase tracking-wider text-[10px] mt-0.5">
            YOUR FUTURE HAS NO BORDERS
          </p>
        </div>

      </div>

      {/* Invite Friends Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 text-slate-900 w-full max-w-sm rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
              <Share2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Invite Scholars</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Share FURSAD with your classmates and fellow youth to unlock verified international scholarships and conferences.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-purple-700 select-all">
              https://fursad.org/join?ref={userProfile.name?.toLowerCase().replace(/\s+/g, '') || 'scholar'}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowInviteModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Close
              </button>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(`https://fursad.org/join?ref=${userProfile.name?.toLowerCase().replace(/\s+/g, '') || 'scholar'}`);
                  setShowInviteModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 text-slate-900 w-full max-w-sm rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Log out of FURSAD?</h3>
            <p className="text-xs text-slate-600">
              Your bookmarks, saved applications, and profile settings are stored safely.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  if (onLogout) {
                    onLogout();
                  } else {
                    onBack();
                  }
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer shadow-md"
                id="confirm-profile-logout-btn"
              >
                Confirm Log Out
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
