# 🎯 Complete User Guide - StrokeRisk AI Platform

## 📍 Hospitals Page Features

### 🔍 **Hospital Filters** (Top of page)
Located above the map and hospital cards, this panel lets you filter hospitals based on:

#### Filter Options:
- **⭐ Minimum Rating**: Slider (0-5 stars) - Show only hospitals with ratings above your threshold
- **📏 Maximum Distance**: Slider (0-50 km) - Filter by proximity to your location
- **🏥 Stroke Centers Only**: Checkbox - Show only Primary Stroke Centers (critical for stroke care)
- **🚑 Emergency Rooms Only**: Checkbox - Filter hospitals with 24/7 emergency departments
- **🕐 24-Hour Service**: Checkbox - Show only hospitals operating round-the-clock
- **🩺 Specialty Filter**: Dropdown - Filter by specific medical specialties (Neurology, Cardiology, Emergency Medicine, etc.)

#### Sorting Options:
- **Distance** (nearest first)
- **Rating** (highest first)
- **Wait Time** (shortest first)
- **Available Beds** (most available first)
- **Stroke Centers First** (prioritize specialized centers)

**How to use:**
1. Click the "Filters" button to expand the panel
2. Adjust sliders and checkboxes to your needs
3. Select a sorting preference from the dropdown
4. The hospital list and map markers update automatically
5. See the filter count badge on the button (e.g., "3 active filters")

---

### 🏥 **Hospital Action Buttons** (On each hospital card)

Each hospital card now has comprehensive action buttons at the bottom:

#### 1. ❤️ **Favorite Toggle**
- **What it does**: Save this hospital to your favorites for quick access
- **Icon**: Heart outline (empty) → Filled heart (red) when favorited
- **Click to**: Toggle favorite status
- **Notification**: Toast message confirms "Added to favorites" or "Removed from favorites"
- **Persists**: Saved in local storage, available offline

#### 2. 📞 **Call Hospital**
- **What it does**: Directly call the hospital's phone number
- **Icon**: Phone
- **Click to**: Initiate phone call (tel: link)
- **Works**: On mobile and desktop (if calling app available)

#### 3. 🗺️ **Get Directions** (Dropdown Menu)
- **What it does**: Open Google Maps with directions from your location
- **Icon**: Navigation pin
- **Transport Modes** (click dropdown arrow):
  - 🚗 **Driving** - Car navigation
  - 🚶 **Walking** - Pedestrian route
  - 🚌 **Transit** - Public transportation
  - 🚴 **Bicycling** - Bike route
- **Default**: Uses your last selected transport mode (saved in preferences)
- **Opens**: Google Maps in new tab

#### 4. 📤 **Share Hospital Info** (Dropdown Menu)
- **What it does**: Share hospital details with family, friends, or caregivers
- **Icon**: Share symbol
- **Share Methods** (click dropdown arrow):
  - 📱 **Native Share** - Use device's built-in share sheet (mobile)
  - 💬 **WhatsApp** - Send via WhatsApp
  - 📧 **Email** - Send via email client
  - 📋 **SMS** - Send via text message
  - 🔗 **Copy Link** - Copy shareable link to clipboard
- **Shared Info Includes**: Hospital name, address, phone, rating, distance, specialties, Google Maps link
- **Notification**: Confirms share method used

#### 5. 🌐 **Visit Website**
- **What it does**: Open the hospital's official website
- **Icon**: External link
- **Click to**: Open in new tab
- **Visibility**: Only shows if hospital has a website URL

#### 6. 🎥 **Start Telemedicine**
- **What it does**: Join a virtual consultation with hospital staff
- **Icon**: Video camera
- **Click to**: Open telemedicine portal in new tab
- **Visibility**: Only shows if hospital offers telemedicine services
- **Use Case**: Pre-screening, follow-up appointments, non-emergency consultations

---

## 🎤 **Voice Commands** (Floating Button - Bottom Right)

