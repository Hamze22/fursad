import React, { useState } from 'react';
import { UserProfile, DegreeLevel, FundingType } from '../types';
import { storage } from '../services/api';
import { 
  User, 
  X, 
  Languages, 
  GraduationCap, 
  Globe2, 
  Sparkles, 
  Crown, 
  CheckCircle2,
  Mail,
  Bell
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onProfileUpdated: (profile: UserProfile) => void;
  onOpenPricing: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onProfileUpdated,
  onOpenPricing
}) => {
  const [profile, setProfile] = useState<UserProfile>(userProfile);
  const [isSavedNotice, setIsSavedNotice] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    storage.saveProfile(profile);
    onProfileUpdated(profile);
    setIsSavedNotice(true);
    setTimeout(() => {
      setIsSavedNotice(false);
      onClose();
    }, 1200);
  };

  const countriesList = ['Germany', 'United Kingdom', 'United States', 'Canada', 'Turkey', 'Sweden', 'Switzerland', 'Egypt', 'Rwanda', 'Japan'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto animate-in fade-in" id="profile-modal">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/10 text-purple-700 flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Scholar Profile & Preferences</h2>
              <p className="text-xs text-slate-500">Fine-tune your credentials for accurate AI matching</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto flex-1 text-slate-800 space-y-5 text-xs">
          
          {/* Subscription & Profile Strength Header */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-blue-50 to-cyan-50 border border-purple-100 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Membership Tier:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-600 text-white font-black uppercase text-[10px]">
                  {profile.subscription}
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                Profile Readiness: <strong className="text-purple-700">{profile.profileStrength}% Complete</strong>
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenPricing();
              }}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Upgrade Plan</span>
            </button>
          </div>

          {/* Name & Origin */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Country of Origin / Citizenship</label>
              <input
                type="text"
                value={profile.countryOrigin}
                onChange={(e) => setProfile({ ...profile, countryOrigin: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Current City of Residence</label>
              <input
                type="text"
                value={profile.currentCity}
                onChange={(e) => setProfile({ ...profile, currentCity: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
              />
            </div>
          </div>

          {/* Education & Field */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Highest Degree Attained</label>
              <select
                value={profile.educationLevel}
                onChange={(e) => setProfile({ ...profile, educationLevel: e.target.value as DegreeLevel })}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-semibold"
              >
                <option value="high_school">High School Diploma</option>
                <option value="bachelor">Bachelor's Degree</option>
                <option value="master">Master's Degree</option>
                <option value="phd">PhD / Doctoral</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Academic Discipline / Major</label>
              <input
                type="text"
                value={profile.fieldOfStudy}
                onChange={(e) => setProfile({ ...profile, fieldOfStudy: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
              />
            </div>
          </div>

          {/* English Proficiency & MOI Exemption Checkbox */}
          <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-purple-950 flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-purple-700" />
                English Medium of Instruction (MOI) Certificate
              </span>
              <input
                type="checkbox"
                checked={profile.hasMoiCertificate}
                onChange={(e) => setProfile({ ...profile, hasMoiCertificate: e.target.checked })}
                className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-purple-900 leading-relaxed">
              Enabling this lets FURSAD AI surface scholarships that accept university verification letters without requiring IELTS or TOEFL.
            </p>
          </div>

          {/* Preferred Countries Selector */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Preferred Destination Countries</label>
            <div className="flex flex-wrap gap-1.5">
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
                    className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                      selected
                        ? 'bg-purple-600 text-white border-purple-600'
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
          <div>
            <label className="block font-bold text-slate-700 mb-1">Career Goal / Research Summary</label>
            <textarea
              rows={2}
              value={profile.careerGoals}
              onChange={(e) => setProfile({ ...profile, careerGoals: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
            />
          </div>

          {/* Footer Save */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            {isSavedNotice ? (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Profile Updated!
              </span>
            ) : <div />}

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-md shadow-purple-600/20 cursor-pointer"
            >
              Save Profile Preferences
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
