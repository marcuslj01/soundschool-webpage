import { NextRequest, NextResponse } from 'next/server';
import { auth } from 'firebase-admin';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { addFLPServer } from '@/lib/firestore/flp.server';

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

    // Parse JSON body. The ZIP itself was already uploaded directly to
    // Firebase Storage by the client via a signed URL (see
    // /api/admin/flp/upload-url) - this route only persists metadata.
    const body = await request.json();
    const file_url = body.file_url as string;

    if (!file_url) {
      return NextResponse.json({ error: 'Missing required file_url' }, { status: 400 });
    }

    // Extract YouTube video ID and get video info
    const videoUrl = body.video_url as string;
    let image_url = '';
    let videoTitle = body.name as string; // Use provided name as fallback
    
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
      description: body.description as string,
      price: Number(body.price),
      root: body.root as string,
      scale: body.scale as string,
      bpm: Number(body.bpm),
      genre: body.genre as string,
      video_url: body.video_url as string,
      file_url,
      image_url,
      tags: body.tags as string[],
      hidden: body.hidden === true,
      is_featured: body.is_featured === true,
      is_discounted: body.is_discounted === true,
      discount_price: Number(body.discount_price),
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