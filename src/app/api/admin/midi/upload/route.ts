import { NextRequest, NextResponse } from 'next/server';
import { auth } from 'firebase-admin';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { addMidiServer } from '@/lib/firestore/midifiles.server';

// Function to sanitize filename for safe storage
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[#%&{}\\<>*?/$!'":@+`|=]/g, '_') // Replace problematic characters with underscore
    .replace(/\s+/g, '_') // Replace spaces with underscore
    .replace(/__+/g, '_') // Replace multiple underscores with single
    .replace(/^_+|_+$/g, ''); // Remove leading/trailing underscores
}

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
    console.log('MIDI upload request received');
    
    // Verify admin access
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Missing or invalid authorization header');
      return NextResponse.json({ error: 'Unauthorized - Missing token' }, { status: 401 });
    }
    
    const token = authHeader.split('Bearer ')[1];
    console.log('Token received, length:', token.length);
    
    let decodedToken;
    try {
      decodedToken = await auth().verifyIdToken(token);
      console.log('Token verified for user:', decodedToken.uid);
    } catch (tokenError) {
      console.error('Token verification failed:', tokenError);
      return NextResponse.json({ error: 'Unauthorized - Invalid token' }, { status: 401 });
    }
    
    let userRecord;
    try {
      userRecord = await auth().getUser(decodedToken.uid);
      console.log('User record retrieved, admin status:', !!userRecord.customClaims?.admin);
    } catch (userError) {
      console.error('Failed to get user record:', userError);
      return NextResponse.json({ error: 'Unauthorized - User not found' }, { status: 401 });
    }
    
    if (!userRecord.customClaims?.admin) {
      console.error('User is not admin:', decodedToken.uid);
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    // Parse form data
    console.log('Parsing form data...');
    const formData = await request.formData();
    console.log('Form data parsed successfully');
    
    // Validate files (server-side)
    const file = formData.get('file') as File;
    const preview = formData.get('preview') as File;
    
    if (!file || !preview) {
      console.error('Missing required files:', { file: !!file, preview: !!preview });
      return NextResponse.json({ error: 'Missing required files' }, { status: 400 });
    }

    console.log('File details:', {
      midiName: file.name,
      midiSize: file.size,
      midiType: file.type,
      previewName: preview.name,
      previewSize: preview.size,
      previewType: preview.type
    });

    // Validate file types and sizes
    const maxFileSize = 50 * 1024 * 1024; // 50MB
    const maxPreviewSize = 10 * 1024 * 1024; // 10MB
    
    if (file.size > maxFileSize) {
      console.error('MIDI file too large:', file.size, 'bytes');
      return NextResponse.json({ error: 'File too large (max 50MB)' }, { status: 400 });
    }
    
    if (preview.size > maxPreviewSize) {
      console.error('Preview file too large:', preview.size, 'bytes');
      return NextResponse.json({ error: 'Preview too large (max 10MB)' }, { status: 400 });
    }

    // Validate MIDI file type
    const validMidiTypes = ['audio/midi', 'audio/x-midi', 'application/x-midi'];
    const validMidiExtensions = ['.mid', '.midi'];
    
    const isValidMidiType = validMidiTypes.includes(file.type);
    const isValidMidiExtension = validMidiExtensions.some(ext => 
      file.name.toLowerCase().endsWith(ext)
    );
    
    console.log('MIDI file validation:', {
      isValidMidiType,
      isValidMidiExtension,
      fileType: file.type,
      fileName: file.name
    });
    
    if (!isValidMidiType && !isValidMidiExtension) {
      console.error('Invalid MIDI file type:', file.type, file.name);
      return NextResponse.json({ error: 'Invalid MIDI file type' }, { status: 400 });
    }

    // Validate audio file type
    const validAudioTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/wave'];
    const validAudioExtensions = ['.mp3', '.wav'];
    
    const isValidAudioType = validAudioTypes.includes(preview.type);
    const isValidAudioExtension = validAudioExtensions.some(ext => 
      preview.name.toLowerCase().endsWith(ext)
    );
    
    console.log('Preview file validation:', {
      isValidAudioType,
      isValidAudioExtension,
      previewType: preview.type,
      previewName: preview.name
    });
    
    if (!isValidAudioType && !isValidAudioExtension) {
      console.error('Invalid audio file type:', preview.type, preview.name);
      return NextResponse.json({ error: 'Invalid audio file type' }, { status: 400 });
    }

    // Upload to Firebase Storage (server-side)
    console.log('Starting Firebase Storage upload...');
    const storage = getStorage();
    const bucket = storage.bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!);

    // Upload MIDI file
    const sanitizedMidiName = sanitizeFilename(file.name);
    const midiFileName = `midifiles/${Date.now()}_${sanitizedMidiName}`;
    console.log('Uploading MIDI file:', midiFileName);
    
    const midiFileBuffer = Buffer.from(await file.arrayBuffer());
    await bucket.file(midiFileName).save(midiFileBuffer, {
      metadata: { contentType: file.type }
    });

    const file_url = `https://firebasestorage.googleapis.com/v0/b/${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}/o/${encodeURIComponent(midiFileName)}?alt=media`;
    console.log('MIDI file uploaded, URL:', file_url);

    // Upload preview file
    const sanitizedPreviewName = sanitizeFilename(preview.name);
    const previewFileName = `previews/${Date.now()}_${sanitizedPreviewName}`;
    console.log('Uploading preview file:', previewFileName);
    
    const previewFileBuffer = Buffer.from(await preview.arrayBuffer());
    await bucket.file(previewFileName).save(previewFileBuffer, {
      metadata: { contentType: preview.type }
    });

    const preview_url = `https://firebasestorage.googleapis.com/v0/b/${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}/o/${encodeURIComponent(previewFileName)}?alt=media`;
    console.log('Preview file uploaded, URL:', preview_url);

    // Save to Firestore
    console.log('Saving to Firestore...');
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
    console.log('MIDI file saved to Firestore successfully');

    return NextResponse.json({ 
      success: true, 
      message: 'MIDI file uploaded successfully' 
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 