import React, { useState } from 'react';
import { Mentor, SuccessStory, UserProfile } from '../types';
import { 
  Users, 
  GraduationCap, 
  Globe2, 
  Star, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Languages, 
  ShieldCheck, 
  X, 
  Sparkles,
  MessageSquare,
  Award
} from 'lucide-react';

interface MentorshipViewProps {
  mentors: Mentor[];
  stories: SuccessStory[];
  userProfile: UserProfile;
}

export const MentorshipView: React.FC<MentorshipViewProps> = ({
  mentors,
  stories,
  userProfile
}) => {
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [bookingTopic, setBookingTopic] = useState<string>('Scholarship Application & SOP Review');
  const [bookingDate, setBookingDate] = useState<string>('2026-09-05');
  const [bookingTime, setBookingTime] = useState<string>('15:00 UTC');

  const handleConfirmBooking = () => {
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setSelectedMentor(null);
    }, 2800);
  };

  return (
    <div className="w-full mx-auto px-3.5 sm:px-6 py-6 sm:py-10 space-y-8 sm:space-y-12" id="mentorship-view">
      
      {/* Top Banner */}
      <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-blue-950 text-white shadow-xl space-y-3 sm:space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-blue-300 text-xs font-black uppercase tracking-wider border border-white/20">
          <Users className="w-3.5 h-3.5" />
          Verified Scholar & Alumni Mentorship
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Learn From Those Who Won Global Scholarships
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed font-medium">
          Connect with verified mentors from DAAD, Chevening, Erasmus Mundus, and UN youth programs who navigated the exact same application process.
        </p>
      </div>

      {/* Verified Mentors Directory */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>Verified International Mentors</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
              {mentors.length} Active Mentors
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map((mentor) => (
            <div 
              key={mentor.id} 
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-lg transition-all duration-200 p-5 flex flex-col justify-between space-y-4"
              id={`mentor-card-${mentor.id}`}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start gap-3.5">
                  <img
                    src={mentor.avatar}
                    alt={mentor.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-purple-200 shrink-0"
                  />
                  <div className="space-y-0.5 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-extrabold text-slate-900">{mentor.name}</h3>
                      <div className="flex items-center gap-1 text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{mentor.rating}</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-purple-700 block">
                      {mentor.scholarshipWon}
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                      <span>{mentor.originCountry}</span> ➔ <span>{mentor.hostCountry}</span>
                    </span>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {mentor.bio}
                </p>

                {/* Expertise Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {mentor.expertise.map((exp, i) => (
                    <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {exp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-extrabold text-emerald-700">
                  {mentor.sessionsCompleted}+ Scholars Advised
                </span>

                <button
                  type="button"
                  onClick={() => setSelectedMentor(mentor)}
                  className="py-2 px-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-xs transition-colors cursor-pointer"
                  id={`book-mentor-${mentor.id}`}
                >
                  Book 1-on-1 Session
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Success Stories & Testimonials */}
      <div className="space-y-6 pt-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-black uppercase tracking-wider border border-emerald-200">
            <Award className="w-3.5 h-3.5" />
            Global Alumni Network
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            Real Students. Real Admissions.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Hear from youth across Africa and developing nations who secured life-changing opportunities through verified guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {stories.map((story) => (
            <div key={story.id} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={story.avatar}
                  alt={story.name}
                  className="w-12 h-12 rounded-full object-cover border border-purple-200"
                />
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">{story.name}</h4>
                  <p className="text-xs font-bold text-purple-700">{story.scholarshipWon} ({story.year})</p>
                  <p className="text-[11px] text-slate-500">{story.countryOrigin} ➔ {story.destinationCountry}</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                "{story.quote}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Mentorship Booking Modal */}
      {selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in" id="booking-modal">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedMentor.avatar}
                  alt={selectedMentor.name}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Book Session with {selectedMentor.name}</h3>
                  <span className="text-xs font-bold text-purple-700">{selectedMentor.scholarshipWon}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedMentor(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingSuccess ? (
              <div className="p-6 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200 animate-in zoom-in-95">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-extrabold text-emerald-950">Mentorship Session Confirmed!</h4>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  A Google Meet invitation has been prepared for <strong>{bookingDate} at {bookingTime}</strong>. Check your email for calendar access.
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-slate-800 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Session Topic Focus</label>
                  <select
                    value={bookingTopic}
                    onChange={(e) => setBookingTopic(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold bg-white"
                  >
                    <option>Scholarship Application & Motivation Essay Review</option>
                    <option>MOI Exemption & University Admission Strategy</option>
                    <option>Interview Preparation & Mock Q&A</option>
                    <option>Visa & Arrival Guidance in {selectedMentor.hostCountry}</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Preferred Date</label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Time Slot</label>
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold bg-white"
                    >
                      <option>15:00 UTC</option>
                      <option>17:00 UTC</option>
                      <option>19:00 UTC</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 leading-relaxed">
                  🤝 <strong>Community Guarantee:</strong> First 30-minute advising session is free for all registered FURSAD scholars!
                </div>

                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-sm shadow-md shadow-purple-600/20 transition-all cursor-pointer"
                  id="confirm-booking-btn"
                >
                  Confirm Advising Session
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
