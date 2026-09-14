import { NextRequest, NextResponse } from 'next/server';
import { auth } from 'firebase-admin';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

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

// Issues a short-lived signed URL so the browser can upload the ZIP
// directly to Firebase Storage, bypassing the serverless function's
// request body size limit entirely.
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

    const { fileName, fileSize } = await request.json();

    if (!fileName || typeof fileName !== 'string') {
      return NextResponse.json({ error: 'Missing fileName' }, { status: 400 });
    }

    if (!fileName.toLowerCase().endsWith('.zip')) {
      return NextResponse.json({ error: 'Invalid ZIP file type' }, { status: 400 });
    }

    const maxFileSize = 400 * 1024 * 1024; // 400MB for ZIP
    if (typeof fileSize === 'number' && fileSize > maxFileSize) {
      return NextResponse.json({ error: 'ZIP file too large (max 400MB)' }, { status: 400 });
    }

    const storage = getStorage();
    const bucket = storage.bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!);

    const sanitizedZipName = sanitizeFilename(fileName);
    const filePath = `flps/${Date.now()}_${sanitizedZipName}`;
    const contentType = 'application/zip';

    const [uploadUrl] = await bucket.file(filePath).getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType,
    });

    const file_url = `https://firebasestorage.googleapis.com/v0/b/${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}/o/${encodeURIComponent(filePath)}?alt=media`;

    return NextResponse.json({ uploadUrl, contentType, filePath, file_url });
  } catch (error) {
    console.error('Error creating signed upload URL:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
