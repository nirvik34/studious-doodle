"use client";

import { useState } from "react";
import { Hospital } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";

interface FilterOptions {
    minRating: number;
    maxDistance: number;
    onlyStrokeCenters: boolean;
    onlyEmergencyRooms: boolean;
    only24Hour: boolean;
    specialty?: string;
}

interface HospitalFiltersProps {
    hospitals: Hospital[];
    onFilterChange: (filtered: Hospital[]) => void;
    onSortChange: (sorted: Hospital[]) => void;
}

export default function HospitalFilters({ hospitals, onFilterChange, onSortChange }: HospitalFiltersProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [filters, setFilters] = useState<FilterOptions>({
        minRating: 0,
        maxDistance: 50,
        onlyStrokeCenters: false,
        onlyEmergencyRooms: false,
        only24Hour: false,
    });
    const [sortBy, setSortBy] = useState<string>("distance");

    const applyFilters = (newFilters: FilterOptions) => {
        let filtered = [...hospitals];

        // Apply rating filter
        if (newFilters.minRating > 0) {
            filtered = filtered.filter(h => (h.rating || 0) >= newFilters.minRating);
        }

        // Apply distance filter
        filtered = filtered.filter(h => h.distance <= newFilters.maxDistance);

        // Apply stroke center filter
        if (newFilters.onlyStrokeCenters) {
            filtered = filtered.filter(h => h.isPrimaryStrokeCenter);
        }

        // Apply emergency room filter
        if (newFilters.onlyEmergencyRooms) {
            filtered = filtered.filter(h => h.hasEmergencyRoom);
        }

        // Apply 24-hour filter
        if (newFilters.only24Hour) {
            filtered = filtered.filter(h => h.has24HourService);
        }

        // Apply specialty filter
        if (newFilters.specialty) {
            filtered = filtered.filter(h => 
                h.specialties?.some(s => s.toLowerCase().includes(newFilters.specialty!.toLowerCase()))
            );
        }

        onFilterChange(filtered);
    };

    const applySorting = (sortOption: string, hospitalsToSort: Hospital[]) => {
        let sorted = [...hospitalsToSort];

        switch (sortOption) {
            case "distance":
                sorted.sort((a, b) => a.distance - b.distance);
                break;
            case "rating":
                sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case "wait-time":
                sorted.sort((a, b) => (a.waitTime || 999) - (b.waitTime || 999));
                break;
            case "beds":
                sorted.sort((a, b) => (b.availableBeds || 0) - (a.availableBeds || 0));
                break;
            case "stroke-centers":
                sorted.sort((a, b) => {
                    if (a.isPrimaryStrokeCenter && !b.isPrimaryStrokeCenter) return -1;
                    if (!a.isPrimaryStrokeCenter && b.isPrimaryStrokeCenter) return 1;
                    return a.distance - b.distance;
                });
                break;
        }

        onSortChange(sorted);
    };

    const handleFilterChange = (key: keyof FilterOptions, value: any) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        applyFilters(newFilters);
    };

    const handleSortChange = (value: string) => {
        setSortBy(value);
        applySorting(value, hospitals);
    };

    const resetFilters = () => {
        const defaultFilters: FilterOptions = {
            minRating: 0,
            maxDistance: 50,
            onlyStrokeCenters: false,
            onlyEmergencyRooms: false,
            only24Hour: false,
        };
        setFilters(defaultFilters);
        applyFilters(defaultFilters);
    };

    const activeFilterCount = Object.values(filters).filter(v => 
        typeof v === 'boolean' ? v : v !== 0 && v !== 50
    ).length;

    return (
        <div className="space-y-4">
            {/* Controls Bar */}
            <div className="flex flex-wrap gap-4 items-center">
                <Button
                    variant="outline"
                    onClick={() => setIsOpen(!isOpen)}
                    className="gap-2"
                >
                    <Filter className="h-4 w-4" />
                    Filters
                    {activeFilterCount > 0 && (
                        <Badge variant="secondary" className="ml-2">
                            {activeFilterCount}
                        </Badge>
                    )}
                </Button>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Sort by:</span>
                    <Select value={sortBy} onValueChange={handleSortChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="distance">Distance</SelectItem>
                            <SelectItem value="rating">Rating</SelectItem>
                            <SelectItem value="wait-time">Wait Time</SelectItem>
                            <SelectItem value="beds">Available Beds</SelectItem>
                            <SelectItem value="stroke-centers">Stroke Centers First</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {activeFilterCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={resetFilters} className="gap-2">
                        <X className="h-4 w-4" />
                        Clear Filters
                    </Button>
                )}
            </div>

            {/* Filter Panel */}
            {isOpen && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Filter Hospitals</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Rating Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Minimum Rating: {filters.minRating > 0 ? filters.minRating : "Any"}
                            </label>
                            <Slider
                                value={[filters.minRating]}
                                onValueChange={([value]) => handleFilterChange("minRating", value)}
                                max={5}
                                step={0.5}
                                className="w-full"
                            />
                        </div>

                        {/* Distance Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Maximum Distance: {filters.maxDistance}km
                            </label>
                            <Slider
                                value={[filters.maxDistance]}
                                onValueChange={([value]) => handleFilterChange("maxDistance", value)}
                                max={50}
                                step={5}
                                className="w-full"
                            />
                        </div>

                        {/* Checkbox Filters */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="stroke-centers"
                                    checked={filters.onlyStrokeCenters}
                                    onChange={(e) => handleFilterChange("onlyStrokeCenters", e.target.checked)}
                                    className="rounded"
                                />
                                <label htmlFor="stroke-centers" className="text-sm cursor-pointer">
                                    Primary Stroke Centers Only
                                </label>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="emergency-rooms"
                                    checked={filters.onlyEmergencyRooms}
                                    onChange={(e) => handleFilterChange("onlyEmergencyRooms", e.target.checked)}
                                    className="rounded"
                                />
                                <label htmlFor="emergency-rooms" className="text-sm cursor-pointer">
                                    With Emergency Room
                                </label>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="24-hour"
                                    checked={filters.only24Hour}
                                    onChange={(e) => handleFilterChange("only24Hour", e.target.checked)}
                                    className="rounded"
                                />
                                <label htmlFor="24-hour" className="text-sm cursor-pointer">
                                    24/7 Service
                                </label>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
