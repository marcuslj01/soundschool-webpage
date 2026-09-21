import { NextRequest, NextResponse } from 'next/server';
import { auth } from 'firebase-admin';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { deletePackServer, getPacksServer } from '@/lib/firestore/pack.server';
import { deleteMidiServer, getAllMidisServer } from '@/lib/firestore/midifiles.server';
import { deleteFLPServer, getFLPsServer, updateFLPServer } from '@/lib/firestore/flp.server';
import { revalidatePath } from 'next/cache';

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
      const packs = await getPacksServer();
      
      // Convert Firestore Timestamps to ISO strings for JSON serialization
      const packsWithFormattedDates = packs.map((pack: { created_at: Date | string | null }) => ({
        ...pack,
        created_at: pack.created_at instanceof Date 
          ? pack.created_at.toISOString() 
          : pack.created_at
      }));

      return NextResponse.json(packsWithFormattedDates);
    } else if (type === 'midis') {
      const midis = await getAllMidisServer();
      
      // Convert Firestore Timestamps to ISO strings for JSON serialization
      const midisWithFormattedDates = midis.map((midi: { created_at: Date | string | null }) => ({
        ...midi,
        created_at: midi.created_at instanceof Date 
          ? midi.created_at.toISOString() 
          : midi.created_at
      }));

      return NextResponse.json(midisWithFormattedDates);
    } else if (type === 'flps') {
      const flps = await getFLPsServer();
      
      // Convert Firestore Timestamps to ISO strings for JSON serialization
      const flpsWithFormattedDates = flps.map((flp: { created_at: Date | string | null }) => ({
        ...flp,
        created_at: flp.created_at instanceof Date 
          ? flp.created_at.toISOString() 
          : flp.created_at
      }));

      return NextResponse.json(flpsWithFormattedDates);
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

    if (type === 'flps') {
      const str = (v: unknown) => (typeof v === 'string' ? v : undefined);
      const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : undefined);
      const bool = (v: unknown) => (typeof v === 'boolean' ? v : undefined);

      const candidate = {
        name: str(productData.name)?.trim(),
        description: str(productData.description),
        price: num(productData.price),
        root: str(productData.root),
        scale: str(productData.scale),
        bpm: num(productData.bpm),
        genre: str(productData.genre),
        video_url: str(productData.video_url),
        tags: Array.isArray(productData.tags)
          ? productData.tags.filter((t: unknown): t is string => typeof t === 'string').slice(0, 3)
          : undefined,
        hidden: bool(productData.hidden),
        is_featured: bool(productData.is_featured),
        is_discounted: bool(productData.is_discounted),
        discount_price: num(productData.discount_price),
        file_url: str(productData.file_url),
      };

      if (
        candidate.file_url !== undefined &&
        !candidate.file_url.startsWith(
          `https://firebasestorage.googleapis.com/v0/b/${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}/o/flps%2F`
        )
      ) {
        return NextResponse.json({ error: 'Invalid file_url' }, { status: 400 });
      }

      const updates = Object.fromEntries(
        Object.entries(candidate).filter(([, v]) => v !== undefined)
      );

      if (candidate.name !== undefined && candidate.name === '') {
        return NextResponse.json({ error: 'Name cannot be empty' }, { status: 400 });
      }

      if (candidate.video_url) {
        const match = candidate.video_url.match(
          /(?:youtube\.com\/watch\?.*v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
        );
        if (match) {
          (updates as Record<string, unknown>).image_url = `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
        }
      }

      await updateFLPServer(productId, updates);
      revalidatePath('/flps');
      revalidatePath('/flp');
    } else {
      return NextResponse.json({ error: 'Updating this product type is not supported yet' }, { status: 400 });
    }

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



    let success = false;
    
    if (type === 'packs') {
      await deletePackServer(productId);
      success = true;
    } else if (type === 'midis') {
      await deleteMidiServer(productId);
      success = true;
    } else if (type === 'flps') {
      await deleteFLPServer(productId);
      success = true;
    } else {
      return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }

    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: `${type === 'packs' ? 'Pack' : type === 'midis' ? 'MIDI file' : 'FLP'} deleted successfully` 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: `Failed to delete ${type === 'packs' ? 'pack' : type === 'midis' ? 'MIDI file' : 'FLP'}` 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}