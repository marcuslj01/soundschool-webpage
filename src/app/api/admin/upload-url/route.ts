import { NextRequest, NextResponse } from 'next/server';
import { auth } from 'firebase-admin';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

const MB = 1024 * 1024;

const CONTENT_TYPES: Record<string, string> = {
  '.zip': 'application/zip',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.mid': 'audio/midi',
  '.midi': 'audio/midi',
};

const KINDS: Record<string, { folder: string; extensions: string[]; maxSize: number }> = {
  'pack-zip': { folder: 'packs', extensions: ['.zip'], maxSize: 400 * MB },
  'pack-preview': { folder: 'previews', extensions: ['.mp3', '.wav'], maxSize: 20 * MB },
  'pack-image': { folder: 'images', extensions: ['.jpg', '.jpeg', '.png'], maxSize: 5 * MB },
  'midi-file': { folder: 'midifiles', extensions: ['.mid', '.midi'], maxSize: 50 * MB },
  'midi-preview': { folder: 'previews', extensions: ['.mp3', '.wav'], maxSize: 20 * MB },
};

function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[#%&{}\\<>*?/$!'":@+`|=]/g, '_')
    .replace(/\s+/g, '_')
    .replace(/__+/g, '_')
    .replace(/^_+|_+$/g, '');
}

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

// Issues a short-lived signed URL so the browser can upload a pack/MIDI
// asset directly to Firebase Storage (no serverless body size limit).
export async function POST(request: NextRequest) {
  try {
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

    const { kind, fileName, fileSize } = await request.json();
    const config = typeof kind === 'string' ? KINDS[kind] : undefined;

    if (!config) {
      return NextResponse.json({ error: 'Invalid kind' }, { status: 400 });
    }
    if (!fileName || typeof fileName !== 'string') {
      return NextResponse.json({ error: 'Missing fileName' }, { status: 400 });
    }

    const lowerName = fileName.toLowerCase();
    const extension = config.extensions.find((ext) => lowerName.endsWith(ext));
    if (!extension) {
      return NextResponse.json(
        { error: `Invalid file type (allowed: ${config.extensions.join(', ')})` },
        { status: 400 }
      );
    }

    if (typeof fileSize === 'number' && fileSize > config.maxSize) {
      return NextResponse.json(
        { error: `File too large (max ${config.maxSize / MB}MB)` },
        { status: 400 }
      );
    }

    const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!;
    const bucket = getStorage().bucket(bucketName);
    const filePath = `${config.folder}/${Date.now()}_${sanitizeFilename(fileName)}`;
    const contentType = CONTENT_TYPES[extension];

    const [uploadUrl] = await bucket.file(filePath).getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000,
      contentType,
    });

    const file_url = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(filePath)}?alt=media`;

    return NextResponse.json({ uploadUrl, contentType, filePath, file_url });
  } catch (error) {
    console.error('Error creating signed upload URL:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
