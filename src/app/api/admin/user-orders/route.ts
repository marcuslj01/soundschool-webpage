import { NextRequest, NextResponse } from 'next/server';
import { auth } from 'firebase-admin';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getOrdersByUserIdServer } from '@/lib/firestore/order.server';

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

export async function GET(request: NextRequest) {
  try {
    console.log('API route called - checking environment variables...');
    console.log('FIREBASE_PROJECT_ID exists:', !!process.env.FIREBASE_PROJECT_ID);
    console.log('FIREBASE_CLIENT_EMAIL exists:', !!process.env.FIREBASE_CLIENT_EMAIL);
    console.log('FIREBASE_PRIVATE_KEY exists:', !!process.env.FIREBASE_PRIVATE_KEY);

    // Verify admin access
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No authorization header found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const token = authHeader.split('Bearer ')[1];
    console.log('Token received, verifying...');
    
    const decodedToken = await auth().verifyIdToken(token);
    console.log('Token verified, getting user record...');
    
    const userRecord = await auth().getUser(decodedToken.uid);
    console.log('User record retrieved, checking admin claims...');
    
    if (!userRecord.customClaims?.admin) {
      console.log('User is not admin');
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    console.log('Admin access verified');

    // Get userId from query params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    console.log('UserId from params:', userId);

    if (!userId) {
      console.log('No userId provided');
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
    }

    // Get orders with server-side access
    console.log('Calling getOrdersByUserIdServer...');
    const orders = await getOrdersByUserIdServer(userId);
    console.log('Orders retrieved, count:', orders.length);
    
    return NextResponse.json(orders);

  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 