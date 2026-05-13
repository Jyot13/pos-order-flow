"use client";

import { usePathname } from "next/navigation";
import BottomNav from "../components/layout/Navbar";
// import BottomNav from "../components/layout/Navbar";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  const hideNavRoutes = ["/"]; // Add routes here

  return (
    <>
      {!hideNavRoutes.includes(pathname) && <BottomNav/> }
      {children}
    </>
  );
}