"use client";

import { useEffect, useRef } from "react";
import { trackPurchase } from "@/lib/metaPixel";

interface TrackPurchaseProps {
  orderId: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity?: number;
  }>;
  total: number;
  currency?: string;
}

export default function TrackPurchase({
  orderId,
  items,
  total,
  currency,
}: TrackPurchaseProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    trackPurchase(orderId, items, total, currency);
  }, [orderId, items, total, currency]);

  return null;
}
