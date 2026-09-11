import { ScreeningRecord } from '../types';

export const FUNDUS_HOTLINK_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoUMngkFsHOyunfvbr27R9isCLxjGZ2Tt816ky5ldwts1JO0EdqqzQ1RL93zGfCpqAPPgzPOAdF6qEyqjuRnUHw4Dm25BNf5ewEEHL1TfgTNlAfxwGtaK-cnM-2zhlx3GjnKVIOKeV--jc-K3kG4if82WmhFl3VpTU_Dcw0XUm2lF1xZkhrdyW3_CcakZ5cnhcuG7Z6HjinuwcLOc_ooFGXpca6W3JgJFdAsIE8L6o6dY-FOXrGG6I';

export const LOGO_HOTLINK_IMAGE = 'https://lh3.googleusercontent.com/aida/AEtjO1WeQuNopG_qXwLsLKuFRzEN6CVJfPGtPeL_72EMGcKXPpsOJwwJRHmdIdgf_NBT9m7lGytFITMYszkwr_D7Z-nr6Mzt-0E2wD0758AF89EESZrC9VlbJpYNqNlHD570PMLLwBZInsbskAt2UY7aSBnKgV1oTVNGXS3dBrNWX7tFChtD2kq3OuTwyra4wh6EYqBKOIZJq1acl76Sb7TUV0ebrpuep-ZZbuTP2UcI4ZmDJw9cg5_Ui0uqkw';

