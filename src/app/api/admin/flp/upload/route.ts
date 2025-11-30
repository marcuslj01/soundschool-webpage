import { NextRequest, NextResponse } from 'next/server';
import { auth } from 'firebase-admin';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { addFLPServer } from '@/lib/firestore/flp.server';

// Function to sanitize filename for safe storage
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[#%&{}\\<>*?/$!'":@+`|=]/g, '_') // Replace problematic characters with underscore
    .replace(/\s+/g, '_') // Replace spaces with underscore
    .replace(/__+/g, '_') // Replace multiple underscores with single
    .replace(/^_+|_+$/g, ''); // Remove leading/trailing underscores
}

// Function to extract YouTube video ID from various URL formats
function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  return null;
}

// Function to fetch YouTube video information
async function getYouTubeVideoInfo(videoId: string): Promise<{ title: string; thumbnail: string } | null> {
  try {
    // Use oEmbed API to get video info (no API key required)
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const response = await fetch(oembedUrl);
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return {
      title: data.title,
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    };
  } catch (error) {
    console.error('Error fetching YouTube video info:', error);
    return null;
  }
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
    
    if (!file) {
      return NextResponse.json({ error: 'Missing required file' }, { status: 400 });
    }

    // Validate file types and sizes
    const maxFileSize = 400 * 1024 * 1024; // 400MB for ZIP
    
    if (file.size > maxFileSize) {
      return NextResponse.json({ error: 'ZIP file too large (max 100MB)' }, { status: 400 });
    }

    // Validate ZIP file type
    const validZipExtensions = ['.zip'];
    const isValidZipExtension = validZipExtensions.some(ext => 
      file.name.toLowerCase().endsWith(ext)
    );
    
    if (!isValidZipExtension) {
      return NextResponse.json({ error: 'Invalid ZIP file type' }, { status: 400 });
    }

    // Upload to Firebase Storage (server-side)
    const storage = getStorage();
    const bucket = storage.bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!);

    // Upload ZIP file
    const sanitizedZipName = sanitizeFilename(file.name);
    const zipFileName = `flps/${Date.now()}_${sanitizedZipName}`;
    console.log('Uploading ZIP file:', zipFileName);
    
    const zipFileBuffer = Buffer.from(await file.arrayBuffer());
    await bucket.file(zipFileName).save(zipFileBuffer, {
      metadata: { contentType: 'application/zip' }
    });

    const file_url = `https://firebasestorage.googleapis.com/v0/b/${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}/o/${encodeURIComponent(zipFileName)}?alt=media`;

    // Extract YouTube video ID and get video info
    const videoUrl = formData.get('video_url') as string;
    let image_url = '';
    let videoTitle = formData.get('name') as string; // Use provided name as fallback
    
    if (videoUrl) {
      const videoId = extractYouTubeVideoId(videoUrl);
      if (videoId) {
        const videoInfo = await getYouTubeVideoInfo(videoId);
        if (videoInfo) {
          image_url = videoInfo.thumbnail;
          // Only use YouTube title if no name was provided
          if (!videoTitle || videoTitle.trim() === '') {
            videoTitle = videoInfo.title;
          }
        } else {
          // Fallback to direct thumbnail URL if oEmbed fails
          image_url = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        }
      }
    }

    // Save to Firestore
    const flpData = {
      name: videoTitle,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      root: formData.get('root') as string,
      scale: formData.get('scale') as string,
      bpm: Number(formData.get('bpm')),
      genre: formData.get('genre') as string,
      video_url: formData.get('video_url') as string,
      file_url,
      image_url,
      tags: JSON.parse(formData.get('tags') as string),
      hidden: formData.get('hidden') === 'true',
      is_featured: formData.get('is_featured') === 'true',
      is_discounted: formData.get('is_discounted') === 'true',
      discount_price: Number(formData.get('discount_price')),
      sales: 0,
    };

    await addFLPServer(flpData);

    return NextResponse.json({ 
      message: 'FLP uploaded successfully',
      file_url,
      image_url,
      title: videoTitle
    });

  } catch (error) {
    console.error('Error uploading FLP:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 