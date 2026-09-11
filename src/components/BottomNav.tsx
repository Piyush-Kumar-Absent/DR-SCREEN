import React from 'react';
import { ViewTab } from '../types';

interface BottomNavProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 shadow-lg">
      <div className="max-w-md mx-auto grid grid-cols-3 px-3">
        {/* Nav 1: Dashboard */}
        <button
          id="nav-btn-dashboard"
          onClick={() => onSelectTab('dashboard')}
          className={`flex flex-col items-center justify-center py-1 transition cursor-pointer ${
            currentTab === 'dashboard'
              ? 'text-teal-700 font-bold'
              : 'text-slate-500 font-medium hover:text-teal-700'
          }`}
        >
          <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span className="text-[11px]">Dashboard</span>
        </button>

        {/* Nav 2: New Screening (Hero Button) */}
        <button
          id="nav-btn-new-screening"
          onClick={() => onSelectTab('new-screening')}
          className={`flex flex-col items-center justify-center py-1 transition cursor-pointer ${
            currentTab === 'new-screening'
              ? 'text-teal-800 font-bold'
              : 'text-slate-500 font-medium hover:text-teal-700'
          }`}
        >
          <div
            className={`w-9 h-9 -mt-4 mb-0.5 rounded-full flex items-center justify-center shadow-md transition-transform active:scale-95 ${
              currentTab === 'new-screening'
                ? 'bg-teal-700 text-white ring-4 ring-teal-100'
                : 'bg-teal-600 text-white hover:bg-teal-700'
            }`}
          >
            <svg className="w-5 h-5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <span className="text-[11px]">New Screening</span>
        </button>

        {/* Nav 3: Screening History */}
        <button
          id="nav-btn-history"
          onClick={() => onSelectTab('history')}
          className={`flex flex-col items-center justify-center py-1 transition cursor-pointer ${
            currentTab === 'history'
              ? 'text-teal-700 font-bold'
              : 'text-slate-500 font-medium hover:text-teal-700'
          }`}
        >
          <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
          <span className="text-[11px]">Screening History</span>
        </button>
      </div>
    </nav>
  );
};
