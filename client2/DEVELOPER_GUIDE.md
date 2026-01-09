# 🔧 Developer Integration Guide

## Table of Contents
1. [Quick Start](#quick-start)
2. [Architecture Overview](#architecture-overview)
3. [Component Integration](#component-integration)
4. [API Usage](#api-usage)
5. [Storage System](#storage-system)
6. [Notifications](#notifications)
7. [Voice Commands](#voice-commands)
8. [Sharing Features](#sharing-features)
9. [Testing Guide](#testing-guide)
10. [Deployment](#deployment)

---

## Quick Start

### Prerequisites
```bash
Node.js >= 18
npm or yarn
```

### Installation
```bash
# Install dependencies
npm install

# Install required packages (if not already done)
npm install leaflet react-leaflet groq-sdk @types/leaflet

# Set up environment variables
cp .env.example .env.local
# Add your Groq API key to .env.local
```

### Environment Variables
```env
# .env.local
NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key_here
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key (if using Firebase)
```

### Run Development Server
```bash
npm run dev
# Open http://localhost:3000
```

---

## Architecture Overview

### Project Structure
```
app/
├── (auth)/          # Authentication pages
│   ├── login/
│   └── signup/
├── hospitals/       # Hospital finder (MAIN FEATURE)
├── emergency/       # FAST test page
├── contacts/        # Emergency contacts management
├── medications/     # Medication tracking
├── scan/           # Face scanning
├── analytics/      # Analytics dashboard
├── history/        # Scan history
├── profile/        # User profile
└── layout.tsx      # Root layout with VoiceCommandButton

components/
├── auth/
│   ├── AuthProvider.tsx
│   └── RequireAuth.tsx
├── health/
│   └── StrokeSymptomsChecker.tsx    # FAST test component
├── hospitals/
│   ├── HospitalFilters.tsx          # Filter panel component
│   └── HospitalActions.tsx          # Action buttons component
├── shared/
│   ├── BrainScanHero.tsx
│   ├── RiskBadge.tsx
│   ├── Sparkline.tsx
│   └── VoiceCommandButton.tsx       # Voice control component
└── ui/              # Shadcn/ui components

lib/
├── api.ts           # Hospital API with Groq integration
├── types.ts         # TypeScript interfaces
├── storage.ts       # Local storage utilities (8 modules)
├── notifications.ts # Notification system (4 types)
├── voice-commands.ts # Voice command system
├── share.ts         # Sharing utilities (5 methods)
├── utils.ts         # General utilities
└── validators.ts    # Form validation
```

---

## Component Integration

### 1. Hospital Filters Component

#### Import & Usage
```tsx
import HospitalFilters from "@/components/hospitals/HospitalFilters";

function YourPage() {
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);

    return (
        <HospitalFilters
            hospitals={hospitals}
            onFilterChange={setFilteredHospitals}
        />
    );
}
```

#### Props
```typescript
interface HospitalFiltersProps {
    hospitals: Hospital[];           // Full list of hospitals
    onFilterChange: (filtered: Hospital[]) => void;  // Callback with filtered results
}
```

#### Features
- Collapsible filter panel
- Real-time filtering (no submit button needed)
- 6 filter types + 5 sort options
- Active filter count badge
- Persists filter state during session

---

### 2. Hospital Actions Component

#### Import & Usage
```tsx
import HospitalActions from "@/components/hospitals/HospitalActions";

function HospitalCard({ hospital }: { hospital: Hospital }) {
    const handleRefresh = () => {
        // Re-render to show updated favorite status
        setHospitals([...hospitals]);
    };

    return (
        <Card>
            {/* Hospital info */}
            <CardContent>
                <HospitalActions 
                    hospital={hospital} 
                    onFavoriteToggle={handleRefresh}
                />
            </CardContent>
        </Card>
    );
}
```

#### Props
```typescript
interface HospitalActionsProps {
    hospital: Hospital;              // Hospital data object
    onFavoriteToggle?: () => void;   // Optional callback after favorite toggle
}
```

#### Action Buttons
1. **Favorite**: Toggle with heart icon, saves to localStorage
2. **Call**: Opens tel: link
3. **Directions**: Dropdown with 4 transport modes
4. **Share**: Dropdown with 5 sharing methods
5. **Website**: Opens hospital website (if available)
6. **Telemedicine**: Opens video consultation (if available)

---

### 3. Voice Command Button

#### Already Integrated
The `VoiceCommandButton` is already added to the root layout and appears on all pages.

#### Manual Integration (if needed elsewhere)
```tsx
import VoiceCommandButton from "@/components/shared/VoiceCommandButton";

// In your component
<VoiceCommandButton />
```

#### Customize Voice Commands
```typescript
import { getVoiceCommandSystem } from "@/lib/voice-commands";

const voiceSystem = getVoiceCommandSystem();

// Add custom command
voiceSystem.registerCommand({
    patterns: ["custom command", "another phrase"],
    action: () => {
        console.log("Custom command triggered!");
        // Your custom logic
    },
    description: "Description for help menu"
});
```

---

### 4. FAST Test Component

#### Usage
```tsx
import StrokeSymptomsChecker from "@/components/health/StrokeSymptomsChecker";

function EmergencyPage() {
    return <StrokeSymptomsChecker />;
}
```

#### Features
- 3-question FAST test
- Instant risk assessment
- Emergency actions (Call 911, View Hospitals)
- Fully self-contained, no props needed

---

## API Usage

### Fetching Hospitals

#### Method 1: With Groq AI (Recommended)
```typescript
import { api } from "@/lib/api";

const hospitals = await api.hospitals.findNearestWithGroq(
    latitude,
    longitude,
    radius // optional, default 10km
);
```

**What it does:**
1. Fetches real hospitals from OpenStreetMap Overpass API
2. Enhances with Groq AI predictions (stroke centers, prioritization)
3. Falls back to generated data if no real hospitals found
4. Adds ratings, specialties, and other metadata

#### Method 2: OpenStreetMap Only
```typescript
import { api } from "@/lib/api";

const hospitals = await api.hospitals.findNearest(
    latitude,
    longitude,
    radius
);
```

**What it does:**
1. Fetches from OpenStreetMap
2. No AI enhancement
3. Faster, but less detailed

#### Method 3: Mock Data (Development)
```typescript
const mockHospitals: Hospital[] = [
    {
        id: "1",
        name: "Test Hospital",
        coordinates: { lat: 40.7128, lng: -74.0060 },
        // ... full hospital object
    }
];
```

---

## Storage System

### 1. Hospital Cache

```typescript
import { hospitalCache } from "@/lib/storage";

// Save hospitals with location
hospitalCache.save(hospitals, userLocation);

// Get cached hospitals (expires after 1 hour)
const cached = hospitalCache.get();
if (cached) {
    const { hospitals, location, timestamp } = cached;
}

// Clear cache
hospitalCache.clear();
```

### 2. Favorites

```typescript
import { favorites } from "@/lib/storage";

// Add to favorites
favorites.add(hospital);

// Remove from favorites
favorites.remove(hospitalId);

// Toggle favorite status
favorites.toggle(hospitalId);

// Check if favorited
const isFav = favorites.isFavorite(hospitalId);

// Get all favorites
const allFavorites = favorites.get();
```

### 3. Emergency Contacts

```typescript
import { emergencyContacts } from "@/lib/storage";

// Add contact
emergencyContacts.add({
    name: "John Doe",
    phone: "+1234567890",
    relationship: "family",
    isPrimary: false
});

// Get all contacts
const contacts = emergencyContacts.getAll();

// Get primary contact only
const primary = emergencyContacts.getPrimary();

// Update contact
emergencyContacts.update(contactId, {
    name: "Jane Doe",
    isPrimary: true
});

// Remove contact
emergencyContacts.remove(contactId);
```

### 4. Medications

```typescript
import { medications } from "@/lib/storage";

// Add medication
const med = medications.add({
    name: "Aspirin",
    dosage: "100mg",
    frequency: "Once daily",
    time: ["09:00"],
    reminderEnabled: true,
    startDate: new Date().toISOString()
});

// Get all medications
const allMeds = medications.getAll();

// Get only active medications
const activeMeds = medications.getActive();

// Update medication
medications.update(medId, {
    dosage: "200mg"
});

// Remove medication
medications.remove(medId);
```

### 5. Medical History

```typescript
import { medicalHistory } from "@/lib/storage";

// Get medical history
const history = medicalHistory.get();

// Update history
medicalHistory.update({
    bloodType: "A+",
    emergencyNotes: "Diabetic, insulin dependent"
});

// Add allergy
medicalHistory.addAllergy("Penicillin");

// Remove allergy
medicalHistory.removeAllergy("Penicillin");

// Add condition
medicalHistory.addCondition("Hypertension");

// Remove condition
medicalHistory.removeCondition("Hypertension");
```

### 6. User Preferences

```typescript
import { preferences } from "@/lib/storage";

// Get preferences
const prefs = preferences.get();

// Update preferences
preferences.update({
    notificationsEnabled: true,
    voiceCommandsEnabled: true,
    insuranceProvider: "Blue Cross"
});

// Get/Set transport mode
const mode = preferences.getTransportMode(); // "driving" | "walking" | "transit" | "bicycling"
preferences.setTransportMode("walking");
```

### 7. Offline Mode

```typescript
import { offlineMode } from "@/lib/storage";

// Check if offline mode is enabled
if (offlineMode.isEnabled()) {
    // Show offline indicator
}

// Manually enable/disable (automatic in production)
offlineMode.enable();
offlineMode.disable();
```

---

## Notifications

### 1. Request Permission

```typescript
import { notifications } from "@/lib/notifications";

// Request browser notification permission
const granted = await notifications.requestPermission();
if (granted) {
    console.log("Notifications enabled");
}

// Check current permission
const permission = notifications.getPermission();
```

### 2. Show Notification

```typescript
// Show a basic notification
notifications.show("Title", {
    body: "Notification message",
    icon: "/icon.png",
    tag: "unique-id",
    requireInteraction: false
});
```

### 3. Medication Reminders

```typescript
import { medicationReminders } from "@/lib/notifications";
import { Medication } from "@/lib/types";

// Schedule reminders for a medication
medicationReminders.schedule(medication);

// Cancel reminders
medicationReminders.cancel(medicationId);
```

**How it works:**
- Parses medication `time` array
- Schedules browser notifications at each time
- Repeats daily automatically
- Notifications persist even if browser is closed (on supported platforms)

### 4. Health Reminders

```typescript
import { healthReminders } from "@/lib/notifications";

// Schedule blood pressure check (8 AM daily)
healthReminders.bloodPressureCheck();

// Schedule water reminder (every 2 hours)
healthReminders.waterReminder();

// Schedule exercise reminder (6 PM daily)
healthReminders.exerciseReminder();

// Schedule appointment reminder
healthReminders.appointmentReminder(
    new Date("2024-02-15T10:00:00"),
    "Dr. Smith",
    "General Checkup"
);
```

### 5. Emergency Notifications

```typescript
import { emergencyNotifications } from "@/lib/notifications";

// Notify all emergency contacts
await emergencyNotifications.notifyContacts(
    userLocation,
    "Stroke symptoms detected"
);

// Show high-risk alert
emergencyNotifications.highRiskAlert();
```

---

## Voice Commands

### 1. Basic Setup (Already Done)

The voice command system is automatically initialized in the root layout via `VoiceCommandButton`.

### 2. Register Custom Commands

```typescript
import { getVoiceCommandSystem } from "@/lib/voice-commands";
import { useRouter } from "next/navigation";

function MyComponent() {
    const router = useRouter();
    const voiceSystem = getVoiceCommandSystem();

    useEffect(() => {
        // Register a custom command
        voiceSystem.registerCommand({
            patterns: ["go home", "take me home", "homepage"],
            action: () => {
                router.push("/");
                voiceSystem.speak("Navigating to home");
            },
            description: "Navigate to the homepage"
        });
    }, []);
}
```

### 3. Multiple Commands at Once

```typescript
const commands = [
    {
        patterns: ["open settings", "show settings"],
        action: () => router.push("/settings"),
        description: "Open settings page"
    },
    {
        patterns: ["logout", "sign out"],
        action: () => handleLogout(),
        description: "Log out of account"
    }
];

voiceSystem.registerCommands(commands);
```

### 4. Programmatic Control

```typescript
const voiceSystem = getVoiceCommandSystem();

// Start listening
await voiceSystem.start();

// Stop listening
voiceSystem.stop();

// Check if active
if (voiceSystem.isActive()) {
    console.log("Voice commands are listening");
}

// Check if supported
if (!voiceSystem.isSupported()) {
    console.log("Voice commands not available in this browser");
}

// Speak feedback
voiceSystem.speak("Hello, this is voice feedback");
```

### 5. Available Default Commands

```typescript
import { getDefaultVoiceCommands } from "@/lib/voice-commands";

// Get all default commands
const defaultCommands = getDefaultVoiceCommands(router);
```

**Default commands:**
- "find hospital" → /hospitals
- "emergency" → /emergency
- "scan face" → /scan
- "check symptoms" → /emergency
- "my profile" → /profile
- "analytics" → /analytics
- "history" → /history
- "help" → Speaks available commands
- "stop listening" → Stops voice commands

---

## Sharing Features

### 1. Share Hospital Info

```typescript
import { shareHospital } from "@/lib/share";

// Native share (mobile preferred)
await shareHospital.native(hospital);

// WhatsApp
shareHospital.whatsapp(hospital);

// SMS
shareHospital.sms(hospital);

// Email
shareHospital.email(hospital);

// Copy link to clipboard
await shareHospital.copyLink(hospital);
```

### 2. Share Emergency Location

```typescript
import { shareEmergencyLocation } from "@/lib/share";

await shareEmergencyLocation(
    { lat: 40.7128, lng: -74.0060 },
    emergencyContact.phone
);
```

**What it sends:**
- "EMERGENCY: I may need help. My location: [GPS coordinates] [Google Maps link]"

### 3. Share Medical Profile (Future Feature)

```typescript
import { shareMedicalProfile } from "@/lib/share";

// Generate QR code with emergency info
const qrCodeUrl = shareMedicalProfile.generateEmergencyQR(medicalHistory);

// Share with hospital
await shareMedicalProfile.shareWithHospital(medicalHistory, hospital);
```

### 4. Check Feature Support

```typescript
import { shareUtils } from "@/lib/share";

// Check if native share is supported
if (shareUtils.isNativeShareSupported()) {
    // Use navigator.share()
} else {
    // Use fallback methods
}

// Check if clipboard API is supported
if (shareUtils.isClipboardSupported()) {
    // Can copy to clipboard
}
```

---

## Testing Guide

### 1. Test Hospital Filters

```bash
# Navigate to /hospitals page
# 1. Load hospitals
# 2. Open filters panel
# 3. Adjust rating slider → verify hospitals update
# 4. Check "Stroke Centers Only" → verify filtering
# 5. Change sort option → verify order changes
# 6. Reset filters → verify all hospitals shown
```

### 2. Test Hospital Actions

```bash
# On a hospital card:
# 1. Click favorite → verify heart fills, toast shows
# 2. Click call → verify phone app opens (mobile)
# 3. Click directions → select transport mode → verify Google Maps opens
# 4. Click share → try each method → verify sharing works
# 5. Click website → verify opens in new tab
# 6. Click telemedicine → verify opens video portal
```

### 3. Test Voice Commands

```bash
# 1. Click microphone button (bottom-right)
# 2. Allow microphone access
# 3. Say "find hospital" → verify navigates to /hospitals
# 4. Say "emergency" → verify navigates to /emergency
# 5. Say "help" → verify speaks available commands
# 6. Say "stop listening" → verify button stops listening
```

### 4. Test Notifications

```bash
# 1. Allow notifications when prompted
# 2. Add a medication with reminder at current time + 2 minutes
# 3. Wait 2 minutes → verify notification appears
# 4. Click notification → verify opens medications page
# 5. Disable reminder → verify no more notifications
```

### 5. Test FAST Test

```bash
# Navigate to /emergency
# 1. Answer No to any question → verify shows EMERGENCY result
# 2. Click "Call 911" → verify opens phone dialer
# 3. Click "View Hospitals" → verify navigates to /hospitals with nearest stroke centers
# 4. Retake test
# 5. Answer Yes to all → verify shows MONITOR result
```

### 6. Test Emergency Contacts

```bash
# Navigate to /contacts
# 1. Click "Add Contact" → fill form → verify adds
# 2. First contact should auto-set as Primary (⭐)
# 3. Add second contact → click Star → verify becomes primary
# 4. Click Call → verify opens dialer
# 5. Click Edit → update info → verify saves
# 6. Click Delete → verify removes
```

### 7. Test Medications

```bash
# Navigate to /medications
# 1. Click "Add Medication" → fill form → verify adds
# 2. Enable reminder → verify scheduled
# 3. Disable reminder → verify cancelled
# 4. Edit medication → verify updates
# 5. Delete medication → verify removes
```

### 8. Test Offline Mode

```bash
# 1. Load /hospitals with internet on
# 2. Turn off internet (airplane mode or disable network)
# 3. Verify "Offline Mode" badge appears
# 4. Verify cached hospitals still visible
# 5. Verify favorites still work
# 6. Verify phone calls still work
# 7. Turn internet back on → verify badge disappears
```

---

## Deployment

### 1. Environment Variables

Ensure `.env.local` is configured:
```env
NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key
```

**Important:** Do NOT commit `.env.local` to git. It's in `.gitignore`.

### 2. Build for Production

```bash
# Build the app
npm run build

# Test production build locally
npm run start
```

### 3. Vercel Deployment (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard:
# Settings → Environment Variables
# Add: NEXT_PUBLIC_GROQ_API_KEY
```

### 4. Other Platforms

**Netlify:**
```bash
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

**AWS Amplify:**
- Connect your repository
- Build command: `npm run build`
- Output directory: `.next`
- Add environment variables in console

### 5. Required Features for Production

✅ **Must Have:**
- HTTPS (required for geolocation and voice commands)
- Groq API key configured
- Node.js 18+ runtime
- Browser notification support (enabled by default)

⚠️ **Optional but Recommended:**
- Custom domain
- Analytics integration
- Error monitoring (Sentry)
- Performance monitoring

---

## Troubleshooting

### Issue: Voice commands not working in production

**Solution:**
- Ensure HTTPS is enabled (required for Web Speech API)
- Check microphone permissions in browser
- Verify browser support (Chrome, Edge, Safari 14.1+)

### Issue: Notifications not showing

**Solution:**
- Check notification permission granted
- Verify HTTPS (required for persistent notifications)
- Check service worker registration

### Issue: Geolocation not working

**Solution:**
- Ensure HTTPS enabled
- Check location permission granted
- Fallback to manual location entry if needed

### Issue: Groq API errors

**Solution:**
- Verify API key is correct
- Check API rate limits
- Implement fallback to OpenStreetMap-only mode

---

## API Reference

### Hospital Type

```typescript
interface Hospital {
    id: string;
    name: string;
    address: string;
    phone: string;
    coordinates: {
        lat: number;
        lng: number;
    };
    distance: number;
    rating?: number;
    reviewCount?: number;
    website?: string;
    isPrimaryStrokeCenter: boolean;
    hasEmergencyRoom: boolean;
    has24HourService: boolean;
    acceptsInsurance: boolean;
    waitTime?: number;
    beds?: number;
    specialties?: string[];
    availableBeds?: number;
    currentPatientVolume?: "low" | "medium" | "high";
    telemedicineUrl?: string;
    isFavorite?: boolean;
}
```

### Emergency Contact Type

```typescript
interface EmergencyContact {
    id: string;
    name: string;
    phone: string;
    relationship: "family" | "friend" | "caregiver" | "doctor" | "other";
    isPrimary: boolean;
}
```

### Medication Type

```typescript
interface Medication {
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    time: string[];
    startDate: string;
    endDate?: string;
    reminderEnabled: boolean;
}
```

---

## Performance Optimization

### 1. Lazy Loading

```typescript
// Already implemented for Leaflet
const MapContainer = dynamic(
    () => import("react-leaflet").then((mod) => mod.MapContainer),
    { ssr: false }
);
```

### 2. Caching Strategy

- Hospital data: 1 hour cache
- User preferences: Persist indefinitely
- API responses: Cache with SWR or React Query

### 3. Code Splitting

```typescript
// Split heavy components
const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
    loading: () => <Spinner />,
    ssr: false
});
```

### 4. Image Optimization

```tsx
import Image from "next/image";

<Image
    src="/hospital-icon.png"
    alt="Hospital"
    width={32}
    height={32}
    loading="lazy"
/>
```

---

## Security Considerations

### 1. API Keys

- ✅ Never commit API keys to git
- ✅ Use environment variables
- ✅ Prefix with `NEXT_PUBLIC_` for client-side usage
- ✅ Rotate keys regularly

### 2. User Data

- ✅ Store locally only (no backend required)
- ✅ Never transmit sensitive data without encryption
- ✅ Allow users to clear data (browser storage)
- ✅ No PII in error logs

### 3. Input Validation

```typescript
import { z } from "zod";

const emergencyContactSchema = z.object({
    name: z.string().min(1),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
    relationship: z.enum(["family", "friend", "caregiver", "doctor", "other"])
});

// Validate before saving
const validated = emergencyContactSchema.parse(formData);
```

---

## Contributing

### Code Style

- Use TypeScript for all new files
- Follow existing component patterns
- Add JSDoc comments for public functions
- Use Prettier for formatting

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Commit with descriptive messages
git commit -m "feat: add hospital rating filter"

# Push and create PR
git push origin feature/new-feature
```

### PR Checklist

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] No console errors in production build
- [ ] Updated documentation (if needed)
- [ ] Added types for new interfaces
- [ ] No breaking changes (or documented)

---

## Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Leaflet](https://react-leaflet.js.org/)
- [Groq API](https://groq.com/docs)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)

### Tools
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## Support

For issues or questions:
1. Check this documentation
2. Review existing code examples
3. Check browser console for errors
4. Test in different browsers

---

**Last Updated:** Today  
**Version:** 2.0  
**Maintainer:** Development Team
