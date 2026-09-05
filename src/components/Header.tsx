import React, { useState } from 'react';
import { FursadLogo } from './FursadLogo';
import { UserAvatar } from './UserAvatar';
import { UserProfile } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { 
  Bookmark, 
  FileCheck2, 
  Bot, 
  Crown, 
  User, 
  Menu, 
  X, 
  GraduationCap, 
  Briefcase, 
  Users, 
  Sparkles,
  Settings,
  Bell,
  LogIn,
  LogOut,
  Globe2,
  ChevronRight,
  Compass,
  Award,
  ShieldCheck
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  savedCount: number;
  applicationCount: number;
  userProfile: UserProfile;
  onOpenPricing: () => void;
  onOpenProfile: () => void;
  onOpenAdmin: () => void;
  onOpenAIModal: () => void;
  onOpenAuth?: () => void;
  onOpenAppIcon?: () => void;
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  savedCount,
  applicationCount,
  userProfile,
  onOpenPricing,
  onOpenProfile,
  onOpenAdmin,
  onOpenAIModal,
  onOpenAuth,
  onOpenAppIcon,
  isLoggedIn = true,
  onLogout
}) => {
  const { t, isRTL, language } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  
  const isOwner = userProfile.email.toLowerCase() === 'hamze.zakarie@gmail.com' || userProfile.role === 'owner';

  const navLinks = [
    { id: 'home', label: t.nav.home, icon: null },
    { id: 'scholarships', label: t.nav.scholarships, icon: GraduationCap },
    { id: 'internships', label: t.nav.internships, icon: Briefcase },
    { id: 'fellowships', label: 'Fellowships', icon: Award },
    { id: 'grants', label: 'Grants & Funds', icon: Globe2 },
    { id: 'saved', label: t.nav.saved, icon: Bookmark, badge: savedCount },
    { id: 'tracker', label: t.nav.tracker, icon: FileCheck2, badge: applicationCount },
    { id: 'mentorship', label: t.nav.mentorship, icon: Users },
    ...(isOwner ? [{ id: 'admin', label: t.nav.admin, icon: ShieldCheck }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs" id="fursad-header" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Main navigation header */}
      <div className="w-full mx-auto px-3 sm:px-6 h-15 sm:h-16 flex items-center justify-between gap-3">
        {/* Brand Logo & App Icon Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={() => onTabChange('home')}
            className="focus:outline-none text-left cursor-pointer shrink-0"
            id="header-brand-logo-btn"
          >
            <FursadLogo size="md" />
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold text-slate-600">
          {navLinks.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'text-blue-700 bg-blue-50 font-bold border border-blue-100 shadow-xs'
                    : 'hover:text-slate-900 hover:bg-slate-100/70'
                }`}
                id={`nav-link-${item.id}`}
              >
                {item.icon && <item.icon className="w-4 h-4 text-blue-600" />}
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-black rounded-full bg-blue-600 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* FURSAD AI Advisor & Matching Hub Link */}
          <button
            onClick={() => onTabChange('ai-assistant')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 font-bold cursor-pointer ml-1 ${
              currentTab === 'ai-assistant' || currentTab === 'matching'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20'
                : 'text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100'
            }`}
            id="nav-link-ai-section"
          >
            <Bot className="w-4 h-4 text-cyan-400" />
            <span>{t.nav.aiAssistant}</span>
            <span className="text-[10px] px-1 py-0.2 rounded bg-blue-600 text-white font-black">
              AI
            </span>
          </button>
        </nav>

        {/* Action Controls & Utilities */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Notification Bell / Alarm */}
          <button
            onClick={() => onOpenProfile()}
            className="relative p-2 sm:p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-all cursor-pointer flex items-center justify-center group"
            title={t.nav.notifications}
            id="header-notification-bell"
          >
            <Bell className="w-4 h-4 text-slate-700 group-hover:text-blue-600 transition-colors" />
            {isLoggedIn && (applicationCount > 0 || true) && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                {applicationCount > 0 ? applicationCount : 0}
              </span>
            )}
          </button>

          {/* Tracker Counter Button */}
          <button
            onClick={() => onTabChange('tracker')}
            className={`relative p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer hidden md:flex items-center gap-1.5 text-xs font-bold ${
              currentTab === 'tracker'
                ? 'bg-blue-50 text-blue-700 border-blue-300'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
            title={t.nav.tracker}
            id="header-tracker-btn"
          >
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
            <span>{t.nav.tracker}</span>
            {applicationCount > 0 && (
              <span className="bg-emerald-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full shadow-xs">
                {applicationCount}
              </span>
            )}
          </button>

          {/* Plan badge & Upgrade Button */}
          {isLoggedIn && (
            <button
              onClick={onOpenPricing}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-extrabold text-xs shadow-sm shadow-blue-600/20 transition-all cursor-pointer"
              id="header-upgrade-btn"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>{userProfile.subscription === 'pro' || isOwner ? t.nav.proMember : t.nav.upgrade}</span>
            </button>
          )}

          {/* User Profile Trigger / Auth Button */}
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 bg-slate-50 transition-all cursor-pointer"
                id="header-profile-menu-trigger"
                title="User Account"
              >
                <div className="relative">
                  <UserAvatar
                    avatar={userProfile.avatar}
                    name={userProfile.name}
                    email={userProfile.email}
                    size="sm"
                    className="w-7 h-7 rounded-lg border border-blue-300 shadow-xs"
                  />
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-800 max-w-[90px] truncate leading-tight">
                    {userProfile.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-slate-500 leading-tight">
                    {isOwner ? t.profile.roleAdmin : t.profile.roleScholar}
                  </span>
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div 
                  className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95`}
                  id="header-profile-dropdown"
                >
                  <div className="px-4 py-3 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black text-slate-900 truncate">{userProfile.name}</p>
                      {isOwner ? (
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold">
                          {t.profile.roleAdmin}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold">
                          {t.profile.roleScholar}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{userProfile.email}</p>

                    <div className="mt-2 flex items-center justify-between text-[11px]">
                      <span className="text-slate-600 font-medium">{t.profile.profileStrength}</span>
                      <span className="font-extrabold text-blue-600">{userProfile.profileStrength}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: `${userProfile.profileStrength}%` }} />
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onTabChange('profile');
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>{t.profile.myProfile}</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onTabChange('tracker');
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <FileCheck2 className="w-4 h-4 text-emerald-600" />
                        <span>{t.nav.tracker}</span>
                      </div>
                      {applicationCount > 0 && (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
                          {applicationCount}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onTabChange('matching');
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <span>AI Profile Match</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onOpenPricing();
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-blue-700 hover:bg-blue-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Crown className="w-4 h-4 text-blue-600" />
                      <span>{t.profile.paymentPlans}</span>
                    </button>

                    {(isOwner || userProfile.role === 'admin') && (
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onOpenAdmin();
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-bold text-slate-800 hover:bg-slate-50 flex items-center gap-2 border-t border-slate-100 cursor-pointer"
                      >
                        <Settings className="w-4 h-4 text-slate-500" />
                        <span>{t.nav.admin}</span>
                      </button>
                    )}

                    {onLogout && (
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onLogout();
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 border-t border-slate-100 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>{t.nav.logout}</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/20 transition-all cursor-pointer"
              id="header-login-btn"
            >
              <LogIn className="w-4 h-4" />
              <span>{t.nav.login}</span>
            </button>
          )}

          {/* 3 Lines / Hamburger / See More Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 bg-slate-50 transition-all cursor-pointer"
            id="mobile-menu-toggle-btn"
            title="Menu & Language / Xulashada & Luuqadaha"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-blue-600" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / "See More" Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200/90 shadow-2xl px-4 py-5 space-y-4 animate-in slide-in-from-top-2 max-h-[85vh] overflow-y-auto" id="mobile-nav-drawer">
          
          {/* Section 1: Collapsible Language Accordion (Compact & Saves Space) */}
          <LanguageSelector 
            variant="accordion" 
            onLanguageChange={() => {
              // Smooth update
            }}
          />

          {/* Section 2: Main Navigation Options */}
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1 pb-1">
              Explore & Applications
            </p>

            {navLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-3.5 py-3 rounded-2xl text-left text-xs sm:text-sm font-bold flex items-center justify-between transition-all cursor-pointer ${
                  currentTab === item.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-700 hover:bg-slate-100/80 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon ? (
                    <item.icon className={`w-4 h-4 ${currentTab === item.id ? 'text-white' : 'text-blue-600'}`} />
                  ) : (
                    <Compass className={`w-4 h-4 ${currentTab === item.id ? 'text-white' : 'text-blue-600'}`} />
                  )}
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 ? (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    currentTab === item.id ? 'bg-white text-blue-700' : 'bg-blue-600 text-white'
                  }`}>
                    {item.badge}
                  </span>
                ) : (
                  <ChevronRight className={`w-4 h-4 ${currentTab === item.id ? 'text-white/70' : 'text-slate-400'}`} />
                )}
              </button>
            ))}

            {/* FURSAD AI Advisor Button */}
            <button
              onClick={() => {
                onTabChange('ai-assistant');
                setMobileMenuOpen(false);
              }}
              className="w-full px-3.5 py-3 rounded-2xl text-left text-xs sm:text-sm font-black flex items-center justify-between bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Bot className="w-4 h-4 text-cyan-300" />
                <span>{t.nav.aiAssistant} & Matcher</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black">
                PRO AI
              </span>
            </button>
          </div>

          {/* Section 3: Extra Features & Quick Actions (Upgrade / Admin / Logout) */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <button
              onClick={() => {
                onOpenPricing();
                setMobileMenuOpen(false);
              }}
              className="w-full p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <Crown className="w-4 h-4 text-blue-600" />
              <span>{userProfile.subscription === 'pro' || isOwner ? t.nav.proMember : t.nav.upgrade}</span>
            </button>
          </div>

          {(isOwner || userProfile.role === 'admin') && (
            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Settings className="w-4 h-4 text-blue-400" />
              <span>{t.nav.admin} Dashboard</span>
            </button>
          )}

          {isLoggedIn && onLogout && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLogout();
              }}
              className="w-full py-2 text-center text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer"
            >
              {t.nav.logout}
            </button>
          )}

        </div>
      )}
    </header>
  );
};
