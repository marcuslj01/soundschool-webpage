import { NextRequest, NextResponse } from 'next/server';
import { auth } from 'firebase-admin';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { addPackServer } from '@/lib/firestore/pack.server';

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
    const image = formData.get('image') as File;
    
    if (!file || !preview || !image) {
      return NextResponse.json({ error: 'Missing required files' }, { status: 400 });
    }

    // Validate file types and sizes
    const maxFileSize = 100 * 1024 * 1024; // 100MB for ZIP
    const maxPreviewSize = 10 * 1024 * 1024; // 10MB for audio
    const maxImageSize = 5 * 1024 * 1024; // 5MB for image
    
    if (file.size > maxFileSize) {
      return NextResponse.json({ error: 'ZIP file too large (max 100MB)' }, { status: 400 });
    }
    
    if (preview.size > maxPreviewSize) {
      return NextResponse.json({ error: 'Preview too large (max 10MB)' }, { status: 400 });
    }

    if (image.size > maxImageSize) {
      return NextResponse.json({ error: 'Image too large (max 5MB)' }, { status: 400 });
    }

    // Validate ZIP file type
    const validZipExtensions = ['.zip'];
    const isValidZipExtension = validZipExtensions.some(ext => 
      file.name.toLowerCase().endsWith(ext)
    );
    
    if (!isValidZipExtension) {
      return NextResponse.json({ error: 'Invalid ZIP file type' }, { status: 400 });
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

    // Validate image file type
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const validImageExtensions = ['.jpg', '.jpeg', '.png'];
    
    const isValidImageType = validImageTypes.includes(image.type);
    const isValidImageExtension = validImageExtensions.some(ext => 
      image.name.toLowerCase().endsWith(ext)
    );
    
    if (!isValidImageType && !isValidImageExtension) {
      return NextResponse.json({ error: 'Invalid image file type' }, { status: 400 });
    }

    // 8. LAST OPP TIL FIREBASE STORAGE (SERVER-SIDE)
    const storage = getStorage();
    const bucket = storage.bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!);

    // Upload ZIP file
    const zipFileName = `packs/${Date.now()}_${file.name}`;
    const zipFileBuffer = Buffer.from(await file.arrayBuffer());
    await bucket.file(zipFileName).save(zipFileBuffer, {
      metadata: { contentType: 'application/zip' }
    });

    const download_url = `https://firebasestorage.googleapis.com/v0/b/${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}/o/${encodeURIComponent(zipFileName)}?alt=media`;

    // Upload preview file
    const previewFileName = `previews/${Date.now()}_${preview.name}`;
    const previewFileBuffer = Buffer.from(await preview.arrayBuffer());
    await bucket.file(previewFileName).save(previewFileBuffer, {
      metadata: { contentType: preview.type }
    });

    const preview_url = `https://firebasestorage.googleapis.com/v0/b/${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}/o/${encodeURIComponent(previewFileName)}?alt=media`;

    // Upload image file
    const imageFileName = `images/${Date.now()}_${image.name}`;
    const imageFileBuffer = Buffer.from(await image.arrayBuffer());
    await bucket.file(imageFileName).save(imageFileBuffer, {
      metadata: { contentType: image.type }
    });

    const image_url = `https://firebasestorage.googleapis.com/v0/b/${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}/o/${encodeURIComponent(imageFileName)}?alt=media`;

    // Save to Firestore
    const packData = {
      name: formData.get('name') as string,
      type: formData.get('type') as "midi" | "sample",
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      discount_price: Number(formData.get('discount_price')),
      genre: formData.get('genre') as string,
      file_count: Number(formData.get('file_count')),
      download_url,
      preview_url,
      image_url,
      tags: JSON.parse(formData.get('tags') as string),
      hidden: formData.get('hidden') === 'true',
      is_featured: formData.get('is_featured') === 'true',
      is_discounted: formData.get('is_discounted') === 'true',
      sales: 0,
    };

    await addPackServer(packData);

    return NextResponse.json({ 
      success: true, 
      message: 'Pack uploaded successfully' 
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 