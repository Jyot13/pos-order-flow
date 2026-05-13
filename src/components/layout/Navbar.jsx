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
    <nav className="fixed bottom-0 left-0 right-0 bg-white z-50 border-t border-[#E8DDD0] font-raleway">
      <div className="flex justify-around items-stretch h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative flex flex-col items-center justify-center flex-1 text-[10px] tracking-widest uppercase transition-colors duration-200 ${
                isActive ? "text-[#CCA665]" : "text-[#9E958B]"
              }`}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[1.5px] bg-[#CCA665]" />
              )}
              <Icon
                size={18}
                className={`mb-1 transition-colors duration-200 ${
                  isActive ? "text-[#CCA665]" : "text-[#BDA070]"
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
