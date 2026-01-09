# Hospital Map Feature with Groq API Integration

This document explains how to use the new hospital mapping feature powered by Leaflet.js and Groq API.

## Features Added

### 1. **Interactive Map with Leaflet.js**
- Real-time map display showing nearby hospitals
- Custom markers for hospitals (red) and user location (blue)
- Click on hospital markers to view details
- Zoom and pan capabilities

### 2. **Groq AI Integration**
- Intelligent hospital recommendations based on:
  - Distance from user
  - Stroke center certification
  - Estimated wait times
- Uses Groq's `llama-3.3-70b-versatile` model for analysis

### 3. **Geolocation**
- Automatically detects user's current location
- Calculates real-time distances to nearby hospitals
- Falls back to default location if permission denied

### 4. **Enhanced Hospital Cards**
- Click to highlight on map
- Direct call functionality
- Google Maps directions integration
- Visual indicators for primary stroke centers

## Setup Instructions

### 1. Install Dependencies (Already Done)
```bash
npm install leaflet react-leaflet groq-sdk
npm install -D @types/leaflet
```

### 2. Get Groq API Key
1. Visit [Groq Console](https://console.groq.com/keys)
2. Sign up or log in
3. Create a new API key
4. Copy your API key

### 3. Configure Environment Variables
Create a `.env.local` file in your project root:

```bash
NEXT_PUBLIC_GROQ_API_KEY=your_actual_groq_api_key_here
```

Replace `your_actual_groq_api_key_here` with your actual Groq API key.

### 4. Run the Development Server
```bash
npm run dev
```

### 5. Visit the Hospitals Page
Navigate to `http://localhost:3000/hospitals`

## How It Works

### Geolocation Flow
1. App requests user's location permission
2. If granted, uses actual coordinates
3. If denied, falls back to New York coordinates (40.7128, -74.0060)

### Hospital Discovery
1. Gets user's coordinates
2. Calls `api.hospitals.findNearestWithGroq()` with coordinates
3. Groq AI analyzes hospitals and provides recommendations
4. Calculates distances using Haversine formula
5. Sorts hospitals by:
   - Primary Stroke Centers first
   - Then by distance

### Map Interaction
- Blue marker: Your current location
- Red markers: Hospital locations
- Click markers for popup with details
- Click hospital cards to highlight on map

### Distance Calculation
Uses the Haversine formula to calculate great-circle distances between coordinates:
```
distance = 2 * R * arcsin(sqrt(sin²(Δlat/2) + cos(lat1) * cos(lat2) * sin²(Δlon/2)))
```
Where R = Earth's radius (6371 km)

## API Structure

### New API Methods

#### `api.hospitals.findNearest(lat, lng)`
- Basic hospital lookup with distance calculation
- No AI involvement
- Fallback method

#### `api.hospitals.findNearestWithGroq(lat, lng)`
- AI-powered hospital recommendations
- Uses Groq API for intelligent analysis
- Provides reasoning for prioritization
- Falls back to basic method on error

## Customization

### Adding More Hospitals
Edit `lib/api.ts` and add to `MOCK_HOSPITALS` array:
```typescript
{
    id: "5",
    name: "Your Hospital Name",
    address: "123 Hospital St, City",
    phone: "+1 555-0000",
    distance: 0, // Will be calculated
    isPrimaryStrokeCenter: true,
    coordinates: { lat: 40.7128, lng: -74.0060 },
    waitTime: 25,
}
```

### Changing Map Style
Edit the TileLayer URL in `app/hospitals/page.tsx`:
```typescript
<TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    // Try other styles:
    // CartoDB: https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png
    // Dark: https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png
/>
```

### Customizing Markers
Edit the `customIcon` or `userIcon` in `app/hospitals/page.tsx` to change marker appearance.

## Troubleshooting

### Map Not Showing
- Check browser console for errors
- Ensure Leaflet CSS is imported
- Verify dynamic imports are working

### Groq API Errors
- Verify API key in `.env.local`
- Check API key is valid at console.groq.com
- Ensure `dangerouslyAllowBrowser: true` is set (for client-side)

### Location Permission Denied
- App will fall back to default NYC location
- User can manually grant permission in browser settings
- Consider adding a manual location input option

### Hospitals Not Showing
- Check browser console for API errors
- Verify mock data in `lib/api.ts`
- Ensure coordinates are valid

## Future Enhancements

1. **Real Hospital Data**: Integrate with actual hospital APIs
2. **Real-time Availability**: Check emergency room capacity
3. **Route Optimization**: Multiple hospital route planning
4. **Offline Support**: Cache hospital data for offline access
5. **Push Notifications**: Alert nearby hospitals in emergency
6. **Telemedicine**: Video consultation before arrival

## Technologies Used

- **Leaflet.js**: Open-source JavaScript library for interactive maps
- **React-Leaflet**: React components for Leaflet maps
- **Groq API**: Fast AI inference for hospital recommendations
- **Next.js**: Server-side rendering and routing
- **TypeScript**: Type safety and better developer experience
- **Tailwind CSS**: Styling and responsive design

## License
MIT
