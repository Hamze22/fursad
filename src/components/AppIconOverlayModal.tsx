import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  Smartphone, 
  Globe, 
  Sparkles, 
  Eye, 
  ExternalLink,
  Share2,
  PlusSquare,
  MoreVertical,
  CheckCircle2
} from 'lucide-react';

interface AppIconOverlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppIconOverlayModal: React.FC<AppIconOverlayModalProps> = ({
  isOpen,
  onClose
}) => {
  const [copied, setCopied] = useState(false);
  const [previewMode, setPreviewMode] = useState<'app' | 'ios' | 'android' | 'guide'>('app');

  if (!isOpen) return null;

  const handleCopyLink = () => {
    const url = `${window.location.origin}/fursad-logo.jpg`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/fursad-logo.jpg';
    link.download = 'fursad-official-logo.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        id="app-icon-overlay-modal"
      >
        {/* Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-[#0A2540] via-blue-950 to-[#0A2540] text-white flex items-center justify-between border-b border-blue-900/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-white leading-tight">FURSAD Brand Emblem</h3>
              <p className="text-[11px] text-blue-200">Youth Opportunity • Official Identity Overlay</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer"
            id="close-app-icon-overlay-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Mode Selector Tabs */}
        <div className="px-6 pt-4 pb-2 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl text-xs font-bold text-slate-600">
            <button
              onClick={() => setPreviewMode('app')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                previewMode === 'app' ? 'bg-white text-[#0A2540] shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Full Icon</span>
            </button>
            <button
              onClick={() => setPreviewMode('ios')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                previewMode === 'ios' ? 'bg-white text-[#0A2540] shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>iOS Mockup</span>
            </button>
            <button
              onClick={() => setPreviewMode('android')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                previewMode === 'android' ? 'bg-white text-[#0A2540] shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>App Grid</span>
            </button>
            <button
              onClick={() => setPreviewMode('guide')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                previewMode === 'guide' ? 'bg-blue-600 text-white font-black shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              <PlusSquare className="w-3.5 h-3.5" />
              <span>Add to Phone</span>
            </button>
          </div>

          <span className="text-[11px] font-extrabold text-blue-600 uppercase tracking-wider hidden sm:inline">
            Official
          </span>
        </div>

        {/* Main Preview Area */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center bg-radial from-slate-50 to-slate-100/60">
          {previewMode === 'app' && (
            <div className="flex flex-col items-center space-y-5 animate-in zoom-in-95 duration-200">
              {/* App Icon Squircle Display */}
              <div className="relative group">
                <div className="absolute -inset-2 rounded-[36px] bg-gradient-to-r from-blue-600 to-blue-500 opacity-20 blur-xl group-hover:opacity-35 transition duration-500" />
                <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-[34px] sm:rounded-[44px] overflow-hidden bg-white shadow-2xl border-4 border-white ring-1 ring-slate-900/10">
                  <img
                    src="/fursad-logo.jpg"
                    alt="Fursad Youth Opportunity Official Identity"
                    className="w-full h-full object-cover select-none"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Icon Details */}
              <div className="text-center space-y-1">
                <h4 className="text-lg font-black text-slate-900 tracking-tight">FURSAD</h4>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">— YOUTH OPPORTUNITY —</p>
                <p className="text-xs text-slate-500 max-w-xs pt-1">
                  Navy Blue & Silver youth empowerment emblem for mobile app, web app, and PWA icon.
                </p>
              </div>
            </div>
          )}

          {previewMode === 'ios' && (
            <div className="flex flex-col items-center space-y-4 animate-in zoom-in-95 duration-200 w-full">
              {/* Smartphone Mockup Frame */}
              <div className="w-64 h-80 rounded-[38px] bg-slate-900 p-3 shadow-2xl border-4 border-slate-700 relative flex flex-col justify-between overflow-hidden">
                {/* Wallpaper simulation */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-950 opacity-90" />
                
                {/* Top Notch / Dynamic Island */}
                <div className="relative z-10 mx-auto w-24 h-4 bg-black rounded-full mb-4" />

                {/* Simulated Home Screen Icon Grid */}
                <div className="relative z-10 grid grid-cols-3 gap-4 px-2">
                  <div className="flex flex-col items-center space-y-1">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-lg border border-white/20 bg-white ring-2 ring-blue-600">
                      <img src="/fursad-logo.jpg" alt="Fursad" className="w-full h-full object-cover" />
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                        3
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-white drop-shadow-md">FURSAD</span>
                  </div>

                  {/* Dummy placeholder apps */}
                  <div className="flex flex-col items-center space-y-1 opacity-40">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500 shadow-md flex items-center justify-center text-white font-bold text-xs">
                      Mail
                    </div>
                    <span className="text-[10px] text-white">Mail</span>
                  </div>

                  <div className="flex flex-col items-center space-y-1 opacity-40">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500 shadow-md flex items-center justify-center text-white font-bold text-xs">
                      Maps
                    </div>
                    <span className="text-[10px] text-white">Maps</span>
                  </div>
                </div>

                {/* Bottom Dock */}
                <div className="relative z-10 w-full h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                  <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md">
                    <img src="/fursad-logo.jpg" alt="Fursad Dock" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              <span className="text-xs text-slate-500 font-semibold">
                iOS Home Screen Squircle Preview
              </span>
            </div>
          )}

          {previewMode === 'android' && (
            <div className="flex flex-col items-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-6 py-4">
                {/* Round Circle Version */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg border-2 border-slate-200 bg-white p-1">
                    <img src="/fursad-logo.jpg" alt="Round icon" className="w-full h-full object-cover rounded-full" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-600">Adaptive Circle</span>
                </div>

                {/* Squircle Version */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg border-2 border-slate-200 bg-white">
                    <img src="/fursad-logo.jpg" alt="Squircle icon" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-600">Squircle</span>
                </div>

                {/* Rounded Square */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-20 h-20 rounded-xl overflow-hidden shadow-lg border-2 border-slate-200 bg-white">
                    <img src="/fursad-logo.jpg" alt="Square icon" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-600">PWA / Web</span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 max-w-sm text-center">
                Astaantan waxaa loo diyaariyay inuu si toos ah u noqdo <strong>Brand Identity</strong> marka uu qofku app-ka ku daro shaashadda taleefanka (Add to Home Screen).
              </div>
            </div>
          )}

          {previewMode === 'guide' && (
            <div className="space-y-4 animate-in zoom-in-95 duration-200 w-full max-w-md">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-emerald-300 shadow-xs">
                  <img src="/apple-touch-icon.png" alt="Fursad" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold flex items-center gap-1.5 text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>HAA! Sawirka Logadu wuu ka muuqanayaa</span>
                  </h4>
                  <p className="text-[11px] text-emerald-800 leading-relaxed mt-0.5">
                    Marka aad doorato <strong>Add to Home Screen</strong>, astaanta FURSAD (Navy Blue & Golden Star) ayaa noqonaysa icon-ka rasmiga ah ee shaashaddaada!
                  </p>
                </div>
              </div>

              {/* iOS Safari Steps */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-black text-slate-900 pb-1 border-b border-slate-100">
                  <Smartphone className="w-4 h-4 text-blue-600" />
                  <span>Haddii aad isticmaalayso iPhone (Safari):</span>
                </div>
                <ol className="text-xs text-slate-700 space-y-2 list-decimal list-inside pl-1">
                  <li className="leading-relaxed">
                    Ka fur link-iga app-ka browser-ka <strong>Safari</strong>.
                  </li>
                  <li className="leading-relaxed">
                    Taabo badhanka <strong>Share</strong> ee hoose <Share2 className="w-3.5 h-3.5 inline text-blue-600" /> (leyliga falladhu ka baxayso).
                  </li>
                  <li className="leading-relaxed">
                    Hoos u yara rog oo taabo <strong>Add to Home Screen</strong> <PlusSquare className="w-3.5 h-3.5 inline text-blue-600" />.
                  </li>
                  <li className="leading-relaxed font-semibold text-slate-900">
                    Guji <strong>Add</strong> ee geeska sare &mdash; waxaa kuugu soo baxaya icon-kan rasmiga ah ee FURSAD!
                  </li>
                </ol>
              </div>

              {/* Android Chrome Steps */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-black text-slate-900 pb-1 border-b border-slate-100">
                  <Globe className="w-4 h-4 text-emerald-600" />
                  <span>Haddii aad isticmaalayso Android (Chrome):</span>
                </div>
                <ol className="text-xs text-slate-700 space-y-2 list-decimal list-inside pl-1">
                  <li className="leading-relaxed">
                    Ka fur link-iga app-ka browser-ka <strong>Google Chrome</strong>.
                  </li>
                  <li className="leading-relaxed">
                    Taabo 3-da dhibcood ee kore <MoreVertical className="w-3.5 h-3.5 inline text-slate-700" /> (Menu).
                  </li>
                  <li className="leading-relaxed">
                    Dooro <strong>Install App</strong> ama <strong>Add to Home screen</strong>.
                  </li>
                  <li className="leading-relaxed font-semibold text-slate-900">
                    Guji <strong>Install</strong> &mdash; taleefankaagu wuxuu u kaydsanayaa sidii Native Application oo kale!
                  </li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              id="download-app-icon-btn"
            >
              <Download className="w-4 h-4" />
              <span>Download Icon</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              id="copy-app-icon-link-btn"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy URL'}</span>
            </button>
          </div>

          <a
            href="/fursad-logo.jpg"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Open in new tab</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