### 🔘 **Voice Command Button**
- **Location**: Fixed position, bottom-right corner of screen
- **Icon**: Microphone (🎤) when inactive, MicOff when active
- **Color**: Gray outline (inactive) → Red with pulse animation (active)
- **Size**: Large circular button (56x56px)

### **How to Use:**
1. **Click** the microphone button
2. **Allow** browser microphone access (if prompted)
3. **Wait** for the "Voice commands activated" message
4. **Speak** clearly one of the commands below
5. **Listen** for voice feedback confirming your command
6. **Click again** to stop listening

### **Available Voice Commands:**
| Say This | What Happens |
|----------|--------------|
| "find hospital" or "hospital nearby" | Navigate to Hospitals page |
| "emergency" or "stroke symptoms" | Navigate to Emergency FAST test |
| "scan face" or "start scan" | Navigate to Face Scan page |
| "check symptoms" or "symptom checker" | Navigate to Symptom checker |
| "my profile" or "show profile" | Navigate to Profile page |
| "analytics" or "show analytics" | Navigate to Analytics dashboard |
| "history" or "scan history" | Navigate to Scan History |
| "help" or "what can you do" | Speak available commands |
| "stop listening" or "disable voice" | Turn off voice commands |

### **Voice Feedback:**
- System speaks confirmations: "Navigating to hospitals page..."
- If command not recognized: "Command not recognized, say help for options"
- Continuous listening until you say "stop" or click button again

### **Requirements:**
- Modern browser (Chrome, Edge, Safari 14.1+)
- Microphone permission granted
- HTTPS connection (required for Web Speech API)

---

## 🚨 **Emergency Contacts Page** (/contacts)

### **How to Access:**
- Navigate to `/contacts` route
- Link from navigation menu or emergency page

### **Features:**

#### ➕ **Add New Contact**
1. Click "Add Contact" button (top right)
2. Fill in the form:
   - **Name**: Contact's full name
   - **Phone Number**: Format: +1 234 567 8900
   - **Relationship**: Select from dropdown (Family, Friend, Caregiver, Doctor, Other)
3. Click "Add Contact"
4. First contact is automatically set as **Primary** (⭐)

#### ✏️ **Edit Contact**
1. Click the **Edit** button (pencil icon) on any contact card
2. Update fields in the dialog
3. Click "Save Changes"

#### ⭐ **Set Primary Contact**
1. Click the **Star** button on any contact (except current primary)
2. This contact becomes your default emergency contact
3. Only one primary contact allowed at a time

#### 🗑️ **Delete Contact**
1. Click the **Trash** button (red icon)
2. Confirm deletion in the prompt
3. Contact is permanently removed

#### 📞 **Quick Call**
- Click the "Call" button on any contact card
- Instantly dials the contact's phone number

### **Primary Contact Benefits:**
- Used for emergency location sharing
- Notified automatically in high-risk situations
- Displayed prominently with ⭐ badge

---

## 💊 **Medications Page** (/medications)

### **How to Access:**
- Navigate to `/medications` route
- Link from profile or settings page

### **Features:**

#### ➕ **Add Medication**
1. Click "Add Medication" button
2. Fill in the form:
   - **Medication Name**: e.g., "Aspirin"
   - **Dosage**: e.g., "100mg"
   - **Frequency**: e.g., "Once daily", "Twice daily"
   - **Time**: Select time(s) for reminders (e.g., 09:00)
   - **Enable Reminders**: Checkbox (checked by default)
3. Click "Add Medication"

#### 🔔 **Medication Reminders**
- **When enabled**: Browser notifications at scheduled times
- **Notification includes**: Medication name, dosage, time
- **First-time setup**: Allow browser notifications when prompted
- **Toggle**: Click "Enable" or "Disable" button on each medication card

#### ✏️ **Edit Medication**
1. Click **Edit** button (pencil icon)
2. Update fields
3. Reminders are rescheduled automatically

