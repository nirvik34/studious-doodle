"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Phone, Navigation, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface FASTTestResult {
    faceAsymmetry: boolean | null;
    armWeakness: boolean | null;
    speechDifficulty: boolean | null;
    timeStarted: Date;
}

export default function StrokeSymptomsChecker() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [results, setResults] = useState<FASTTestResult>({
        faceAsymmetry: null,
        armWeakness: null,
        speechDifficulty: null,
        timeStarted: new Date(),
    });

    const questions = [
        {
            title: "F - Face Drooping",
            question: "When you smile, does one side of your face droop or feel numb?",
            description: "Ask the person to smile. Check if one side of the face droops.",
            key: "faceAsymmetry" as keyof FASTTestResult,
        },
        {
            title: "A - Arm Weakness",
            question: "When you raise both arms, does one arm drift downward?",
            description: "Ask the person to raise both arms. Check if one arm drifts down.",
            key: "armWeakness" as keyof FASTTestResult,
        },
        {
            title: "S - Speech Difficulty",
            question: "Is your speech slurred or are you having trouble speaking?",
            description: 'Ask the person to repeat: "The sky is blue." Check for slurred or strange speech.',
            key: "speechDifficulty" as keyof FASTTestResult,
        },
    ];

    const handleAnswer = (answer: boolean) => {
        const key = questions[step].key;
        setResults({ ...results, [key]: answer });
        
        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            // Test complete
            setStep(step + 1);
        }
    };

    const calculateRisk = () => {
        const symptoms = [results.faceAsymmetry, results.armWeakness, results.speechDifficulty];
        const positiveSymptoms = symptoms.filter(s => s === true).length;
        
        if (positiveSymptoms >= 1) {
            return {
                level: 'EMERGENCY' as const,
                message: 'IMMEDIATE ACTION REQUIRED',
                description: 'You are showing signs of a possible stroke. Call 911 immediately!',
                color: 'bg-red-600',
                action: 'CALL 911 NOW',
            };
        } else {
            return {
                level: 'MONITOR' as const,
                message: 'No immediate stroke signs detected',
                description: 'While you don\'t show immediate stroke signs, monitor your condition and consult a doctor if symptoms appear.',
                color: 'bg-green-600',
                action: 'Find Nearby Hospital',
            };
        }
    };

    const reset = () => {
        setStep(0);
        setResults({
            faceAsymmetry: null,
            armWeakness: null,
            speechDifficulty: null,
            timeStarted: new Date(),
        });
    };

    if (step >= questions.length) {
        const risk = calculateRisk();
        
        return (
            <div className="container max-w-2xl py-8">
                <Card className={`border-4 ${risk.level === 'EMERGENCY' ? 'border-red-500' : 'border-green-500'}`}>
                    <CardHeader>
                        <div className="flex items-center justify-center mb-4">
                            {risk.level === 'EMERGENCY' ? (
                                <AlertCircle className="h-20 w-20 text-red-600 animate-pulse" />
                            ) : (
                                <CheckCircle className="h-20 w-20 text-green-600" />
                            )}
                        </div>
                        <CardTitle className="text-center text-2xl">
                            <Badge variant={risk.level === 'EMERGENCY' ? 'destructive' : 'default'} className="text-lg px-6 py-2">
                                {risk.message}
                            </Badge>
                        </CardTitle>
                        <CardDescription className="text-center text-lg mt-4">
                            {risk.description}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Test Results Summary */}
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                            <h3 className="font-semibold mb-3">FAST Test Results:</h3>
                            {questions.map((q, idx) => {
                                const result = results[q.key];
                                return (
                                    <div key={idx} className="flex items-center justify-between">
                                        <span className="text-sm">{q.title}</span>
                                        {result === true ? (
                                            <XCircle className="h-5 w-5 text-red-600" />
                                        ) : (
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Important Note */}
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                            <p className="text-sm font-semibold text-yellow-800">
                                <strong>T - Time:</strong> Time is critical! If you observe any of these signs, call 911 immediately. 
                                Note the time symptoms started.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            {risk.level === 'EMERGENCY' ? (
                                <>
                                    <Button
                                        size="lg"
                                        className="w-full bg-red-600 hover:bg-red-700 text-white gap-2 text-lg h-14"
                                        onClick={() => window.location.href = 'tel:911'}
                                    >
                                        <Phone className="h-6 w-6" />
                                        CALL 911 IMMEDIATELY
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="w-full gap-2"
                                        onClick={() => router.push('/hospitals')}
                                    >
                                        <Navigation className="h-5 w-5" />
                                        View Nearby Hospitals
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    size="lg"
                                    className="w-full gap-2"
                                    onClick={() => router.push('/hospitals')}
                                >
                                    <Navigation className="h-5 w-5" />
                                    {risk.action}
                                </Button>
                            )}
                            <Button
                                size="lg"
                                variant="ghost"
                                className="w-full"
                                onClick={reset}
                            >
                                Take Test Again
                            </Button>
                        </div>

                        {/* Stroke Warning Signs */}
                        <div className="text-xs text-gray-600 space-y-2 pt-4 border-t">
                            <p className="font-semibold">Other stroke warning signs include:</p>
                            <ul className="list-disc list-inside space-y-1 text-xs">
                                <li>Sudden numbness or weakness</li>
                                <li>Sudden confusion or trouble understanding</li>
                                <li>Sudden trouble seeing in one or both eyes</li>
                                <li>Sudden trouble walking or loss of balance</li>
                                <li>Sudden severe headache with no known cause</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const currentQuestion = questions[step];

    return (
        <div className="container max-w-2xl py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">FAST Stroke Test</CardTitle>
                    <CardDescription>
                        Answer these questions to check for stroke symptoms. This is not a substitute for medical advice.
                    </CardDescription>
                    <div className="flex gap-2 mt-4">
                        {questions.map((_, idx) => (
                            <div
                                key={idx}
                                className={`flex-1 h-2 rounded ${
                                    idx < step ? 'bg-blue-600' : idx === step ? 'bg-blue-400' : 'bg-gray-200'
                                }`}
                            />
                        ))}
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <Badge variant="outline" className="text-sm px-3 py-1">
                            Step {step + 1} of {questions.length}
                        </Badge>
                        <h2 className="text-xl font-bold">{currentQuestion.title}</h2>
                        <p className="text-lg">{currentQuestion.question}</p>
                        <p className="text-sm text-muted-foreground italic">{currentQuestion.description}</p>
                    </div>

                    {/* Visual Guide */}
                    <div className="bg-blue-50 rounded-lg p-4 text-sm">
                        <p className="font-semibold mb-2">💡 How to check:</p>
                        {step === 0 && <p>Look in a mirror and smile widely. Both sides of your face should move equally.</p>}
                        {step === 1 && <p>Raise both arms straight out in front of you with palms up. Hold for 10 seconds. Both arms should stay level.</p>}
                        {step === 2 && <p>Try to speak clearly. Say "The sky is blue" or another simple sentence. Your speech should be clear and easy to understand.</p>}
                    </div>

                    <div className="flex gap-4">
                        <Button
                            size="lg"
                            variant="outline"
                            className="flex-1 h-20 text-lg"
                            onClick={() => handleAnswer(false)}
                        >
                            <CheckCircle className="h-6 w-6 mr-2" />
                            No / Normal
                        </Button>
                        <Button
                            size="lg"
                            variant="destructive"
                            className="flex-1 h-20 text-lg"
                            onClick={() => handleAnswer(true)}
                        >
                            <XCircle className="h-6 w-6 mr-2" />
                            Yes / Abnormal
                        </Button>
                    </div>

                    {/* Emergency Button */}
                    <Button
                        variant="ghost"
                        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => window.location.href = 'tel:911'}
                    >
                        <Phone className="h-4 w-4 mr-2" />
                        Skip Test - Call 911 Now
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
