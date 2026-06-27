"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient();

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  
  // Better Auth থেকে লগইন করা ইউজারের ডাটা আনা হচ্ছে
  const { data: session, isPending } = authClient.useSession();

  // ডাটা লোড হওয়ার সময় লোডিং স্পিকার
  if (isPending) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // ডাইনামিক রোল নির্ধারণ
  const userRole = session?.user?.role || "tenant"; 

  // Role-based Links
  const tenantLinks = [
    { name: "My Bookings", path: "/dashboard/my-bookings", icon: "📄" },
    { name: "Wishlist", path: "/dashboard/wishlist", icon: "❤️" },
  ];

  const ownerLinks = [
    { name: "My Properties", path: "/dashboard/my-properties", icon: "🏢" },
    { name: "Add Property", path: "/dashboard/add-property", icon: "➕" },
    { name: "Manage Bookings", path: "/dashboard/manage-bookings", icon: "🔔" }, // 🔴 এখানে লিংকটি আপডেট করা হয়েছে
  ];

  const adminLinks = [
    { name: "All Properties", path: "/dashboard/all-properties", icon: "🌐" },
    { name: "All Users", path: "/dashboard/users", icon: "👥" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 hidden md:block flex-shrink-0">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary mb-8">
            <span className="text-2xl">🏠</span> HouseNest
          </Link>

          <nav className="space-y-1">
            {/* Common Links (সবার জন্য) */}
            <Link href="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${pathname === '/dashboard' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}>
              <span>📊</span> Overview
            </Link>
            <Link href="/dashboard/profile" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${pathname === '/dashboard/profile' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}>
              <span>👤</span> My Profile
            </Link>

            <div className="divider my-4"></div>

            {/* Tenant Links */}
            {userRole === "tenant" && tenantLinks.map((link) => (
              <Link key={link.path} href={link.path} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${pathname === link.path ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}>
                <span>{link.icon}</span> {link.name}
              </Link>
            ))}

            {/* Owner Links */}
            {userRole === "owner" && ownerLinks.map((link) => (
              <Link key={link.path} href={link.path} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${pathname === link.path ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}>
                <span>{link.icon}</span> {link.name}
              </Link>
            ))}

            {/* Admin Links */}
            {userRole === "admin" && adminLinks.map((link) => (
              <Link key={link.path} href={link.path} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${pathname === link.path ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}>
                <span>{link.icon}</span> {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}