import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { SupportedLanguage } from '../i18n/types';
import { Globe2, Check, ChevronDown, Sparkles } from 'lucide-react';

interface LanguageSelectorProps {
  variant?: 'compact' | 'full' | 'dropdown' | 'inline-buttons' | 'grid-cards' | 'accordion';
  className?: string;
  onLanguageChange?: (lang: SupportedLanguage) => void;
  defaultExpanded?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'dropdown',
  className = '',
  onLanguageChange,
  defaultExpanded = false
}) => {
  const { language, setLanguage, availableLanguages, currentLanguageOption, isRTL, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(defaultExpanded);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (variant === 'dropdown' && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [variant]);

  const handleSelect = (code: SupportedLanguage) => {
    setLanguage(code);
    if (variant === 'dropdown' || variant === 'accordion') {
      setIsOpen(false);
    }
    if (onLanguageChange) {
      onLanguageChange(code);
    }
  };

  // 1. Collapsible Accordion Variant (Compact & Expandable for See More Menu / Drawer)
  if (variant === 'accordion') {
    return (
      <div className={`rounded-2xl border border-slate-200/90 bg-slate-50/80 overflow-hidden transition-all ${className}`} id="language-accordion-container">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-2.5 sm:p-3 flex items-center justify-between hover:bg-slate-100/80 transition-colors cursor-pointer text-left"
          id="language-accordion-toggle"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-blue-100/80 text-blue-700 flex items-center justify-center shrink-0">
              <Globe2 className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-slate-900">
                  {t.common.language}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-blue-100 text-blue-800">
                  {currentLanguageOption.nativeName}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium truncate">
                {language === 'so' ? 'Dooro luuqadda' : language === 'ar' ? 'اختر اللغة' : language === 'fr' ? 'Choisir la langue' : 'Select language'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0 text-slate-400">
            <ChevronDown 
              className={`w-4 h-4 transition-transform duration-200 text-slate-600 ${
                isOpen ? 'rotate-180 text-blue-600' : ''
              }`} 
            />
          </div>
        </button>

        {isOpen && (
          <div className="p-2 pt-1 border-t border-slate-200/60 bg-white space-y-1 animate-in slide-in-from-top-1 duration-150">
            <div className="flex flex-col gap-1 pt-1">
              {availableLanguages.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSelect(lang.code)}
                    className={`w-full py-1.5 px-2.5 rounded-lg border text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold ring-1 ring-blue-300'
                        : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200/80 text-slate-700 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`text-xs ${isSelected ? 'font-black text-blue-950' : 'text-slate-800 font-semibold'}`}>
                        {lang.nativeName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({lang.name})
                      </span>
                    </div>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 1. Grid Cards Variant (Ideal for Mobile Drawer / "See More" menu)
  if (variant === 'grid-cards') {
    return (
      <div className={`grid grid-cols-2 gap-2 w-full ${className}`}>
        {availableLanguages.map((lang) => {
          const isSelected = language === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleSelect(lang.code)}
              className={`p-2.5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                isSelected
                  ? 'bg-blue-50/90 border-blue-400 text-blue-900 shadow-xs ring-2 ring-blue-500/20'
                  : 'bg-slate-50/80 hover:bg-slate-100/90 border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex flex-col min-w-0">
                  <span className={`text-xs truncate ${isSelected ? 'font-black text-blue-950' : 'font-bold text-slate-800'}`}>
                    {lang.nativeName}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium truncate">
                    {lang.name}
                  </span>
                </div>
              </div>
              {isSelected ? (
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </div>
              ) : null}
            </button>
          );
        })}
      </div>
    );
  }

  // 2. Inline Buttons Variant
  if (variant === 'inline-buttons') {
    return (
      <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
        {availableLanguages.map((lang) => {
          const isSelected = language === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleSelect(lang.code)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <span>{lang.nativeName}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // 3. Dropdown Menu Variant (For Header Navbar)
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border transition-all cursor-pointer select-none ${
          isOpen
            ? 'bg-blue-50 border-blue-400 text-blue-900 shadow-xs'
            : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-700 shadow-2xs'
        }`}
        id="language-selector-btn"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Select Language / Dooro Luuqadda / اختر اللغة"
      >
        <span className="font-extrabold text-xs text-slate-900">
          {currentLanguageOption.nativeName}
        </span>
        <ChevronDown 
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-blue-600' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <div 
          className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150`}
          id="language-dropdown-menu"
          role="menu"
        >
          <div className="px-3.5 py-2 border-b border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Language / Luuqadda
            </span>
            <Sparkles className="w-3 h-3 text-amber-500" />
          </div>

          <div className="p-1 space-y-0.5">
            {availableLanguages.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelect(lang.code)}
                  role="menuitem"
                  className={`w-full px-3 py-2 rounded-xl text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 text-blue-900 font-black'
                      : 'text-slate-700 hover:bg-slate-100 font-semibold'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex flex-col">
                      <span className="leading-tight">{lang.nativeName}</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {lang.name}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
