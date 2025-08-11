import { NextRequest, NextResponse } from 'next/server';
import { auth } from 'firebase-admin';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAllUsersServer, deleteUserServer } from '@/lib/firestore/user.server';

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

// GET: Fetch all users with their custom claims
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

    // Get all users from Firestore
    const users = await getAllUsersServer();
    
    // Get custom claims for each user
    const usersWithClaims = await Promise.all(
      users.map(async (user: { uid: string; createdAt: Date | string | null; lastLoginAt: Date | string | null }) => {
        try {
          const userRecord = await auth().getUser(user.uid);
          
          // Helper function to convert timestamp to ISO string
          const convertTimestamp = (timestamp: FirebaseFirestore.Timestamp | Date | string | null) => {
            if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp) {
              return (timestamp as FirebaseFirestore.Timestamp).toDate().toISOString();
            }
            return timestamp;
          };
          
          return {
            ...user,
            // Convert Firestore Timestamps to ISO strings for JSON serialization
            createdAt: convertTimestamp(user.createdAt),
            lastLoginAt: convertTimestamp(user.lastLoginAt),
            isAdmin: userRecord.customClaims?.admin === true,
            role: userRecord.customClaims?.admin ? 'Admin' : 'User'
          };
        } catch (error) {
          console.error(`Error getting claims for user ${user.uid}:`, error);
          
          // Helper function to convert timestamp to ISO string
          const convertTimestamp = (timestamp: FirebaseFirestore.Timestamp | Date | string | null) => {
            if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp) {
              return (timestamp as FirebaseFirestore.Timestamp).toDate().toISOString();
            }
            return timestamp;
          };
          
          return {
            ...user,
            // Convert Firestore Timestamps to ISO strings for JSON serialization
            createdAt: convertTimestamp(user.createdAt),
            lastLoginAt: convertTimestamp(user.lastLoginAt),
            isAdmin: false,
            role: 'User'
          };
        }
      })
    );

    return NextResponse.json(usersWithClaims);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Set admin status for a user
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

    const { targetUserId, isAdmin } = await request.json();
    
    if (!targetUserId || typeof isAdmin !== 'boolean') {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    // Set custom claims
    await auth().setCustomUserClaims(targetUserId, { admin: isAdmin });
    
    return NextResponse.json({ 
      success: true, 
      message: `User ${targetUserId} admin status set to ${isAdmin}` 
    });
  } catch (error) {
    console.error('Error setting admin status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 

// DELETE: Delete a user (admin only)
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

    const { targetUserId } = await request.json();
    
    if (!targetUserId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Prevent admin from deleting themselves
    if (targetUserId === decodedToken.uid) {
      return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 400 });
    }

    // Delete from Firestore first
    await deleteUserServer(targetUserId);
    
    // Then delete from Firebase Auth
    await auth().deleteUser(targetUserId);
    
    return NextResponse.json({ 
      success: true, 
      message: `User ${targetUserId} deleted successfully` 
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 