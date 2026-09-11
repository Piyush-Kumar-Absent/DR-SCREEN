import React, { useState, useMemo } from 'react';
import { ScreeningRecord } from '../types';

interface HistoryViewProps {
  screenings: ScreeningRecord[];
  onSelectScreening: (record: ScreeningRecord) => void;
  onStartNewScreening: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  screenings,
  onSelectScreening,
  onStartNewScreening,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'normal' | 'review' | 'urgent'>('all');

  const filteredRecords = useMemo(() => {
    return screenings.filter((rec) => {
      const matchesSearch =
        rec.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.result.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.clinic.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        filterCategory === 'all' || rec.triageCategory === filterCategory;

      return matchesSearch && matchesCategory;
    });
  }, [screenings, searchQuery, filterCategory]);

  return (
    <section id="view-history" className="space-y-4">
      {/* Title & Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 font-display">Screening History</h2>
          <p className="text-xs text-slate-500">All preliminary retinal records</p>
        </div>
        <button
          onClick={onStartNewScreening}
          className="bg-teal-600 hover:bg-teal-700 active:scale-95 transition text-white font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1 shadow-sm cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path>
          </svg>
          <span>New Screening</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          id="history-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search patient name, ID, or result..."
          className="w-full bg-white border border-slate-300 rounded-xl py-2.5 pl-9 pr-8 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs"
        />
        <svg
          className="w-4 h-4 text-slate-400 absolute left-3 top-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer whitespace-nowrap ${
            filterCategory === 'all'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          All ({screenings.length})
        </button>
        <button
          onClick={() => setFilterCategory('normal')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer whitespace-nowrap ${
            filterCategory === 'normal'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-emerald-800 hover:bg-emerald-50 border border-emerald-200'
          }`}
        >
          Normal ({screenings.filter((s) => s.triageCategory === 'normal').length})
        </button>
        <button
          onClick={() => setFilterCategory('review')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer whitespace-nowrap ${
            filterCategory === 'review'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-amber-800 hover:bg-amber-50 border border-amber-200'
          }`}
        >
          Review ({screenings.filter((s) => s.triageCategory === 'review').length})
        </button>
        <button
          onClick={() => setFilterCategory('urgent')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer whitespace-nowrap ${
            filterCategory === 'urgent'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-red-800 hover:bg-red-50 border border-red-200'
          }`}
        >
          Severe ({screenings.filter((s) => s.triageCategory === 'urgent').length})
        </button>
      </div>

      {/* History Records Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Table Header */}
        <div className="grid grid-cols-12 bg-slate-50 px-3 py-2.5 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          <div className="col-span-5">Patient Name</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-3">Result</div>
          <div className="col-span-2 text-right">Action</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-100 text-xs">
          {filteredRecords.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <p className="font-semibold text-sm">No screening records found</p>
              <p className="text-[11px] mt-1">Try adjusting your search query or filter</p>
            </div>
          ) : (
            filteredRecords.map((record) => {
              const isNormal = record.triageCategory === 'normal';
              const isUrgent = record.triageCategory === 'urgent';
              const isModerate = record.result.includes('Moderate');

              const badgeColor = isNormal
                ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                : isUrgent
                ? 'bg-red-100 text-red-800 border-red-200'
                : isModerate
                ? 'bg-amber-100 text-amber-800 border-amber-200'
                : 'bg-orange-50 text-orange-700 border-orange-200';

              const shortLabel = isNormal
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
                  className="history-item grid grid-cols-12 px-3 py-3 items-center hover:bg-teal-50/50 transition cursor-pointer"
                >
                  <div className="col-span-5 font-bold text-slate-800 truncate pr-1">
                    <p className="truncate text-slate-900">{record.patientName}</p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {record.patientId} • {record.eyeExamined}
                    </p>
                  </div>

                  <div className="col-span-2 text-slate-500 text-[11px]">
                    {record.date.split(',')[0]}
                  </div>

                  <div className="col-span-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeColor}`}
                    >
                      {shortLabel}
                    </span>
                  </div>

                  <div className="col-span-2 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectScreening(record);
                      }}
                      className="text-teal-700 font-bold hover:underline py-1 px-1.5 rounded"
                    >
                      View
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};
