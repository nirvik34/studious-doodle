"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Activity, Apple, Moon, Droplet, Brain } from "lucide-react";

const HEALTH_TIPS = [
    {
        icon: Heart,
        title: "Monitor Blood Pressure",
        description: "Keep your blood pressure below 120/80 mmHg. Check it regularly.",
        color: "text-red-500"
    },
    {
        icon: Activity,
        title: "Stay Active",
        description: "Get at least 30 minutes of moderate exercise 5 days a week.",
        color: "text-green-500"
    },
    {
        icon: Apple,
        title: "Healthy Diet",
        description: "Eat plenty of fruits, vegetables, and whole grains. Limit salt and saturated fats.",
        color: "text-orange-500"
    },
    {
        icon: Moon,
        title: "Quality Sleep",
        description: "Aim for 7-9 hours of quality sleep each night.",
        color: "text-indigo-500"
    },
    {
        icon: Droplet,
        title: "Stay Hydrated",
        description: "Drink 8-10 glasses of water daily to maintain healthy blood flow.",
        color: "text-blue-500"
    },
    {
        icon: Brain,
        title: "Manage Stress",
        description: "Practice relaxation techniques like meditation or deep breathing.",
        color: "text-purple-500"
    }
];

export function HealthTips() {
    return (
        <Card className="border-2 border-green-100">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-green-700 text-base">
                    <Heart className="h-5 w-5" />
                    Stroke Prevention Tips
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {HEALTH_TIPS.map((tip, index) => {
                        const Icon = tip.icon;
                        return (
                            <div 
                                key={index} 
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <Icon className={`h-4 w-4 flex-shrink-0 ${tip.color}`} />
                                <div className="flex-1">
                                    <h4 className="font-medium text-sm">{tip.title}</h4>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-4 p-2 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-xs text-green-900 text-center">
                        💡 Scan weekly for early detection
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
