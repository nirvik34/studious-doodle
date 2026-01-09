import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('stroke_detection');
    const collection = db.collection('scans');
    
    // Get statistics
    const totalScans = await collection.countDocuments();
    
    const recentScans = await collection
      .find()
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();
    
    // Calculate averages
    const avgRiskScore = recentScans.length > 0
      ? recentScans.reduce((sum, scan) => sum + (scan.riskScore || 0), 0) / recentScans.length
      : 0;
    
    // Risk distribution
    const lowRisk = recentScans.filter(s => s.riskLevel === 'LOW').length;
    const mediumRisk = recentScans.filter(s => s.riskLevel === 'MEDIUM').length;
    const highRisk = recentScans.filter(s => s.riskLevel === 'HIGH').length;
    
    // Get latest scan
    const latestScan = recentScans[0] || null;
    
    // Calculate trend (last 7 scans)
    const trendData = recentScans.slice(0, 7).reverse().map((scan, index) => ({
      date: new Date(scan.createdAt).toLocaleDateString(),
      value: scan.riskScore || 0,
      index
    }));
    
    return NextResponse.json({
      totalScans,
      avgRiskScore: Math.round(avgRiskScore),
      latestScan,
      distribution: {
        low: lowRisk,
        medium: mediumRisk,
        high: highRisk
      },
      trendData,
      recentScans: recentScans.slice(0, 5)
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
