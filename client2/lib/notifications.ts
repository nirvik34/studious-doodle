// Notification and Reminder Utilities

export interface NotificationOptions {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    tag?: string;
    requireInteraction?: boolean;
    data?: any;
}

export const notifications = {
    // Request permission for notifications
    requestPermission: async (): Promise<NotificationPermission> => {
        if (!('Notification' in window)) {
            console.warn('This browser does not support notifications');
            return 'denied';
        }

        if (Notification.permission === 'granted') {
            return 'granted';
        }

        if (Notification.permission !== 'denied') {
            return await Notification.requestPermission();
        }

        return Notification.permission;
    },

    // Show a notification
    show: async (options: NotificationOptions): Promise<void> => {
        const permission = await notifications.requestPermission();

        if (permission === 'granted') {
            new Notification(options.title, {
                body: options.body,
                icon: options.icon || '/icon.png',
                badge: options.badge,
                tag: options.tag,
                requireInteraction: options.requireInteraction,
                data: options.data,
            });
        }
    },

    // Check if notifications are supported
    isSupported: (): boolean => {
        return 'Notification' in window;
    },

    // Check current permission status
    getPermission: (): NotificationPermission => {
        if (!notifications.isSupported()) return 'denied';
        return Notification.permission;
    },
};

// Medication Reminder System
export const medicationReminders = {
    // Schedule a medication reminder
    schedule: (medicationId: string, medicationName: string, time: string): void => {
        const [hours, minutes] = time.split(':').map(Number);
        const now = new Date();
        const scheduledTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

        // If the time has passed today, schedule for tomorrow
        if (scheduledTime < now) {
            scheduledTime.setDate(scheduledTime.getDate() + 1);
        }

        const timeUntilReminder = scheduledTime.getTime() - now.getTime();

        setTimeout(() => {
            notifications.show({
                title: '💊 Medication Reminder',
                body: `Time to take ${medicationName}`,
                icon: '/medication-icon.png',
                tag: `medication-${medicationId}`,
                requireInteraction: true,
                data: { type: 'medication', medicationId },
            });

            // Reschedule for next day
            medicationReminders.schedule(medicationId, medicationName, time);
        }, timeUntilReminder);
    },

    // Cancel a medication reminder
    cancel: (medicationId: string): void => {
        // Note: This is simplified. In production, you'd want to use a more robust scheduler
        // or service worker for background scheduling
    },
};

// Health Reminders
export const healthReminders = {
    // Blood pressure check reminder
    bloodPressureCheck: (): void => {
        notifications.show({
            title: '🩺 Health Check Reminder',
            body: 'Time to check your blood pressure',
            icon: '/health-icon.png',
            tag: 'bp-check',
        });
    },

    // Daily exercise reminder
    exerciseReminder: (): void => {
        notifications.show({
            title: '🏃 Exercise Reminder',
            body: 'Remember to do your daily exercise',
            icon: '/exercise-icon.png',
            tag: 'exercise',
        });
    },

    // Water intake reminder
    waterReminder: (): void => {
        notifications.show({
            title: '💧 Hydration Reminder',
            body: 'Time to drink water',
            icon: '/water-icon.png',
            tag: 'water',
        });
    },

    // Appointment reminder
    appointmentReminder: (hospitalName: string, time: string): void => {
        notifications.show({
            title: '📅 Appointment Reminder',
            body: `You have an appointment at ${hospitalName} at ${time}`,
            icon: '/appointment-icon.png',
            tag: 'appointment',
            requireInteraction: true,
        });
    },
};

// Emergency Notifications
export const emergencyNotifications = {
    // Notify emergency contacts
    notifyContacts: async (contacts: { name: string; phone: string }[]): Promise<void> => {
        // In a real app, this would send SMS via Twilio or similar service
        // For now, we'll show a notification
        notifications.show({
            title: '🚨 Emergency Alert',
            body: `Emergency contacts have been notified: ${contacts.map(c => c.name).join(', ')}`,
            icon: '/emergency-icon.png',
            tag: 'emergency',
            requireInteraction: true,
        });
    },

    // High-risk alert
    highRiskAlert: (): void => {
        notifications.show({
            title: '⚠️ High Risk Alert',
            body: 'Your stroke risk assessment indicates high risk. Please seek medical attention immediately.',
            icon: '/alert-icon.png',
            tag: 'high-risk',
            requireInteraction: true,
        });
    },
};

// Schedule recurring health reminders
export const scheduleHealthReminders = (): void => {
    if (notifications.getPermission() !== 'granted') {
        return;
    }

    // Blood pressure check - every morning at 8 AM
    const bpCheckTime = new Date();
    bpCheckTime.setHours(8, 0, 0, 0);
    if (bpCheckTime < new Date()) {
        bpCheckTime.setDate(bpCheckTime.getDate() + 1);
    }
    setTimeout(() => {
        healthReminders.bloodPressureCheck();
        setInterval(healthReminders.bloodPressureCheck, 24 * 60 * 60 * 1000); // Every 24 hours
    }, bpCheckTime.getTime() - Date.now());

    // Water reminder - every 2 hours during the day
    setInterval(healthReminders.waterReminder, 2 * 60 * 60 * 1000);

    // Exercise reminder - every day at 6 PM
    const exerciseTime = new Date();
    exerciseTime.setHours(18, 0, 0, 0);
    if (exerciseTime < new Date()) {
        exerciseTime.setDate(exerciseTime.getDate() + 1);
    }
    setTimeout(() => {
        healthReminders.exerciseReminder();
        setInterval(healthReminders.exerciseReminder, 24 * 60 * 60 * 1000);
    }, exerciseTime.getTime() - Date.now());
};
