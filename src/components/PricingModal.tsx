import React, { useState } from 'react';
import { UserProfile, SubscriptionPlan } from '../types';
import { api } from '../services/api';
import { 
  Crown, 
  CheckCircle2, 
  Sparkles, 
  CreditCard, 
  Smartphone, 
  X, 
  ShieldCheck, 
  ArrowRight,
  Loader2,
  Check
} from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onProfileUpdated: (profile: UserProfile) => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onProfileUpdated
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string>('basic');
  const [paymentMethod, setPaymentMethod] = useState<'mobile_money' | 'card'>('mobile_money');
  const [mobileCarrier, setMobileCarrier] = useState<string>('evc_plus');
  const [phoneNumber, setPhoneNumber] = useState<string>('+252 61 ');
  const [cardNumber, setCardNumber] = useState<string>('4242 •••• •••• 4242');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubscribe = async () => {
    setIsProcessing(true);
    try {
      const res = await api.subscribe({
        plan: selectedPlan,
        paymentMethod,
        phoneNumber: paymentMethod === 'mobile_money' ? phoneNumber : undefined,
        accountName: userProfile.name
      });

      if (res.success) {
        const updated = {
          ...userProfile,
          subscription: (selectedPlan === 'basic' ? 'premium' : selectedPlan === 'pro' ? 'pro' : 'enterprise') as SubscriptionPlan
        };
        onProfileUpdated(updated);
        setPaymentSuccess(true);
        setTimeout(() => {
          setPaymentSuccess(false);
          onClose();
        }, 2200);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto animate-in fade-in" id="pricing-modal">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto">
        
        {/* Header Bar */}
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-purple-900 via-slate-900 to-blue-900 text-white flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/20 text-blue-300 text-xs font-black uppercase tracking-wider border border-blue-600/30">
              <Crown className="w-3.5 h-3.5" />
              Empowering Global Youth
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Affordable Plans for Every Scholar
            </h2>
            <p className="text-xs sm:text-sm text-purple-200">
              Transparent, student-friendly pricing with instant Somali Mobile Money (EVC Plus, Zaad, eDahab) & Card access.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            id="pricing-close-btn"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-800 space-y-6">
          
          {paymentSuccess ? (
            <div className="p-10 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200 animate-in zoom-in-95">
              <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
              <h3 className="text-xl font-extrabold text-emerald-950">Subscription Activated Successfully!</h3>
              <p className="text-sm text-emerald-800">
                You now have full access to personalized AI matching, SOP reviews, and priority deadline alerts.
              </p>
            </div>
          ) : (
            <>
              {/* Pricing Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* 1. Free Plan */}
                <div 
                  onClick={() => setSelectedPlan('free')}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                    selectedPlan === 'free'
                      ? 'border-purple-600 ring-2 ring-purple-600 bg-purple-50/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-2">
                    <h4 className="text-base font-extrabold text-slate-900">Free Scholar</h4>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-slate-900">$0</span>
                      <span className="text-xs text-slate-500 font-semibold">/ forever</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Standard access to all verified global opportunities and deadlines.
                    </p>

                    <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Search verified opportunities</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Direct official apply links</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Basic deadline countdown</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Core $4 / Year Plan (The Highlighted Model) */}
                <div 
                  onClick={() => setSelectedPlan('basic')}
                  className={`p-5 rounded-2xl border relative transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                    selectedPlan === 'basic'
                      ? 'border-purple-600 ring-2 ring-purple-600 bg-purple-50/40 shadow-lg'
                      : 'border-purple-300 bg-purple-50/20 hover:border-purple-400'
                  }`}
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                    Most Popular • Core Model
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-base font-extrabold text-slate-900 flex items-center justify-between">
                      <span>Core Member</span>
                      <Sparkles className="w-4 h-4 text-blue-600" />
                    </h4>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-purple-700">$4</span>
                      <span className="text-xs text-slate-500 font-semibold">/ year (or $0.50/mo)</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Personalized AI matching, automated deadline tracking, and MOI guidance.
                    </p>

                    <div className="space-y-2 pt-3 border-t border-purple-100 text-xs">
                      <div className="flex items-center gap-2 font-semibold text-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                        <span>Automated AI Profile Matching</span>
                      </div>
                      <div className="flex items-center gap-2 font-semibold text-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                        <span>Application Pipeline Tracker</span>
                      </div>
                      <div className="flex items-center gap-2 font-semibold text-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                        <span>MOI Exemption Guides</span>
                      </div>
                      <div className="flex items-center gap-2 font-semibold text-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                        <span>SMS / Email Deadline Alerts</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Pro Plan $10 */}
                <div 
                  onClick={() => setSelectedPlan('pro')}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                    selectedPlan === 'pro'
                      ? 'border-purple-600 ring-2 ring-purple-600 bg-purple-50/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-2">
                    <h4 className="text-base font-extrabold text-slate-900 flex items-center justify-between">
                      <span>Pro Scholar</span>
                      <Crown className="w-4 h-4 text-blue-600" />
                    </h4>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-slate-900">$10</span>
                      <span className="text-xs text-slate-500 font-semibold">/ year</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Full AI Statement of Purpose advisor, unlimited queries & group mentorship.
                    </p>

                    <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-2 font-semibold text-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                        <span>Everything in Core ($4)</span>
                      </div>
                      <div className="flex items-center gap-2 font-semibold text-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                        <span>AI Statement of Purpose (SOP) Review</span>
                      </div>
                      <div className="flex items-center gap-2 font-semibold text-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                        <span>Alumni Mentorship Group Access</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Payment Method Selector */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-600">
                    Select Convenient Payment Gateway
                  </h4>
                  <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Instant Activation
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mobile_money')}
                    className={`p-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      paymentMethod === 'mobile_money'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Somali Mobile Money</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Credit / Debit Card</span>
                  </button>
                </div>

                {paymentMethod === 'mobile_money' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Carrier Provider</label>
                      <select
                        value={mobileCarrier}
                        onChange={(e) => setMobileCarrier(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-semibold"
                      >
                        <option value="evc_plus">Hormuud EVC Plus (*770#)</option>
                        <option value="zaad">Telesom ZAAD (*880#)</option>
                        <option value="edahab">Somtel eDahab (*100#)</option>
                        <option value="waafi">Waafi / Premier Bank</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Phone Number (Merchant Prompt)</label>
                      <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-semibold"
                        placeholder="+252 61..."
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        defaultValue={userProfile.name}
                        className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-semibold"
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

        </div>

        {/* Footer */}
        {!paymentSuccess && (
          <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Cancel anytime. 100% money-back guarantee within 14 days.
            </div>

            <button
              type="button"
              onClick={handleSubscribe}
              disabled={isProcessing}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-purple-600/25 transition-all cursor-pointer"
              id="confirm-subscribe-btn"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <span>Activate {selectedPlan === 'free' ? 'Free Access' : selectedPlan === 'basic' ? 'Core Plan ($4)' : 'Pro Plan ($10)'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
