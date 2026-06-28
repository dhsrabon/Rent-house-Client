"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient();

export default function Navbar() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut();
    router.refresh(); 
  };

  return (
    <div className="navbar backdrop-blur-xl bg-base-100/80 sticky top-0 z-50 border-b border-gray-100/50 px-4 md:px-8 transition-all duration-300">
      
      {/* 1. Logo & Website Name */}
      <div className="navbar-start">
        {/* Mobile Menu */}
        <div className="dropdown lg:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow-xl bg-base-100 rounded-2xl w-52 border border-gray-50 gap-2">
            <li><Link href="/" className="hover:text-primary font-medium text-base py-2">Home</Link></li>
            <li><Link href="/properties" className="hover:text-primary font-medium text-base py-2">All Properties</Link></li>
            {/* Mobile Dashboard (If Logged In) */}
            {session && <li><Link href="/dashboard" className="hover:text-primary font-medium text-base py-2">Dashboard</Link></li>}
          </ul>
        </div>
        
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity ml-2 lg:ml-0 cursor-pointer">
          <div className="bg-primary/10 p-2 rounded-xl text-2xl shadow-sm">🏠</div>
          <span className="text-2xl font-extrabold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent hidden sm:block tracking-tight">
            HouseNest
          </span>
        </Link>
      </div>
      
      {/* 2. Main Center Links */}
      <div className="navbar-center hidden lg:flex">
        <ul className="flex items-center gap-8 font-semibold text-gray-600">
          <li>
            <Link href="/" className="relative group hover:text-primary transition-colors py-2">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] rounded-full bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </li>
          <li>
            <Link href="/properties" className="relative group hover:text-primary transition-colors py-2">
              All Properties
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] rounded-full bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </li>
          
          {/* Dashboard Link - Only shows if user is logged in */}
          {session && (
            <li>
              <Link href="/dashboard" className="relative group hover:text-primary transition-colors py-2 text-primary">
                Dashboard
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] rounded-full bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
          )}
        </ul>
      </div>
      
      {/* 3. Auth Buttons (Login/Register OR Logout) */}
      <div className="navbar-end gap-3 lg:gap-4">
        {isPending ? (
          <span className="loading loading-spinner loading-md text-primary"></span>
        ) : session ? (
          
          /* If User is Logged In: Show Name & Logout Button */
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-sm font-bold text-neutral bg-gray-100 px-4 py-2 rounded-full">
              Hi, {session.user.name.split(' ')[0]}
            </span>
            <button onClick={handleLogout} className="btn btn-error btn-outline font-bold rounded-full px-6 shadow-sm hover:shadow-md transition-all">
              Logout
            </button>
          </div>

        ) : (

          /* If User is NOT Logged In: Show Login & Register */
          <div className="flex items-center gap-2">
            <Link href="/login" className="btn btn-ghost font-bold hover:bg-primary/10 hover:text-primary rounded-full px-5 hidden sm:inline-flex transition-colors">
              Login
            </Link>
            <Link href="/register" className="btn btn-primary text-white font-bold rounded-full px-6 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
              Register
            </Link>
          </div>

        )}
      </div>
    </div>
  );
}