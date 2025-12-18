import Stripe from "stripe";
import { getOrderServer } from "@/lib/firestore/order.server";
import OrderDetails from "@/components/sections/OrderDetails";
import Link from "next/link";
import ClearCartOnSuccess from "@/components/ClearCartOnSuccess";
import TrackPurchase from "@/components/TrackPurchase";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  if (!session_id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white">
        <p className="text-gray-400 text-2xl">
          Oops! Something went wrong. Please try again or contact support.
        </p>
        <Link
          href="/"
          className="text-white mt-4 bg-primary/80 hover:bg-primary/70 transition-colors px-4 py-2 rounded-md"
        >
          Go back to home
        </Link>
      </div>
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-06-30.basil",
  });

  // Find session based on sessionId
  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(session_id);
  } catch {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white">
        <p className="text-gray-400 text-2xl">
          We couldn&apos;t find your order. Please try again or contact support.
        </p>
        <Link
          href="/"
          className="text-white mt-4 bg-primary/80 hover:bg-primary/70 transition-colors px-4 py-2 rounded-md"
        >
          Go back to home
        </Link>
      </div>
    );
  }

  let order;
  try {
    order = await getOrderServer(session.payment_intent as string);
  } catch (error) {
    console.error("Error fetching order:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white">
        <p className="text-gray-400 text-2xl">
          Your payment was successful, but we couldn&apos;t load your order
          details. Please check your email for download links.
        </p>
        <Link
          href="/"
          className="text-white mt-4 bg-primary/80 hover:bg-primary/70 transition-colors px-4 py-2 rounded-md"
        >
          Go back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <ClearCartOnSuccess />
      {order && (
        <>
          <TrackPurchase
            orderId={order.id}
            items={order.orderItems.map((item) => ({
              id: item.id,
              name: item.title,
              price: item.price,
              quantity: 1,
            }))}
            total={order.total_price}
            currency="USD"
          />
          <OrderDetails order={order} />
        </>
      )}
    </div>
  );
}
