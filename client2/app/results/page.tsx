"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { StrokeRiskResult } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import dynamic from "next/dynamic";
import { RiskBadge } from "@/components/shared/RiskBadge";

const BrainScanHero = dynamic(() => import("@/components/shared/BrainScanHero").then((mod) => mod.BrainScanHero), {
    ssr: false,
    loading: () => <div className="h-64 w-64 bg-muted/20 animate-pulse rounded-full" />
});
import { AlertTriangle, CheckCircle, Phone, ArrowRight, Eye, Smile, Circle, MapPin, Hospital as HospitalIcon, Share2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ResultsPage() {
    const router = useRouter();
    const [result, setResult] = useState<StrokeRiskResult | null>(null);
    const [previousScan, setPreviousScan] = useState<StrokeRiskResult | null>(null);
    const [saving, setSaving] = useState(false);
    const [showComparison, setShowComparison] = useState(false);

    useEffect(() => {
        // Try to get the latest scan result from localStorage first
        const latestScan = localStorage.getItem('latestScanResult');
        if (latestScan) {
            setResult(JSON.parse(latestScan));
        }
        
        // Get previous scan for comparison
        api.history.getScans().then(scans => {
            if (latestScan && scans.length > 0) {
                setResult(JSON.parse(latestScan));
                // Get the previous scan (second most recent)
                if (scans.length > 1) {
                    setPreviousScan(scans[1]);
                }
            } else if (scans.length > 0) {
                setResult(scans[0]);
                if (scans.length > 1) {
                    setPreviousScan(scans[1]);
                }
            }
        });
        
        if (!latestScan) return;
        
        // Otherwise, fetch from history
        api.history.getScans().then(scans => {
            if (scans.length > 0) {
                setResult(scans[0]);
            } else {
                // Fallback mock (should rarely happen now)
                setResult({
                    riskScore: 0,
                    riskLevel: 'LOW',
                    confidence: 0,
                    factors: ["No scan data available"],
                    recommendations: ["Please perform a facial scan first"],
                    timestamp: new Date().toISOString(),
                })
            }
        });
    }, []);

    if (!result) return <div className="p-8 text-center">Loading analysis...</div>;

    const handleSaveToHistory = async () => {
        if (!result) return;
        
        setSaving(true);
        try {
            const response = await fetch('/api/scans', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(result)
            });
            
            if (response.ok) {
                alert('✅ Scan saved to history!');
            } else {
                alert('⚠️ Failed to save scan');
            }
        } catch (error) {
            console.error('Save error:', error);
            alert('⚠️ Error saving scan');
        } finally {
            setSaving(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score < 30) return "text-green-600";
        if (score < 70) return "text-yellow-600";
        return "text-red-600";
    };

    const getProgressColor = (score: number) => {
        if (score < 30) return "bg-green-500";
        if (score < 70) return "bg-yellow-500";
        return "bg-red-500";
    };

    const handleShareResults = async () => {
        if (!result) return;
        
        const shareText = `Facial Asymmetry Scan Results\n\nRisk Score: ${result.riskScore}%\nRisk Level: ${result.riskLevel}\nAI Confidence: ${result.confidence}%\n\nPerformed on: ${new Date(result.timestamp).toLocaleString()}`;
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Stroke Risk Assessment Results',
                    text: shareText,
                });
            } catch (error) {
                console.log('Share cancelled');
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareText);
            alert('✅ Results copied to clipboard!');
        }
    };

    return (
        <div className="container py-8 space-y-8 max-w-7xl">
            <div className="text-center space-y-4">
                <motion.h1 
                    className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    Analysis Complete ✓
                </motion.h1>
                <p className="text-lg text-muted-foreground">Comprehensive facial asymmetry assessment powered by AI</p>
                <div className="flex flex-wrap gap-3 justify-center">
                    <Button 
                        onClick={handleSaveToHistory} 
                        variant="outline" 
                        className="gap-2"
                        disabled={saving}
                    >
                        {saving ? '💾 Saving...' : '💾 Save to History'}
                    </Button>
                    <Link href="/hospitals">
                        <Button variant="default" className="gap-2 bg-red-600 hover:bg-red-700">
                            <HospitalIcon className="h-4 w-4" />
                            Find Nearby Hospitals
                        </Button>
                    </Link>
                    <Button onClick={handleShareResults} variant="outline" className="gap-2">
                        <Share2 className="h-4 w-4" />
                        Share Results
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Overall Risk Score */}
                <Card className="border-2 shadow-xl lg:col-span-1 bg-gradient-to-br from-blue-50 via-purple-50 to-white">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between text-xl">
                            🎯 Overall Risk
                            <RiskBadge level={result.riskLevel} className="text-lg px-4 py-1" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col items-center justify-center py-6">
                            <div className="relative">
                                <div className="w-48 h-48 rounded-full flex items-center justify-center border-8 border-white shadow-2xl bg-gradient-to-br from-white to-gray-50">
                                    <span className={`text-6xl font-bold ${getScoreColor(result.riskScore)}`}>{result.riskScore}%</span>
                                </div>
                            </div>
                            <div className="mt-6 space-y-2 text-center">
                                <p className="text-sm font-medium text-gray-600">🤖 AI Confidence: <span className="font-bold text-purple-600">{result.confidence}%</span></p>
                                {result.rawAsymmetryScore !== undefined && (
                                    <p className="text-xs text-muted-foreground">Raw Asymmetry Score: {result.rawAsymmetryScore.toFixed(4)}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-semibold text-sm">Detected Factors:</h3>
                            {result.factors.length > 0 ? (
                                <ul className="space-y-1">
                                    {result.factors.map((f, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm">
                                            <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-muted-foreground">{f}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="flex items-center gap-2 text-green-600 text-sm">
                                    <CheckCircle className="h-4 w-4" />
                                    No significant risk factors detected
                                </div>
                            )}
                        </div>

                        {result.detectedFeatures && result.detectedFeatures.length > 0 && (
                            <div className="space-y-2">
                                <h3 className="font-semibold text-sm">Analysis Details:</h3>
                                <ul className="space-y-1">
                                    {result.detectedFeatures.map((f, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm">
                                            <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-muted-foreground">{f}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </CardContent>
                </Card>
                {/* Scan Comparison */}
                {previousScan && (
                    <Card className="border-2 border-green-100 shadow-lg lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between text-xl">
                                📈 Progress Tracking
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-white rounded-lg">
                                    <span className="text-sm font-medium">Current Scan</span>
                                    <span className="text-2xl font-bold text-blue-600">{result.riskScore}%</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="text-sm font-medium">Previous Scan</span>
                                    <span className="text-2xl font-bold text-gray-600">{previousScan.riskScore}%</span>
                                </div>
                                <div className={`flex items-center justify-between p-4 rounded-lg ${
                                    result.riskScore < previousScan.riskScore 
                                        ? 'bg-green-50 border-2 border-green-200' 
                                        : result.riskScore > previousScan.riskScore
                                        ? 'bg-red-50 border-2 border-red-200'
                                        : 'bg-yellow-50 border-2 border-yellow-200'
                                }`}>
                                    <span className="font-semibold">Change</span>
                                    <span className={`text-2xl font-bold ${
                                        result.riskScore < previousScan.riskScore 
                                            ? 'text-green-600' 
                                            : result.riskScore > previousScan.riskScore
                                            ? 'text-red-600'
                                            : 'text-yellow-600'
                                    }`}>
                                        {result.riskScore < previousScan.riskScore ? '↓' : result.riskScore > previousScan.riskScore ? '↑' : '='}
                                        {Math.abs(result.riskScore - previousScan.riskScore)}%
                                    </span>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground text-center mt-4">
                                {result.riskScore < previousScan.riskScore 
                                    ? '✅ Great improvement! Your facial symmetry has improved.' 
                                    : result.riskScore > previousScan.riskScore
                                    ? '⚠️ Risk increased. Consider consulting a healthcare professional.'
                                    : '🔄 Risk level unchanged from last scan.'}
                            </p>
                        </CardContent>
                    </Card>
                )}
                {/* Facial Feature Analysis */}
                <Card className="border-2 border-purple-100 shadow-lg lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Eye className="h-5 w-5 text-purple-600" />
                            Detailed Facial Feature Analysis
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {result.facialMetrics ? (
                            <>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {/* Left Eye */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium flex items-center gap-2">
                                                <Eye className="h-4 w-4 text-blue-500" />
                                                Left Eye Asymmetry
                                            </span>
                                            <span className={`text-sm font-bold ${getScoreColor(result.facialMetrics.leftEye)}`}>
                                                {result.facialMetrics.leftEye}%
                                            </span>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full ${getProgressColor(result.facialMetrics.leftEye)} transition-all duration-500`}
                                                style={{ width: `${result.facialMetrics.leftEye}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Right Eye */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium flex items-center gap-2">
                                                <Eye className="h-4 w-4 text-blue-500" />
                                                Right Eye Asymmetry
                                            </span>
                                            <span className={`text-sm font-bold ${getScoreColor(result.facialMetrics.rightEye)}`}>
                                                {result.facialMetrics.rightEye}%
                                            </span>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full ${getProgressColor(result.facialMetrics.rightEye)} transition-all duration-500`}
                                                style={{ width: `${result.facialMetrics.rightEye}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Mouth */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium flex items-center gap-2">
                                                <Smile className="h-4 w-4 text-pink-500" />
                                                Mouth Asymmetry
                                            </span>
                                            <span className={`text-sm font-bold ${getScoreColor(result.facialMetrics.mouth)}`}>
                                                {result.facialMetrics.mouth}%
                                            </span>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full ${getProgressColor(result.facialMetrics.mouth)} transition-all duration-500`}
                                                style={{ width: `${result.facialMetrics.mouth}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Nose */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium flex items-center gap-2">
                                                <Circle className="h-4 w-4 text-orange-500" />
                                                Nose Asymmetry
                                            </span>
                                            <span className={`text-sm font-bold ${getScoreColor(result.facialMetrics.nose)}`}>
                                                {result.facialMetrics.nose}%
                                            </span>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full ${getProgressColor(result.facialMetrics.nose)} transition-all duration-500`}
                                                style={{ width: `${result.facialMetrics.nose}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Chin */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium flex items-center gap-2">
                                                <Circle className="h-4 w-4 text-purple-500" />
                                                Chin Asymmetry
                                            </span>
                                            <span className={`text-sm font-bold ${getScoreColor(result.facialMetrics.chin)}`}>
                                                {result.facialMetrics.chin}%
                                            </span>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full ${getProgressColor(result.facialMetrics.chin)} transition-all duration-500`}
                                                style={{ width: `${result.facialMetrics.chin}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Forehead */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium flex items-center gap-2">
                                                <Circle className="h-4 w-4 text-indigo-500" />
                                                Forehead Asymmetry
                                            </span>
                                            <span className={`text-sm font-bold ${getScoreColor(result.facialMetrics.forehead)}`}>
                                                {result.facialMetrics.forehead}%
                                            </span>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full ${getProgressColor(result.facialMetrics.forehead)} transition-all duration-500`}
                                                style={{ width: `${result.facialMetrics.forehead}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Left Cheek */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium flex items-center gap-2">
                                                <Circle className="h-4 w-4 text-rose-500" />
                                                Left Cheek Asymmetry
                                            </span>
                                            <span className={`text-sm font-bold ${getScoreColor(result.facialMetrics.leftCheek)}`}>
                                                {result.facialMetrics.leftCheek}%
                                            </span>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full ${getProgressColor(result.facialMetrics.leftCheek)} transition-all duration-500`}
                                                style={{ width: `${result.facialMetrics.leftCheek}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Right Cheek */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium flex items-center gap-2">
                                                <Circle className="h-4 w-4 text-rose-500" />
                                                Right Cheek Asymmetry
                                            </span>
                                            <span className={`text-sm font-bold ${getScoreColor(result.facialMetrics.rightCheek)}`}>
                                                {result.facialMetrics.rightCheek}%
                                            </span>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full ${getProgressColor(result.facialMetrics.rightCheek)} transition-all duration-500`}
                                                style={{ width: `${result.facialMetrics.rightCheek}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                    <p className="text-sm text-blue-900">
                                        <span className="font-semibold">Analysis Method:</span> Advanced AI facial recognition analyzing {Object.keys(result.facialMetrics).length} key facial features for asymmetry patterns that may indicate stroke risk.
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <p>Detailed facial metrics not available</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Recommendations and Actions */}
            <div className="grid gap-6 md:grid-cols-2">

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recommendations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {result.recommendations.map((rec, i) => (
                                    <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                        <span className="text-sm">{rec}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="bg-red-50 border-red-100">
                        <CardHeader>
                            <CardTitle className="text-red-900 flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5" />
                                Know the Signs (FAST)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-white rounded-lg text-center">
                                <div className="font-bold text-red-600">F</div>
                                <div className="text-xs font-medium">Face Drooping</div>
                            </div>
                            <div className="p-3 bg-white rounded-lg text-center">
                                <div className="font-bold text-red-600">A</div>
                                <div className="text-xs font-medium">Arm Weakness</div>
                            </div>
                            <div className="p-3 bg-white rounded-lg text-center">
                                <div className="font-bold text-red-600">S</div>
                                <div className="text-xs font-medium">Speech Difficulty</div>
                            </div>
                            <div className="p-3 bg-white rounded-lg text-center">
                                <div className="font-bold text-red-600">T</div>
                                <div className="text-xs font-medium">Time to Call</div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-4">
                        <Link href="/dashboard" className="flex-1">
                            <Button variant="outline" className="w-full">Back to Dashboard</Button>
                        </Link>
                        {result.riskLevel === 'HIGH' && (
                            <Link href="/emergency" className="flex-1">
                                <Button variant="destructive" className="w-full gap-2">
                                    <Phone className="h-4 w-4" /> Call Emergency
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
