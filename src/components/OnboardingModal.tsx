import React, { useState } from 'react';
import { FursadLogo } from './FursadLogo';
import { storage } from '../services/api';
import { UserProfile } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { 
  Globe2, 
  GraduationCap, 
  Bot, 
  ArrowRight, 
  ArrowLeft,
  Sparkles, 
  ShieldCheck, 
  FileText, 
  X,
  Languages,
  Compass,
  Award
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated?: (profile: UserProfile) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose
}) => {
  const [step, setStep] = useState<number>(1);
  const { t, isRTL } = useLanguage();

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFinish = () => {
    storage.setOnboardingCompleted(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm transition-all" id="onboarding-modal" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header bar with 3 Step Indicators, Language Picker & Close Button */}
        <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2">
            <FursadLogo size="sm" showText={false} />
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider">FURSAD</span>
          </div>

          {/* 3 Step Indicator Dots */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setStep(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === step 
                    ? 'w-7 bg-blue-600' 
                    : i < step 
                      ? 'w-2.5 bg-blue-300' 
                      : 'w-2 bg-slate-200'
                }`}
                title={`Page ${i}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <LanguageSelector />
            <button
              onClick={handleFinish}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              title={t.onboarding.skip}
              id="onboarding-skip-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area - 3 High Quality Pages */}
        <div className="p-6 sm:p-7 overflow-y-auto flex-1 text-slate-800">
          
          {/* PAGE 1: Global Discovery & Verified Opportunities */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
                  <Globe2 className="w-8 h-8 text-blue-600 animate-pulse" />
                </div>
                
                <div className="space-y-1.5">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-extrabold uppercase tracking-wide">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    {t.onboarding.page1.tag}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                    {t.onboarding.page1.title}
                  </h2>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
                    {t.onboarding.page1.desc}
                  </p>
                </div>
              </div>

              {/* 3 High-Quality Elements Cards */}
              <div className="space-y-2.5 pt-1">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <strong className="text-xs font-bold text-slate-900 block">{t.onboarding.page1.item1Title}</strong>
                    <p className="text-[11px] text-slate-500 leading-tight">{t.onboarding.page1.item1Desc}</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <strong className="text-xs font-bold text-slate-900 block">{t.onboarding.page1.item2Title}</strong>
                    <p className="text-[11px] text-slate-500 leading-tight">{t.onboarding.page1.item2Desc}</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <strong className="text-xs font-bold text-slate-900 block">{t.onboarding.page1.item3Title}</strong>
                    <p className="text-[11px] text-slate-500 leading-tight">{t.onboarding.page1.item3Desc}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PAGE 2: FURSAD AI & MOI (No IELTS) */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner">
                  <Bot className="w-8 h-8 text-indigo-600" />
                </div>
                
                <div className="space-y-1.5">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-extrabold uppercase tracking-wide">
                    🤖 {t.onboarding.page2.tag}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                    {t.onboarding.page2.title}
                  </h2>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
                    {t.onboarding.page2.desc}
                  </p>
                </div>
              </div>

              {/* 3 High-Quality Feature Elements */}
              <div className="space-y-2.5 pt-1">
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-blue-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                      {t.onboarding.page2.matchTitle}
                    </span>
                    <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {t.onboarding.page2.matchBadge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {t.onboarding.page2.matchDesc}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <Languages className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <strong className="text-xs font-bold text-slate-900 block">{t.onboarding.page2.item1Title}</strong>
                    <p className="text-[11px] text-slate-500 leading-tight">{t.onboarding.page2.item1Desc}</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <strong className="text-xs font-bold text-slate-900 block">{t.onboarding.page2.item2Title}</strong>
                    <p className="text-[11px] text-slate-500 leading-tight">{t.onboarding.page2.item2Desc}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PAGE 3: Application Pipeline & Direct Success */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
                  <Compass className="w-8 h-8 text-emerald-600" />
                </div>
                
                <div className="space-y-1.5">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold uppercase tracking-wide">
                    🌍 {t.onboarding.page3.tag}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                    {t.onboarding.page3.title}
                  </h2>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
                    {t.onboarding.page3.desc}
                  </p>
                </div>
              </div>

              {/* 3 Step Process List */}
              <div className="space-y-2.5 pt-1">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                    1
                  </div>
                  <div className="min-w-0 flex-1">
                    <strong className="text-xs font-bold text-slate-900 block">{t.onboarding.page3.step1Title}</strong>
                    <p className="text-[11px] text-slate-500 leading-tight">{t.onboarding.page3.step1Desc}</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                    2
                  </div>
                  <div className="min-w-0 flex-1">
                    <strong className="text-xs font-bold text-slate-900 block">{t.onboarding.page3.step2Title}</strong>
                    <p className="text-[11px] text-slate-500 leading-tight">{t.onboarding.page3.step2Desc}</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                    3
                  </div>
                  <div className="min-w-0 flex-1">
                    <strong className="text-xs font-bold text-slate-900 block">{t.onboarding.page3.step3Title}</strong>
                    <p className="text-[11px] text-slate-500 leading-tight">{t.onboarding.page3.step3Desc}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions with Back, Skip, and Next/Start Buttons */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              id="onboarding-back-btn"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.onboarding.back}</span>
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer px-2"
              id="onboarding-skip-btn-footer"
            >
              {t.onboarding.skip}
            </button>
          )}

          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer ml-auto"
            id="onboarding-next-btn"
          >
            <span>{step === 3 ? t.onboarding.getStarted : t.onboarding.next}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
