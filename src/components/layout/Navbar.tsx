"use client";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import {
  Bars3Icon,
  ShoppingCartIcon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCartCount } from "@/hooks/useCartCount";
import { getCartItems, removeFromCart } from "@/lib/cart";
import { CartItem } from "@/lib/types/cartItem";

const navigation = [
  { name: "Home", href: "/", current: true },
  // { name: "All midifiles", href: "#", current: false },
  // { name: "Free files", href: "#", current: false },
  // { name: "My files", href: "/files", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const [isMounted, setIsMounted] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const cartCount = useCartCount();
  const [autoOpened, setAutoOpened] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update cartItems when cart changes
  useEffect(() => {
    if (!isMounted) return;
    const update = () => setCartItems(getCartItems());
    update();
    window.addEventListener("cart-updated", update);
    return () => window.removeEventListener("cart-updated", update);
  }, [isMounted]);

  // Close dropdown automatically after 3 seconds when it's opened because of add
  useEffect(() => {
    if (showCartDropdown && autoOpened) {
      const timer = setTimeout(() => setShowCartDropdown(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showCartDropdown, autoOpened]);

  // Open dropdown when clicking on cart
  const handleCartClick = () => {
    setShowCartDropdown((prev) => !prev);
    setAutoOpened(false);
  };

  return (
    <Disclosure as="nav" className="bg-black/80 fixed top-0 w-full z-50">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block size-6 group-data-open:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden size-6 group-data-open:block"
              />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start h-full">
            <Link href="/" className="flex shrink-0 items-center">
              <Image
                alt="SoundSchool logo"
                src="/logo/sslogo.png"
                className="h-8 w-auto"
                width={100}
                height={100}
              />
            </Link>
            <div className="hidden sm:ml-6 sm:block h-full">
              <div className="flex space-x-4 h-full">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    aria-current={item.current ? "page" : undefined}
                    className={classNames(
                      item.current
                        ? "text-white border-primary"
                        : "text-gray-300 hover:border-white border-transparent hover:text-white",
                      "h-full flex items-center justify-center border-b-2"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div
              className="relative hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden hover:cursor-pointer"
              onClick={handleCartClick}
              role="button"
              tabIndex={0}
            >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">View cart</span>
              <ShoppingCartIcon
                color="white"
                aria-hidden="true"
                className="size-6"
              />
              <span className="absolute top-0 right-0 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {isMounted ? cartCount : null}
              </span>
              {/* Cart dropdown */}
              {showCartDropdown && (
                <div className="absolute right-0 mt-2 w-fit min-w-[300px] bg-[#23272f] rounded-xl shadow-2xl border border-gray-800 z-50 p-4">
                  <h3 className="font-bold mb-4 text-lg text-white">My Cart</h3>
                  {cartItems.length === 0 ? (
                    <div className="text-gray-400 py-8">Cart is empty</div>
                  ) : (
                    <>
                      <ul className="mb-4 flex flex-col gap-2">
                        {cartItems.map((item) => (
                          <li
                            key={item.id + item.type}
                            className="flex items-center text-white py-2 px-1 bg-[#23272f] rounded hover:bg-[#2c313a] transition-colors gap-2"
                          >
                            <span className="flex-1 truncate max-w-[200px] text-left text-sm">
                              {item.title}
                            </span>
                            <span className="min-w-[60px] text-right font-mono font-medium">
                              ${item.price}
                            </span>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="ml-2 p-1 rounded hover:bg-red-600 transition-colors"
                              aria-label="Remove from cart"
                            >
                              <XMarkIcon className="w-4 h-4 text-white" />
                            </button>
                          </li>
                        ))}
                      </ul>
                      <div className="h-px w-full bg-gray-700 my-2" />
                      <div className="flex justify-between items-center pt-2">
                        <span className="font-semibold text-white">Total</span>
                        <span className="font-bold text-white text-lg">
                          $
                          {cartItems.reduce(
                            (sum, item) => sum + Number(item.price),
                            0
                          )}
                        </span>
                      </div>
                      <Link
                        href="/cart"
                        className="w-full h-10 rounded-md truncate bg-primary px-1 sm:px-2 py-1 text-sm sm:text-md text-white shadow-xs hover:bg-primary/80 hover:scale-102 focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer mt-4 flex items-center justify-center"
                      >
                        Go to cart
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <UserCircleIcon
                    color="white"
                    aria-hidden="true"
                    className="size-6"
                  />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                <MenuItem>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                  >
                    Your Profile
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                  >
                    Settings
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                  >
                    Sign out
                  </Link>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as={Link}
              href={item.href}
              aria-current={item.current ? "page" : undefined}
              className={classNames(
                item.current
                  ? "text-white border-l-2 border-primary"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                "block px-3 py-2 text-base font-medium "
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
