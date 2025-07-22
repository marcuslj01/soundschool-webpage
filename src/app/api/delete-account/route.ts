// src/app/api/delete-account/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { initializeApp, getApps, cert } from "firebase-admin/app";

// Initialize Firebase Admin if not already done
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export async function POST(req: NextRequest) {
  try {
    const { uid } = await req.json();
    
    if (!uid) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    // Delete Firebase Auth account
    await getAuth().deleteUser(uid);
    
    console.log(`Successfully deleted Firebase Auth account for user: ${uid}`);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting Firebase Auth account:', error);
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
  }
}