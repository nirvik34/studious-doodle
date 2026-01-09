// Local Storage Utilities for Offline Mode and Data Persistence

import { Hospital, EmergencyContact, Medication, UserPreferences, MedicalHistory } from "./types";

const STORAGE_KEYS = {
    HOSPITALS_CACHE: 'hospitals_cache',
    FAVORITE_HOSPITALS: 'favorite_hospitals',
    EMERGENCY_CONTACTS: 'emergency_contacts',
    MEDICATIONS: 'medications',
    MEDICAL_HISTORY: 'medical_history',
    USER_PREFERENCES: 'user_preferences',
    LAST_LOCATION: 'last_location',
    OFFLINE_MODE: 'offline_mode',
} as const;

// Generic storage functions
export const storage = {
    // Get item from localStorage
    get: <T>(key: string): T | null => {
        if (typeof window === 'undefined') return null;
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Error getting ${key} from storage:`, error);
            return null;
        }
    },

    // Set item in localStorage
    set: <T>(key: string, value: T): void => {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error setting ${key} in storage:`, error);
        }
    },

    // Remove item from localStorage
    remove: (key: string): void => {
        if (typeof window === 'undefined') return;
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing ${key} from storage:`, error);
        }
    },

    // Clear all storage
    clear: (): void => {
        if (typeof window === 'undefined') return;
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Error clearing storage:', error);
        }
    },
};

// Hospital Cache Management
export const hospitalCache = {
    save: (hospitals: Hospital[], location: { lat: number; lng: number }) => {
        storage.set(STORAGE_KEYS.HOSPITALS_CACHE, {
            hospitals,
            location,
            timestamp: Date.now(),
        });
    },

    get: (): { hospitals: Hospital[]; location: { lat: number; lng: number }; timestamp: number } | null => {
        const cache = storage.get<{ hospitals: Hospital[]; location: { lat: number; lng: number }; timestamp: number }>(
            STORAGE_KEYS.HOSPITALS_CACHE
        );
        // Cache expires after 1 hour
        if (cache && Date.now() - cache.timestamp < 3600000) {
            return cache;
        }
        return null;
    },

    clear: () => {
        storage.remove(STORAGE_KEYS.HOSPITALS_CACHE);
    },
};

// Favorite Hospitals
export const favorites = {
    get: (): string[] => {
        return storage.get<string[]>(STORAGE_KEYS.FAVORITE_HOSPITALS) || [];
    },

    add: (hospitalId: string): void => {
        const current = favorites.get();
        if (!current.includes(hospitalId)) {
            storage.set(STORAGE_KEYS.FAVORITE_HOSPITALS, [...current, hospitalId]);
        }
    },

    remove: (hospitalId: string): void => {
        const current = favorites.get();
        storage.set(
            STORAGE_KEYS.FAVORITE_HOSPITALS,
            current.filter(id => id !== hospitalId)
        );
    },

    toggle: (hospitalId: string): boolean => {
        const current = favorites.get();
        if (current.includes(hospitalId)) {
            favorites.remove(hospitalId);
            return false;
        } else {
            favorites.add(hospitalId);
            return true;
        }
    },

    isFavorite: (hospitalId: string): boolean => {
        return favorites.get().includes(hospitalId);
    },
};

// Emergency Contacts
export const emergencyContacts = {
    getAll: (): EmergencyContact[] => {
        return storage.get<EmergencyContact[]>(STORAGE_KEYS.EMERGENCY_CONTACTS) || [];
    },

    add: (contact: Omit<EmergencyContact, 'id'>): EmergencyContact => {
        const contacts = emergencyContacts.getAll();
        const newContact: EmergencyContact = {
            ...contact,
            id: `contact-${Date.now()}`,
        };
        storage.set(STORAGE_KEYS.EMERGENCY_CONTACTS, [...contacts, newContact]);
        return newContact;
    },

    update: (id: string, updates: Partial<EmergencyContact>): void => {
        const contacts = emergencyContacts.getAll();
        const updated = contacts.map(c => (c.id === id ? { ...c, ...updates } : c));
        storage.set(STORAGE_KEYS.EMERGENCY_CONTACTS, updated);
    },

    remove: (id: string): void => {
        const contacts = emergencyContacts.getAll();
        storage.set(
            STORAGE_KEYS.EMERGENCY_CONTACTS,
            contacts.filter(c => c.id !== id)
        );
    },

    getPrimary: (): EmergencyContact | null => {
        return emergencyContacts.getAll().find(c => c.isPrimary) || null;
    },
};

// Medications
export const medications = {
    getAll: (): Medication[] => {
        return storage.get<Medication[]>(STORAGE_KEYS.MEDICATIONS) || [];
    },

    add: (medication: Omit<Medication, 'id'>): Medication => {
        const meds = medications.getAll();
        const newMed: Medication = {
            ...medication,
            id: `med-${Date.now()}`,
        };
        storage.set(STORAGE_KEYS.MEDICATIONS, [...meds, newMed]);
        return newMed;
    },

    update: (id: string, updates: Partial<Medication>): void => {
        const meds = medications.getAll();
        const updated = meds.map(m => (m.id === id ? { ...m, ...updates } : m));
        storage.set(STORAGE_KEYS.MEDICATIONS, updated);
    },

    remove: (id: string): void => {
        const meds = medications.getAll();
        storage.set(
            STORAGE_KEYS.MEDICATIONS,
            meds.filter(m => m.id !== id)
        );
    },

    getActive: (): Medication[] => {
        const now = Date.now();
        return medications.getAll().filter(m => {
            if (m.endDate) {
                return new Date(m.endDate).getTime() > now;
            }
            return true;
        });
    },
};

// Medical History
export const medicalHistory = {
    get: (): MedicalHistory => {
        return storage.get<MedicalHistory>(STORAGE_KEYS.MEDICAL_HISTORY) || {
            allergies: [],
            conditions: [],
            medications: [],
        };
    },

    update: (updates: Partial<MedicalHistory>): void => {
        const current = medicalHistory.get();
        storage.set(STORAGE_KEYS.MEDICAL_HISTORY, { ...current, ...updates });
    },

    addAllergy: (allergy: string): void => {
        const history = medicalHistory.get();
        if (!history.allergies.includes(allergy)) {
            medicalHistory.update({
                allergies: [...history.allergies, allergy],
            });
        }
    },

    removeAllergy: (allergy: string): void => {
        const history = medicalHistory.get();
        medicalHistory.update({
            allergies: history.allergies.filter(a => a !== allergy),
        });
    },

    addCondition: (condition: string): void => {
        const history = medicalHistory.get();
        if (!history.conditions.includes(condition)) {
            medicalHistory.update({
                conditions: [...history.conditions, condition],
            });
        }
    },

    removeCondition: (condition: string): void => {
        const history = medicalHistory.get();
        medicalHistory.update({
            conditions: history.conditions.filter(c => c !== condition),
        });
    },
};

// User Preferences
export const preferences = {
    get: (): UserPreferences => {
        return storage.get<UserPreferences>(STORAGE_KEYS.USER_PREFERENCES) || {
            favoriteHospitals: [],
            transportMode: 'driving',
            notificationsEnabled: true,
            voiceCommandsEnabled: false,
        };
    },

    update: (updates: Partial<UserPreferences>): void => {
        const current = preferences.get();
        storage.set(STORAGE_KEYS.USER_PREFERENCES, { ...current, ...updates });
    },

    getTransportMode: (): 'driving' | 'walking' | 'transit' | 'bicycling' => {
        return preferences.get().transportMode;
    },

    setTransportMode: (mode: 'driving' | 'walking' | 'transit' | 'bicycling'): void => {
        preferences.update({ transportMode: mode });
    },
};

// Last Location
export const lastLocation = {
    save: (lat: number, lng: number): void => {
        storage.set(STORAGE_KEYS.LAST_LOCATION, { lat, lng, timestamp: Date.now() });
    },

    get: (): { lat: number; lng: number; timestamp: number } | null => {
        return storage.get(STORAGE_KEYS.LAST_LOCATION);
    },
};

// Offline Mode
export const offlineMode = {
    isEnabled: (): boolean => {
        return !navigator.onLine || storage.get<boolean>(STORAGE_KEYS.OFFLINE_MODE) || false;
    },

    enable: (): void => {
        storage.set(STORAGE_KEYS.OFFLINE_MODE, true);
    },

    disable: (): void => {
        storage.set(STORAGE_KEYS.OFFLINE_MODE, false);
    },
};
