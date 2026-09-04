import React, { useState } from 'react';
import { Opportunity, UserProfile } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import {
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Building2,
  MapPin,
  Coins,
  Send,
  Check,
  FileText,
  UserCheck,
  Award,
  Clock,
  ArrowRight,
  ExternalLink,
  MessageCircle
} from 'lucide-react';

interface ApplyWithFursadModalProps {
  opportunity: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
  userProfile?: UserProfile;
  onTrackApplyClick?: (id: string) => void;
}

export const ApplyWithFursadModal: React.FC<ApplyWithFursadModalProps> = ({
  opportunity,
  isOpen,
  onClose,
  userProfile,
  onTrackApplyClick
}) => {
  const { language, isRTL } = useLanguage();
  const [applicantName, setApplicantName] = useState(userProfile?.name || '');
  const [applicantWhatsApp, setApplicantWhatsApp] = useState(userProfile?.phone || '');
  const [applicantEducation, setApplicantEducation] = useState(userProfile?.educationLevel || 'bachelor');
  const [applicantNotes, setApplicantNotes] = useState('');
  const [submittedDirectly, setSubmittedDirectly] = useState(false);

  // Lock body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !opportunity) return null;

  // Fursad Official WhatsApp Support Number
  // Allows direct international WhatsApp routing
  const fursadWhatsAppNumber = '252639404820'; // Fursad official support hotline

  const generateWhatsAppMessage = () => {
    const isSomali = language === 'so';
    const isArabic = language === 'ar';

    if (isSomali) {
      return `Asc Team FURSAD! Waxaan doonayaa adeegga caawinta codsiga (Apply with Fursad) ee fursaddan:

📌 *Fursadda:* ${opportunity.title}
🏛️ *Jaamacadda/Hay'adda:* ${opportunity.university || opportunity.organization}
🌍 *Waddanka:* ${opportunity.country} (${opportunity.flag})
💰 *Maalgelinta:* ${opportunity.fundingType === 'fully_funded' ? 'Fully Funded (100% Bilaash)' : opportunity.fundingType}
⏳ *Xilliga Kama Dambaysta:* ${opportunity.deadline}
🎓 *Heerkayga Waxbarasho:* ${applicantEducation || 'Bachelor / Master'}
👤 *Magacayga:* ${applicantName || 'Arday FURSAD'}
${applicantWhatsApp ? `📞 *Tel/WhatsApp:* ${applicantWhatsApp}` : ''}
${applicantNotes ? `📝 *Faahfaahin dheeraad ah:* ${applicantNotes}` : ''}

Fadlan ila bilaaba diyaarinta dukumentiyada, qorista SOP-ga, iyo gudbinta codsigayga. Mahadsanidiin!`;
    }

    if (isArabic) {
      return `مرحباً فريق فرصة! أود الاستفادة من خدمة المساعدة في التقديم (Apply with Fursad) لهذه الفرصة:

📌 *الفرصة:* ${opportunity.title}
🏛️ *المؤسسة/الجامعة:* ${opportunity.university || opportunity.organization}
🌍 *الدولة:* ${opportunity.country}
💰 *التمويل:* ${opportunity.fundingType}
⏳ *الموعد النهائي:* ${opportunity.deadline}
👤 *الاسم:* ${applicantName || 'مستخدم فرصة'}

يرجى إرشادي والبدء في مراجعة مستنداتي وتقديم الطلب. شكراً لكم!`;
    }

    return `Hello FURSAD Admissions Team! I would like one-on-one application assistance (Apply with FURSAD) for:

📌 *Opportunity:* ${opportunity.title}
🏛️ *Institution:* ${opportunity.university || opportunity.organization}
🌍 *Country:* ${opportunity.country} (${opportunity.flag})
💰 *Funding:* ${opportunity.fundingType}
⏳ *Deadline:* ${opportunity.deadline}
🎓 *My Education Level:* ${applicantEducation || 'Undergraduate / Graduate'}
👤 *Applicant Name:* ${applicantName || 'Fursad Scholar'}
${applicantWhatsApp ? `📞 *WhatsApp Phone:* ${applicantWhatsApp}` : ''}
${applicantNotes ? `📝 *Notes:* ${applicantNotes}` : ''}

Please guide me through document preparation, SOP drafting, and official submission. Thank you!`;
  };

  const whatsAppUrl = `https://api.whatsapp.com/send?phone=${fursadWhatsAppNumber}&text=${encodeURIComponent(
    generateWhatsAppMessage()
  )}`;

  const handleWhatsAppClick = () => {
    if (onTrackApplyClick && opportunity) {
      onTrackApplyClick(opportunity.id);
    }
    window.open(whatsAppUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDirectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedDirectly(true);
    if (onTrackApplyClick && opportunity) {
      onTrackApplyClick(opportunity.id);
    }
    // Also trigger WhatsApp after 1 second for instant chat
    setTimeout(() => {
      window.open(whatsAppUrl, '_blank', 'noopener,noreferrer');
    }, 800);
  };

  const assistanceBenefits = [
    {
      icon: FileText,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      title: language === 'so' ? 'Qorista & Tafatirka Qoraalka Qancinta (SOP / Motivation Letter)' : 'Winning Statement of Purpose & Motivation Letter',
      desc: language === 'so' 
        ? 'Waxaan kuu qoraynaa ama kuu saxaynaa qoraal qancin heer caalami ah oo si toos ah ugu habboon deeqdan gaarka ah.'
        : 'Expert drafting, proofreading, and structuring of your Statement of Purpose tailored specifically to this university/grant.'
    },
    {
      icon: UserCheck,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      title: language === 'so' ? 'Hubinta & Qiimaynta Dukumentiyada (Transcripts & Certificates)' : 'Document Review, Translation & MOI Verification',
      desc: language === 'so'
        ? 'Hubinta shahaadooyinka, buundooyinka, baasaboorka, iyo shahaadada English MOI si aysan wax qalad ah ugu dhicin.'
        : 'Verification of your transcripts, degree diplomas, CV, and English Medium of Instruction certificates.'
    },
    {
      icon: Award,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      title: language === 'so' ? 'Habaynta Academic CV & Warqadaha Talo-bixinta (References)' : 'Academic CV Formatting & Reference Letter Guidance',
      desc: language === 'so'
        ? 'Qaabaynta CV-ga heerka Europass ama Harvard iyo diyaarinta foomamka talo-bixinta macallimiinta (Recommendations).'
        : 'Europass & US-standard academic CV tailoring and professor recommendation letter templates.'
    },
    {
      icon: ShieldCheck,
      color: 'bg-blue-50 text-blue-800 border-blue-200',
      title: language === 'so' ? 'Gudbinta Tooska ah ee Bogga Rasmiga ah (Official Portal Submission)' : 'Direct Official Portal Submission & Guidance',
      desc: language === 'so'
        ? 'Kala shaqeynta buuxinta foomamka adag ee barta rasmiga ah ee jaamacadda tallaabo-tallaabo iyadoo aadan khaldin.'
        : 'Step-by-step navigation and submission assistance through the host university or government portal.'
    },
    {
      icon: Clock,
      color: 'bg-rose-50 text-rose-700 border-rose-200',
      title: language === 'so' ? 'U Diyaargarowga Wareysiga & Talooyinka Visa-da' : 'Scholarship Interview Coaching & Visa Guidance',
      desc: language === 'so'
        ? 'Tababar toos ah oo ku saabsan su\'aalaha wareysiga deeqda waxbarasho iyo talooyinka safaaradda visa-da.'
        : '1-on-1 mock interview preparation and Embassy visa application guidance upon getting shortlisted.'
    }
  ];

  return (
    <div
      className="fixed inset-0 z-[100] bg-white sm:bg-slate-950/80 sm:backdrop-blur-sm overflow-y-auto overflow-x-hidden animate-in fade-in duration-300"
      id="apply-with-fursad-modal"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="min-h-screen flex flex-col items-center justify-start sm:py-10 px-0 sm:px-4">
        {/* Main Modal Container - Cohesive Page Layout */}
        <div className="bg-white w-full max-w-2xl sm:rounded-[40px] shadow-2xl border-none sm:border sm:border-slate-200 flex flex-col relative overflow-hidden">
          
          {/* Modal Hero Header Section - High Contrast & Branded */}
          <div className="p-8 sm:p-12 bg-slate-950 text-white relative flex flex-col items-start gap-5 sm:rounded-t-[40px] overflow-hidden">
            {/* Abstract Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] -mr-32 -mt-32 rounded-full" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 blur-[80px] -ml-24 -mb-24 rounded-full" />
            
            {/* Close Button - Premium Floating Style */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-2xl bg-white/5 hover:bg-white/15 text-white transition-all cursor-pointer z-20 border border-white/10 active:scale-95"
              title="Close"
              id="close-apply-fursad-modal-btn"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black bg-blue-500 text-white uppercase tracking-[0.15em] shadow-lg shadow-blue-500/20">
                <div className="w-4 h-4 rounded-md overflow-hidden bg-white p-0.5 border border-blue-400/30 shrink-0">
                  <img src="/fursad-logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-sm" />
                </div>
                <span>{language === 'so' ? 'Adeegga FURSAD' : 'FURSAD Assisted Apply'}</span>
              </div>
              
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tighter leading-[1.1]">
                {language === 'so' ? 'Codsashada Khibradda Leh' : 'Expert Application Support'}
              </h2>
              
              <p className="text-sm sm:text-lg text-slate-400 font-medium max-w-md leading-relaxed">
                {language === 'so'
                  ? 'Waxaan kuu dhisaynaa qoraal SOP ah oo guul horseeda iyo CV heer caalami ah.'
                  : 'We craft winning scholarship documents and handle the entire submission process for you.'}
              </p>
            </div>

            {/* Trust Metrics Row */}
            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/5 w-full relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Security</p>
                  <p className="text-xs font-bold text-slate-200">100% Verified</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <UserCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Expertise</p>
                  <p className="text-xs font-bold text-slate-200">Advisor Led</p>
                </div>
              </div>
            </div>
          </div>

        {/* Sticky Opportunity Summary for Context */}
        <div className="sticky top-0 z-20 bg-slate-50/95 backdrop-blur-md border-b border-slate-200 px-5 sm:px-8 py-3.5 flex items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
              <span className="text-xl">{opportunity.flag}</span>
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-black text-slate-900 truncate">{opportunity.title}</h3>
              <p className="text-[11px] text-slate-500 font-bold truncate">{opportunity.organization}</p>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <span className="text-[10px] text-slate-400 font-black uppercase block">Deadline</span>
            <span className="text-xs font-black text-rose-600">{opportunity.deadline}</span>
          </div>
        </div>

        {/* Modal Body Content - Clean Scrollable Flow */}
        <div className="p-6 sm:p-10 space-y-10 text-slate-900 pb-24 sm:pb-12">
          
          {/* Value Proposition Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs border border-blue-100">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-black text-slate-900 tracking-tight">
                {language === 'so' ? 'Maxaynu kugu caawinaynaa?' : 'How We Support Your Success'}
              </h4>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {assistanceBenefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-xs hover:border-blue-200 transition-all">
                  <div className={`p-3 rounded-xl ${benefit.color} shrink-0`}>
                    <benefit.icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-sm font-black text-slate-900">{benefit.title}</h5>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      {benefit.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Direct WhatsApp Call to Action - Highlighted */}
          <div className="p-6 sm:p-8 rounded-[32px] bg-emerald-50 border border-emerald-200 relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 opacity-5 transition-transform group-hover:scale-110">
              <svg className="w-40 h-40 fill-emerald-600" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
            </div>
            <div className="space-y-4 text-center sm:text-left relative z-10">
              <h4 className="text-xl font-black text-slate-900 leading-tight">
                {language === 'so' ? 'Ma rabtaa in lagaa caawiyo codsigan?' : 'Ready to start your application?'}
              </h4>
              <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-md">
                {language === 'so' 
                  ? 'Kala hadal khubaraadeena WhatsApp si aad isla hadaba u bilawdo diyaarinta codsigaaga rasmiga ah.' 
                  : 'Chat with our advisors on WhatsApp to immediately begin document verification and essay drafting.'}
              </p>
              <button
                type="button"
                onClick={handleWhatsAppClick}
                className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black text-base shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-3 transition-all active:scale-95 cursor-pointer"
              >
                <svg className="w-6 h-6 fill-slate-950" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                <span>{language === 'so' ? 'La hadal Khubarada (WhatsApp)' : 'Connect to Expert on WhatsApp'}</span>
              </button>
            </div>
          </div>

          {/* Application Request Inquiry Form */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center shadow-xs border border-slate-200">
                <UserCheck className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-black text-slate-900 tracking-tight">
                {language === 'so' ? 'Buuxi Xogtaada' : 'Confirm Your Details'}
              </h4>
            </div>

            {submittedDirectly ? (
              <div className="p-8 rounded-[32px] bg-blue-600 text-white text-center space-y-4 animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto border border-white/30">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <div className="space-y-1">
                  <h5 className="text-xl font-black">
                    {language === 'so' ? 'Codsigii waa la diray!' : 'Request Received!'}
                  </h5>
                  <p className="text-sm text-blue-100">
                    {language === 'so' 
                      ? 'FURSAD ayaa hada kugu xiriirinaysa WhatsApp si laguugu caawiyo...' 
                      : 'We are now redirecting you to our official support chat...'}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleDirectSubmit} className="grid grid-cols-1 gap-5 bg-slate-50 p-6 sm:p-8 rounded-[32px] border border-slate-200">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700 block ml-1 uppercase tracking-wider">
                    {language === 'so' ? 'Magacaaga (Full Name):' : 'Your Full Name:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="e.g. Axmed Cali"
                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-300 text-sm text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700 block ml-1 uppercase tracking-wider">
                    {language === 'so' ? 'Lambarka WhatsApp (Phone):' : 'WhatsApp Number:'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={applicantWhatsApp}
                    onChange={(e) => setApplicantWhatsApp(e.target.value)}
                    placeholder="+252 63 940 4820"
                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-300 text-sm text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700 block ml-1 uppercase tracking-wider">
                    {language === 'so' ? 'Farriin gaar ah (Optional):' : 'Additional Notes:'}
                  </label>
                  <textarea
                    value={applicantNotes}
                    onChange={(e) => setApplicantNotes(e.target.value)}
                    placeholder={language === 'so' ? 'Halkan ku qor hadaad hayso xog dheeraad ah...' : 'Any specific questions or documents you already have?'}
                    rows={3}
                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-300 text-sm text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all shadow-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-base flex items-center justify-center gap-3 transition-all cursor-pointer shadow-lg active:scale-[0.98]"
                >
                  <Send className="w-5 h-5 text-blue-400" />
                  <span>
                    {language === 'so' ? 'Gudbi oo Codso Caawin' : 'Submit & Connect with Advisor'}
                  </span>
                </button>
              </form>
            )}
          </div>

          {/* Service Process Timeline - Cleaned up */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-xs border border-emerald-100">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-black text-slate-900 tracking-tight">
                {language === 'so' ? 'Tallaabooyinka Adeegga' : 'Our Professional Process'}
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { step: '1', title: 'Consultation', color: 'blue', desc: language === 'so' ? 'Kala hadal khabiirka FURSAD dukumentiyada aad haysato.' : 'Direct chat with FURSAD advisor about your eligibility.' },
                { step: '2', title: 'Preparation', color: 'emerald', desc: language === 'so' ? 'Diyaarinta SOP adag iyo xaqiijinta buundooyinka.' : 'Expert SOP drafting and academic document polishing.' },
                { step: '3', title: 'Submission', color: 'purple', desc: language === 'so' ? 'Gudbinta tooska ah ee codsigaaga rasmiga ah.' : 'Guiding your final official submission in the portal.' }
              ].map((item, i) => (
                <div key={i} className="p-5 rounded-2xl bg-white border border-slate-100 shadow-xs space-y-2">
                  <span className={`inline-block px-2.5 py-0.5 rounded-lg bg-${item.color}-50 text-${item.color}-600 text-[10px] font-black uppercase tracking-widest border border-${item.color}-100`}>
                    Step {item.step}
                  </span>
                  <h5 className="text-sm font-black text-slate-900">{item.title}</h5>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Fixed Footer Action Bar on Mobile - Floating */}
        <div className="sticky bottom-0 z-30 p-4 sm:p-6 bg-white/95 backdrop-blur-md border-t border-slate-100 flex items-center justify-between gap-3 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] sm:rounded-b-3xl">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-3 rounded-2xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            {language === 'so' ? 'Back' : 'Back'}
          </button>

          <div className="flex items-center gap-2 flex-1 sm:flex-none">
            {opportunity.applicationUrl && (
              <a
                href={opportunity.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span className="hidden sm:inline">{language === 'so' ? 'Bogga Rasmiga' : 'Official Portal'}</span>
                <span className="sm:hidden">Portal</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            <button
              type="button"
              onClick={handleWhatsAppClick}
              className="flex-[2] sm:flex-none px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 h-5 fill-slate-950" />
              <span>Chat</span>
            </button>
          </div>
        </div>

        </div>
      </div>
    </div>
  );
};
