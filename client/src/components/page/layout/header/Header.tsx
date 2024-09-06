import HanapBHLogo from "@/components/svg/HanapBHLogo";
import Link from "next/link";
import React from "react";
import AddPlace from "./AddPlace";
import HeaderDropdownMenu from "./HeaderDropdownMenu";
import Navigation from "./Navigation";
import HeaderDropdownMenuMobile from "./HeaderDropdownMenuMobile";
import Logo from "./Logo";

export default function Header() {
  return (
    <header className="w-screen flex shadow-sm items-center sticky top-0 z-10 bg-background">
      {/* Desktop */}
      <div className="hidden sm:grid grid-cols-3 px-8 lg:px-10 py-1 grow">
        <Logo />
        <Navigation />
        <div className="flex items-center justify-end gap-4 lg:gap-8">
          <AddPlace />
          <HeaderDropdownMenu />
        </div>
      </div>
      {/* Mobile */}
      <span className="sm:hidden grow space-y-2">
        <div className="flex justify-between grow px-4 py-2">
          <Logo />

          <HeaderDropdownMenuMobile />
        </div>
        <Navigation />
      </span>
    </header>
  );
}