#### 🗑️ **Delete Medication**
1. Click **Trash** button
2. Confirm deletion
3. All associated reminders are cancelled

#### 📊 **View Sections:**
- **Active Medications**: Current medications with green badges
- **Past Medications**: Ended medications (grayed out)

### **Reminder Features:**
- **Automatic Scheduling**: Set once, system handles recurring notifications
- **Skip/Snooze**: Options in browser notification
- **Persistent**: Reminders continue even after browser restart (if notifications permitted)

---

## 🏥 **FAST Test (Stroke Symptom Checker)** (/emergency)

### **What is FAST?**
FAST is a quick test to identify stroke symptoms:
- **F**ace drooping
- **A**rm weakness
- **S**peech difficulty
- **T**ime to call 911

### **How to Use:**
1. Navigate to Emergency page
2. Answer **3 questions** with Yes/No:
   - **Face**: Can you smile evenly on both sides?
   - **Arms**: Can you raise both arms equally?
   - **Speech**: Can you repeat a simple sentence clearly?
3. Click "Yes" or "No" for each
4. Get instant risk assessment

### **Results:**
#### 🚨 **EMERGENCY Level** (Any "No" answer):
- **Message**: "IMMEDIATE ACTION REQUIRED"
- **Actions**:
  - 🚑 **Call 911** button (direct dial)
  - 🏥 **View Nearest Hospitals** (prioritized stroke centers)
  - 🔄 **Retake Test**
- **Critical**: Time is brain tissue - act immediately

#### ✅ **MONITOR Level** (All "Yes" answers):
- **Message**: "No immediate symptoms detected"
- **Recommendation**: Continue monitoring, seek medical advice if concerned
- **Actions**:
  - 🏥 **View Hospitals** (for non-emergency consultation)
  - 🔄 **Retake Test**

### **Important Notes:**
- Test results are NOT a medical diagnosis
- When in doubt, always call 911
- Stroke symptoms can be subtle
- Time from symptom onset is critical

---

## 🔌 **Offline Mode**

### **How It Works:**
- **Automatic**: System detects when you go offline
- **Indicator**: Yellow "Offline Mode" badge appears on Hospitals page
- **Cached Data**: Last fetched hospitals remain available
- **Favorites**: Always accessible, even offline
- **Emergency Contacts**: Always accessible, even offline
- **Medications**: Always accessible, even offline

### **What Works Offline:**
✅ View previously loaded hospitals  
✅ Access favorites  
✅ Make phone calls  
✅ View emergency contacts  
✅ View medications  
✅ Take FAST test  

### **What Requires Internet:**
❌ Fetch new hospitals  
❌ Get real-time wait times  
❌ Update hospital status  
❌ Groq AI recommendations  
❌ Telemedicine sessions  
❌ Share via WhatsApp/Email (native share may work)

### **Cache Duration:**
- Hospital data cached for **1 hour**
- After expiration, system attempts to refresh when online
- Manual refresh available (reload page)

---

## 📊 **Smart Notifications**

### **Types of Notifications:**

#### 1. **Medication Reminders** 💊
- **Frequency**: Based on your medication schedule
- **Content**: "Time to take [Medication Name] - [Dosage]"
- **Action**: Click to mark as taken or snooze

#### 2. **Health Reminders** 🩺
- **Blood Pressure Check**: Daily at 8:00 AM
- **Water Reminder**: Every 2 hours
- **Exercise Reminder**: Daily at 6:00 PM
- **Appointment Reminders**: 1 hour before scheduled time

#### 3. **High-Risk Alerts** ⚠️
- **Trigger**: FAST test indicates emergency
- **Action**: Automatically notifies primary emergency contact with your location
- **Content**: "EMERGENCY: [Your Name] may be experiencing stroke symptoms. Location: [GPS]"

### **Setup:**
1. Allow browser notifications when prompted
2. Notifications work even when browser is closed (on supported platforms)
3. Manage in browser settings: Settings → Site Settings → Notifications

