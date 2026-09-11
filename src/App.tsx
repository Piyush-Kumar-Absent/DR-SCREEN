import React, { useState } from 'react';
import { ViewTab, ScreeningRecord } from './types';
import { INITIAL_SCREENINGS } from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { NewScreeningView } from './components/NewScreeningView';
import { HistoryView } from './components/HistoryView';
import { ReferralModal } from './components/ReferralModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ViewTab>('dashboard');
  const [currentClinic, setCurrentClinic] = useState<string>('Rural Primary Clinic #4');
  const [screenings, setScreenings] = useState<ScreeningRecord[]>(INITIAL_SCREENINGS);
  const [activeRecord, setActiveRecord] = useState<ScreeningRecord | null>(null);
  const [referralModalRecord, setReferralModalRecord] = useState<ScreeningRecord | null>(null);

  const handleTabChange = (tab: ViewTab) => {
    if (tab === 'new-screening' && currentTab !== 'new-screening') {
      // If navigating to new screening directly, prepare fresh flow
      setActiveRecord(null);
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartNewScreening = () => {
    setActiveRecord(null);
    setCurrentTab('new-screening');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectRecordFromAnywhere = (record: ScreeningRecord) => {
    setActiveRecord(record);
    setCurrentTab('new-screening');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveRecord = (newRecord: ScreeningRecord) => {
    setScreenings((prev) => {
      const existsIndex = prev.findIndex((s) => s.id === newRecord.id);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = newRecord;
        return updated;
      }
      return [newRecord, ...prev];
    });
    setActiveRecord(newRecord);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 selection:bg-teal-100 antialiased">
      {/* Top Sticky Header */}
      <Header
        currentClinic={currentClinic}
        onSelectClinic={(clinic) => setCurrentClinic(clinic)}
      />

      {/* Main Viewport Container */}
      <main className="max-w-md mx-auto px-4 pt-4">
        {currentTab === 'dashboard' && (
          <DashboardView
            screenings={screenings}
            onStartNewScreening={handleStartNewScreening}
            onViewAllHistory={() => setCurrentTab('history')}
            onSelectScreening={handleSelectRecordFromAnywhere}
          />
        )}

        {currentTab === 'new-screening' && (
          <NewScreeningView
            currentClinic={currentClinic}
            activeRecord={activeRecord}
            onSaveRecord={handleSaveRecord}
            onOpenReferral={(record) => setReferralModalRecord(record)}
            onResetToNew={() => setActiveRecord(null)}
          />
        )}

        {currentTab === 'history' && (
          <HistoryView
            screenings={screenings}
            onSelectScreening={handleSelectRecordFromAnywhere}
            onStartNewScreening={handleStartNewScreening}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation */}
      <BottomNav currentTab={currentTab} onSelectTab={handleTabChange} />

      {/* Referral Slip Modal */}
      {referralModalRecord && (
        <ReferralModal
          record={referralModalRecord}
          onClose={() => setReferralModalRecord(null)}
          onConfirmed={() => {
            alert('Referral slip dispatched! Patient referral status marked as active.');
            setReferralModalRecord(null);
          }}
        />
      )}
    </div>
  );
}
