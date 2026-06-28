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
      
      <div className="navbar-start">
        <div className="dropdown lg:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow-xl bg-base-100 rounded-2xl w-52 border border-gray-50 gap-2">
            <li><Link href="/" className="hover:text-primary font-medium text-base py-2">Home</Link></li>
            <li><Link href="/properties" className="hover:text-primary font-medium text-base py-2">All Properties</Link></li>
          </ul>
        </div>
        
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity ml-2 lg:ml-0 cursor-pointer">
          <div className="bg-primary/10 p-2 rounded-xl text-2xl shadow-sm">🏠</div>
          <span className="text-2xl font-extrabold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent hidden sm:block tracking-tight">
            HouseNest
          </span>
        </Link>
      </div>
      
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
        </ul>
      </div>
      
      <div className="navbar-end gap-3 lg:gap-4">
        {isPending ? (
          <span className="loading loading-spinner loading-md text-primary"></span>
        ) : session ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar border-2 border-primary/20 hover:border-primary transition-colors shadow-sm hover:shadow-md">
              <div className="w-10 rounded-full">
                <img alt="User Avatar" src={session.user.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60"} />
              </div>
            </div>
            <ul tabIndex={0} className="mt-4 z-[1] p-2 shadow-2xl menu menu-sm dropdown-content bg-base-100 rounded-2xl w-64 border border-gray-100">
              
              <li className="mb-1 bg-gray-50/70 rounded-xl pointer-events-none">
                <div className="flex flex-col items-start p-3">
                  <span className="font-bold text-neutral text-base truncate w-full">{session.user.name}</span>
                  <span className="text-xs text-gray-400 font-medium truncate w-full">{session.user.email}</span>
                </div>
              </li>
              <div className="divider my-1 h-[1px]"></div>
              
              <li>
                <Link href="/dashboard" className="py-3 text-sm font-semibold hover:bg-primary/10 hover:text-primary rounded-xl transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
                  Dashboard
                </Link>
              </li>
              
              <li>
                <button onClick={handleLogout} className="py-3 text-sm font-bold text-error hover:bg-error/15 rounded-xl transition-all mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
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