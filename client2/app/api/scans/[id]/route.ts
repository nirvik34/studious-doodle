import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const client = await clientPromise;
    const db = client.db('stroke_detection');
    const collection = db.collection('scans');
    
    // Validate ObjectId format
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid scan ID format' },
        { status: 400 }
      );
    }
    
    const scan = await collection.findOne({ _id: new ObjectId(params.id) });
    
    if (!scan) {
      return NextResponse.json(
        { error: 'Scan not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ scan });
  } catch (error) {
    console.error('Error fetching scan:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scan', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
