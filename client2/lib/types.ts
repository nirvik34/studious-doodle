export interface FacialMetrics {
    chin: number;
    leftEye: number;
    rightEye: number;
    mouth: number;
    nose: number;
    leftCheek: number;
    rightCheek: number;
    forehead: number;
    overall: number;
}

export interface StrokeRiskResult {
    riskScore: number; // 0-100
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    confidence: number; // 0-100
    factors: string[];
    recommendations: string[];
    timestamp: string;
    facialMetrics?: FacialMetrics;
    rawAsymmetryScore?: number;
    detectedFeatures?: string[];
}

export interface MedicalProfile {
    id: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    systolicBP: number;
    diastolicBP: number;
    bmi: number;
    hasHypertension: boolean;
    hasHeartDisease: boolean;
    hasDiabetes: boolean;
    smokingStatus: 'never' | 'former' | 'current';
    activityLevel: 'sedentary' | 'moderate' | 'active';
}

export interface Hospital {
    id: string;
    name: string;
    address: string;
    phone: string;
    distance: number; // in km
    isPrimaryStrokeCenter: boolean;
    coordinates: {
        lat: number;
        lng: number;
    };
    waitTime?: number; // in minutes
    rating?: number; // 0-5 stars
    reviewCount?: number;
    website?: string;
    specialties?: string[];
    hasEmergencyRoom?: boolean;
    has24HourService?: boolean;
    acceptsInsurance?: boolean;
    beds?: number;
    availableBeds?: number; // Real-time bed availability
    currentPatientVolume?: 'low' | 'medium' | 'high';
    telemedicineUrl?: string; // Video consultation link
    isFavorite?: boolean; // User bookmarked
}

export interface EmergencyContact {
    id: string;
    name: string;
    phone: string;
    relationship: "family" | "friend" | "caregiver" | "doctor" | "other";
    isPrimary: boolean;
}

export interface Medication {
    id: string;
    name: string;
    dosage: string;
    frequency: string; // e.g., "twice daily"
    time: string[]; // e.g., ["08:00", "20:00"]
    startDate: string;
    endDate?: string;
    reminderEnabled: boolean;
}

export interface MedicalHistory {
    allergies: string[];
    conditions: string[];
    medications: Medication[];
    bloodType?: string;
    emergencyNotes?: string;
}

export interface UserPreferences {
    favoriteHospitals: string[]; // Hospital IDs
    transportMode: 'driving' | 'walking' | 'transit' | 'bicycling';
    insuranceProvider?: string;
    notificationsEnabled: boolean;
    voiceCommandsEnabled: boolean;
}

export interface SymptomAssessment {
    faceAsymmetry: boolean;
    armWeakness: boolean;
    speechDifficulty: boolean;
    timestamp: string;
    riskLevel: 'EMERGENCY' | 'URGENT' | 'MONITOR';
    recommendation: string;
}

export interface User {
    id: string;
    email: string;
    name: string;
    profile?: MedicalProfile;
    history: StrokeRiskResult[];
}
