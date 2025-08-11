import { NextRequest, NextResponse } from 'next/server';
import { auth } from 'firebase-admin';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { addMidiServer } from '@/lib/firestore/midifiles.server';

// Initialize Firebase Admin
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

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
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    // Parse form data
    const formData = await request.formData();
    
    // Validate files (server-side)
    const file = formData.get('file') as File;
    const preview = formData.get('preview') as File;
    
    if (!file || !preview) {
      return NextResponse.json({ error: 'Missing required files' }, { status: 400 });
    }

    // Validate file types and sizes
    const maxFileSize = 50 * 1024 * 1024; // 50MB
    const maxPreviewSize = 10 * 1024 * 1024; // 10MB
    
    if (file.size > maxFileSize) {
      return NextResponse.json({ error: 'File too large (max 50MB)' }, { status: 400 });
    }
    
    if (preview.size > maxPreviewSize) {
      return NextResponse.json({ error: 'Preview too large (max 10MB)' }, { status: 400 });
    }

    // Validate MIDI file type
    const validMidiTypes = ['audio/midi', 'audio/x-midi', 'application/x-midi'];
    const validMidiExtensions = ['.mid', '.midi'];
    
    const isValidMidiType = validMidiTypes.includes(file.type);
    const isValidMidiExtension = validMidiExtensions.some(ext => 
      file.name.toLowerCase().endsWith(ext)
    );
    
    if (!isValidMidiType && !isValidMidiExtension) {
      return NextResponse.json({ error: 'Invalid MIDI file type' }, { status: 400 });
    }

    // Validate audio file type
    const validAudioTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/wave'];
    const validAudioExtensions = ['.mp3', '.wav'];
    
    const isValidAudioType = validAudioTypes.includes(preview.type);
    const isValidAudioExtension = validAudioExtensions.some(ext => 
      preview.name.toLowerCase().endsWith(ext)
    );
    
    if (!isValidAudioType && !isValidAudioExtension) {
      return NextResponse.json({ error: 'Invalid audio file type' }, { status: 400 });
    }

    // 7. LAST OPP TIL FIREBASE STORAGE (SERVER-SIDE)
    const storage = getStorage();
    const bucket = storage.bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!);

    // Upload MIDI file
    const midiFileName = `midifiles/${Date.now()}_${file.name}`;
    const midiFileBuffer = Buffer.from(await file.arrayBuffer());
    await bucket.file(midiFileName).save(midiFileBuffer, {
      metadata: { contentType: file.type }
    });

    const file_url = `https://firebasestorage.googleapis.com/v0/b/${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}/o/${encodeURIComponent(midiFileName)}?alt=media`;

    // Upload preview file
    const previewFileName = `previews/${Date.now()}_${preview.name}`;
    const previewFileBuffer = Buffer.from(await preview.arrayBuffer());
    await bucket.file(previewFileName).save(previewFileBuffer, {
      metadata: { contentType: preview.type }
    });

    const preview_url = `https://firebasestorage.googleapis.com/v0/b/${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}/o/${encodeURIComponent(previewFileName)}?alt=media`;

    // Save to Firestore
    const midiData = {
      name: formData.get('name') as string,
      price: Number(formData.get('price')),
      root: formData.get('root') as string,
      scale: formData.get('scale') as string,
      bpm: Number(formData.get('bpm')),
      genre: formData.get('genre') as string,
      vst: formData.get('vst') as string,
      preset: formData.get('preset') as string,
      discount_price: formData.get('discount_price') ? Number(formData.get('discount_price')) : undefined,
      file_url,
      preview_url,
      tags: JSON.parse(formData.get('tags') as string),
      hidden: formData.get('hidden') === 'true',
      is_featured: formData.get('is_featured') === 'true',
      is_discounted: formData.get('is_discounted') === 'true',
    };

    await addMidiServer(midiData);

    return NextResponse.json({ 
      success: true, 
      message: 'MIDI file uploaded successfully' 
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 