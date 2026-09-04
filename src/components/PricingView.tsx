import React, { useState } from 'react';
import { UserProfile, SubscriptionPlan } from '../types';
import { api } from '../services/api';
import { 
  Crown, 
  CheckCircle2, 
  Sparkles, 
  CreditCard, 
  Smartphone, 
  ShieldCheck, 
  ArrowRight,
  Loader2,
  Check,
  ArrowLeft,
  Lock,
  Globe2,
  Zap,
  HelpCircle
} from 'lucide-react';

interface PricingViewProps {
  userProfile: UserProfile;
  onProfileUpdated: (profile: UserProfile) => void;
  onBack: () => void;
}

export const PricingView: React.FC<PricingViewProps> = ({
  userProfile,
  onProfileUpdated,
  onBack
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string>('basic');
  const [paymentMethod, setPaymentMethod] = useState<'mobile_money' | 'card'>('mobile_money');
  const [mobileCarrier, setMobileCarrier] = useState<string>('evc_plus');
  const [phoneNumber, setPhoneNumber] = useState<string>('+252 61 ');
  const [cardNumber, setCardNumber] = useState<string>('4242 •••• •••• 4242');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);

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
          onBack();
        }, 2200);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3.5 sm:px-6 py-6 sm:py-10 space-y-8 animate-in fade-in duration-200" id="pricing-page-view">
      
      {/* Top Header & Breadcrumb */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
          id="pricing-back-button"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black uppercase tracking-wider border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>100% Secure Checkout</span>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-blue-950 text-white shadow-xl text-center space-y-3 relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-600/20 text-blue-300 text-xs font-black uppercase tracking-wider border border-blue-600/30">
          <Crown className="w-3.5 h-3.5" />
          Empowering Somali & Global Youth
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Affordable Plans for Every Scholar
        </h1>
        <p className="text-slate-300 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
          Transparent, student-friendly pricing with instant Somali Mobile Money (EVC Plus, Zaad, eDahab) & Card access.
        </p>
      </div>

      {paymentSuccess ? (
        <div className="p-12 text-center space-y-4 bg-emerald-50 rounded-3xl border border-emerald-200 shadow-md animate-in zoom-in-95">
          <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
          <h2 className="text-2xl font-black text-emerald-950">Subscription Activated Successfully!</h2>
          <p className="text-sm text-emerald-800 max-w-md mx-auto">
            You now have full access to personalized FURSAD AI guidance, SOP essay reviews, and priority deadline alerts.
          </p>
        </div>
      ) : (
        <>
          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* 1. Free Plan */}
            <div 
              onClick={() => setSelectedPlan('free')}
              className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-5 bg-white shadow-xs ${
                selectedPlan === 'free'
                  ? 'border-blue-600 ring-2 ring-blue-600 bg-blue-50/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-slate-900">Free Scholar</h3>
                  {selectedPlan === 'free' && (
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900">$0</span>
                  <span className="text-xs text-slate-500 font-semibold">/ forever</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Standard access to all verified global opportunities and deadlines.
                </p>

                <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs font-medium text-slate-700">
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
              className={`p-6 rounded-3xl border relative transition-all cursor-pointer flex flex-col justify-between space-y-5 bg-white shadow-md ${
                selectedPlan === 'basic'
                  ? 'border-blue-600 ring-2 ring-blue-600 bg-blue-50/30'
                  : 'border-blue-300 bg-blue-50/10 hover:border-blue-400'
              }`}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                Most Popular • Core Model
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-slate-900">Scholar Pro</h3>
                  {selectedPlan === 'basic' && (
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-blue-700">$4</span>
                  <span className="text-xs text-slate-500 font-semibold">/ full year ($0.33/mo)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The primary student-accessible model with AI matching and SOP review.
                </p>

                <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs font-medium text-slate-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-bold text-slate-900">Unlimited FURSAD AI Advisor</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>English MOI Waiver matching</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>AI Statement of Purpose (SOP) review</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>SMS / WhatsApp Deadline Alerts</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Pro / Mentorship $10 Plan */}
            <div 
              onClick={() => setSelectedPlan('pro')}
              className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-5 bg-white shadow-xs ${
                selectedPlan === 'pro'
                  ? 'border-purple-600 ring-2 ring-purple-600 bg-purple-50/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-slate-900">Global Elite</h3>
                  {selectedPlan === 'pro' && (
                    <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900">$10</span>
                  <span className="text-xs text-slate-500 font-semibold">/ full year</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  For scholars needing 1-on-1 alumni reviews and visa preparation.
                </p>

                <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs font-medium text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>All Scholar Pro AI features</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>1-on-1 Alumni Mock Interview Session</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Embassy Visa Checklist Assistance</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Payment Section Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-6">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <span>Select Payment Method</span>
            </h3>

            {/* Method Tabs */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('mobile_money')}
                className={`p-4 rounded-2xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  paymentMethod === 'mobile_money'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-600'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>Somali Mobile Money</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-2xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-600'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span>Credit / Debit Card</span>
              </button>
            </div>

            {/* Mobile Money Details */}
            {paymentMethod === 'mobile_money' && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-2">
                    Choose Carrier
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'evc_plus', name: 'Hormuud EVC Plus' },
                      { id: 'zaad', name: 'Telesom Zaad' },
                      { id: 'edahab', name: 'Somtel eDahab' }
                    ].map((carrier) => (
                      <button
                        key={carrier.id}
                        type="button"
                        onClick={() => setMobileCarrier(carrier.id)}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                          mobileCarrier === carrier.id
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                        }`}
                      >
                        {carrier.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                    Mobile Money Number
                  </label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+252 61 XXX XXXX"
                    className="w-full p-3 rounded-xl border border-slate-300 bg-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    You will receive an instant USSD push prompt on your mobile phone to approve the {selectedPlan === 'basic' ? '$4' : selectedPlan === 'pro' ? '$10' : '$0'} payment.
                  </span>
                </div>
              </div>
            )}

            {/* Card Details */}
            {paymentMethod === 'card' && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                    Card Details (Visa / MasterCard)
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 bg-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSubscribe}
                disabled={isProcessing}
                className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm sm:text-base shadow-lg shadow-blue-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                id="pricing-pay-now-btn"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing Secure Payment...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>
                      {selectedPlan === 'free' 
                        ? 'Continue with Free Plan' 
                        : `Activate Plan ($${selectedPlan === 'basic' ? '4' : '10'} / Year)`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
};
