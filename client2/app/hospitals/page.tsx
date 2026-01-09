"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { api } from "@/lib/api";
import { Hospital } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Navigation, Clock, Loader2, Star, ExternalLink, Activity, Building2, Shield, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import HospitalFilters from "@/components/hospitals/HospitalFilters";
import HospitalActions from "@/components/hospitals/HospitalActions";
import { hospitalCache, offlineMode } from "@/lib/storage";
import "leaflet/dist/leaflet.css";

// Dynamic import to avoid SSR issues with Leaflet
const MapContainer = dynamic(
    () => import("react-leaflet").then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import("react-leaflet").then((mod) => mod.TileLayer),
    { ssr: false }
);
const Marker = dynamic(
    () => import("react-leaflet").then((mod) => mod.Marker),
    { ssr: false }
);
const Popup = dynamic(
    () => import("react-leaflet").then((mod) => mod.Popup),
    { ssr: false }
);

export default function HospitalsPage() {
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);
    const [loading, setLoading] = useState(true);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

    useEffect(() => {
        // Skip cache - always fetch fresh hospitals from Groq
        console.log('🏥 Fetching fresh hospitals from Groq API...');

        // Get user's location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const userCoords = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setUserLocation(userCoords);

                    // Fetch hospitals using Groq API
                    try {
                        console.log(`📍 User location: ${userCoords.lat}, ${userCoords.lng}`);
                        const nearbyHospitals = await api.hospitals.findNearestWithGroq(
                            userCoords.lat,
                            userCoords.lng
                        );
                        console.log(`✅ Received ${nearbyHospitals.length} hospitals:`, nearbyHospitals);
                        setHospitals(nearbyHospitals);
                        setFilteredHospitals(nearbyHospitals);
                    } catch (error) {
                        console.error("Error fetching hospitals:", error);
                        // Fallback to mock data
                        const fallbackHospitals = await api.hospitals.findNearest(
                            userCoords.lat,
                            userCoords.lng
                        );
                        setHospitals(fallbackHospitals);
                        setFilteredHospitals(fallbackHospitals);
                    } finally {
                        setLoading(false);
                    }
                },
                (error) => {
                    console.error("Error getting location:", error);
                    // Fallback to default location (New York)
                    const defaultLocation = { lat: 40.7128, lng: -74.0060 };
                    setUserLocation(defaultLocation);
                    console.log('📍 Using default location (New York)');
                    api.hospitals.findNearestWithGroq(defaultLocation.lat, defaultLocation.lng)
                        .then((h) => {
                            console.log(`✅ Received ${h.length} hospitals for default location`);
                            setHospitals(h);
                            setFilteredHospitals(h);
                        })
                        .catch((err) => {
                            console.error('❌ Groq failed, using mock data:', err);
                            return api.hospitals.findNearest(defaultLocation.lat, defaultLocation.lng);
                        })
                        .then((h) => {
                            if (h) {
                                setHospitals(h);
                                setFilteredHospitals(h);
                            }
                        })
                        .finally(() => setLoading(false));
                }
            );
        } else {
            // Geolocation not supported
            console.log('⚠️ Geolocation not supported, using default location');
            const defaultLocation = { lat: 40.7128, lng: -74.0060 };
            setUserLocation(defaultLocation);
            api.hospitals.findNearestWithGroq(defaultLocation.lat, defaultLocation.lng)
                .then((h) => {
                    console.log(`✅ Received ${h.length} hospitals`);
                    setHospitals(h);
                    setFilteredHospitals(h);
                })
                .catch((err) => {
                    console.error('❌ Error:', err);
                    return api.hospitals.findNearest(defaultLocation.lat, defaultLocation.lng);
                })
                .then((h) => {
                    if (h) {
                        setHospitals(h);
                        setFilteredHospitals(h);
                    }
                })
                .finally(() => setLoading(false));
        }
    }, []);

    const customIcon = useMemo(() => {
        if (typeof window === "undefined") return null;
        const L = require("leaflet");
        return L.divIcon({
            html: `<div style="background-color: #ef4444; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2">
                    <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
                    <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z"></path>
                </svg>
            </div>`,
            className: "custom-hospital-marker",
            iconSize: [30, 30],
            iconAnchor: [15, 30],
        });
    }, []);

    const userIcon = useMemo(() => {
        if (typeof window === "undefined") return null;
        const L = require("leaflet");
        return L.divIcon({
            html: `<div style="background-color: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
            className: "custom-user-marker",
            iconSize: [20, 20],
            iconAnchor: [10, 10],
        });
    }, []);

    const handleRefresh = () => {
        // Refresh hospital list after favorite toggle
        setFilteredHospitals([...filteredHospitals]);
    };

    if (loading || !userLocation) {
        return (
            <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
                <div className="text-center space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
                    <p className="text-lg text-muted-foreground">Locating nearby stroke centers...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-8 space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">Nearby Stroke Centers</h1>
                    <p className="text-muted-foreground">
                        Primary Stroke Centers prioritized. In an emergency, call 911 immediately.
                    </p>
                </div>
                <div className="flex gap-2">
                    {offlineMode.isEnabled() && (
                        <Badge variant="outline" className="bg-yellow-50">
                            Offline Mode
                        </Badge>
                    )}
                    <Badge variant="secondary">
                        {filteredHospitals.length} hospitals
                    </Badge>
                </div>
            </div>

            {/* Hospital Filters */}
            <HospitalFilters
                hospitals={hospitals}
                onFilterChange={setFilteredHospitals}
                onSortChange={setFilteredHospitals}
            />

            {/* Map Section */}
            <Card className="overflow-hidden">
                <div className="h-[500px] w-full">
                    <MapContainer
                        center={[userLocation.lat, userLocation.lng]}
                        zoom={13}
                        scrollWheelZoom={true}
                        style={{ height: "100%", width: "100%" }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        
                        {/* User Location Marker */}
                        {userIcon && (
                            <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                                <Popup>
                                    <div className="font-semibold">Your Location</div>
                                </Popup>
                            </Marker>
                        )}

                        {/* Hospital Markers */}
                        {filteredHospitals.map((hospital) => (
                            customIcon && (
                                <Marker
                                    key={hospital.id}
                                    position={[hospital.coordinates.lat, hospital.coordinates.lng]}
                                    icon={customIcon}
                                    eventHandlers={{
                                        click: () => setSelectedHospital(hospital),
                                    }}
                                >
                                    <Popup>
                                        <div className="space-y-2">
                                            <div className="font-bold">{hospital.name}</div>
                                            <div className="text-sm text-gray-600">{hospital.address}</div>
                                            <div className="text-sm">
                                                <strong>Distance:</strong> {hospital.distance} km
                                            </div>
                                            {hospital.isPrimaryStrokeCenter && (
                                                <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                    Primary Stroke Center
                                                </div>
                                            )}
                                        </div>
                                    </Popup>
                                </Marker>
                            )
                        ))}
                    </MapContainer>
                </div>
            </Card>

            {/* Hospital Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredHospitals.map((hospital) => (
                    <Card
                        key={hospital.id}
                        className={`flex flex-col transition-all cursor-pointer ${
                            selectedHospital?.id === hospital.id
                                ? "ring-2 ring-blue-500 shadow-lg"
                                : "hover:shadow-md"
                        }`}
                        onClick={() => setSelectedHospital(hospital)}
                    >
                        <CardHeader>
                            <div className="flex justify-between items-start gap-2">
                                <CardTitle className="text-lg">{hospital.name}</CardTitle>
                                {hospital.isPrimaryStrokeCenter && (
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                                        Primary Center
                                    </Badge>
                                )}
                            </div>
                            
                            {/* Star Rating */}
                            {hospital.rating && (
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`h-4 w-4 ${
                                                    star <= Math.round(hospital.rating!)
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "text-gray-300"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm font-semibold">{hospital.rating.toFixed(1)}</span>
                                    {hospital.reviewCount && (
                                        <span className="text-sm text-muted-foreground">
                                            ({hospital.reviewCount.toLocaleString()} reviews)
                                        </span>
                                    )}
                                </div>
                            )}
                        </CardHeader>
                        <CardContent className="flex-1 space-y-4">
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <div className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                                    <span>{hospital.address}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Navigation className="h-4 w-4 shrink-0" />
                                    <span>{hospital.distance} km away</span>
                                </div>
                                {hospital.waitTime && (
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 shrink-0" />
                                        <span>~{hospital.waitTime} min wait time</span>
                                    </div>
                                )}
                                {hospital.beds && (
                                    <div className="flex items-center gap-2">
                                        <Building2 className="h-4 w-4 shrink-0" />
                                        <span>{hospital.beds} beds</span>
                                    </div>
                                )}
                            </div>

                            {/* Features */}
                            {(hospital.hasEmergencyRoom || hospital.has24HourService || hospital.acceptsInsurance) && (
                                <div className="flex flex-wrap gap-2">
                                    {hospital.hasEmergencyRoom && (
                                        <Badge variant="outline" className="gap-1 text-xs">
                                            <Activity className="h-3 w-3" />
                                            Emergency Room
                                        </Badge>
                                    )}
                                    {hospital.has24HourService && (
                                        <Badge variant="outline" className="gap-1 text-xs">
                                            <Clock className="h-3 w-3" />
                                            24/7
                                        </Badge>
                                    )}
                                    {hospital.acceptsInsurance && (
                                        <Badge variant="outline" className="gap-1 text-xs">
                                            <Shield className="h-3 w-3" />
                                            Insurance
                                        </Badge>
                                    )}
                                </div>
                            )}

                            {/* Specialties */}
                            {hospital.specialties && hospital.specialties.length > 0 && (
                                <div className="pt-2 border-t">
                                    <p className="text-xs font-semibold text-muted-foreground mb-1">Specialties:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {hospital.specialties.slice(0, 3).map((specialty, idx) => (
                                            <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                {specialty}
                                            </span>
                                        ))}
                                        {hospital.specialties.length > 3 && (
                                            <span className="text-xs text-muted-foreground px-2 py-1">
                                                +{hospital.specialties.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Hospital Action Buttons */}
                            <div className="mt-auto pt-4">
                                <HospitalActions 
                                    hospital={hospital} 
                                    onFavoriteToggle={handleRefresh}
                                />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
