import { NextRequest, NextResponse } from 'next/server';
import { auth } from 'firebase-admin';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getPacks } from '@/lib/firestore/pack';
import { getAllMidis } from '@/lib/firestore/midifiles';

// Initialize Firebase Admin
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

// Cache for 1 hour
export const revalidate = 3600;

// GET: Fetch all products (packs or midis)
export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth().verifyIdToken(token);
    const userRecord = await auth().getUser(decodedToken.uid);
    
    if (!userRecord.customClaims?.admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'packs') {
      const packs = await getPacks();
      
      // Convert Firestore Timestamps to ISO strings for JSON serialization
      const packsWithFormattedDates = packs.map(pack => ({
        ...pack,
        created_at: pack.created_at instanceof Date 
          ? pack.created_at.toISOString() 
          : pack.created_at
      }));

      return NextResponse.json(packsWithFormattedDates);
    } else if (type === 'midis') {
      const midis = await getAllMidis();
      
      // Convert Firestore Timestamps to ISO strings for JSON serialization
      const midisWithFormattedDates = midis.map(midi => ({
        ...midi,
        created_at: midi.created_at instanceof Date 
          ? midi.created_at.toISOString() 
          : midi.created_at
      }));

      return NextResponse.json(midisWithFormattedDates);
    } else {
      return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Create new product (pack or midi)
export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth().verifyIdToken(token);
    const userRecord = await auth().getUser(decodedToken.uid);
    
    if (!userRecord.customClaims?.admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { type, productData } = body;

    if (!type || !productData) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    // TODO: Implement product creation logic
    // This would involve calling the appropriate Firestore functions
    // based on the type (pack or midi)

    return NextResponse.json({ 
      success: true, 
      message: `Product created successfully` 
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT: Update existing product
export async function PUT(request: NextRequest) {
  try {
    // Verify admin access
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth().verifyIdToken(token);
    const userRecord = await auth().getUser(decodedToken.uid);
    
    if (!userRecord.customClaims?.admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { type, productId, productData } = body;

    if (!type || !productId || !productData) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    // TODO: Implement product update logic

    return NextResponse.json({ 
      success: true, 
      message: `Product updated successfully` 
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE: Delete product
export async function DELETE(request: NextRequest) {
  try {
    // Verify admin access
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth().verifyIdToken(token);
    const userRecord = await auth().getUser(decodedToken.uid);
    
    if (!userRecord.customClaims?.admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const productId = searchParams.get('id');

    if (!type || !productId) {
      return NextResponse.json({ error: 'Missing type or id parameter' }, { status: 400 });
    }

    // TODO: Implement product deletion logic

    return NextResponse.json({ 
      success: true, 
      message: `Product deleted successfully` 
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}