import React from "react";
import { NavLink } from "react-router-dom";
import {
  ShoppingBag,
  Heart,
  User,
  Package,
  MapPin,
  Search,
} from "lucide-react"; // Install with: npm install lucide-react

export default function Navbar() {
  const activeStyle = "text-[#B22222] border-b-2 border-[#B22222]";
  const navItemStyle =
    "flex flex-col items-center gap-1 transition-colors hover:text-[#B22222] px-1";

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#FCF9F1] border-b border-[#1A1A1A] px-6 py-4 font-serif">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo Section */}
        <NavLink
          to="/"
          className="text-4xl font-bold tracking-tighter text-[#1A1A1A]"
        >
          MADHUBAN<span className="text-[#B22222]">.</span>
        </NavLink>

        {/* Search Bar - Center */}
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search for masterpieces..."
            className="w-full bg-white border border-[#1A1A1A] py-2 pl-4 pr-10 focus:outline-none focus:ring-1 focus:ring-[#B22222] transition-all italic text-sm"
          />
          <Search className="absolute right-3 top-2.5 text-[#1A1A1A] w-5 h-5" />
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-6 text-[#1A1A1A] text-[13px] uppercase tracking-widest font-bold">
          <NavLink
            to="/address"
            className={({ isActive }) =>
              `${navItemStyle} ${isActive ? activeStyle : ""}`
            }
          >
            <MapPin size={20} strokeWidth={1.5} />
            <span className="hidden lg:block">Address</span>
          </NavLink>

          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `${navItemStyle} ${isActive ? activeStyle : ""}`
            }
          >
            <Package size={20} strokeWidth={1.5} />
            <span className="hidden lg:block">Orders</span>
          </NavLink>

          <NavLink
            to="/wishlist"
            className={({ isActive }) =>
              `${navItemStyle} ${isActive ? activeStyle : ""}`
            }
          >
            <Heart size={20} strokeWidth={1.5} />
            <span className="hidden lg:block">Wishlist</span>
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `${navItemStyle} ${isActive ? activeStyle : ""}`
            }
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            <span className="hidden lg:block">Cart</span>
          </NavLink>

          <NavLink
            to="/account"
            className={({ isActive }) =>
              `${navItemStyle} ${isActive ? activeStyle : ""}`
            }
          >
            <User size={20} strokeWidth={1.5} />
            <span className="hidden lg:block">Account</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
