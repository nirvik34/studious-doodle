"use client";

import { useState } from "react";
import { Hospital } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { 
    Heart, 
    Share2, 
    Phone, 
    Navigation, 
    ExternalLink, 
    Copy, 
    MessageSquare,
    Mail,
    Video,
    Car,
    Bike,
    Train,
    Footprints
} from "lucide-react";
import { favorites, preferences } from "@/lib/storage";
import { shareHospital } from "@/lib/share";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HospitalActionsProps {
    hospital: Hospital;
    onFavoriteToggle?: () => void;
}

export default function HospitalActions({ hospital, onFavoriteToggle }: HospitalActionsProps) {
    const [isFavorite, setIsFavorite] = useState(favorites.isFavorite(hospital.id));
    const [transportMode, setTransportMode] = useState(preferences.getTransportMode());

    const handleFavoriteToggle = () => {
        const newState = favorites.toggle(hospital.id);
        setIsFavorite(newState);
        toast.success(newState ? "Added to favorites" : "Removed from favorites");
        onFavoriteToggle?.();
    };

    const handleCall = () => {
        window.location.href = `tel:${hospital.phone}`;
    };

    const handleDirections = (mode?: string) => {
        const modeParam = mode || transportMode;
        let url = `https://www.google.com/maps/dir/?api=1&destination=${hospital.coordinates.lat},${hospital.coordinates.lng}`;
        
        if (modeParam === 'walking') url += '&travelmode=walking';
        else if (modeParam === 'transit') url += '&travelmode=transit';
        else if (modeParam === 'bicycling') url += '&travelmode=bicycling';
        else url += '&travelmode=driving';
        
        window.open(url, '_blank');
    };

    const handleWebsite = () => {
        if (hospital.website) {
            window.open(hospital.website, '_blank');
        }
    };

    const handleShare = async (method: 'native' | 'whatsapp' | 'sms' | 'email' | 'copy') => {
        try {
            switch (method) {
                case 'native':
                    const shared = await shareHospital.native(hospital);
                    if (shared) toast.success("Shared successfully");
                    break;
                case 'whatsapp':
                    shareHospital.whatsapp(hospital);
                    break;
                case 'sms':
                    shareHospital.sms(hospital);
                    break;
                case 'email':
                    shareHospital.email(hospital);
                    break;
                case 'copy':
                    const copied = await shareHospital.copyLink(hospital);
                    if (copied) toast.success("Copied to clipboard");
                    break;
            }
        } catch (error) {
            toast.error("Failed to share");
        }
    };

    const handleTelemedicine = () => {
        if (hospital.telemedicineUrl) {
            window.open(hospital.telemedicineUrl, '_blank');
        } else {
            toast.info("Telemedicine not available for this hospital");
        }
    };

    return (
        <div className="flex flex-wrap gap-2">
            {/* Favorite Button */}
            <Button
                variant="outline"
                size="sm"
                onClick={handleFavoriteToggle}
                className={isFavorite ? "text-red-600 border-red-600" : ""}
            >
                <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
            </Button>

            {/* Call Button */}
            <Button
                variant="outline"
                size="sm"
                onClick={handleCall}
                className="gap-2"
            >
                <Phone className="h-4 w-4" />
                Call
            </Button>

            {/* Directions Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="sm" className="gap-2">
                        <Navigation className="h-4 w-4" />
                        Directions
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Choose Transport Mode</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleDirections('driving')}>
                        <Car className="h-4 w-4 mr-2" />
                        Driving
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDirections('transit')}>
                        <Train className="h-4 w-4 mr-2" />
                        Public Transit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDirections('walking')}>
                        <Footprints className="h-4 w-4 mr-2" />
                        Walking
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDirections('bicycling')}>
                        <Bike className="h-4 w-4 mr-2" />
                        Bicycling
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Share Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Share2 className="h-4 w-4" />
                        Share
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Share Hospital</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleShare('whatsapp')}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        WhatsApp
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare('sms')}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        SMS
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare('email')}>
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare('copy')}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Link
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Website Button */}
            {hospital.website && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleWebsite}
                    className="gap-2"
                >
                    <ExternalLink className="h-4 w-4" />
                    Website
                </Button>
            )}

            {/* Telemedicine Button */}
            {hospital.telemedicineUrl && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTelemedicine}
                    className="gap-2 text-blue-600 border-blue-600"
                >
                    <Video className="h-4 w-4" />
                    Video Consult
                </Button>
            )}
        </div>
    );
}
