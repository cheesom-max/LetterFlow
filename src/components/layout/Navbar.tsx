"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass border-b border-gray-200/50 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-200 group-hover:shadow-lg group-hover:shadow-indigo-300 transition-shadow">
              <span className="text-white font-bold text-sm">LF</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              Letter<span className="gradient-text">Flow</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors">
              Pricing
            </a>
            <Link href="/auth/login" className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors">
              Log in
            </Link>
            <Link href="/auth/signup">
              <Button size="sm">Try Free</Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-lg px-4 py-4 space-y-3 shadow-lg">
          <a href="#features" className="block text-sm font-medium text-gray-600 hover:text-indigo-600 py-2">Features</a>
          <a href="#pricing" className="block text-sm font-medium text-gray-600 hover:text-indigo-600 py-2">Pricing</a>
          <Link href="/auth/login" className="block text-sm font-medium text-gray-600 hover:text-indigo-600 py-2">Log in</Link>
          <Link href="/auth/signup">
            <Button className="w-full mt-2">Try Free</Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
