// Share Hospital Information Utilities

import { Hospital } from "./types";

export const shareHospital = {
    // Share via Web Share API (if supported)
    native: async (hospital: Hospital): Promise<boolean> => {
        if (!navigator.share) {
            return false;
        }

        try {
            await navigator.share({
                title: hospital.name,
                text: `${hospital.name}\n${hospital.address}\nPhone: ${hospital.phone}\nDistance: ${hospital.distance}km away`,
                url: hospital.website || `https://www.google.com/maps/search/?api=1&query=${hospital.coordinates.lat},${hospital.coordinates.lng}`,
            });
            return true;
        } catch (error) {
            console.error('Error sharing:', error);
            return false;
        }
    },

    // Share via SMS
    sms: (hospital: Hospital, phoneNumber: string = ''): void => {
        const message = encodeURIComponent(
            `${hospital.name}\n${hospital.address}\nPhone: ${hospital.phone}\nDistance: ${hospital.distance}km\nDirections: https://www.google.com/maps/dir/?api=1&destination=${hospital.coordinates.lat},${hospital.coordinates.lng}`
        );
        window.location.href = `sms:${phoneNumber}?body=${message}`;
    },

    // Share via WhatsApp
    whatsapp: (hospital: Hospital): void => {
        const message = encodeURIComponent(
            `🏥 *${hospital.name}*\n📍 ${hospital.address}\n📞 ${hospital.phone}\n📏 ${hospital.distance}km away\n${hospital.isPrimaryStrokeCenter ? '✅ Primary Stroke Center\n' : ''}🗺️ Directions: https://www.google.com/maps/dir/?api=1&destination=${hospital.coordinates.lat},${hospital.coordinates.lng}`
        );
        window.open(`https://wa.me/?text=${message}`, '_blank');
    },

    // Share via Email
    email: (hospital: Hospital, recipientEmail: string = ''): void => {
        const subject = encodeURIComponent(`Hospital Information: ${hospital.name}`);
        const body = encodeURIComponent(
            `Hospital Information\n\nName: ${hospital.name}\nAddress: ${hospital.address}\nPhone: ${hospital.phone}\nDistance: ${hospital.distance}km away\n${hospital.rating ? `Rating: ${hospital.rating}/5 (${hospital.reviewCount} reviews)\n` : ''}${hospital.isPrimaryStrokeCenter ? '\n✓ Primary Stroke Center\n' : ''}${hospital.specialties ? `\nSpecialties: ${hospital.specialties.join(', ')}\n` : ''}${hospital.website ? `\nWebsite: ${hospital.website}\n` : ''}\nGoogle Maps: https://www.google.com/maps/dir/?api=1&destination=${hospital.coordinates.lat},${hospital.coordinates.lng}`
        );
        window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
    },

    // Copy to clipboard
    copyLink: async (hospital: Hospital): Promise<boolean> => {
        const text = `${hospital.name}\n${hospital.address}\nPhone: ${hospital.phone}\nDistance: ${hospital.distance}km\nDirections: https://www.google.com/maps/dir/?api=1&destination=${hospital.coordinates.lat},${hospital.coordinates.lng}`;
        
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
                return true;
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                document.body.appendChild(textArea);
                textArea.select();
                const success = document.execCommand('copy');
                document.body.removeChild(textArea);
                return success;
            }
        } catch (error) {
            console.error('Error copying to clipboard:', error);
            return false;
        }
    },

    // Share location with emergency contacts
    shareEmergencyLocation: async (
        currentLocation: { lat: number; lng: number },
        emergencyContacts: { name: string; phone: string }[]
    ): Promise<void> => {
        const message = encodeURIComponent(
            `🚨 EMERGENCY: I need help!\n📍 My current location: https://www.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}\nPlease call or come to my location immediately.`
        );

        // Try to send to all emergency contacts
        for (const contact of emergencyContacts) {
            // In a real app, you'd use an SMS API like Twilio
            // For now, we'll open SMS app with pre-filled message
            setTimeout(() => {
                window.location.href = `sms:${contact.phone}?body=${message}`;
            }, 1000);
        }
    },
};

// Share Utilities
export const shareUtils = {
    // Check if native share is supported
    isNativeShareSupported: (): boolean => {
        return typeof navigator !== 'undefined' && 'share' in navigator;
    },

    // Check if clipboard API is supported
    isClipboardSupported: (): boolean => {
        return typeof navigator !== 'undefined' && 'clipboard' in navigator;
    },

    // Generate shareable link
    generateShareLink: (hospital: Hospital): string => {
        return `https://www.google.com/maps/search/?api=1&query=${hospital.coordinates.lat},${hospital.coordinates.lng}`;
    },

    // Generate QR code URL (using a QR code service)
    generateQRCodeUrl: (hospital: Hospital): string => {
        const data = encodeURIComponent(
            `${hospital.name}\n${hospital.address}\n${hospital.phone}\nhttps://www.google.com/maps/dir/?api=1&destination=${hospital.coordinates.lat},${hospital.coordinates.lng}`
        );
        return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${data}`;
    },
};

// Medical Profile Sharing
export const shareMedicalProfile = {
    // Generate emergency QR code with medical info
    generateEmergencyQR: (profile: {
        name: string;
        bloodType?: string;
        allergies: string[];
        conditions: string[];
        emergencyContact: string;
    }): string => {
        const data = encodeURIComponent(
            JSON.stringify({
                name: profile.name,
                bloodType: profile.bloodType,
                allergies: profile.allergies,
                conditions: profile.conditions,
                emergencyContact: profile.emergencyContact,
            })
        );
        return `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${data}`;
    },

    // Share medical profile with hospital
    shareWithHospital: (profile: any, hospital: Hospital): void => {
        const subject = encodeURIComponent('Medical Profile Information');
        const body = encodeURIComponent(
            `Medical Profile for Hospital Visit\n\nPatient Name: ${profile.name}\nBlood Type: ${profile.bloodType || 'Not specified'}\nAllergies: ${profile.allergies?.join(', ') || 'None'}\nMedical Conditions: ${profile.conditions?.join(', ') || 'None'}\nCurrent Medications: ${profile.medications?.map((m: any) => m.name).join(', ') || 'None'}\n\nPlanning to visit: ${hospital.name}\n${hospital.address}`
        );
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    },
};
