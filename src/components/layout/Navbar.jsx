"use client";

import Link from "next/link";
import { Home, LayoutGrid, ClipboardList, CreditCard } from "lucide-react";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Menu", href: "/website/menu", icon: LayoutGrid },
  { name: "Orders", href: "/website/order", icon: ClipboardList },
  { name: "Pay Bill", href: "/website/bill", icon: CreditCard },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white z-50 shadow-3xl">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center text-xs ${isActive ? "text-orange-500" : "text-gray-500"
                }`}
            >
              <Icon
                className={`h-5 w-5 mb-1 ${isActive ? "text-orange-500" : "text-gray-400"
                  }`}
              />
              {item.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
