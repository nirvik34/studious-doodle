import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const client = await clientPromise;
    const db = client.db('stroke_detection');
    const collection = db.collection('scans');
    
    // Add createdAt timestamp
    const scanResult = {
      ...data,
      createdAt: new Date(),
    };
    
    const result = await collection.insertOne(scanResult);
    
    return NextResponse.json({ 
      success: true, 
      id: result.insertedId,
      data: scanResult
    });
  } catch (error) {
    console.error('Error saving scan:', error);
    return NextResponse.json(
      { error: 'Failed to save scan result' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const client = await clientPromise;
    const db = client.db('stroke_detection');
    const collection = db.collection('scans');
    
    const query = userId ? { userId } : {};
    
    const scans = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
    
    return NextResponse.json({ scans });
  } catch (error) {
    console.error('Error fetching scans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scans' },
      { status: 500 }
    );
  }
}
