"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import { Loader2, Camera, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ScanPage() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [countdown, setCountdown] = useState(7);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const router = useRouter();

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setIsScanning(true);
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Could not access camera. Please allow camera permissions.");
        }
    };

    const handleScanComplete = useCallback(async () => {
        setIsScanning(false);
        setIsAnalyzing(true);

        try {
            // Capture frame from video
            if (!videoRef.current) {
                throw new Error("Video reference not available");
            }

            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
                throw new Error("Could not get canvas context");
            }

            // Draw the video frame to canvas (flip horizontally back to normal)
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            
            // Convert to base64
            const imageData = canvas.toDataURL('image/jpeg', 0.8);

            // Stop camera
            if (videoRef.current?.srcObject) {
                const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
                tracks.forEach(track => track.stop());
            }

            // Send to model API and get result
            const scanResult = await api.scan.submit(imageData);
            
            // Save to MongoDB
            try {
                await fetch('/api/scans', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(scanResult),
                });
            } catch (dbError) {
                console.warn('Failed to save to MongoDB:', dbError);
            }
            
            // Save result to localStorage as backup
            localStorage.setItem('latestScanResult', JSON.stringify(scanResult));
            
            // Also save to scan history in localStorage
            const history = JSON.parse(localStorage.getItem('scanHistory') || '[]');
            history.unshift(scanResult); // Add to beginning
            localStorage.setItem('scanHistory', JSON.stringify(history.slice(0, 10))); // Keep last 10
            
            router.push("/results");
        } catch (error) {
            console.error("Analysis failed:", error);
            alert("Analysis failed. Please try again.");
            setIsAnalyzing(false);
            
            // Restart camera
            setIsScanning(false);
            setCountdown(7);
        }
    }, [router]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isScanning && countdown > 0) {
            interval = setInterval(() => {
                setCountdown((c) => c - 1);
            }, 1000);
        } else if (countdown === 0 && isScanning) {
            handleScanComplete();
        }
        return () => clearInterval(interval);
    }, [isScanning, countdown, handleScanComplete]);

    return (
        <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-8">
            <div className="w-full max-w-2xl space-y-8 text-center">
                <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Facial Asymmetry Scan
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        AI-powered facial analysis for stroke risk assessment
                    </p>
                </motion.div>

                <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border-4 border-blue-900/20">
                    {!isScanning && !isAnalyzing && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/90 z-10">
                            <Button size="lg" onClick={startCamera} className="gap-2 text-lg h-16 px-8">
                                <Camera className="h-6 w-6" />
                                Enable Camera & Start
                            </Button>
                        </div>
                    )}

                    {isAnalyzing && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-900/90 z-20 text-white">
                            <Loader2 className="h-16 w-16 animate-spin mb-4" />
                            <h2 className="text-2xl font-bold">Analyzing Facial Features...</h2>
                            <p className="text-blue-200">Detecting asymmetry and micro-expressions</p>
                        </div>
                    )}

                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover transform scale-x-[-1]"
                    />

                    {isScanning && (
                        <>
                            {/* Face Overlay SVG */}
                            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-50">
                                <div className="w-64 h-64 border-4 border-blue-500/7 rounded-[40%] animate-pulse" />
                            </div>

                            {/* Countdown */}
                            <div className="absolute top-4 right-4 bg-black/50 text-white px-4 py-2 rounded-full font-mono text-xl backdrop-blur-sm">
                                00:{countdown.toString().padStart(2, '0')}
                            </div>

                            {/* Progress Bar */}
                            <motion.div
                                className="absolute bottom-0 left-0 h-2 bg-blue-500"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 7, ease: "linear" }}
                            />
                        </>
                    )}
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                    <motion.div 
                        className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-lg border border-blue-200"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">1</div>
                        <p className="font-semibold text-blue-900">Good Lighting</p>
                        <p className="text-xs text-blue-700 text-center">Ensure face is well-lit</p>
                    </motion.div>
                    <motion.div 
                        className="flex flex-col items-center gap-2 p-4 bg-purple-50 rounded-lg border border-purple-200"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">2</div>
                        <p className="font-semibold text-purple-900">Remove Glasses</p>
                        <p className="text-xs text-purple-700 text-center">Clear view of face</p>
                    </motion.div>
                    <motion.div 
                        className="flex flex-col items-center gap-2 p-4 bg-green-50 rounded-lg border border-green-200"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">3</div>
                        <p className="font-semibold text-green-900">Neutral Expression</p>
                        <p className="text-xs text-green-700 text-center">Relax your face</p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