### **Disable:**
- Per-medication: Toggle reminder button
- All notifications: Revoke browser permission in site settings

---

## 🎛️ **User Preferences** (Auto-saved)

### **Stored Preferences:**
- ✅ **Favorite Hospitals**: Up to unlimited favorites
- ✅ **Transport Mode**: Last selected direction mode (driving/walking/transit/bicycling)
- ✅ **Emergency Contacts**: Priority contacts for alerts
- ✅ **Medications**: Full medication schedule
- ✅ **Medical History**: Allergies, conditions, blood type
- ✅ **Notification Settings**: Enabled/disabled state
- ✅ **Voice Commands**: Enabled/disabled state
- ✅ **Filter Preferences**: Last used hospital filters

### **Data Storage:**
- **Location**: Browser Local Storage
- **Privacy**: Never leaves your device (100% local)
- **Backup**: Manual export feature (coming soon)
- **Clear**: Clear browser data to reset

---

## 🛠️ **Troubleshooting**

### **Voice Commands Not Working:**
1. Check microphone permission in browser settings
2. Ensure HTTPS connection (required)
3. Try supported browser (Chrome, Edge, Safari 14.1+)
4. Check microphone isn't used by another app
5. Refresh page and try again

### **Notifications Not Showing:**
1. Check browser notification permission
2. Enable "Do Not Disturb" mode if on mobile
3. Check OS notification settings
4. Try rescheduling the reminder

### **Hospital Map Not Loading:**
1. Check internet connection
2. Allow location permission in browser
3. Refresh the page
4. Clear cache and try again

### **Favorites Not Saving:**
1. Check browser allows local storage
2. Ensure not in Incognito/Private mode
3. Check available storage space

---

## 📱 **Mobile vs Desktop Features**

| Feature | Mobile | Desktop |
|---------|--------|---------|
| Voice Commands | ✅ | ✅ |
| Share (Native) | ✅ | ❌ (uses fallback) |
| Phone Calls | ✅ (Direct) | ✅ (Via app) |
| Notifications | ✅ | ✅ |
| GPS Location | ✅ | ✅ (if available) |
| Offline Mode | ✅ | ✅ |
| Maps | ✅ (Touch) | ✅ (Click/Drag) |

---

## 🔐 **Privacy & Security**

### **Your Data:**
- ✅ **100% Local**: All data stored on your device only
- ✅ **No Account Required**: No sign-up, no cloud storage
- ✅ **No Tracking**: We don't track your activity
- ✅ **Secure**: HTTPS encryption for all API calls
- ✅ **Private**: Location never shared without explicit action

### **Third-Party Services:**
- **Groq API**: Used for AI hospital recommendations (no personal data sent)
- **OpenStreetMap**: Used for map tiles (anonymous)
- **Google Maps**: Used for directions (opens externally)

---

## 📞 **Emergency Procedures**

### **In a Stroke Emergency:**
1. ☎️ **CALL 911 IMMEDIATELY** - Don't wait!
2. Note the time symptoms started
3. Use FAST test to communicate symptoms to dispatcher
4. Stay calm and still
5. Do NOT drive yourself

### **Pre-Emergency Preparation:**
1. ✅ Add emergency contacts NOW
2. ✅ Update medication list
3. ✅ Add medical history (allergies, conditions)
4. ✅ Save nearest stroke centers as favorites
5. ✅ Enable notifications for reminders
6. ✅ Practice voice commands

---

## 🎓 **Tips for Best Experience**

### **First-Time Setup (5 minutes):**
1. 📍 Allow location access → More accurate hospital results
2. 🎤 Enable microphone → Voice commands work
3. 🔔 Allow notifications → Never miss medication reminders
4. ➕ Add 1-2 emergency contacts → Quick emergency communication
5. 💊 Add medications (if any) → Automated reminders
6. ❤️ Favorite 1-2 nearby hospitals → Quick access in emergency

