# 🚀 QUICK START - 2 Minute Setup

## For Users

### 1. First Visit
1. Open the app at your deployed URL
2. **Allow Location** when prompted → Get nearby hospitals
3. **Allow Microphone** when prompted → Enable voice commands  
4. **Allow Notifications** when prompted → Get medication reminders

### 2. Setup Emergency Contacts (1 minute)
1. Click the microphone button (bottom-right)
2. Say **"contacts"** OR navigate to `/contacts`
3. Click **"Add Contact"**
4. Fill in:
   - Name: Your emergency contact's name
   - Phone: Their phone number
   - Relationship: Select from dropdown
5. Click **"Add Contact"**
6. ✅ Done! This contact will be notified in emergencies

### 3. Try Voice Commands (30 seconds)
1. Click the 🎤 button (bottom-right) → Turns red and pulses
2. Say one of these:
   - **"find hospital"** → See nearby hospitals
   - **"emergency"** → Take stroke symptom test
   - **"help"** → Hear all available commands
3. ✅ Done! Voice commands are active

### 4. Find & Save Hospitals (30 seconds)
1. Say **"find hospital"** OR go to `/hospitals`
2. See hospitals on map and in list below
3. Click **❤️ (heart)** on any hospital → Saves as favorite
4. Click **📞 Call** → Instantly call the hospital
5. Click **🗺️ Directions** → Choose transport mode → Opens Google Maps
6. ✅ Done! You can find help quickly

---

## For Developers

### 1. Install & Run (1 minute)
```bash
# Install dependencies (if not done)
npm install

# Add Groq API key to .env.local
echo "NEXT_PUBLIC_GROQ_API_KEY=your_key_here" >> .env.local

# Run development server
npm run dev

# Open http://localhost:3000
```

### 2. Get Your Groq API Key
1. Visit [https://console.groq.com/keys](https://console.groq.com/keys)
2. Sign up or log in
3. Click "Create API Key"
4. Copy the key
5. Add to `.env.local`: `NEXT_PUBLIC_GROQ_API_KEY=your_key`
6. Restart dev server

### 3. Test Key Features (1 minute)
```bash
# Open in browser:
# 1. http://localhost:3000/hospitals
#    - Should load nearby hospitals
#    - Click "Filters" → Try filtering
#    - Click heart on a hospital → Should toggle favorite

# 2. http://localhost:3000/emergency
#    - Answer FAST test questions
#    - Should show emergency/monitor result

# 3. http://localhost:3000/contacts
#    - Click "Add Contact"
#    - Fill form and submit
#    - Should see contact card

# 4. Click microphone button (bottom-right)
#    - Allow microphone
#    - Say "find hospital"
#    - Should navigate to /hospitals
```

### 4. Build & Deploy (2 minutes)
```bash
# Build for production
npm run build

# Test production build
npm run start

# Deploy to Vercel
vercel

# Add environment variable in Vercel dashboard:
# NEXT_PUBLIC_GROQ_API_KEY=your_key
```

---

## 🎯 What You Get Out of the Box

### ✅ Hospital Finder
- 🗺️ Interactive Leaflet map with hospital markers
- 📍 Automatic location detection
- 🤖 Groq AI-powered hospital recommendations
- ⭐ Star ratings and reviews
- 🔍 Advanced filtering (rating, distance, stroke centers, etc.)
- ❤️ Favorite hospitals system
- 📞 One-click calling
- 🗺️ Multi-modal directions (driving, walking, transit, bicycling)
- 📤 Share via WhatsApp, SMS, Email, or copy link
- 🌐 Direct links to hospital websites
- 🎥 Telemedicine video consultation links

### ✅ Emergency Features
- 🚨 FAST test (Face-Arms-Speech-Time) for stroke symptoms
- 📞 One-click 911 dialing
- 🏥 Instant nearby stroke center lookup
- 📱 Emergency contact management
- 📍 Share location with emergency contacts

### ✅ Medication Management
- 💊 Add medications with dosage and schedule
- ⏰ Automatic reminders at scheduled times
- 🔔 Browser notifications
- ✏️ Edit/delete medications
- 📊 Track active vs. past medications

### ✅ Voice Commands
- 🎤 Hands-free navigation
- 9 pre-programmed commands
- Continuous listening mode
- Voice feedback
- "find hospital", "emergency", "help", etc.

### ✅ Offline Support
- 💾 Automatic caching of hospital data
- ❤️ Favorites work offline
- 📞 Emergency contacts accessible offline
- 💊 Medications list available offline
- 🟡 Visual offline mode indicator

### ✅ Smart Notifications
- 💊 Medication reminders
- 🩺 Blood pressure check reminders
- 💧 Water intake reminders
- 🏃 Exercise reminders
- 📅 Appointment reminders
- 🚨 High-risk emergency alerts

---

## 📁 Files You'll Use Most

### For Users:
- **USER_GUIDE.md** - Complete guide with all button explanations
- **INTEGRATION_COMPLETE.md** - Feature summary and checklist

### For Developers:
- **DEVELOPER_GUIDE.md** - Full API reference and integration guide
- **lib/storage.ts** - Local storage utilities (favorites, contacts, medications)
- **lib/api.ts** - Hospital data fetching (Groq AI + OpenStreetMap)
- **lib/notifications.ts** - Notification system
- **lib/voice-commands.ts** - Voice command system
- **lib/share.ts** - Sharing utilities
- **components/hospitals/HospitalFilters.tsx** - Filter component
- **components/hospitals/HospitalActions.tsx** - Action buttons component
- **components/shared/VoiceCommandButton.tsx** - Voice control button

---

## 🔧 Common Issues & Quick Fixes

### Issue: Voice commands not working
**Fix:** Check HTTPS is enabled (required by Web Speech API)

### Issue: Geolocation not working
**Fix:** Allow location permission in browser settings

### Issue: Notifications not showing
**Fix:** Allow notification permission in browser settings

### Issue: Hospitals not loading
**Fix:** Check Groq API key is set in `.env.local`

### Issue: Map not displaying
**Fix:** Check internet connection, leaflet CSS is imported

---

## 📖 Read Next

1. **USER_GUIDE.md** - Detailed user instructions
2. **DEVELOPER_GUIDE.md** - Integration details
3. **INTEGRATION_COMPLETE.md** - Complete feature list and checklist

---

## ✅ Checklist: Am I Ready?

### For Users:
- [ ] Location permission granted
- [ ] Microphone permission granted (for voice commands)
- [ ] Notification permission granted (for medication reminders)
- [ ] At least 1 emergency contact added
- [ ] Tried voice command "find hospital"
- [ ] Favorited at least 1 hospital

### For Developers:
- [ ] Dependencies installed (`npm install`)
- [ ] `.env.local` created with Groq API key
- [ ] Development server running (`npm run dev`)
- [ ] Tested hospitals page loads
- [ ] Tested voice commands work
- [ ] Tested filters work
- [ ] No TypeScript errors
- [ ] Production build successful (`npm run build`)

---

## 🎊 You're Ready!

**For Users:** Start by saying **"find hospital"** to the microphone button!

**For Developers:** Start by reading **DEVELOPER_GUIDE.md** for integration details!

---

**Need Help?**
- 📖 Read USER_GUIDE.md (users)
- 💻 Read DEVELOPER_GUIDE.md (developers)
- 🐛 Check browser console for errors (F12)
- 📝 Review INTEGRATION_COMPLETE.md for feature checklist

