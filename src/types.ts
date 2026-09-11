export type DRGrade = 'No DR' | 'Mild NPDR' | 'Moderate NPDR' | 'Severe NPDR' | 'PDR';

export type TriageCategory = 'normal' | 'review' | 'urgent';

export interface LesionMarker {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  radius: number; // percentage
  type: 'microaneurysm' | 'hemorrhage' | 'exudate' | 'cotton_wool';
  label: string;
  description: string;
  confidence: number;
}

export interface ScreeningRecord {
  id: string;
  patientName: string;
  patientId: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  date: string; // e.g. "May 26, 2024"
  clinic: string;
  eyeExamined: 'OD' | 'OS'; // OD = Right eye, OS = Left eye
  imageUrl: string;
  result: DRGrade;
  triageCategory: TriageCategory;
  confidence: number; // e.g. 87%
  explanation: string;
  keyPoints: string[];
  recommendation: string;
  recommendationDetail: string;
  lesions: LesionMarker[];
  referralGenerated?: boolean;
  notes?: string;
}

export type ViewTab = 'dashboard' | 'new-screening' | 'history';
