import React, { useState, useEffect } from 'react';
import { ApplicationItem, ApplicationStatus } from '../types';
import { storage, INITIAL_APPLICATIONS } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';
import { 
  FileCheck2, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  ExternalLink, 
  Trash2, 
  Clock, 
  CheckSquare, 
  Square,
  Sparkles,
  AlertCircle,
  Building2,
  Edit3,
  RotateCcw,
  Compass,
  MessageCircle
} from 'lucide-react';

interface ApplicationTrackerViewProps {
  applications: ApplicationItem[];
  onUpdateApplication: (app: ApplicationItem) => void;
  onDeleteApplication: (id: string) => void;
  onExploreMore?: () => void;
  isLoggedIn?: boolean;
}

export const ApplicationTrackerView: React.FC<ApplicationTrackerViewProps> = ({
  applications,
  onUpdateApplication,
  onDeleteApplication,
  onExploreMore,
  isLoggedIn = false
}) => {
  const { t, isRTL, language } = useLanguage();
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState<string>('');

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const stageLabels: Record<ApplicationStatus, { en: string; so: string; ar: string; fr: string }> = {
    interested: {
      en: 'Interested',
      so: 'Xiisaynaya',
      ar: 'مهتم',
      fr: 'Intéressé'
    },
    saved: {
      en: 'Saved & Shortlisted',
      so: 'Keydsan & La Xushay',
      ar: 'محفوظ ومحدد',
      fr: 'Enregistré'
    },
    preparing: {
      en: 'Preparing Documents',
      so: 'Dukumintiyada Diyaarinaya',
      ar: 'تجهيز المستندات',
      fr: 'Préparation des documents'
    },
    applied: {
      en: 'Applied (Submitted)',
      so: 'La Gudbiyay (Applied)',
      ar: 'تم التقديم',
      fr: 'Candidaté'
    },
    interview: {
      en: 'Interview / Shortlisted',
      so: 'Wareysi / Xulasho',
      ar: 'المقابلة / القائمة المختصرة',
      fr: 'Entretien / Présélectionné'
    },
    accepted: {
      en: 'Accepted / Awarded 🎉',
      so: 'La Aqbalay / Guuleystay 🎉',
      ar: 'تم القبول / فائز 🎉',
      fr: 'Accepté / Lauréat 🎉'
    },
    rejected: {
      en: 'Unsuccessful',
      so: 'Aan Guulaysan',
      ar: 'غير موفق',
      fr: 'Non retenu'
    }
  };

  const stages: { id: ApplicationStatus; label: string; color: string; bg: string }[] = [
    { 
      id: 'interested', 
      label: stageLabels.interested[language] || stageLabels.interested.en, 
      color: 'text-slate-700', 
      bg: 'bg-slate-100' 
    },
    { 
      id: 'preparing', 
      label: stageLabels.preparing[language] || stageLabels.preparing.en, 
      color: 'text-blue-800', 
      bg: 'bg-blue-100' 
    },
    { 
      id: 'applied', 
      label: stageLabels.applied[language] || stageLabels.applied.en, 
      color: 'text-blue-800', 
      bg: 'bg-blue-100' 
    },
    { 
      id: 'interview', 
      label: stageLabels.interview[language] || stageLabels.interview.en, 
      color: 'text-purple-800', 
      bg: 'bg-purple-100' 
    },
    { 
      id: 'accepted', 
      label: stageLabels.accepted[language] || stageLabels.accepted.en, 
      color: 'text-emerald-800', 
      bg: 'bg-emerald-100' 
    },
    { 
      id: 'rejected', 
      label: stageLabels.rejected[language] || stageLabels.rejected.en, 
      color: 'text-rose-800', 
      bg: 'bg-rose-100' 
    },
  ];

  const handleStatusChange = (id: string, newStatus: ApplicationStatus) => {
    const app = applications.find(a => a.id === id);
    if (!app) return;
    const updated = { ...app, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] };
    onUpdateApplication(updated);
  };

  const handleToggleChecklist = (appId: string, checkId: string) => {
    const app = applications.find(a => a.id === appId);
    if (!app || !app.checklist) return;

    const updatedChecklist = app.checklist.map(item => 
      item.id === checkId ? { ...item, completed: !item.completed } : item
    );
    const updated = { ...app, checklist: updatedChecklist };
    onUpdateApplication(updated);
  };

  const handleDeleteApplication = (id: string) => {
    onDeleteApplication(id);
  };

  const handleSaveNotes = (id: string) => {
    const app = applications.find(a => a.id === id);
    if (!app) return;
    const updated = { ...app, notes: tempNotes };
    onUpdateApplication(updated);
    setEditingNotesId(null);
  };

  const handleRestoreSampleApplications = () => {
    const restored = storage.resetToDefaultApplications();
    // For guest mode, we just reset the whole list
    restored.forEach(app => onUpdateApplication(app));
  };

  const filteredApps = applications.filter(app => 
    selectedStatusFilter === 'all' || app.status === selectedStatusFilter
  );

  return (
    <div className="w-full max-w-5xl mx-auto px-3.5 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8" id="application-tracker-view" dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Header Banner */}
      <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-400/30">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Application Tracker</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {t.tracker.title}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl font-medium leading-relaxed">
            {language === 'so'
              ? 'Kala soco dukumintiyadaada, qormooyinka motivation-ka, taariikhaha xidhitaanka (deadlines), iyo heerarka codsiyadaada dhammaan hal meel.'
              : language === 'ar'
              ? 'تتبع مستنداتك ورسائل الدافع والمواعيد النهائية ومراحل طلباتك في لوحة تحكم واحدة.'
              : 'Manage your documents, motivation letters, submission milestones, and deadlines in one central workspace.'}
          </p>
        </div>

        {/* Stats & Actions */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
          <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl border border-white/10">
            <div className="text-center px-3">
              <span className="text-xl font-black text-white block">{applications.length}</span>
              <span className="text-[10px] text-slate-300 uppercase font-bold">Total Tracked</span>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center px-3">
              <span className="text-xl font-black text-emerald-400 block">
                {applications.filter(a => a.status === 'applied' || a.status === 'accepted').length}
              </span>
              <span className="text-[10px] text-slate-300 uppercase font-bold">Submitted</span>
            </div>
          </div>

          {!isLoggedIn && (
            <button
              type="button"
              onClick={handleRestoreSampleApplications}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white border border-white/15 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Reload Sample Applications / Soo Celi Tusaalooyinka"
            >
              <RotateCcw className="w-4 h-4 text-cyan-300" />
              <span className="hidden sm:inline">Reload Samples</span>
            </button>
          )}
        </div>
      </div>

      {/* Stage Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedStatusFilter('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            selectedStatusFilter === 'all'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          {language === 'so' ? 'Dhammaan Codsiyada' : language === 'ar' ? 'جميع الطلبات' : 'All Applications'} ({applications.length})
        </button>
        {stages.map(st => (
          <button
            key={st.id}
            onClick={() => setSelectedStatusFilter(st.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedStatusFilter === st.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {st.label} ({applications.filter(a => a.status === st.id).length})
          </button>
        ))}
      </div>

      {/* Application Cards List */}
      {filteredApps.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {filteredApps.map((app) => {
            const currentStageInfo = stages.find(s => s.id === app.status) || stages[0];
            const completedCount = app.checklist?.filter(c => c.completed).length || 0;
            const totalChecklist = app.checklist?.length || 0;
            const progressPercent = totalChecklist > 0 ? Math.round((completedCount / totalChecklist) * 100) : 0;

            return (
              <div 
                key={app.id} 
                className="rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col"
                id={`app-item-${app.id}`}
              >
                {/* Laptop-only image on top */}
                <div className="hidden lg:block w-full h-40 bg-slate-100 relative overflow-hidden">
                  <img 
                    src={app.imageUrl || `https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&auto=format&fit=crop&q=80`}
                    alt={app.opportunityTitle}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-white/90 backdrop-blur-sm text-[10px] font-black uppercase tracking-wider text-blue-700 shadow-sm border border-white/50">
                    {app.category}
                  </div>
                </div>

                <div className="p-5 sm:p-6 space-y-4">
                  {/* Top Row: Title, country, stage selector */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 flex-wrap">
                      <span>{app.flag} {app.country}</span>
                      <span>•</span>
                      <span>{app.organization}</span>
                      <span>•</span>
                      <span className="capitalize text-blue-700 font-extrabold">{app.category}</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                      {app.opportunityTitle}
                    </h3>
                  </div>

                  {/* Stage Dropdown Selector */}
                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                      className={`text-xs font-extrabold px-3 py-2 rounded-xl border focus:outline-none ${currentStageInfo.bg} ${currentStageInfo.color} border-slate-300 cursor-pointer`}
                    >
                      {stages.map(st => (
                        <option key={st.id} value={st.id}>
                          {st.label}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => handleDeleteApplication(app.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Remove Tracker Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress bar for document checklist */}
                {totalChecklist > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>
                        {language === 'so' ? 'Diyargarowga Dukumintiyada' : language === 'ar' ? 'جاهزية المستندات' : 'Document & Requirement Readiness'}
                      </span>
                      <span className="text-blue-700">{completedCount} of {totalChecklist} completed ({progressPercent}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          progressPercent === 100 ? 'bg-emerald-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Interactive Checklist Items */}
                {app.checklist && app.checklist.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {app.checklist.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleToggleChecklist(app.id, item.id)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                          item.completed 
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-200' 
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {item.completed ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                        <span className={item.completed ? 'line-through opacity-80' : ''}>
                          {item.title}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Notes and deadline section */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex-1 space-y-1">
                    {editingNotesId === app.id ? (
                      <div className="flex items-center gap-2 w-full">
                        <input
                          type="text"
                          value={tempNotes}
                          onChange={(e) => setTempNotes(e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 bg-white"
                          placeholder="Add application notes..."
                        />
                        <button
                          onClick={() => handleSaveNotes(app.id)}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-bold cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Edit3 
                          className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-blue-600" 
                          onClick={() => {
                            setEditingNotesId(app.id);
                            setTempNotes(app.notes || '');
                          }}
                        />
                        <span className="italic">
                          {app.notes || 'No notes added. Click pencil to write reminders.'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 shrink-0 text-slate-500">
                    <div className="flex items-center gap-1 text-slate-700 font-bold text-xs">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span>Deadline: {app.deadline}</span>
                    </div>

                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                        language === 'so'
                          ? `Asc Team FURSAD! Waxaan ku jiraa diyaarinta codsiga: *${app.opportunityTitle}* (${app.organization}). Fadlan ma iga caawin kartaan dukumiintiyada iyo gudbinta?`
                          : `Hello FURSAD Team! I am preparing my application for *${app.opportunityTitle}* (${app.organization}). Could you assist me with document preparation and submission?`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      title="Ka Codso Kooxda FURSAD WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-emerald-600 text-white" />
                      <span>WhatsApp Help</span>
                    </a>

                    {app.applicationUrl && (
                      <a
                        href={app.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-extrabold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <span>Official Portal</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <FileCheck2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
              {language === 'so' ? 'Weli wax codsi ah ma aadan raacayn' : language === 'ar' ? 'لا توجد طلبات متتبعة حالياً' : 'No applications tracked yet'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              {language === 'so'
                ? 'Guji badhanka hoose si aad u soo celiso tusaalooyinka diyaarinta deeqaha (DAAD & Chevening) ama ka raadso buugga fursadaha.'
                : 'Click below to load sample admission pipelines or browse verified scholarships to start tracking.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {!isLoggedIn && (
              <button
                onClick={handleRestoreSampleApplications}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{language === 'so' ? 'Soo Celi Tusaalooyinka' : 'Load Sample Applications'}</span>
              </button>
            )}

            {onExploreMore && (
              <button
                onClick={onExploreMore}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-blue-600" />
                <span>{language === 'so' ? 'Baadh Fursadaha' : 'Explore Opportunities'}</span>
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
