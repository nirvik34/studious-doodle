"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, CheckCircle, Phone } from "lucide-react";

const STROKE_SYMPTOMS = [
    { id: "face", label: "Face drooping on one side", severity: "critical" },
    { id: "arm", label: "Arm weakness or numbness", severity: "critical" },
    { id: "speech", label: "Speech difficulty or slurred words", severity: "critical" },
    { id: "vision", label: "Sudden vision problems", severity: "high" },
    { id: "headache", label: "Severe headache with no cause", severity: "high" },
    { id: "dizziness", label: "Sudden dizziness or loss of balance", severity: "high" },
    { id: "confusion", label: "Sudden confusion or trouble understanding", severity: "medium" },
    { id: "numbness", label: "Sudden numbness or tingling", severity: "medium" },
];

export function StrokeSymptomChecker() {
    const [checkedSymptoms, setCheckedSymptoms] = useState<string[]>([]);
    const [showResult, setShowResult] = useState(false);

    const handleSymptomToggle = (symptomId: string) => {
        setCheckedSymptoms(prev => 
            prev.includes(symptomId) 
                ? prev.filter(id => id !== symptomId)
                : [...prev, symptomId]
        );
    };

    const criticalSymptoms = checkedSymptoms.filter(id => 
        STROKE_SYMPTOMS.find(s => s.id === id)?.severity === "critical"
    );

    const checkSymptoms = () => {
        setShowResult(true);
    };

    const callEmergency = () => {
        window.location.href = "tel:911";
    };

    return (
        <Card className="border-2 border-red-100">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="h-5 w-5" />
                    Stroke Symptom Checker
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                    Check any symptoms you're experiencing right now
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-3">
                    {STROKE_SYMPTOMS.map(symptom => (
                        <div key={symptom.id} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50">
                            <Checkbox
                                id={symptom.id}
                                checked={checkedSymptoms.includes(symptom.id)}
                                onCheckedChange={() => handleSymptomToggle(symptom.id)}
                            />
                            <label
                                htmlFor={symptom.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                            >
                                {symptom.label}
                            </label>
                        </div>
                    ))}
                </div>

                <Button 
                    onClick={checkSymptoms} 
                    className="w-full"
                    variant="outline"
                    disabled={checkedSymptoms.length === 0}
                >
                    Check Symptoms
                </Button>

                {showResult && (
                    <div className={`p-4 rounded-lg border-2 ${
                        criticalSymptoms.length > 0 
                            ? 'bg-red-50 border-red-300' 
                            : checkedSymptoms.length > 0
                            ? 'bg-yellow-50 border-yellow-300'
                            : 'bg-green-50 border-green-300'
                    }`}>
                        {criticalSymptoms.length > 0 ? (
                            <>
                                <div className="flex items-center gap-2 text-red-700 font-bold mb-3">
                                    <AlertTriangle className="h-6 w-6" />
                                    EMERGENCY - CALL 911 NOW
                                </div>
                                <p className="text-sm text-red-900 mb-4">
                                    You have {criticalSymptoms.length} critical stroke symptom(s). 
                                    This is a medical emergency. Call 911 immediately.
                                </p>
                                <Button 
                                    onClick={callEmergency}
                                    className="w-full bg-red-600 hover:bg-red-700"
                                    size="lg"
                                >
                                    <Phone className="h-5 w-5 mr-2" />
                                    Call 911 Now
                                </Button>
                            </>
                        ) : checkedSymptoms.length > 0 ? (
                            <>
                                <div className="flex items-center gap-2 text-yellow-700 font-semibold mb-2">
                                    <AlertTriangle className="h-5 w-5" />
                                    Seek Medical Attention
                                </div>
                                <p className="text-sm text-yellow-900">
                                    While not immediately critical, these symptoms should be evaluated 
                                    by a healthcare professional soon. Contact your doctor.
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-2 text-green-700 font-semibold mb-2">
                                    <CheckCircle className="h-5 w-5" />
                                    No Symptoms Checked
                                </div>
                                <p className="text-sm text-green-900">
                                    No symptoms selected. Remember: if you experience sudden symptoms, 
                                    seek help immediately.
                                </p>
                            </>
                        )}
                    </div>
                )}

                <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground text-center">
                        <strong>Remember FAST:</strong> Face drooping, Arm weakness, 
                        Speech difficulty, Time to call 911
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
