// src/app/api/admin/stats/route.ts

// a server component that fetches the stats from the database 
// and returns them as a JSON object for the admin dashboard

import { NextRequest, NextResponse } from 'next/server';
import { auth } from 'firebase-admin';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getUsersCountServer } from '@/lib/firestore/user.server';
import { getOrdersCountAndRevenueServer, getMonthlyOrdersStatsServer } from '@/lib/firestore/order.server';

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

export const revalidate = 3600; // 1 hour cache

export async function GET(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No valid authorization header' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    
    // Verify token and check admin status
    const decodedToken = await auth().verifyIdToken(token);
    const userRecord = await auth().getUser(decodedToken.uid);
    
    // Check if user has admin claim
    if (!userRecord.customClaims?.admin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    // User is admin, fetch stats
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
    const [users, orders, currentMonthStats, previousMonthStats] = await Promise.all([
      getUsersCountServer(),
      getOrdersCountAndRevenueServer(),
      getMonthlyOrdersStatsServer(currentMonth),
      getMonthlyOrdersStatsServer(previousMonth),
    ]);

    // Calculate percentage change for orders and revenue
    const ordersChange = previousMonthStats.count === 0
      ? (currentMonthStats.count > 0 ? 100 : 0)
      : ((currentMonthStats.count - previousMonthStats.count) / previousMonthStats.count) * 100;
    
    const revenueChange = previousMonthStats.revenue === 0
      ? (currentMonthStats.revenue > 0 ? 100 : 0)
      : ((currentMonthStats.revenue - previousMonthStats.revenue) / previousMonthStats.revenue) * 100;

    return NextResponse.json({
      users,
      orders: orders.count,
      revenue: orders.revenue,
      monthly: {
        current: {
          orders: currentMonthStats.count,
          revenue: currentMonthStats.revenue,
        },
        previous: {
          orders: previousMonthStats.count,
          revenue: previousMonthStats.revenue,
        },
        change: {
          orders: Math.round(ordersChange * 100) / 100,
          revenue: Math.round(revenueChange * 100) / 100,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}