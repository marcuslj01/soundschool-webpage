import { Order } from "@/lib/types/order";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";

export default function OrderDetails({ order }: { order: Order }) {
  return (
    <main className="relative lg:min-h-full">
      <div>
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24">
          <div className="lg:col-start-1">
            <Image
              src="/images/Hero.png"
              alt="Success"
              width={1000}
              height={1000}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="lg:col-start-2">
            <h1 className="text-sm font-medium text-green-500 mt-4 lg:mt-0">
              Payment successful
            </h1>
            <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Thanks for your order!
            </p>
            <p className="mt-2 text-base text-gray-200 max-w-md">
              Here are the details of your order. An email confirmation is sent
              to your email address.
            </p>

            <dl className="mt-8 text-sm font-medium text-gray-400 space-y-1">
              <div>
                <dt className="text-gray-300">Order ID</dt>
                <dd className="text-primary break-all">{order.payment_id}</dd>
              </div>
              <div>
                <dt className="text-gray-300">E-mail</dt>
                <dd className="text-white">{order.customer_email}</dd>
              </div>
              <div>
                <dt className="text-gray-300">Date</dt>
                <dd className="text-white">
                  {order.created_at?.toDate
                    ? order.created_at.toDate().toLocaleString()
                    : ""}
                </dd>
              </div>
              <div>
                <dt className="text-gray-300">Status</dt>
                <dd className="text-white capitalize">{order.status}</dd>
              </div>
            </dl>

            <p className="text-white font-semibold text-2xl mt-8">
              Your products:
            </p>
            <ul
              role="list"
              className="mt-8 divide-y divide-gray-700 border-t border-gray-700 text-sm font-medium text-gray-300"
            >
              {order.orderItems.map((item) => (
                <li key={item.id} className="flex space-x-6 py-6 items-center">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-sm lg:text-lg">
                      {item.title}
                    </h3>
                  </div>
                  <p className="flex-none font-medium text-white text-sm lg:text-lg">
                    ${item.price}
                  </p>
                  <a
                    href={item.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-4 p-2 rounded-full bg-primary/80 hover:bg-primary/70 transition-colors"
                    title="Download file"
                  >
                    <ArrowDownTrayIcon className="w-5 h-5 text-white" />
                  </a>
                </li>
              ))}
            </ul>

            <dl className="space-y-6 border-t border-white pt-6 font-medium mt-8">
              <div className="flex items-center justify-between text-md lg:text-xl text-white font-bold">
                <dt>Total</dt>
                <dd>${order.total_price}</dd>
              </div>
            </dl>

            <div className="mt-8 border-t border-white py-6 text-right">
              <Link
                href="/"
                className="text-sm font-medium text-primary hover:text-primary/80"
              >
                Continue Shopping
                <span aria-hidden="true"> &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
