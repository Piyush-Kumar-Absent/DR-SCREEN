import React from 'react';
import { ScreeningRecord } from '../types';

interface DashboardViewProps {
  screenings: ScreeningRecord[];
  onStartNewScreening: () => void;
  onViewAllHistory: () => void;
  onSelectScreening: (record: ScreeningRecord) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  screenings,
  onStartNewScreening,
  onViewAllHistory,
  onSelectScreening,
}) => {
  // Compute metrics from records
  const totalCount = screenings.length;
  const normalCount = screenings.filter((s) => s.triageCategory === 'normal').length;
  const reviewCount = screenings.filter(
    (s) => s.triageCategory === 'review' || s.triageCategory === 'urgent'
  ).length;

  const recentList = screenings.slice(0, 3);

  // Helper for avatar initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <section id="view-dashboard" className="space-y-4">
      {/* Hero Banner / Quick Action matching Image 4.png */}
      <div className="bg-gradient-to-br from-teal-700 via-teal-800 to-emerald-900 text-white rounded-2xl p-5 shadow-md relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="inline-block px-2.5 py-0.5 rounded-full bg-teal-500/30 text-teal-100 text-[11px] font-medium tracking-wide uppercase mb-2">
            Explainable AI Screening
          </div>
          <h2 className="text-xl font-extrabold tracking-tight font-display">
            AI Retinopathy Assistant
          </h2>
          <p className="text-teal-100/90 text-xs mt-1 leading-relaxed">
            “AI-Powered. Explainable. Accessible. Affordable.”
          </p>

          <div className="mt-4">
            <button
              id="hero-new-screening-btn"
              onClick={onStartNewScreening}
              className="w-full bg-white text-teal-800 hover:bg-teal-50 active:scale-[0.98] transition font-bold py-3.5 px-5 rounded-xl shadow-lg flex items-center justify-center gap-2 text-base cursor-pointer"
            >
              <svg
                className="w-5 h-5 text-teal-600 stroke-[2.5]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path>
              </svg>
              <span>+ New Screening</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Metrics Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-white border border-slate-200/80 rounded-xl p-3 text-center shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">
            Total
          </span>
          <span className="text-2xl font-extrabold text-slate-800 mt-1 block font-display">
            {totalCount}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">Screenings</span>
        </div>

        <div className="bg-white border border-emerald-200 rounded-xl p-3 text-center shadow-xs bg-emerald-50/20">
          <span className="text-[11px] font-semibold text-emerald-700 block uppercase tracking-wider">
            Normal
          </span>
          <span className="text-2xl font-extrabold text-emerald-600 mt-1 block font-display">
            {normalCount}
          </span>
          <span className="text-[10px] text-emerald-600 font-medium">No Retinopathy</span>
        </div>

        <div className="bg-white border border-amber-200 rounded-xl p-3 text-center shadow-xs bg-amber-50/20">
          <span className="text-[11px] font-semibold text-amber-700 block uppercase tracking-wider">
            Review
          </span>
          <span className="text-2xl font-extrabold text-amber-600 mt-1 block font-display">
            {reviewCount}
          </span>
          <span className="text-[10px] text-amber-600 font-medium">Needs Doctor</span>
        </div>
      </div>

      {/* Recent Screenings Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 font-display">
            <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            Recent Screenings
          </h3>
          <button
            id="dashboard-view-all-btn"
            onClick={onViewAllHistory}
            className="text-teal-700 text-xs font-semibold hover:underline cursor-pointer"
          >
            View All ({totalCount}) →
          </button>
        </div>

        <div className="space-y-2.5">
          {recentList.map((record) => {
            const isNormal = record.triageCategory === 'normal';
            const isUrgent = record.triageCategory === 'urgent';
            const isModerate = record.result.includes('Moderate');

            // Avatar styling
            const avatarBg = isNormal
              ? 'bg-emerald-100 text-emerald-800'
              : isUrgent
              ? 'bg-red-100 text-red-800'
              : isModerate
              ? 'bg-amber-100 text-amber-800'
              : 'bg-orange-50 text-orange-700';

            // Badge styling
            const badgeClass = isNormal
              ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
              : isUrgent
              ? 'bg-red-100 text-red-800 border-red-200'
              : isModerate
              ? 'bg-amber-100 text-amber-800 border-amber-200'
              : 'bg-orange-50 text-orange-700 border-orange-200';

            const displayTag = isNormal
              ? 'No DR'
              : isUrgent
              ? 'Severe DR'
              : isModerate
              ? 'Moderate DR'
              : 'Mild DR';

            return (
              <div
                key={record.id}
                onClick={() => onSelectScreening(record)}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-teal-50/60 border border-slate-200/70 transition cursor-pointer active:scale-[0.99]"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div
                    className={`w-9 h-9 rounded-full ${avatarBg} flex items-center justify-center font-bold text-xs flex-shrink-0`}
                  >
                    {getInitials(record.patientName)}
                  </div>
                  <div className="truncate">
                    <p className="font-bold text-slate-800 text-sm truncate">{record.patientName}</p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {record.date} • {record.clinic}
                    </p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold border ${badgeClass}`}
                  >
                    {displayTag}
                  </span>
                  <span className="block text-[10px] text-slate-400 mt-0.5 font-medium">
                    Tap to view
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Clinical Disclaimer Callout */}
      <div className="p-3 bg-teal-50/80 border border-teal-200 rounded-xl flex items-start gap-2.5">
        <svg
          className="w-5 h-5 text-teal-700 mt-0.5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <p className="text-xs text-teal-900 leading-snug font-medium">
          <span className="font-bold">Support Tool:</span> DR Screen aids healthcare staff for preliminary
          triaging. Final diagnosis is always confirmed by a qualified ophthalmologist.
        </p>
      </div>
    </section>
  );
};
