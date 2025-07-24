import {
  UsersIcon,
  ShoppingBagIcon,
  CubeIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: ChartBarIcon,
    current: false,
  },
  { name: "Users", href: "/admin/users", icon: UsersIcon, current: false },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingBagIcon,
    current: false,
  },
  { name: "Products", href: "/admin/products", icon: CubeIcon, current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  // Update current state based on current path
  const updatedNavigation = navigation.map((item) => ({
    ...item,
    current: pathname.startsWith(item.href),
  }));

  return (
    <div className="flex flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-4 w-64 h-screen">
      <div className="flex h-16 shrink-0 items-center mt-20">
        <h1 className="text-lg font-bold text-white">Admin</h1>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-4">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {updatedNavigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={classNames(
                      item.current
                        ? "bg-indigo-700 text-white"
                        : "text-indigo-200 hover:bg-indigo-700 hover:text-white",
                      "group flex gap-x-3 rounded-md p-2 text-sm font-semibold"
                    )}
                  >
                    <item.icon
                      aria-hidden="true"
                      className={classNames(
                        item.current
                          ? "text-white"
                          : "text-indigo-200 group-hover:text-white",
                        "size-5 shrink-0"
                      )}
                    />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li className="-mx-4 mt-auto">
            <div className="flex items-center gap-x-3 px-4 py-3 text-sm font-semibold text-white">
              <div className="size-7 rounded-full bg-indigo-700 flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {user?.displayName?.charAt(0) || "A"}
                </span>
              </div>
              <span className="truncate">{user?.displayName || "Admin"}</span>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
}
