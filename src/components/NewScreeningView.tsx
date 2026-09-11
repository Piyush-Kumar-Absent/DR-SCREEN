import React, { useState, useEffect } from 'react';
import { ScreeningRecord, LesionMarker } from '../types';
import { HeatmapOverlay } from './HeatmapOverlay';
import { FUNDUS_HOTLINK_IMAGE, PRESET_SAMPLE_PATIENTS } from '../data/mockData';

interface NewScreeningViewProps {
  currentClinic: string;
  activeRecord: ScreeningRecord | null;
  onSaveRecord: (record: ScreeningRecord) => void;
  onOpenReferral: (record: ScreeningRecord) => void;
  onResetToNew: () => void;
}

export const NewScreeningView: React.FC<NewScreeningViewProps> = ({
  currentClinic,
  activeRecord,
  onSaveRecord,
  onOpenReferral,
  onResetToNew,
}) => {
  // Step state: 1 = Upload, 2 = AI Screen, 3 = Result
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(activeRecord ? 3 : 1);

  // Patient inputs
  const [patientName, setPatientName] = useState(activeRecord?.patientName || 'Ramesh Kumar');
  const [patientAge, setPatientAge] = useState<number>(activeRecord?.age || 56);
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>(
    activeRecord?.gender || 'Male'
  );
  const [eyeExamined, setEyeExamined] = useState<'OD' | 'OS'>(activeRecord?.eyeExamined || 'OD');
  const [imageUrl, setImageUrl] = useState<string>(activeRecord?.imageUrl || FUNDUS_HOTLINK_IMAGE);
  const [simulatedCaseIndex, setSimulatedCaseIndex] = useState<number>(0);

  // Heatmap visibility
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [selectedLesion, setSelectedLesion] = useState<LesionMarker | null>(null);

  // Analysis simulation checkpoints
  const [analysisCheck, setAnalysisCheck] = useState<number>(1);

  // If external record changed (e.g. from Dashboard or History click)
  useEffect(() => {
    if (activeRecord) {
      setCurrentStep(3);
      setPatientName(activeRecord.patientName);
      setPatientAge(activeRecord.age);
      setPatientGender(activeRecord.gender);
      setEyeExamined(activeRecord.eyeExamined);
      setImageUrl(activeRecord.imageUrl);
      setShowHeatmap(activeRecord.triageCategory !== 'normal');
      setSelectedLesion(null);
    }
  }, [activeRecord]);

  // Handle Preset Patient Selection
  const handleSelectPreset = (index: number) => {
    setSimulatedCaseIndex(index);
    const preset = PRESET_SAMPLE_PATIENTS[index];
    setPatientName(preset.name);
    setPatientAge(preset.age);
    setPatientGender(preset.gender);
    setEyeExamined(preset.eye);
  };

  // Image upload handling
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setImageUrl(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Start Screening trigger
  const handleStartAnalysis = () => {
    setCurrentStep(2);
    setAnalysisCheck(1);

    const t1 = setTimeout(() => setAnalysisCheck(2), 1100);
    const t2 = setTimeout(() => setAnalysisCheck(3), 2200);
    const t3 = setTimeout(() => {
      finishAnalysis();
    }, 3300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  };

  // Finish Analysis & Generate Result
  const finishAnalysis = () => {
    const selectedPreset = PRESET_SAMPLE_PATIENTS[simulatedCaseIndex];
    const isNormal = selectedPreset?.simulatedResult === 'No DR';
    const isUrgent = selectedPreset?.simulatedResult === 'Severe NPDR';

    let resultGrade: ScreeningRecord['result'] = selectedPreset?.simulatedResult || 'Moderate NPDR';
    let triageCategory: ScreeningRecord['triageCategory'] = selectedPreset?.triage || 'review';
    let confidence = selectedPreset?.confidence || 87;

    let explanation =
      'AI detected some abnormal changes in the retina. The highlighted areas may contain signs such as microaneurysms or small hemorrhages.';
    let recommendation = 'Specialist Review Recommended';
    let recommendationDetail =
      'Please refer the patient to an ophthalmologist for further examination.';
    let keyPoints = [
      'Abnormal areas detected (microaneurysms / dot hemorrhages)',
      'Retinal changes highlighted',
      `Screening result: ${resultGrade}`,
    ];

    let lesions: LesionMarker[] = [
      {
        id: 'L1',
        x: 30,
        y: 38,
        radius: 14,
        type: 'microaneurysm',
        label: 'Microaneurysm Cluster',
        description: 'Capillary wall dilation along superior vascular arcade.',
        confidence: 89,
      },
      {
        id: 'L2',
        x: 35,
        y: 45,
        radius: 12,
        type: 'hemorrhage',
        label: 'Dot Hemorrhage',
        description: 'Punctate intraretinal hemorrhage.',
        confidence: 85,
      },
    ];

    if (isNormal) {
      explanation =
        'No signs of diabetic retinopathy were detected. The retinal vascular tree, optic nerve, and macula are clear of lesions.';
      recommendation = 'Routine Annual Monitoring';
      recommendationDetail =
        'Continue regular annual diabetic retinal checkups and maintain glycemic control.';
      keyPoints = [
        'Zero microaneurysms or hemorrhages detected',
        'Healthy foveal avascular zone',
        'Screening result: Normal (No DR)',
      ];
      lesions = [];
      setShowHeatmap(false);
    } else if (isUrgent) {
      explanation =
        'Multiple intraretinal blot hemorrhages and microvascular abnormalities identified across quadrants. High risk of visual compromise.';
      recommendation = 'Urgent Ophthalmologist Referral Required';
      recommendationDetail =
        'Please refer patient immediately to a specialized eye care hospital within 2 weeks.';
      keyPoints = [
        'Extensive hemorrhages detected in multiple quadrants',
        'Suspected venous beading and ischemia',
        'Screening result: Severe NPDR (Urgent triage)',
      ];
      setShowHeatmap(true);
    } else {
      setShowHeatmap(true);
    }

    const newRecord: ScreeningRecord = {
      id: `SCR-${Date.now().toString().slice(-6)}`,
      patientName,
      patientId: `PT-${Math.floor(1000 + Math.random() * 9000)}`,
      age: patientAge,
      gender: patientGender,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      clinic: currentClinic,
      eyeExamined,
      imageUrl,
      result: resultGrade,
      triageCategory,
      confidence,
      explanation,
      keyPoints,
      recommendation,
      recommendationDetail,
      lesions,
    };

    onSaveRecord(newRecord);
    setCurrentStep(3);
  };

  // Reset to create another screening
  const handleReset = () => {
    setCurrentStep(1);
    setSelectedLesion(null);
    onResetToNew();
  };

  // Current display record
  const currentRecord = activeRecord || {
    id: 'SCR-2024-0526-01',
    patientName,
    patientId: 'PT-9042',
    age: patientAge,
    gender: patientGender,
    date: 'May 26, 2024',
    clinic: currentClinic,
    eyeExamined,
    imageUrl,
    result: PRESET_SAMPLE_PATIENTS[simulatedCaseIndex]?.simulatedResult || 'Moderate NPDR',
    triageCategory: PRESET_SAMPLE_PATIENTS[simulatedCaseIndex]?.triage || 'review',
    confidence: PRESET_SAMPLE_PATIENTS[simulatedCaseIndex]?.confidence || 87,
    explanation:
      'AI detected some abnormal changes in the retina. The highlighted areas may contain signs such as microaneurysms or small hemorrhages.',
    keyPoints: [
      'Abnormal areas detected',
      'Retinal changes highlighted',
      'Screening result: Moderate NPDR',
    ],
    recommendation: 'Specialist Review Recommended',
    recommendationDetail:
      'Please refer the patient to an ophthalmologist for further examination.',
    lesions: [
      {
        id: 'L1',
        x: 30,
        y: 38,
        radius: 14,
        type: 'microaneurysm',
        label: 'Microaneurysm Cluster',
        description: 'Capillary wall dilation along superior vascular arcade.',
        confidence: 89,
      },
      {
        id: 'L2',
        x: 35,
        y: 45,
        radius: 12,
        type: 'hemorrhage',
        label: 'Dot Hemorrhage',
        description: 'Punctate intraretinal hemorrhage.',
        confidence: 85,
      },
    ],
  };

  const isNormalResult = currentRecord.triageCategory === 'normal';
  const isUrgentResult = currentRecord.triageCategory === 'urgent';

  return (
    <section id="view-new-screening" className="space-y-4">
      {/* 3-Step Process Indicator */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
        <div className="flex items-center justify-between relative">
          {/* Step 1 */}
          <div className="flex items-center gap-1.5 z-10">
            <span
              className={`w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center transition-colors duration-300 ${
                currentStep >= 1
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              1
            </span>
            <span
              className={`text-xs font-bold ${
                currentStep >= 1 ? 'text-teal-950' : 'text-slate-500'
              }`}
            >
              Upload
            </span>
          </div>

          {/* Connector 1-2 */}
          <div
            className={`h-0.5 flex-1 mx-2 transition-colors duration-300 ${
              currentStep >= 2 ? 'bg-teal-600' : 'bg-slate-200'
            }`}
          ></div>

          {/* Step 2 */}
          <div className="flex items-center gap-1.5 z-10">
            <span
              className={`w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center transition-colors duration-300 ${
                currentStep >= 2
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              2
            </span>
            <span
              className={`text-xs font-semibold ${
                currentStep >= 2 ? 'text-teal-950' : 'text-slate-500'
              }`}
            >
              AI Screen
            </span>
          </div>

          {/* Connector 2-3 */}
          <div
            className={`h-0.5 flex-1 mx-2 transition-colors duration-300 ${
              currentStep >= 3 ? 'bg-teal-600' : 'bg-slate-200'
            }`}
          ></div>

          {/* Step 3 */}
          <div className="flex items-center gap-1.5 z-10">
            <span
              className={`w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center transition-colors duration-300 ${
                currentStep >= 3
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              3
            </span>
            <span
              className={`text-xs font-semibold ${
                currentStep >= 3 ? 'text-teal-950' : 'text-slate-500'
              }`}
            >
              Result
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* STEP 1: UPLOAD RETINAL FUNDUS IMAGE                       */}
      {/* ========================================================= */}
      {currentStep === 1 && (
        <div
          id="screening-stage-upload"
          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4"
        >
          <div className="text-center">
            <h3 className="text-base font-bold text-slate-900 font-display">Upload Fundus Image</h3>
            <p className="text-xs text-slate-500 mt-0.5">Take or upload a clear retinal photograph</p>
          </div>

          {/* Preset Sample Selector (Enables fast testing for rural clinic scenarios) */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Quick Test Patient Cases:
            </label>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {PRESET_SAMPLE_PATIENTS.map((p, idx) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => handleSelectPreset(idx)}
                  className={`px-2.5 py-2 rounded-lg text-left transition border cursor-pointer ${
                    simulatedCaseIndex === idx
                      ? 'bg-teal-50 border-teal-500 text-teal-900 font-bold'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <p className="font-bold truncate text-[11px]">{p.name}</p>
                  <p className="text-[10px] text-slate-400">
                    {p.eye} • {p.simulatedResult}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Upload Dropzone */}
          <label className="block border-2 border-dashed border-teal-300 hover:border-teal-500 bg-teal-50/40 rounded-2xl p-5 text-center transition cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <div className="w-14 h-14 mx-auto rounded-full bg-teal-100 flex items-center justify-center text-teal-700 mb-2 shadow-inner">
              <svg className="w-7 h-7 stroke-[1.8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
            </div>
            <p className="font-bold text-teal-900 text-sm">Select or Capture Retinal Photo</p>
            <p className="text-xs text-slate-500 mt-1">
              Supports handheld or desktop fundus camera inputs
            </p>
            <div className="mt-3 flex justify-center">
              <span className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-5 rounded-xl text-xs shadow-sm inline-flex items-center gap-2">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  ></path>
                </svg>
                Upload / Replace Image
              </span>
            </div>
          </label>

          {/* Retinal Image Preview Box */}
          <div className="space-y-3 pt-1">
            <div className="relative rounded-2xl overflow-hidden border border-slate-300 bg-slate-900 aspect-square max-w-[280px] mx-auto shadow-md">
              <img
                src={imageUrl}
                alt="Retinal Examination"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded">
                {eyeExamined === 'OD' ? 'Right Eye (OD)' : 'Left Eye (OS)'}
              </span>
            </div>

            {/* Quality Verification Badges */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                <svg className="w-4 h-4 text-emerald-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span>Image detected</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                <svg className="w-4 h-4 text-emerald-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span>Image quality acceptable (Good focus & illumination)</span>
              </div>
            </div>

            {/* Patient details quick inputs */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Patient Name</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Eye Examined</label>
                <select
                  value={eyeExamined}
                  onChange={(e) => setEyeExamined(e.target.value as 'OD' | 'OS')}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                >
                  <option value="OD">OD - Right Eye</option>
                  <option value="OS">OS - Left Eye</option>
                </select>
              </div>
            </div>

            {/* START SCREENING BUTTON */}
            <button
              id="start-screening-btn"
              onClick={handleStartAnalysis}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 text-base transition active:scale-[0.99] cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>Start Screening</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STEP 2: AI SCREENING IN PROGRESS ANIMATION                */}
      {/* ========================================================= */}
      {currentStep === 2 && (
        <div
          id="screening-stage-analysis"
          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-5 text-center"
        >
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold mb-1 animate-pulse">
              Neural Network Inference
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 font-display">
              Analyzing retinal image...
            </h3>
            <p className="text-xs text-slate-500">
              Processing fundus micro-features for early diabetic indicators
            </p>
          </div>

          {/* Central Fundus Image with animated scan line overlay */}
          <div className="relative rounded-2xl overflow-hidden border-2 border-teal-500 aspect-square max-w-[280px] mx-auto shadow-lg bg-black">
            <img src={imageUrl} alt="Analyzing fundus" className="w-full h-full object-cover" />

            {/* Scanning beam line */}
            <div className="scan-line-animation absolute left-0 right-0 h-1 bg-gradient-to-r from-teal-400 via-emerald-300 to-teal-400 shadow-[0_0_12px_#14b8a6]"></div>

            {/* Corner targeting marks & Pulse ring */}
            <div className="absolute inset-2 pointer-events-none border border-white/20 rounded-xl flex items-center justify-center">
              <div className="w-20 h-20 border-2 border-teal-400/80 rounded-full pulse-ring-animation"></div>
            </div>

            <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur py-1 px-2 rounded text-[11px] text-teal-300 font-mono">
              Scanning optic disc & micro-vessels...
            </div>
          </div>

          {/* 3 Progress Checkpoints */}
          <div className="space-y-2.5 max-w-[300px] mx-auto text-left text-xs">
            <div
              className={`flex items-center gap-2.5 p-2 rounded-lg font-semibold border transition-all duration-300 ${
                analysisCheck >= 1
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-slate-50 text-slate-400 border-slate-200'
              }`}
            >
              <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span>Checking retinal abnormalities</span>
            </div>

            <div
              className={`flex items-center gap-2.5 p-2 rounded-lg font-semibold border transition-all duration-300 ${
                analysisCheck >= 2
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-slate-50 text-slate-400 border-slate-200 opacity-50'
              }`}
            >
              <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span>Identifying suspicious regions</span>
            </div>

            <div
              className={`flex items-center gap-2.5 p-2 rounded-lg font-semibold border transition-all duration-300 ${
                analysisCheck >= 3
                  ? 'bg-teal-50 text-teal-800 border-teal-200 animate-pulse'
                  : 'bg-slate-50 text-slate-400 border-slate-200 opacity-40'
              }`}
            >
              <svg className="w-4 h-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span>Preparing explanation...</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">Takes about 3–5 seconds on mobile networks</p>
        </div>
      )}

      {/* ========================================================= */}
      {/* STEP 3: SCREENING RESULT, HEATMAP & RECOMMENDATION        */}
      {/* ========================================================= */}
      {currentStep === 3 && (
        <div id="screening-stage-result" className="space-y-4">
          {/* Result Banner Card */}
          <div
            className={`bg-white rounded-2xl border-2 p-4 shadow-sm relative overflow-hidden ${
              isNormalResult
                ? 'border-emerald-400'
                : isUrgentResult
                ? 'border-red-400'
                : 'border-amber-400'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span
                  className={`text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-block mb-1 ${
                    isNormalResult
                      ? 'bg-emerald-100 text-emerald-800'
                      : isUrgentResult
                      ? 'bg-red-100 text-red-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  Screening Result
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 leading-tight font-display">
                  {currentRecord.result}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  {isNormalResult
                    ? 'No Retinopathy Detected'
                    : 'Non-Proliferative Diabetic Retinopathy'}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Patient: <span className="font-semibold text-slate-700">{currentRecord.patientName}</span> ({currentRecord.eyeExamined})
                </p>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-500 font-bold block uppercase">Confidence</span>
                <span className="text-2xl font-black text-teal-700 font-display">
                  {currentRecord.confidence}%
                </span>
              </div>
            </div>
          </div>

          {/* Retina & Heatmap Viewer */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider font-display">
                Retinal Scan & Heatmap
              </h4>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                  showHeatmap && !isNormalResult
                    ? 'text-amber-700 bg-amber-50 border-amber-200'
                    : 'text-slate-600 bg-slate-100 border-slate-200'
                }`}
              >
                {showHeatmap && !isNormalResult ? 'AI Highlight Active' : 'Original Image View'}
              </span>
            </div>

            {/* Canvas / Image Wrapper with Heatmap Overlay */}
            <div className="relative rounded-xl overflow-hidden aspect-square max-w-[290px] mx-auto bg-black shadow-inner border border-slate-300">
              {/* Base Retinal Image */}
              <img
                src={currentRecord.imageUrl}
                alt="Retinal Examination Fundus"
                className="w-full h-full object-cover"
              />

              {/* AI Heatmap Layer */}
              {!isNormalResult && (
                <HeatmapOverlay
                  opacity={showHeatmap ? 0.9 : 0}
                  showLesionMarkers={showHeatmap}
                  lesions={currentRecord.lesions}
                  selectedLesionId={selectedLesion?.id}
                  onSelectLesion={(l) => setSelectedLesion(l)}
                />
              )}

              <div className="absolute bottom-2 left-2 bg-black/75 backdrop-blur px-2 py-0.5 rounded text-[10px] text-white flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isNormalResult ? 'bg-emerald-400' : 'bg-red-500'
                  }`}
                ></span>
                {isNormalResult ? 'Normal Retinal Macula' : 'High Probability Lesions'}
              </div>
            </div>

            {/* Heatmap Toggle Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                id="btn-show-original"
                type="button"
                onClick={() => setShowHeatmap(false)}
                className={`py-2.5 px-3 rounded-xl font-bold text-xs transition cursor-pointer active:scale-[0.98] ${
                  !showHeatmap
                    ? 'border-2 border-teal-600 text-teal-800 bg-teal-50/80 shadow-xs'
                    : 'border border-slate-300 text-slate-700 bg-white hover:bg-slate-50'
                }`}
              >
                Original Image
              </button>
              <button
                id="btn-show-heatmap"
                type="button"
                onClick={() => setShowHeatmap(true)}
                className={`py-2.5 px-3 rounded-xl font-bold text-xs transition cursor-pointer active:scale-[0.98] ${
                  showHeatmap
                    ? 'border-2 border-teal-600 text-teal-800 bg-teal-50/80 shadow-xs'
                    : 'border border-slate-300 text-slate-700 bg-white hover:bg-slate-50'
                }`}
              >
                ✓ AI Highlight
              </button>
            </div>

            {/* Selected Lesion Detail Banner if clicked */}
            {selectedLesion && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-red-900">{selectedLesion.label}</span>
                  <span className="text-[10px] font-bold text-red-700">
                    Confidence: {selectedLesion.confidence}%
                  </span>
                </div>
                <p className="text-[11px] text-red-800">{selectedLesion.description}</p>
              </div>
            )}
          </div>

          {/* 5. EASY EXPLANATION */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold font-display">
                ?
              </div>
              <h4 className="font-bold text-slate-900 text-sm font-display">
                Why did AI give this result?
              </h4>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              “{currentRecord.explanation}”
            </p>

            {/* 3 Simple Visual Points */}
            <div className="space-y-2 pt-1">
              {currentRecord.keyPoints.map((point, idx) => {
                const bulletColor =
                  idx === 0
                    ? isNormalResult
                      ? 'bg-emerald-500'
                      : 'bg-amber-500'
                    : idx === 1
                    ? 'bg-teal-500'
                    : 'bg-teal-700';

                return (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-800 font-medium">
                    <span className={`w-2.5 h-2.5 rounded-full ${bulletColor} flex-shrink-0`}></span>
                    <span>{point}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 6. RECOMMENDATION CARD */}
          <div
            id="recommendation-card"
            className={`border-2 rounded-2xl p-4 shadow-xs space-y-3 ${
              isNormalResult
                ? 'bg-emerald-50 border-emerald-300'
                : isUrgentResult
                ? 'bg-red-50/80 border-red-300'
                : 'bg-amber-50/70 border-amber-300'
            }`}
          >
            <div
              className={`flex items-center gap-2 font-bold text-sm ${
                isNormalResult
                  ? 'text-emerald-900'
                  : isUrgentResult
                  ? 'text-red-900'
                  : 'text-amber-900'
              }`}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isNormalResult ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  ></path>
                )}
              </svg>
              <span>Recommended Action</span>
            </div>

            <div>
              <p
                className={`text-base font-extrabold font-display ${
                  isNormalResult
                    ? 'text-emerald-950'
                    : isUrgentResult
                    ? 'text-red-950'
                    : 'text-amber-950'
                }`}
              >
                {isNormalResult ? '✓ ' : '⚠ '}
                {currentRecord.recommendation}
              </p>
              <p
                className={`text-xs mt-1 leading-relaxed ${
                  isNormalResult
                    ? 'text-emerald-900/90'
                    : isUrgentResult
                    ? 'text-red-900/90'
                    : 'text-amber-900/90'
                }`}
              >
                “{currentRecord.recommendationDetail}”
              </p>
            </div>

            {/* Recommendation Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => onOpenReferral(currentRecord)}
                className="bg-teal-700 hover:bg-teal-800 text-white font-bold py-3 px-3 rounded-xl text-xs shadow-sm flex items-center justify-center gap-1.5 transition active:scale-[0.98] cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  ></path>
                </svg>
                <span>Refer to Specialist</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSaveRecord(currentRecord);
                  alert(`Screening record for ${currentRecord.patientName} successfully saved!`);
                }}
                className="bg-white hover:bg-slate-100 text-slate-800 font-bold py-3 px-3 rounded-xl text-xs border border-slate-300 shadow-xs flex items-center justify-center gap-1.5 transition active:scale-[0.98] cursor-pointer"
              >
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                  ></path>
                </svg>
                <span>Save Result</span>
              </button>
            </div>
          </div>

          {/* Important UI Disclaimer */}
          <div className="p-3 bg-slate-100/90 border border-slate-200 rounded-xl text-center">
            <p className="text-[11px] text-slate-500 leading-snug">
              “DR Screen is an AI-assisted screening tool. It supports healthcare workers and doctors and
              does not replace professional medical diagnosis.”
            </p>
          </div>

          {/* Back / New Screening Action */}
          <div className="pt-2">
            <button
              onClick={handleReset}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs border border-slate-200 transition cursor-pointer"
            >
              ← Screen Another Patient
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
