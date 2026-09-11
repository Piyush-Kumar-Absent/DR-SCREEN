import React from 'react';
import { LOGO_HOTLINK_IMAGE } from '../data/mockData';

interface HeaderProps {
  currentClinic: string;
  onSelectClinic: (clinic: string) => void;
}

const CLINICS = [
  'Rural Primary Clinic #4',
  'Community Health Camp',
  'Mobile Screening Van',
  'District Tele-Health Unit'
];

export const Header: React.FC<HeaderProps> = ({ currentClinic, onSelectClinic }) => {
  const [showClinicDropdown, setShowClinicDropdown] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-teal-100 px-4 py-3 shadow-xs">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center p-1.5 shadow-sm text-white flex-shrink-0 overflow-hidden">
            <img 
              src={LOGO_HOTLINK_IMAGE} 
              alt="DR Screen" 
              className="w-full h-full object-contain rounded-full bg-white/10"
              onError={(e) => {
                // Fallback SVG icon if hotlink fails
                (e.target as HTMLElement).style.display = 'none';
              }} 
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-bold text-teal-900 leading-tight font-display tracking-tight">DR Screen</h1>
              <span className="bg-teal-50 text-teal-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-teal-200">
                AI ASSIST
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Diabetic Retinopathy Screening</p>
          </div>
        </div>

        {/* Clinic Location Selector Pill */}
        <div className="relative">
          <button
            id="clinic-location-toggle"
            onClick={() => setShowClinicDropdown(!showClinicDropdown)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100/70 transition cursor-pointer"
            title="Switch Clinic Location"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="max-w-[110px] truncate">{currentClinic}</span>
            <svg className="w-3 h-3 text-emerald-700 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          {showClinicDropdown && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowClinicDropdown(false)} 
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 text-xs">
                <div className="px-3 py-1.5 border-b border-slate-100 font-bold text-slate-400 uppercase text-[10px] tracking-wider">
                  Active Clinic Unit
                </div>
                {CLINICS.map((clinic) => (
                  <button
                    key={clinic}
                    onClick={() => {
                      onSelectClinic(clinic);
                      setShowClinicDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-teal-50 transition ${
                      currentClinic === clinic ? 'text-teal-700 font-bold bg-teal-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>{clinic}</span>
                    {currentClinic === clinic && (
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
