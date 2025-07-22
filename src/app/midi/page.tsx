"use client";

import { getMidiById } from "@/lib/firestore/midifiles";
import { notFound } from "next/navigation";
import BackButton from "@/components/ui/BackButton";
import PlayButton from "@/components/ui/PlayButton";
import { addToCart, getCartItems, removeFromCart } from "@/lib/cart";
import { CartItem } from "@/lib/types/cartItem";
import { CheckCircleIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Midi } from "@/lib/types/midi";

interface MidiPageProps {
  searchParams: Promise<{ id?: string }>;
}

export default function MidiPage({ searchParams }: MidiPageProps) {
  const [midi, setMidi] = useState<Midi | null>(null);
  const [isAdded, setIsAdded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMidi = async () => {
      const id = (await searchParams).id as string;
      console.log("MIDI ID:", id);

      if (!id) {
        notFound();
      }

      try {
        const midiData = await getMidiById(id);
        if (!midiData) {
          notFound();
        }
        setMidi(midiData);
      } catch (error) {
        console.error("Error fetching MIDI file:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchMidi();
  }, [searchParams]);

  useEffect(() => {
    if (midi) {
      const update = () => {
        const cartItems = getCartItems();
        setIsAdded(cartItems.some((item: CartItem) => item.id === midi.id));
      };
      update();
      window.addEventListener("cart-updated", update);
      return () => window.removeEventListener("cart-updated", update);
    }
  }, [midi]);

  const handleAddToCart = (item: CartItem) => {
    if (isAdded) {
      removeFromCart(midi!.id);
      setIsAdded(false);
    } else {
      addToCart(item);
      setIsAdded(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-16">
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span className="ml-2 text-white">Loading...</span>
        </div>
      </div>
    );
  }

  if (!midi) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4 py-20 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <BackButton />
        </div>

        {/* MIDI file details */}
        <div className="lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16 mx-auto">
          {/* MIDI preview/audio player */}
          <div className="lg:col-span-4 lg:row-end-1">
            <div className="aspect-4/3 w-full rounded-lg bg-gray-900 object-cover flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🎵</div>
                <h3 className="text-white text-lg font-medium">MIDI Preview</h3>
                <p className="text-gray-400 text-sm mt-2">
                  {midi.name} - {midi.bpm} BPM
                </p>
                {/* Audio player */}
                <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                  <PlayButton previewUrl={midi.preview_url} />
                </div>
              </div>
            </div>
          </div>

          {/* MIDI file details */}
          <div className="mx-auto mt-14 max-w-xs lg:w-md sm:mt-16 lg:col-span-3 lg:row-span-2 lg:row-end-2 lg:mt-0 lg:max-w-none">
            <div className="flex flex-col-reverse">
              <div className="mt-4">
                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {midi.name}
                </h1>

                <h2 id="information-heading" className="sr-only">
                  MIDI file information
                </h2>

                {/* MIDI file specifications */}
                <div className="mt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-400">Key</h3>
                      <p className="text-white">
                        {midi.root} {midi.scale}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-400">BPM</h3>
                      <p className="text-white">{midi.bpm}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-400">
                        Genre
                      </h3>
                      <p className="text-white">{midi.genre}</p>
                    </div>
                  </div>

                  {/* TODO: Add VST and preset (maybe?) */}
                  {/* {midi.vst && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-400">VST</h3>
                      <p className="text-white">{midi.vst}</p>
                    </div>
                  )}

                  {midi.preset && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-400">
                        Preset
                      </h3>
                      <p className="text-white">{midi.preset}</p>
                    </div>
                  )} */}

                  {midi.tags && midi.tags.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-400">
                        Tags
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {midi.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-medium text-gray-400">
                      Created
                    </h3>
                    <p className="text-white">
                      {midi.created_at instanceof Date
                        ? midi.created_at.toLocaleDateString()
                        : new Date(midi.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="mt-6">
              {midi.is_discounted && midi.discount_price ? (
                <div className="flex items-center gap-2">
                  <p className="text-white text-lg font-bold">
                    ${midi.discount_price}
                  </p>
                  <p className="text-gray-400 text-lg line-through">
                    ${midi.price}
                  </p>
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                    SALE
                  </span>
                </div>
              ) : (
                <p className="text-white text-lg font-bold">${midi.price}</p>
              )}
            </div>

            {/* Add to Cart Button */}
            <div className="mt-4">
              {isAdded ? (
                <button
                  className="bg-primary/20 text-white rounded-md w-full px-4 py-2 flex items-center justify-center flex-row hover:bg-primary/10 hover:cursor-pointer transition-all duration-300"
                  onClick={() =>
                    handleAddToCart({
                      id: midi.id,
                      title: midi.name,
                      price:
                        midi.is_discounted && midi.discount_price
                          ? midi.discount_price
                          : midi.price,
                      type: "midi",
                    })
                  }
                >
                  <div className="flex items-center justify-center gap-2">
                    <p>In Cart</p>
                    <CheckCircleIcon className="w-4 h-4" />
                  </div>
                </button>
              ) : (
                <button
                  className="w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80 hover:cursor-pointer hover:scale-102 transition-all duration-300"
                  onClick={() =>
                    handleAddToCart({
                      id: midi.id,
                      title: midi.name,
                      price:
                        midi.is_discounted && midi.discount_price
                          ? midi.discount_price
                          : midi.price,
                      type: "midi",
                    })
                  }
                >
                  <div className="flex items-center justify-center gap-2">
                    <p>Add to Cart</p>
                    <ShoppingCartIcon className="w-4 h-4" />
                  </div>
                </button>
              )}
            </div>

            {/* Share section */}
            <div className="mt-10 border-t border-gray-200 pt-10">
              <h3 className="text-sm font-medium text-gray-400">Share</h3>
              <ul role="list" className="mt-4 flex items-center space-x-6">
                <li>
                  <a
                    href="#"
                    className="flex size-6 items-center justify-center text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Share on Facebook</span>
                    <svg
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                      className="size-5"
                    >
                      <path
                        d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                        clipRule="evenodd"
                        fillRule="evenodd"
                      />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex size-6 items-center justify-center text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Share on Instagram</span>
                    <svg
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="size-6"
                    >
                      <path
                        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                        clipRule="evenodd"
                        fillRule="evenodd"
                      />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex size-6 items-center justify-center text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Share on X</span>
                    <svg
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                      className="size-5"
                    >
                      <path d="M11.4678 8.77491L17.2961 2H15.915L10.8543 7.88256L6.81232 2H2.15039L8.26263 10.8955L2.15039 18H3.53159L8.87581 11.7878L13.1444 18H17.8063L11.4675 8.77491H11.4678ZM9.57608 10.9738L8.95678 10.0881L4.02925 3.03974H6.15068L10.1273 8.72795L10.7466 9.61374L15.9156 17.0075H13.7942L9.57608 10.9742V10.9738Z" />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
