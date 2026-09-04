import React, { useState } from 'react';
import { UserProfile, DegreeLevel } from '../types';
import { storage } from '../services/api';
import { UserAvatar } from './UserAvatar';
import { 
  User, 
  ArrowLeft, 
  Languages, 
  GraduationCap, 
  Globe2, 
  Sparkles, 
  Crown, 
  CheckCircle2,
  Mail,
  Camera,
  MapPin,
  Save,
  Check,
  LogOut
} from 'lucide-react';

interface ProfileSettingsViewProps {
  userProfile: UserProfile;
  onProfileUpdated: (profile: UserProfile) => void;
  onBack: () => void;
  onNavigateToPricing: () => void;
  onLogout?: () => void;
}

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({
  userProfile,
  onProfileUpdated,
  onBack,
  onNavigateToPricing,
  onLogout
}) => {
  const [profile, setProfile] = useState<UserProfile>(userProfile);
  const [isSavedNotice, setIsSavedNotice] = useState<boolean>(false);

  const countriesList = [
    'Germany', 'United Kingdom', 'United States', 'Canada', 
    'Turkey', 'Sweden', 'Switzerland', 'Egypt', 'Rwanda', 'Japan', 'Malaysia', 'Italy'
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    storage.saveProfile(profile);
    onProfileUpdated(profile);
    setIsSavedNotice(true);
    setTimeout(() => {
      setIsSavedNotice(false);
      onBack();
    }, 1500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3.5 sm:px-6 py-6 sm:py-10 space-y-8 animate-in fade-in duration-200" id="profile-settings-page-view">
      
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
          id="settings-back-button"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Profile</span>
        </button>

        <span className="text-xs font-bold text-slate-500">
          Profile Settings & Preferences
        </span>
      </div>

      {/* Header Profile Summary */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="relative">
              <UserAvatar
                avatar={profile.avatar}
                name={profile.name}
                email={profile.email}
                size="lg"
                className="w-20 h-20 border-4 border-slate-100 shadow-md text-2xl"
              />
              <label 
                className="absolute bottom-0 right-0 p-1.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 cursor-pointer shadow-md"
                title="Update avatar url"
              >
                <Camera className="w-3.5 h-3.5" />
              </label>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                {profile.name || 'Scholar Profile'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-semibold flex items-center gap-1.5 justify-center sm:justify-start">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{profile.email || 'No email attached'}</span>
              </p>
              <div className="flex items-center gap-2 mt-1 justify-center sm:justify-start">
                <span className="text-xs font-bold text-slate-600">Profile Readiness:</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[11px]">
                  {profile.profileStrength}% Complete
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onNavigateToPricing}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-extrabold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Crown className="w-4 h-4" />
            <span>Manage Plan ({profile.subscription.toUpperCase()})</span>
          </button>
        </div>

        {/* Settings Form */}
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Personal Info */}
          <div className="space-y-4">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <span>Personal Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Country of Origin / Citizenship</label>
                <input
                  type="text"
                  value={profile.countryOrigin}
                  onChange={(e) => setProfile({ ...profile, countryOrigin: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Current City of Residence</label>
                <input
                  type="text"
                  value={profile.currentCity}
                  onChange={(e) => setProfile({ ...profile, currentCity: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Academic Background */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span>Academic Background & Degree</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Highest Degree Attained</label>
                <select
                  value={profile.educationLevel}
                  onChange={(e) => setProfile({ ...profile, educationLevel: e.target.value as DegreeLevel })}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="high_school">High School Diploma</option>
                  <option value="bachelor">Bachelor's Degree</option>
                  <option value="master">Master's Degree</option>
                  <option value="phd">PhD / Doctoral</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Academic Discipline / Major</label>
                <input
                  type="text"
                  value={profile.fieldOfStudy}
                  onChange={(e) => setProfile({ ...profile, fieldOfStudy: e.target.value })}
                  placeholder="e.g. Computer Science, Medicine, Economics"
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* English Proficiency & MOI Waiver Checkbox */}
          <div className="p-5 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-black text-blue-950 flex items-center gap-2 text-sm">
                <Languages className="w-4 h-4 text-blue-700" />
                English Medium of Instruction (MOI) Certificate
              </span>
              <input
                type="checkbox"
                checked={profile.hasMoiCertificate}
                onChange={(e) => setProfile({ ...profile, hasMoiCertificate: e.target.checked })}
                className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
              />
            </div>
            <p className="text-xs text-blue-900 leading-relaxed font-medium">
              Enabling this lets FURSAD AI prioritize and filter scholarships that accept university English verification letters without requiring IELTS or TOEFL.
            </p>
          </div>

          {/* Preferred Countries Selector */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Globe2 className="w-4 h-4 text-blue-600" />
              <span>Preferred Study Destination Countries</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {countriesList.map((country) => {
                const selected = profile.preferredCountries.includes(country);
                return (
                  <button
                    key={country}
                    type="button"
                    onClick={() => {
                      const updated = selected
                        ? profile.preferredCountries.filter(c => c !== country)
                        : [...profile.preferredCountries, country];
                      setProfile({ ...profile, preferredCountries: updated });
                    }}
                    className={`text-xs px-3 py-1.5 rounded-xl border font-bold transition-all cursor-pointer ${
                      selected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {country}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Career Statement */}
          <div className="space-y-2 pt-4 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700">
              Career Goals & Research Statement
            </label>
            <textarea
              rows={3}
              value={profile.careerGoals}
              onChange={(e) => setProfile({ ...profile, careerGoals: e.target.value })}
              placeholder="Briefly state your intended career trajectory and academic focus for AI matching..."
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Action Bar */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              {isSavedNotice ? (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Profile Preferences Saved Successfully!
                </span>
              ) : onLogout ? (
                <button
                  type="button"
                  onClick={onLogout}
                  className="px-4 py-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all"
                  id="profile-settings-logout-btn"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Log Out</span>
                </button>
              ) : null}
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
              id="save-profile-settings-btn"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Preferences</span>
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};
