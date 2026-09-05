import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, Opportunity } from '../types';
import { api } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { 
  Bot, 
  Send, 
  Sparkles, 
  X, 
  Loader2, 
  ArrowRight,
  RotateCcw
} from 'lucide-react';

interface FursadAIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  opportunities: Opportunity[];
  onViewOpportunity: (opportunity: Opportunity) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  matchedOpps?: Opportunity[];
  timestamp: string;
}

export const FursadAIAssistant: React.FC<FursadAIAssistantProps> = ({
  isOpen,
  onClose,
  userProfile,
  opportunities,
  onViewOpportunity
}) => {
  const { language, t, isRTL } = useLanguage();

  const getInitialMessage = (): Message => ({
    id: `init-${language}`,
    sender: 'ai',
    text: `${t.hero.greeting} ${userProfile.name.split(' ')[0]}! 🌍 **${t.ai.title}**

${t.ai.welcomeMessage}

${language === 'ar' ? 'يمكنك الضغط على أحد الأسئلة المقترحة أدناه أو كتابة أي استفسار تريده:' :
  language === 'fr' ? 'Cliquez sur l\'une des questions suggérées ci-dessous ou posez votre propre question :' :
  language === 'en' ? 'Click any of the suggested topics below or ask anything directly:' :
  'Guji su\'aalaha hoose ama toos u weydii wixii aad doonto:'}`,
    timestamp: 'Just now'
  });

  const [messages, setMessages] = useState<Message[]>([getInitialMessage()]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Reset or update welcome message when language changes
  useEffect(() => {
    setMessages([getInitialMessage()]);
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const quickPrompts = t.ai.inputChips;

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
      
      // Match with database objects
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

  const handleResetChat = () => {
    setMessages([getInitialMessage()]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in" id="fursad-ai-modal" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[90vh] my-auto">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">{t.ai.title}</h3>
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-400 text-slate-950 uppercase">
                  {t.ai.groundedBadge}
                </span>
              </div>
              <p className="text-[11px] text-blue-200">
                {t.ai.tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSelector />

            <button
              onClick={handleResetChat}
              className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title={t.ai.clearChat}
              id="ai-modal-reset-btn"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              id="ai-modal-close-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Message Scroll Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 text-slate-800 space-y-4 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className="max-w-[85%] sm:max-w-[80%] space-y-2">
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-xs shadow-md shadow-blue-600/10'
                      : 'bg-white text-slate-800 rounded-tl-xs border border-slate-200/80 shadow-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-medium">
                    {msg.text}
                  </div>
                </div>

                {/* Linked Opportunity Cards inside AI Response */}
                {msg.matchedOpps && msg.matchedOpps.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-extrabold uppercase text-blue-700 block">
                      {t.ai.mentionedOpportunities}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.matchedOpps.map((opp) => (
                        <div
                          key={opp.id}
                          onClick={() => {
                            onClose();
                            onViewOpportunity(opp);
                          }}
                          className="p-3 rounded-xl bg-white border border-blue-200 hover:border-blue-400 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-1.5 group text-left"
                          dir="ltr"
                        >
                          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                            <span>{opp.flag} {opp.country}</span>
                            <span className="text-emerald-700 font-extrabold">
                              {opp.fundingType === 'fully_funded' ? t.card.fullyFunded : t.card.paid}
                            </span>
                          </div>
                          <h5 className="text-xs font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">
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
            <div className="flex gap-3 justify-start items-center text-slate-500 text-xs py-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs text-blue-950 font-bold flex items-center gap-2 shadow-xs">
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
          {quickPrompts.map((p, i) => (
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

        {/* Input Bar */}
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
              id="fursad-ai-input"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="px-4 py-3 sm:px-5 sm:py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all cursor-pointer shrink-0"
              id="fursad-ai-send-btn"
            >
              <Send className="w-4 h-4" />
              <span>{t.ai.askButton}</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
