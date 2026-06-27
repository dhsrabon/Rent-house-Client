"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createAuthClient } from "better-auth/react";

// Better Auth ক্লায়েন্ট তৈরি করা হচ্ছে
const authClient = createAuthClient();

export default function Navbar() {
  const router = useRouter();
  
  // ইউজারের লগইন সেশন (Session) চেক করা হচ্ছে
  const { data: session, isPending } = authClient.useSession();

  // লগআউট করার ফাংশন
  const handleLogout = async () => {
    await authClient.signOut();
    router.refresh(); // লগআউট হওয়ার পর পেজ রিফ্রেশ করে লগইন বাটন দেখাবে
  };

  return (
    <div className="navbar bg-base-100 shadow-sm px-4 md:px-8 sticky top-0 z-50">
      
      {/* Left Side: Logo */}
      <div className="navbar-start">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
          <span className="text-3xl">🏠</span> HouseNest
        </Link>
      </div>
      
      {/* Center: Main Links */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 font-medium text-gray-600">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/properties">All Properties</Link></li>
        </ul>
      </div>
      
      {/* Right Side: Auth Buttons or User Profile */}
      <div className="navbar-end gap-3">
        {isPending ? (
          // ডাটা লোড হওয়ার সময় ছোট একটি স্পিনার দেখাবে
          <span className="loading loading-spinner loading-md text-primary"></span>
        ) : session ? (
          
          // ইউজার লগইন করা থাকলে এই অংশটুকু দেখাবে
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar ring ring-primary ring-offset-base-100 ring-offset-2">
              <div className="w-10 rounded-full">
                {/* ইউজারের ছবি না থাকলে ডিফল্ট ছবি দেখাবে */}
                <img alt="User Avatar" src={session.user.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60"} />
              </div>
            </div>
            <ul tabIndex={0} className="mt-4 z-[1] p-3 shadow-lg menu menu-sm dropdown-content bg-base-100 rounded-box w-56 border border-gray-100">
              <li className="mb-2 border-b pb-2">
                <div className="flex flex-col items-start pointer-events-none">
                  <span className="font-bold text-neutral text-base">{session.user.name}</span>
                  <span className="text-xs text-gray-400">{session.user.email}</span>
                </div>
              </li>
              <li><Link href="/dashboard" className="py-2 text-base font-medium hover:text-primary">Dashboard</Link></li>
              <li><button onClick={handleLogout} className="py-2 text-base font-bold text-error mt-1 hover:bg-error/10">Logout</button></li>
            </ul>
          </div>

        ) : (

          // ইউজার লগইন করা না থাকলে Login/Register বাটন দেখাবে
          <>
            <Link href="/login" className="btn btn-outline btn-primary rounded-full px-6">Login</Link>
            <Link href="/register" className="btn btn-primary text-white rounded-full px-6">Register</Link>
          </>

        )}
      </div>
    </div>
  );
}