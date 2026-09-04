import React, { useState } from 'react';
import { Opportunity } from '../types';
import { api } from '../services/api';
import { Flag, X, ShieldAlert, CheckCircle2, Loader2 } from 'lucide-react';

interface ReportModalProps {
  opportunity: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  opportunity,
  isOpen,
  onClose
}) => {
  const [reason, setReason] = useState<string>('Broken or Expired Link');
  const [details, setDetails] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen || !opportunity) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.reportOpportunity(opportunity.id, {
        reason,
        details,
        userEmail
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2500);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in" id="report-modal">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-rose-600">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="text-base font-extrabold text-slate-900">Report Listing Safety</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-6 text-center space-y-2 bg-emerald-50 rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="text-sm font-extrabold text-emerald-950">Thank you for reporting!</h4>
            <p className="text-xs text-emerald-800">
              Our moderation team will verify this listing against official registries within 2 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <span className="text-[11px] text-slate-500 font-medium">Reporting listing:</span>
              <p className="font-extrabold text-slate-900 line-clamp-1">{opportunity.title}</p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Reason for Report</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-semibold"
              >
                <option>Broken or Expired Official Link</option>
                <option>Discrepancy in Deadline Date</option>
                <option>Third-Party Fee or Scam Suspicion</option>
                <option>Eligibility Details Incorrect</option>
                <option>Other Feedback</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Additional Details</label>
              <textarea
                required
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Explain the issue (e.g. Portal shows deadline closed on Sept 1st)..."
                className="w-full p-2.5 rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Your Email (Optional)</label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="scholar@example.com"
                className="w-full p-2.5 rounded-lg border border-slate-300"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Submit Safety Report</span>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
