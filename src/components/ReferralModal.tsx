import React from 'react';
import { ScreeningRecord } from '../types';
import { LOGO_HOTLINK_IMAGE } from '../data/mockData';

interface ReferralModalProps {
  record: ScreeningRecord;
  onClose: () => void;
  onConfirmed?: () => void;
}

export const ReferralModal: React.FC<ReferralModalProps> = ({ record, onClose, onConfirmed }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    const summary = `--- DR SCREEN CLINICAL REFERRAL SLIP ---
Patient: ${record.patientName} (${record.age}y, ${record.gender}) [ID: ${record.patientId}]
Screening Date: ${record.date}
Referring Clinic: ${record.clinic}
Eye Examined: ${record.eyeExamined === 'OD' ? 'Right Eye (OD)' : 'Left Eye (OS)'}
AI Screening Result: ${record.result} (Confidence: ${record.confidence}%)
Triage Status: ${record.triageCategory.toUpperCase()} - ${record.recommendation}
Clinical Detail: ${record.recommendationDetail}
Explanation: ${record.explanation}`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
    onConfirmed?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Modal Top Bar */}
        <div className="bg-teal-700 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/10 p-1 flex items-center justify-center">
              <img src={LOGO_HOTLINK_IMAGE} alt="Logo" className="w-full h-full object-contain rounded-full" />
            </div>
            <div>
              <h3 className="font-bold text-sm font-display leading-tight">Ophthalmology Referral Slip</h3>
              <p className="text-[10px] text-teal-100">Preliminary Diabetic Retinopathy Triage</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition text-xs font-bold"
          >
            ✕
          </button>
        </div>

        {/* Slip Body (Designed like a clean clinical document) */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto print:max-h-none text-xs">
          
          {/* Header Metadata */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-3">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Referring Center</span>
              <p className="font-bold text-slate-800 text-sm">{record.clinic}</p>
              <p className="text-[11px] text-slate-500">Field Primary Health Unit • AI Screen v2.4</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Referral Ref</span>
              <p className="font-mono font-bold text-teal-800">{record.id}</p>
              <p className="text-[11px] text-slate-500">{record.date}</p>
            </div>
          </div>

          {/* Patient Details Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block">Patient Name</span>
              <span className="font-bold text-slate-800">{record.patientName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block">Age / Gender</span>
              <span className="font-semibold text-slate-700">{record.age} yrs • {record.gender}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block">Patient ID</span>
              <span className="font-mono text-slate-700">{record.patientId}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block">Eye Examined</span>
              <span className="font-bold text-teal-800">
                {record.eyeExamined === 'OD' ? 'OD (Right Eye)' : 'OS (Left Eye)'}
              </span>
            </div>
          </div>

          {/* Diagnosis & Urgency Badge */}
          <div className="border border-amber-200 bg-amber-50/60 rounded-xl p-3 flex items-start justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800">
                Preliminary Triage
              </span>
              <p className="text-base font-extrabold text-amber-950 mt-0.5">{record.result}</p>
              <p className="text-[11px] text-amber-900 mt-1 leading-snug">
                {record.recommendationDetail}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="inline-block px-2.5 py-1 rounded-full text-xs font-black bg-amber-200 text-amber-900 border border-amber-300">
                {record.triageCategory === 'urgent' ? 'URGENT < 2 WKS' : 'RECOMMENDED'}
              </span>
              <span className="block text-[10px] text-slate-500 font-bold mt-1">
                AI Conf: {record.confidence}%
              </span>
            </div>
          </div>

          {/* Key Abnormalities List */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-700 text-xs">Observed Findings & Explanation:</h4>
            <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-slate-700 space-y-1 text-[11px]">
              <p className="italic text-slate-600 mb-1.5 font-medium">"{record.explanation}"</p>
              {record.keyPoints.map((pt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600 flex-shrink-0"></span>
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fundus Preview Thumbnail */}
          <div className="flex items-center gap-3 p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-black flex-shrink-0 border border-slate-300 relative">
              <img src={record.imageUrl} alt="Fundus mini" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-red-500/20 mix-blend-color-dodge pointer-events-none"></div>
            </div>
            <div className="text-[11px] text-slate-600">
              <p className="font-bold text-slate-800">Digital Fundus Photographic Capture</p>
              <p className="text-[10px] text-slate-500">Image analyzed by DR Screen deep neural network. Lesion heatmap attached to patient record.</p>
            </div>
          </div>

          {/* Signoff row */}
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200">
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Examining Health Worker</p>
              <div className="h-9 border-b border-dashed border-slate-300 flex items-end">
                <span className="font-serif italic text-slate-700 text-xs">Nurse Practitioner / CHW #14</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Receiving Doctor Signature</p>
              <div className="h-9 border-b border-dashed border-slate-300 flex items-end">
                <span className="text-[10px] text-slate-400 italic">Stamp & Signature on arrival</span>
              </div>
            </div>
          </div>

          {/* Clinical Disclaimer */}
          <p className="text-[9px] text-slate-400 text-center leading-tight">
            *This referral slip is generated by DR Screen AI assist for triage purposes in community clinics. It does not constitute a definitive medical diagnosis.
          </p>

        </div>

        {/* Modal Actions */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-200 border border-slate-300 font-bold text-xs flex items-center gap-1.5 transition"
          >
            {copied ? '✓ Copied' : 'Copy Text'}
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200 font-bold text-xs transition"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print / Save Slip
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
