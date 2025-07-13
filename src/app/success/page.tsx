import Stripe from "stripe";
import { getOrder } from "@/lib/firestore/order";
import OrderDetails from "@/components/sections/OrderDetails";
import Link from "next/link";
import ClearCartOnSuccess from "@/components/ClearCartOnSuccess";

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

  const order = await getOrder(session.payment_intent as string);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <ClearCartOnSuccess />
      {order && <OrderDetails order={order} />}
    </div>
  );
}
