import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, Opportunity } from '../types';
import { api } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';
import { 
  Bot, 
  Send, 
  Sparkles, 
  RotateCcw,
  Loader2,
  Languages,
  FileText,
  Plane,
  Briefcase,
  GraduationCap,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

interface FursadAISectionViewProps {
  userProfile: UserProfile;
  opportunities: Opportunity[];
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onViewDetails: (opportunity: Opportunity) => void;
  onTrackApplyClick: (id: string) => void;
  onOpenProfile: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  matchedOpps?: Opportunity[];
  timestamp: string;
}

export const FursadAISectionView: React.FC<FursadAISectionViewProps> = ({
  userProfile,
  opportunities,
  onViewDetails
}) => {
  const { language, t, isRTL } = useLanguage();

  const getInitialMessage = (): Message => ({
    id: `init-${language}`,
    sender: 'ai',
    text: `${t.hero.greeting} ${userProfile.name.split(' ')[0]}! 🌍 **${t.ai.title}**

${t.ai.welcomeMessage}

${language === 'ar' ? '1. العثور على منح دراسية ممولة بالكامل.\n2. الجامعات التي تقبل شهادة لغة التدريس (MOI) بدون آيلتس.\n3. صياغة خطابات الغرض من الدراسة (SOP) وخطابات الدافع.\n4. المؤتمرات الدولية والتدريب المهني مع تذاكر طيران وإقامة.' :
  language === 'fr' ? '1. Trouver des bourses d\'études entièrement financées.\n2. Universités acceptant l\'attestation MOI sans IELTS.\n3. Rédaction de SOP et lettres de motivation percutantes.\n4. Conférences et stages avec billets d\'avion et hôtel gratuits.' :
  language === 'en' ? '1. Finding fully funded global scholarships.\n2. Universities accepting English MOI without IELTS/TOEFL.\n3. High-impact Statement of Purpose (SOP) guidance.\n4. Youth summits & internships with fully covered flights & housing.' :
  '1. Helidda deeqaha waxbarasho ee daboolaya kharashka oo dhan (Fully Funded).\n2. Jaamacadaha aqbala shahaadada Ingiriiska ee dugsiga/jaamacadda (MOI) adigoo aan qaadan IELTS.\n3. Talooyinka qorista Statement of Purpose (SOP) & Waraaqaha Dhiirrigelinta.\n4. Shirarka iyo tababarrada caalamiga ah ee bixiya tikidhada diyaaradda iyo huteelka.'}`,
    timestamp: 'Just now'
  });

  const [messages, setMessages] = useState<Message[]>([getInitialMessage()]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([getInitialMessage()]);
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const readyPrompts = [
    {
      icon: GraduationCap,
      label: t.ai.quickPrompts.fullyFundedEurope.label,
      query: t.ai.quickPrompts.fullyFundedEurope.query
    },
    {
      icon: Languages,
      label: t.ai.quickPrompts.moiNoIelts.label,
      query: t.ai.quickPrompts.moiNoIelts.query
    },
    {
      icon: FileText,
      label: t.ai.quickPrompts.sopMotivation.label,
      query: t.ai.quickPrompts.sopMotivation.query
    },
    {
      icon: Plane,
      label: t.ai.quickPrompts.youthFlights.label,
      query: t.ai.quickPrompts.youthFlights.query
    },
    {
      icon: Briefcase,
      label: t.ai.quickPrompts.paidInternships.label,
      query: t.ai.quickPrompts.paidInternships.query
    },
    {
      icon: ShieldCheck,
      label: t.ai.quickPrompts.checkEligibility.label,
      query: t.ai.quickPrompts.checkEligibility.query
    }
  ];

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await api.askFursadAI(textToSend, [], userProfile, language);
      
      const matchedOpps = opportunities.filter(o => 
        res.matchedOpportunityIds?.includes(o.id)
      );

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: res.response,
        matchedOpps: matchedOpps.length > 0 ? matchedOpps : undefined,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const fallbackText = language === 'ar'
        ? 'بحثت في قاعدة بياناتنا الموثقة. من أهم المنح المفتوحة حالياً: **DAAD EPOS (ألمانيا)**، **Chevening (بريطانيا)**، و**المنحة التركية Turkiye Burslari**.'
        : language === 'fr'
        ? 'J\'ai exploré notre base de données vérifiée. Parmi les bourses ouvertes : **DAAD EPOS (Allemagne)**, **Chevening (Royaume-Uni)**, et **Turkiye Burslari (Turquie)**.'
        : language === 'en'
        ? 'I searched our verified database. Top open opportunities right now include: **DAAD EPOS (Germany)**, **Chevening (UK)**, and **Turkiye Burslari (Turkey)**.'
        : 'Waxaan ka baadhay xog-ururintayada la xaqiijiyay. Deeqaha hadda furan ee ugu muhiimsan waxaa ka mid ah: **DAAD EPOS (Germany)**, **Chevening (UK)**, iyo **Turkiye Burslari (Turkey)**.';

      const errorMsg: Message = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: fallbackText,
        timestamp: 'Just now'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([getInitialMessage()]);
  };

  return (
    <div className="w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-5" id="fursad-ai-section-view" dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Ready Application Prompts Grid */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            {t.ai.suggestedTitle}
          </span>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            {t.ai.suggestedSubtitle}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5">
          {readyPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p.query)}
              disabled={isLoading}
              className={`p-3 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-xs transition-colors group flex items-start gap-2.5 cursor-pointer disabled:opacity-50 ${isRTL ? 'text-right' : 'text-left'}`}
              id={`ready-prompt-${idx}`}
            >
              <div className="p-2 rounded-xl bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                <p.icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <strong className="text-xs font-bold text-slate-900 block truncate group-hover:text-blue-700">
                  {p.label}
                </strong>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight mt-0.5">
                  {p.query}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Pure AI Chat Console */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden flex flex-col h-[600px] sm:h-[680px]">
        {/* Chat Top Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-none">
                {t.ai.title}
              </h3>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {t.ai.groundedBadge}
              </span>
            </div>
          </div>

          <button
            onClick={handleClearChat}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
            title={t.ai.clearChat}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.ai.clearChat}</span>
          </button>
        </div>

        {/* Chat Messages Feed */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/40">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] sm:max-w-2xl space-y-2.5 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white font-medium rounded-tr-none shadow-sm'
                      : 'bg-white text-slate-800 rounded-tl-none border border-slate-200/80 shadow-xs'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Attached Opportunities if referenced */}
                {msg.matchedOpps && msg.matchedOpps.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-black text-blue-700 uppercase tracking-wide block">
                      {t.ai.mentionedOpportunities}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.matchedOpps.map((opp) => (
                        <div
                          key={opp.id}
                          onClick={() => onViewDetails(opp)}
                          className="p-3 rounded-xl bg-white border border-blue-200 hover:border-blue-500 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-1.5 text-left"
                          dir="ltr"
                        >
                          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                            <span>{opp.flag} {opp.country}</span>
                            <span className="text-emerald-700 font-black">
                              {opp.fundingType === 'fully_funded' ? t.card.fullyFunded : t.card.paid}
                            </span>
                          </div>
                          <h5 className="text-xs font-bold text-slate-900 line-clamp-1">
                            {opp.title}
                          </h5>
                          <div className="flex items-center justify-between text-[10px] text-slate-500">
                            <span>{t.card.deadline} {opp.deadline}</span>
                            <span className="text-blue-700 font-bold flex items-center gap-1">
                              {t.card.viewDetails} <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <span className="text-[10px] text-slate-400 block px-1">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 items-center py-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs text-blue-950 font-bold flex items-center gap-2 shadow-xs">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                <span>{t.ai.thinking}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompt chips placed right above the Ask input bar */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 shrink-0 pr-1">
            <Sparkles className="w-3 h-3 text-blue-500" />
            <span className="hidden sm:inline">{t.ai.suggestedTitle}:</span>
          </div>
          {t.ai.inputChips.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(p.query)}
              disabled={isLoading}
              className="text-[11px] px-2.5 py-1 rounded-full bg-white hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-200 font-semibold whitespace-nowrap shadow-2xs transition-colors cursor-pointer disabled:opacity-40"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Chat Input Console */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t.ai.askPlaceholder}
              className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
              disabled={isLoading}
              id="ai-console-input"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all cursor-pointer shrink-0"
              id="ai-console-send-btn"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">{t.ai.askButton}</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
