import { NextResponse } from "next/server";

export function middleware(request) {
  // কুকি থেকে লগইন টোকেন খোঁজা হচ্ছে
  const sessionToken = request.cookies.get("better-auth.session_token")?.value || 
                       request.cookies.get("__Secure-better-auth.session_token")?.value;

  // টোকেন না থাকলে (লগইন না করা থাকলে) এবং ড্যাশবোর্ডে যাওয়ার চেষ্টা করলে
  if (!sessionToken && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // লগইন করা থাকলে যেতে দেবে
  return NextResponse.next();
}

// কোন কোন লিংকের জন্য এই সিকিউরিটি কাজ করবে
export const config = {
  matcher: ["/dashboard/:path*"],
};