### **Daily Use:**
- ✅ Keep app open for active notifications
- ✅ Update medications when prescriptions change
- ✅ Test voice commands occasionally to stay familiar
- ✅ Review emergency contacts quarterly

### **For Caregivers:**
- 👥 Share your emergency contacts with patient
- 📱 Add your number as patient's primary contact
- 🔔 Ensure patient enables notifications
- 📋 Maintain medication list together
- 🏥 Pre-select preferred hospitals with patient

---

## 🚀 **Advanced Features**

### **1. Multi-Modal Directions:**
- System remembers your preferred transport mode
- Switch between modes based on situation:
  - 🚗 **Driving**: Fastest in emergencies
  - 🚶 **Walking**: Short distances, no vehicle
  - 🚌 **Transit**: Urban areas, no car
  - 🚴 **Bicycling**: Eco-friendly, moderate distance

### **2. Smart Filtering:**
- Combine multiple filters for precise results
- Example: "Stroke Centers + ER + Rating 4+"
- Sort by relevance after filtering
- Reset filters easily with "Clear" button

### **3. Emergency Location Sharing:**
- Automatically shares your GPS coordinates with primary contact
- Includes hospital recommendations
- One-click activation in emergency situations

### **4. Medical Profile Integration:**
- Future feature: QR code with emergency info
- Scannable by EMTs and hospital staff
- Includes allergies, medications, emergency contacts

---

## 📚 **Glossary**

- **FAST Test**: Face-Arms-Speech-Time stroke identification method
- **Primary Stroke Center**: Hospital certified for specialized stroke care
- **Telemedicine**: Virtual medical consultation via video
- **Offline Mode**: App functionality without internet connection
- **Local Storage**: Data saved directly on your device
- **Voice Commands**: Hands-free control using speech recognition
- **Emergency Contact**: Designated person to notify in medical emergencies
- **Medication Reminder**: Automated alert for taking prescribed medicine

---

## 🆘 **Support & Feedback**

### **Need Help?**
- 📖 Review this guide
- 🔍 Search specific features above
- 🧪 Test features in low-stakes situations

### **Report Issues:**
- Browser console errors (F12 → Console)
- Steps to reproduce the problem
- Browser and OS version

---

## ✅ **Quick Reference - All Buttons**

| Button | Location | Icon | Action |
|--------|----------|------|--------|
| **Favorite** | Hospital card | ❤️ | Save/unsave hospital |
| **Call** | Hospital card | 📞 | Phone hospital |
| **Directions** | Hospital card | 🗺️ | Open Google Maps |
| **Share** | Hospital card | 📤 | Share hospital info |
| **Website** | Hospital card | 🌐 | Visit hospital site |
| **Telemedicine** | Hospital card | 🎥 | Start video call |
| **Voice Commands** | Bottom-right | 🎤 | Toggle voice control |
| **Add Contact** | Contacts page | ➕ | New emergency contact |
| **Edit Contact** | Contact card | ✏️ | Update contact info |
| **Set Primary** | Contact card | ⭐ | Make primary contact |
| **Delete Contact** | Contact card | 🗑️ | Remove contact |
| **Add Medication** | Medications page | ➕ | New medication |
| **Edit Medication** | Medication card | ✏️ | Update medication |
| **Toggle Reminder** | Medication card | 🔔 | Enable/disable alert |
| **Delete Medication** | Medication card | 🗑️ | Remove medication |
| **Filters** | Hospitals page | 🔍 | Show filter panel |
| **Call 911** | FAST test results | 🚑 | Emergency dial |
| **View Hospitals** | FAST test results | 🏥 | Find nearest |
| **Retake Test** | FAST test results | 🔄 | Restart FAST test |

---

**Last Updated**: Today  
**Version**: 2.0  
**Platform**: Web (Mobile & Desktop)

---

🎉 **You're all set!** Start by adding your emergency contacts and exploring the hospitals near you. Stay safe! 🏥