export const INITIAL_SCREENINGS: ScreeningRecord[] = [
  {
    id: 'SCR-2024-0526-01',
    patientName: 'Ramesh Kumar',
    patientId: 'PT-9042',
    age: 56,
    gender: 'Male',
    date: 'May 26, 2024',
    clinic: 'Rural Primary Clinic #4',
    eyeExamined: 'OD',
    imageUrl: FUNDUS_HOTLINK_IMAGE,
    result: 'Moderate NPDR',
    triageCategory: 'review',
    confidence: 87,
    explanation: 'AI detected abnormal microvascular changes in the retina. The highlighted areas contain clinical signs such as microaneurysms and small dot-and-blot hemorrhages along the vascular arcades.',
    keyPoints: [
      'Abnormal areas detected (4 microaneurysms, 2 dot hemorrhages)',
      'Retinal vascular changes highlighted along upper temporal arcade',
      'Screening result: Moderate NPDR (Specialist evaluation recommended)'
    ],
    recommendation: 'Specialist Review Recommended',
    recommendationDetail: 'Please refer the patient to an ophthalmologist for comprehensive dilated fundus examination and optical coherence tomography (OCT).',
    lesions: [
      {
        id: 'L1',
        x: 31,
        y: 38,
        radius: 14,
        type: 'microaneurysm',
        label: 'Microaneurysm Cluster',
        description: 'Localized outpouching of retinal capillary walls with focal leakage risk.',
        confidence: 89
      },
      {
        id: 'L2',
        x: 35,
        y: 45,
        radius: 12,
        type: 'hemorrhage',
        label: 'Dot Hemorrhage',
        description: 'Intraretinal hemorrhage within inner nuclear/outer plexiform layer.',
        confidence: 85
      },
      {
        id: 'L3',
        x: 23,
        y: 49,
        radius: 10,
        type: 'microaneurysm',
        label: 'Focal Lesion',
        description: 'Microvascular dilation near macular temporal boundary.',
        confidence: 82
      },
      {
        id: 'L4',
        x: 33,
        y: 28,
        radius: 8,
        type: 'exudate',
        label: 'Lipid Exudate',
        description: 'Hard lipid sediment indicative of chronic endothelial leakage.',
        confidence: 78
      }
    ]
  },
  {
    id: 'SCR-2024-0526-02',
    patientName: 'Savitri Devi',
    patientId: 'PT-8813',
    age: 62,
    gender: 'Female',
    date: 'May 26, 2024',
    clinic: 'Community Health Camp',
    eyeExamined: 'OS',
    imageUrl: FUNDUS_HOTLINK_IMAGE,
    result: 'Mild NPDR',
    triageCategory: 'review',
    confidence: 91,
    explanation: 'AI identified isolated microaneurysms without signs of macular edema or extensive hemorrhages. Early stage diabetic retinopathy detected.',
    keyPoints: [
      'Isolated microaneurysms detected in nasal quadrant',
      'No signs of diabetic macular edema (DME)',
      'Screening result: Mild NPDR (6-month monitoring advised)'
    ],
    recommendation: 'Follow-up & Specialist Advised',
    recommendationDetail: 'Advise patient on strict blood glucose and blood pressure control. Schedule 6-month repeat retinal screening or consult local eye specialist.',
    lesions: [
      {
        id: 'L1',
        x: 36,
        y: 42,
        radius: 10,
        type: 'microaneurysm',
        label: 'Isolated Microaneurysm',
        description: 'Mild early microvascular distortion.',
        confidence: 91
      }
    ]
  },
  {
    id: 'SCR-2024-0525-01',
    patientName: 'Mohd. Aslam',
    patientId: 'PT-7650',
    age: 48,
    gender: 'Male',
    date: 'May 25, 2024',
    clinic: 'Mobile Screening Van',
    eyeExamined: 'OD',
    imageUrl: FUNDUS_HOTLINK_IMAGE,
    result: 'No DR',
    triageCategory: 'normal',
    confidence: 96,
    explanation: 'No diabetic retinopathy lesions detected. Optic disc margins are clear, macula is healthy, and retinal blood vessels exhibit normal caliber.',
    keyPoints: [
      'No microaneurysms or retinal hemorrhages found',
      'Normal cup-to-disc ratio and distinct macula',
      'Screening result: Normal (Routine annual check)'
    ],
    recommendation: 'Routine Annual Monitoring',
    recommendationDetail: 'Continue regular annual diabetic retinal checkups and maintain target glycated hemoglobin (HbA1c) levels.',
    lesions: []
  },
  {
    id: 'SCR-2024-0524-01',
    patientName: 'Lakshmi Narayanan',
    patientId: 'PT-6294',
    age: 58,
    gender: 'Female',
    date: 'May 24, 2024',
    clinic: 'Rural Primary Clinic #4',
    eyeExamined: 'OD',
    imageUrl: FUNDUS_HOTLINK_IMAGE,
    result: 'Severe NPDR',
    triageCategory: 'urgent',
    confidence: 94,
    explanation: 'Multiple blot hemorrhages in 4 quadrants and venous beading noted. High risk of progression to proliferative stage. Urgent referral required.',
    keyPoints: [
      'Widespread dot-blot hemorrhages across multiple quadrants',
      'Venous caliber irregularities and suspected cotton wool spots',
      'Screening result: Severe NPDR (Urgent attention within 2 weeks)'
    ],
    recommendation: 'Urgent Ophthalmologist Referral Required',
    recommendationDetail: 'Immediate referral to tertiary ophthalmology facility within 2 weeks for fluorescein angiography and potential anti-VEGF / laser treatment.',
    lesions: [
      {
        id: 'L1',
        x: 28,
        y: 35,
        radius: 16,
        type: 'hemorrhage',
        label: 'Confluent Blot Hemorrhage',
        description: 'Large intraretinal bleeding indicating widespread ischemia.',
        confidence: 96
      },
      {
        id: 'L2',
        x: 37,
        y: 50,
        radius: 14,
        type: 'cotton_wool',
        label: 'Cotton Wool Spot',
        description: 'Localized nerve fiber layer infarction from microvascular occlusion.',
        confidence: 92
      }
    ]
  },
  {
    id: 'SCR-2024-0524-02',
    patientName: 'Anand Joshi',
    patientId: 'PT-5120',
    age: 51,
    gender: 'Male',
    date: 'May 24, 2024',
    clinic: 'Mobile Screening Van',
    eyeExamined: 'OS',
    imageUrl: FUNDUS_HOTLINK_IMAGE,
    result: 'No DR',
    triageCategory: 'normal',
    confidence: 98,
    explanation: 'Retinal morphology within standard physiological limits. Clear foveal reflex and intact vascular integrity.',
    keyPoints: [
      'Zero evidence of diabetic microvascular abnormalities',
      'Normal retinal architecture and pigmentation',
      'Screening result: No DR'
    ],
    recommendation: 'Routine Annual Monitoring',
    recommendationDetail: 'Repeat annual fundus photography exam. Patient counselled on lifestyle and glycemic control.',
    lesions: []
  }
];

export const PRESET_SAMPLE_PATIENTS = [
  {
    name: 'Ramesh Kumar',
    age: 56,
    gender: 'Male' as const,
    eye: 'OD' as const,
    clinic: 'Rural Primary Clinic #4',
    simulatedResult: 'Moderate NPDR' as const,
    confidence: 87,
    triage: 'review' as const
  },
  {
    name: 'Mohd. Aslam',
    age: 48,
    gender: 'Male' as const,
    eye: 'OD' as const,
    clinic: 'Mobile Screening Van',
    simulatedResult: 'No DR' as const,
    confidence: 96,
    triage: 'normal' as const
  },
  {
    name: 'Lakshmi Narayanan',
    age: 58,
    gender: 'Female' as const,
    eye: 'OD' as const,
    clinic: 'Rural Primary Clinic #4',
    simulatedResult: 'Severe NPDR' as const,
    confidence: 94,
    triage: 'urgent' as const
  },
  {
    name: 'Savitri Devi',
    age: 62,
    gender: 'Female' as const,
    eye: 'OS' as const,
    clinic: 'Community Health Camp',
    simulatedResult: 'Mild NPDR' as const,
    confidence: 91,
    triage: 'review' as const
  }
];
