import React, { useState } from 'react';
import { firebaseService } from '../services/firebaseService';
import { UserProfile, DegreeLevel } from '../types';
import { FursadLogo } from './FursadLogo';
import { 
  ArrowLeft,
  Mail, 
  Lock, 
  User as UserIcon, 
  Loader2, 
  ArrowRight, 
  AlertCircle,
  Copy,
  Check,
  Sparkles
} from 'lucide-react';

interface AuthViewProps {
  onBack: () => void;
  onAuthSuccess: (profile: UserProfile) => void;
  initialMode?: 'login' | 'register';
}

export const AuthView: React.FC<AuthViewProps> = ({
  onBack,
  onAuthSuccess,
  initialMode = 'login'
}) => {
  // Mode: 'signin' or 'register'
  const [authMode, setAuthMode] = useState<'signin' | 'register'>(
    initialMode === 'register' ? 'register' : 'signin'
  );

  // Sign In Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [countryOrigin, setCountryOrigin] = useState('Somalia');
  const [currentCity, setCurrentCity] = useState('Mogadishu');
  const [educationLevel, setEducationLevel] = useState<DegreeLevel>('bachelor');
  const [fieldOfStudy, setFieldOfStudy] = useState('Computer Science & IT');
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  // Forgot Password Modal
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);
  const [forgotError, setForgotError] = useState<string | null>(null);

  const [googleLoading, setGoogleLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isDomainError, setIsDomainError] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState(false);

  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : '';

  const handleCopyDomain = () => {
    if (currentHostname) {
      navigator.clipboard.writeText(currentHostname);
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 3000);
    }
  };

  // Handle Sign In Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setGeneralError(null);
    setLoginLoading(true);

    try {
      const { profile } = await firebaseService.loginWithEmail(loginEmail, loginPassword);
      if (profile) {
        onAuthSuccess(profile);
      }
    } catch (err: any) {
      console.error(err);
      let msg = err.message || 'Invalid credentials. Please check your email and password.';
      setLoginError(msg);
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setGeneralError(null);

    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match.');
      return;
    }

    setRegLoading(true);
    try {
      const { profile } = await firebaseService.registerWithEmail({
        email: regEmail,
        pass: regPassword,
        name: regName,
        countryOrigin,
        currentCity,
        educationLevel,
        fieldOfStudy
      });
      onAuthSuccess(profile);
    } catch (err: any) {
      console.error(err);
      let msg = err.message || 'Registration could not be completed.';
      setRegError(msg);
    } finally {
      setRegLoading(false);
    }
  };

  // Google Single Sign-On (Acts as both Login & Register)
  const handleGoogleAuth = async () => {
    setGeneralError(null);
    setIsDomainError(false);
    setGoogleLoading(true);
    try {
      const { profile } = await firebaseService.loginWithGoogle();
      onAuthSuccess(profile);
    } catch (err: any) {
      console.error(err);
      const isUnauthorized = 
        err.code === 'auth/unauthorized-domain' ||
        err.message?.includes('unauthorized-domain') ||
        err.message?.includes('authorized domain');

      if (isUnauthorized) {
        setIsDomainError(true);
        setGeneralError('Domain-ka app-kan kuma jiro Authorized Domains ee Firebase.');
      } else {
        setGeneralError(err.message || 'Google authentication failed.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  // Handle Password Reset
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotSuccess(null);
    setForgotLoading(true);
    try {
      await firebaseService.resetPassword(forgotEmail);
      setForgotSuccess('Password reset instructions have been sent to your email.');
    } catch (err: any) {
      setForgotError(err.message || 'Unable to send reset email. Please verify the address.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 sm:py-14 px-4 sm:px-6 pb-24" id="auth-page-screen">
      <div className="w-full max-w-md mx-auto space-y-6">
        
        {/* Top Back Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 shadow-xs transition-all cursor-pointer"
            id="auth-back-btn"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>Back</span>
          </button>
        </div>

        {isDomainError ? (
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-300 text-blue-900 space-y-3 animate-in fade-in" id="auth-unauthorized-domain-alert">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-blue-950">Domain-ka App-ka kuma jiro Firebase (Authorized Domains)</h4>
                <p className="text-xs text-blue-800 mt-0.5 leading-relaxed">
                  Google Sign-In wuxuu u baahan yahay in domain-kan lagu daro liiska <strong>Authorized Domains</strong> ee Firebase Console.
                </p>
              </div>
            </div>

            {/* Domain box with Copy Button */}
            <div className="bg-white p-2.5 rounded-xl border border-blue-200 flex items-center justify-between gap-2 shadow-xs">
              <code className="text-[11px] sm:text-xs font-mono text-slate-800 break-all select-all font-bold">
                {currentHostname || 'ais-dev-cjmxa2yvpgvrsf6ypn7zqr-221043921390.europe-west2.run.app'}
              </code>
              <button
                type="button"
                onClick={handleCopyDomain}
                className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold flex items-center gap-1 shrink-0 transition-colors cursor-pointer shadow-xs"
              >
                {copiedDomain ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedDomain ? 'La koobiyay!' : 'Copy Domain'}</span>
              </button>
            </div>

            <div className="text-[11px] text-blue-900 space-y-1 bg-blue-100/60 p-2.5 rounded-xl border border-blue-200/80">
              <p className="font-bold">Tallaabooyinka fudud (1 daqiiqo):</p>
              <ol className="list-decimal list-inside space-y-0.5 text-blue-800">
                <li>Gal <strong>Firebase Console</strong> &rarr; mashruucaaga <strong>fursad-c833a</strong></li>
                <li>Guji <strong>Authentication</strong> &rarr; tab-ka <strong>Settings</strong> &rarr; <strong>Authorized domains</strong></li>
                <li>Guji <strong>Add domain</strong>, ku dheji domain-ka kore, kadibna guji <strong>Save</strong></li>
              </ol>
            </div>

            <div className="text-[11px] text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Talo degdeg ah: Waxaad isla hadda si toos ah ugu geli kartaa <strong>Email & Password</strong> hoose adigoon u baahnayn Authorized Domains!</span>
            </div>
          </div>
        ) : generalError ? (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{generalError}</span>
          </div>
        ) : null}

        {/* Main Clean Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          
          {/* Official Brand Logo */}
          <div className="flex justify-center pb-1">
            <FursadLogo size="lg" showText={true} />
          </div>

          {/* Header text */}
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-black text-slate-900">
              {authMode === 'signin' ? 'Sign In' : 'Create Account'}
            </h1>
            <p className="text-xs text-slate-500">
              {authMode === 'signin' 
                ? 'Welcome back! Enter your details to access your account'
                : 'Join FURSAD to track scholarships and matching opportunities'}
            </p>
          </div>

          {/* Google Sign In / Sign Up Button (One-click Login & Register) */}
          <div>
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={googleLoading}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-300 flex items-center justify-center gap-3 shadow-xs transition-all cursor-pointer"
              id="auth-google-sso-btn"
            >
              {googleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              ) : (
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              )}
              <span>Continue with Google</span>
            </button>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-slate-400 font-semibold">Or with email</span>
              </div>
            </div>
          </div>

          {/* SIGN IN FORM */}
          {authMode === 'signin' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
                    id="signin-email-input"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(loginEmail);
                      setShowForgot(true);
                    }}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
                    id="signin-password-input"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                id="signin-submit-btn"
              >
                {loginLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Bottom Toggle: I don't have an account */}
              <div className="text-center pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-600">
                  I don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setRegEmail(loginEmail);
                      setAuthMode('register');
                    }}
                    className="font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer ml-1"
                    id="toggle-to-register-btn"
                  >
                    Register
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* REGISTER FORM */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {regError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{regError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Ahmed Mohamed"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
                    id="register-name-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="scholar@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
                    id="register-email-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Country</label>
                  <input
                    type="text"
                    value={countryOrigin}
                    onChange={(e) => setCountryOrigin(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">City</label>
                  <input
                    type="text"
                    value={currentCity}
                    onChange={(e) => setCurrentCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Education</label>
                  <select
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value as DegreeLevel)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                  >
                    <option value="high_school">High School</option>
                    <option value="bachelor">Bachelor</option>
                    <option value="master">Master</option>
                    <option value="phd">PhD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Field of Study</label>
                  <input
                    type="text"
                    value={fieldOfStudy}
                    onChange={(e) => setFieldOfStudy(e.target.value)}
                    placeholder="Computer Science"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                    id="register-password-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Confirm</label>
                  <input
                    type="password"
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={regLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                id="register-submit-btn"
              >
                {regLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Bottom Toggle: Already have an account */}
              <div className="text-center pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail(regEmail);
                      setAuthMode('signin');
                    }}
                    className="font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer ml-1"
                    id="toggle-to-signin-btn"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          )}

        </div>

        {/* Forgot Password Modal */}
        {showForgot && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900">Reset Password</h3>
                <button
                  onClick={() => setShowForgot(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>

              <p className="text-xs text-slate-500">
                Enter your account email address. We will send you a link to reset your password.
              </p>

              {forgotError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
                  {forgotError}
                </div>
              )}

              {forgotSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                  {forgotSuccess}
                </div>
              )}

              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgot(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer flex items-center gap-2"
                  >
                    {forgotLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Send Reset Link</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
