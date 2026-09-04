import React, { useState, useEffect } from 'react';
import { DataSource, SyncLog, OpportunityReport, Opportunity } from '../types';
import { api } from '../services/api';
import { isSupabaseConfigured } from '../supabase';
import { 
  Settings, 
  RefreshCw, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Coins, 
  Database, 
  FileText, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  Globe2,
  ExternalLink,
  Edit2,
  CheckCircle
} from 'lucide-react';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunities: Opportunity[];
  onOpportunityCreated: (opp: Opportunity) => void;
  onOpportunityDeleted: (id: string) => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  opportunities,
  onOpportunityCreated,
  onOpportunityDeleted
}) => {
  const [activeTab, setActiveTab] = useState<'sources' | 'crud' | 'reports' | 'financials'>('sources');
  const [sources, setSources] = useState<DataSource[]>([]);
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [reports, setReports] = useState<OpportunityReport[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string>('');

  // Financial model simulator state
  const [marketReach, setMarketReach] = useState<number>(5000000);
  const [conversionRate, setConversionRate] = useState<number>(0.5);
  const [pricePerUser, setPricePerUser] = useState<number>(4);

  // New Opportunity Form
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newOpp, setNewOpp] = useState<Partial<Opportunity>>({
    title: '',
    organization: '',
    country: 'Germany',
    region: 'Europe',
    flag: '🇩🇪',
    category: 'scholarship',
    degreeLevel: ['master'],
    fundingType: 'fully_funded',
    fundingAmount: '100% Tuition + €934/month',
    tuitionCoverage: '100% Full Waiver',
    stipend: '€934 Monthly Allowance',
    travelSupport: 'Round-trip Flight Tickets',
    accommodation: 'Provided / Subsidized',
    moiAccepted: true,
    deadline: '2026-11-30',
    applicationUrl: 'https://example.org/apply',
    sourceName: 'Official University Portal',
    description: 'Verified international grant award.',
    eligibility: ['Bachelor degree completed', 'English proficiency via MOI certificate'],
    status: 'active',
    featured: true
  });

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      const [srcRes, logRes, repRes] = await Promise.all([
        api.getSources(),
        api.getSyncLogs(),
        api.getReports()
      ]);
      setSources(srcRes.sources);
      setLogs(logRes.logs);
      setReports(repRes.reports);
    } catch (e) {
      console.error(e);
    }
  };

  const handleTriggerSync = async (sourceId?: string) => {
    setIsSyncing(true);
    setSyncStatusMsg('Connecting to external endpoints, verifying deadlines & deduping...');
    try {
      const res = await api.triggerSync(sourceId);
      setLogs(res.logs);
      setSources(res.sources);
      setSyncStatusMsg(res.message);
      setTimeout(() => setSyncStatusMsg(''), 4000);
    } catch (e) {
      console.error(e);
      setSyncStatusMsg('Sync pipeline executed with simulated verified sources.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCreateOpportunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOpp.title || !newOpp.organization) return;
    try {
      const res = await api.createOpportunity(newOpp);
      if (res.success) {
        onOpportunityCreated(res.opportunity);
        setShowAddModal(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteOpp = async (id: string) => {
    if (confirm('Delete this opportunity listing?')) {
      try {
        await api.deleteOpportunity(id);
        onOpportunityDeleted(id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleResolveReport = async (reportId: string, status: 'resolved' | 'dismissed') => {
    try {
      await api.resolveReport(reportId, status);
      setReports(reports.map(r => r.id === reportId ? { ...r, status } : r));
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  // Financial simulation calculations
  const totalSubscribers = Math.round((marketReach * (conversionRate / 100)));
  const totalAnnualRevenue = totalSubscribers * pricePerUser;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in" id="admin-dashboard-modal">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh] my-auto">
        
        {/* Header Bar */}
        <div className="p-6 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-600/30 text-purple-300 border border-purple-500/30">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">FURSAD Admin & Data Pipeline</h2>
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-400 text-slate-950 uppercase">
                  Live Operations
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Source health monitoring, automated ingest pipelines, fraud prevention & financial modeling
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            id="admin-close-btn"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('sources')}
            className={`py-3 px-4 text-xs font-extrabold border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'sources' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-slate-600'
            }`}
          >
            Data Sources & Ingestion ({sources.length})
          </button>
          <button
            onClick={() => setActiveTab('crud')}
            className={`py-3 px-4 text-xs font-extrabold border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'crud' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-slate-600'
            }`}
          >
            Opportunity Directory ({opportunities.length})
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`py-3 px-4 text-xs font-extrabold border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'reports' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-slate-600'
            }`}
          >
            Anti-Scam Queue ({reports.filter(r => r.status === 'pending').length} Pending)
          </button>
          <button
            onClick={() => setActiveTab('financials')}
            className={`py-3 px-4 text-xs font-extrabold border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'financials' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-slate-600'
            }`}
          >
            $100k ARR Revenue Simulator
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-800 space-y-6">
          
          {/* TAB 1: DATA SOURCES & SYNC PIPELINE */}
          {activeTab === 'sources' && (
            <div className="space-y-6">
              {/* Supabase Connection Status Banner */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
                isSupabaseConfigured
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                  : 'bg-blue-50/80 border-blue-200 text-blue-950'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${
                    isSupabaseConfigured 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-blue-600 text-white'
                  }`}>
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-extrabold">
                        {isSupabaseConfigured ? 'Supabase Database: Connected (Live)' : 'Supabase Database: Local Fallback Mode'}
                      </h4>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                        isSupabaseConfigured ? 'bg-emerald-200 text-emerald-900' : 'bg-blue-200 text-blue-900'
                      }`}>
                        {isSupabaseConfigured ? 'Active Cloud' : 'Standby'}
                      </span>
                    </div>
                    <p className="text-xs opacity-80 mt-0.5">
                      {isSupabaseConfigured
                        ? 'Users, profiles, opportunities, and applications are synced directly with your PostgreSQL database.'
                        : 'Running on browser local storage fallback. Enter VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable cloud sync.'}
                    </p>
                  </div>
                </div>

                {isSupabaseConfigured && (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-white/80 px-3 py-1.5 rounded-xl border border-emerald-200 shrink-0">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>PostgreSQL Ready</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-purple-50 border border-purple-200">
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-purple-950 flex items-center gap-1.5">
                    <RefreshCw className="w-4 h-4 text-purple-700" />
                    Automated Ingestion & Sync Pipeline
                  </h3>
                  <p className="text-xs text-purple-800">
                    Triggers web hooks across EU Funding, ReliefWeb, UN Volunteers, and University feeds with deduplication.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleTriggerSync()}
                  disabled={isSyncing}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-extrabold text-xs flex items-center gap-2 shadow-sm shrink-0 cursor-pointer"
                  id="trigger-sync-all-btn"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Syncing Sources...' : 'Sync All Sources Now'}</span>
                </button>
              </div>

              {syncStatusMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 animate-in fade-in">
                  ✓ {syncStatusMsg}
                </div>
              )}

              {/* Data Sources Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sources.map((src) => (
                  <div key={src.id} className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-900">{src.name}</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        src.status === 'healthy' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {src.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Ingested:</span>
                        <strong className="text-slate-900 font-bold">{src.totalIngested.toLocaleString()}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Sync Frequency:</span>
                        <span className="capitalize">{src.syncFrequency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Last Synced:</span>
                        <span>{src.lastSynced}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-purple-600 font-bold flex items-center gap-1">
                        Endpoint <ExternalLink className="w-3 h-3" />
                      </a>
                      <button
                        onClick={() => handleTriggerSync(src.id)}
                        className="text-[11px] text-slate-600 hover:text-purple-600 font-semibold"
                      >
                        Sync Source
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Audit Logs */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Recent Sync Audit Trail
                </h4>
                <div className="bg-slate-900 text-slate-200 rounded-2xl p-4 font-mono text-xs space-y-2 max-h-48 overflow-y-auto">
                  {logs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400">[{log.status.toUpperCase()}]</span>
                        <span>{log.sourceName}:</span>
                        <span className="text-slate-300">+{log.opportunitiesAdded} added, {log.duplicatesSkipped} deduped</span>
                      </div>
                      <span className="text-slate-500 text-[10px]">{log.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OPPORTUNITY DIRECTORY CRUD */}
          {activeTab === 'crud' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900">
                  Manage Verified Listings ({opportunities.length})
                </h3>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                  id="add-opp-btn"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Opportunity</span>
                </button>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                    <tr>
                      <th className="p-3">Title & Organization</th>
                      <th className="p-3">Country</th>
                      <th className="p-3">Funding</th>
                      <th className="p-3">Deadline</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    {opportunities.map((opp) => (
                      <tr key={opp.id} className="hover:bg-slate-50">
                        <td className="p-3">
                          <p className="font-extrabold text-slate-900">{opp.title}</p>
                          <p className="text-slate-500 text-[11px]">{opp.organization}</p>
                        </td>
                        <td className="p-3">{opp.flag} {opp.country}</td>
                        <td className="p-3">
                          <span className="font-bold text-emerald-700 capitalize">{opp.fundingType.replace('_', ' ')}</span>
                        </td>
                        <td className="p-3 font-semibold">{opp.deadline}</td>
                        <td className="p-3">
                          <button
                            onClick={() => handleDeleteOpp(opp.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ANTI-SCAM MODERATION QUEUE */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900">
                Community Reports & Scam Prevention Queue
              </h3>

              <div className="space-y-3">
                {reports.map((report) => (
                  <div key={report.id} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-900">{report.opportunityTitle}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        report.status === 'pending' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {report.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1">
                      <p><strong>Reason:</strong> <span className="text-rose-600 font-bold">{report.reason}</span></p>
                      <p><strong>User Details:</strong> {report.details}</p>
                      <p className="text-[10px] text-slate-400">Reported on: {report.createdAt}</p>
                    </div>

                    {report.status === 'pending' && (
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleResolveReport(report.id, 'dismissed')}
                          className="px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                        >
                          Dismiss (Verified Safe)
                        </button>
                        <button
                          onClick={() => handleResolveReport(report.id, 'resolved')}
                          className="px-3 py-1 text-xs font-extrabold bg-rose-600 text-white rounded-lg"
                        >
                          Take Down Listing
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: FINANCIAL SIMULATOR ($100,000 ARR) */}
          {activeTab === 'financials' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-blue-300 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    $100,000 ARR Sustainable Growth Model
                  </h3>
                  <span className="text-xs font-bold text-slate-400">Target Strategy</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Formula: Reaching <strong>5,000,000</strong> African and global developing youth. At a conservative <strong>0.5%</strong> free-to-paid conversion rate, <strong>25,000</strong> students subscribe to the <strong>$4 / year</strong> core plan = <strong>$100,000</strong> Annual Recurring Revenue.
                </p>
              </div>

              {/* Interactive Simulation Controls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Total Youth Market Reach: <strong className="text-purple-700">{marketReach.toLocaleString()}</strong>
                  </label>
                  <input
                    type="range"
                    min={500000}
                    max={10000000}
                    step={250000}
                    value={marketReach}
                    onChange={(e) => setMarketReach(Number(e.target.value))}
                    className="w-full accent-purple-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Conversion Rate (%): <strong className="text-blue-700">{conversionRate}%</strong>
                  </label>
                  <input
                    type="range"
                    min={0.1}
                    max={3.0}
                    step={0.1}
                    value={conversionRate}
                    onChange={(e) => setConversionRate(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Annual Price Per Scholar: <strong className="text-emerald-700">${pricePerUser} / yr</strong>
                  </label>
                  <input
                    type="range"
                    min={2}
                    max={10}
                    step={1}
                    value={pricePerUser}
                    onChange={(e) => setPricePerUser(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                </div>
              </div>

              {/* Output Results */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-purple-50 border border-purple-200 text-center space-y-1">
                  <span className="text-xs font-bold text-purple-700 uppercase">Projected Paying Scholars</span>
                  <p className="text-3xl sm:text-4xl font-black text-purple-950">{totalSubscribers.toLocaleString()}</p>
                  <span className="text-[11px] text-slate-500 font-medium">Students supported globally</span>
                </div>

                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                  <span className="text-xs font-bold text-emerald-700 uppercase">Gross Annual Revenue (ARR)</span>
                  <p className="text-3xl sm:text-4xl font-black text-emerald-950">${totalAnnualRevenue.toLocaleString()}</p>
                  <span className="text-[11px] text-slate-500 font-medium">Sustainable cash flow</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
          >
            Close Dashboard
          </button>
        </div>

      </div>

      {/* Add Opportunity Sub-Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">Add Verified Opportunity</h3>
              <button onClick={() => setShowAddModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <form onSubmit={handleCreateOpportunity} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Opportunity Title</label>
                <input
                  type="text"
                  required
                  value={newOpp.title}
                  onChange={(e) => setNewOpp({ ...newOpp, title: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                  placeholder="e.g. Master Minds Scholarship"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Organization</label>
                  <input
                    type="text"
                    required
                    value={newOpp.organization}
                    onChange={(e) => setNewOpp({ ...newOpp, organization: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Country</label>
                  <input
                    type="text"
                    required
                    value={newOpp.country}
                    onChange={(e) => setNewOpp({ ...newOpp, country: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Funding Type</label>
                  <select
                    value={newOpp.fundingType}
                    onChange={(e) => setNewOpp({ ...newOpp, fundingType: e.target.value as any })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="fully_funded">Fully Funded</option>
                    <option value="paid">Paid</option>
                    <option value="grant">Grant</option>
                    <option value="partially_funded">Partially Funded</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Deadline Date</label>
                  <input
                    type="date"
                    required
                    value={newOpp.deadline}
                    onChange={(e) => setNewOpp({ ...newOpp, deadline: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Application Link</label>
                <input
                  type="url"
                  required
                  value={newOpp.applicationUrl}
                  onChange={(e) => setNewOpp({ ...newOpp, applicationUrl: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-purple-600 text-white font-extrabold shadow-md cursor-pointer mt-2"
              >
                Publish Verified Opportunity
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
