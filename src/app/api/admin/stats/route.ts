// src/app/api/admin/stats/route.ts

// a server component that fetches the stats from the database 
// and returns them as a JSON object for the admin dashboard

import { NextResponse } from 'next/server';
import { getUsersCount } from '@/lib/firestore/user';
import { getOrdersCountAndRevenue } from '@/lib/firestore/order';

export const revalidate = 3600; // 1 hour cache

export async function GET() {
  try {
    const [users, orders] = await Promise.all([
      getUsersCount(),
      getOrdersCountAndRevenue(),
    ]);

    return NextResponse.json({
      users,
      orders: orders.count,
      revenue: orders.revenue,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}