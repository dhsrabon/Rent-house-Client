"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  // ৩টি স্টেট: 'loading', 'success', 'error'
  const [status, setStatus] = useState("loading"); 

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    const verifyPayment = async () => {
      try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        const data = await res.json();

        if (data.success) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
      }
    };

    // ফাংশনটি কল করা হচ্ছে
    verifyPayment();
  }, [sessionId]);

  // ১. লোডিং স্টেট (যখন ব্যাকএন্ডে ভেরিফাই হচ্ছে)
  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <h2 className="text-2xl font-semibold mt-6 text-gray-700">Verifying your payment...</h2>
        <p className="text-gray-500 mt-2">Please do not close or refresh this page.</p>
      </div>
    );
  }

  // ২. এরর স্টেট (পেমেন্ট ফেইল করলে বা ভুল সেশন আইডি হলে)
  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Verification Failed</h2>
        <p className="text-gray-600 mb-8 max-w-md">We couldn't verify your payment. If the amount was deducted, please contact our support team.</p>
        <Link href="/" className="btn btn-primary px-8">Return to Home</Link>
      </div>
    );
  }

  // ৩. সাকসেস স্টেট (পেমেন্ট সফল হলে এবং ডাটাবেসে সেভ হলে)
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
      </div>
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Payment Successful! 🎉</h2>
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
        Your booking request has been successfully placed. The property owner will review it shortly. You can check the status in your dashboard.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        {/* রিকোয়ারমেন্ট অনুযায়ী Tenant Dashboard-এর লিংক */}
        <Link href="/dashboard/my-bookings" className="btn btn-success text-white px-8 hover:scale-105 transition-transform">
          Go to My Bookings
        </Link>
        <Link href="/" className="btn btn-outline px-8 hover:scale-105 transition-transform">
          Continue Exploring
        </Link>
      </div>
    </div>
  );
}

// মূল পেজ কম্পোনেন্ট
export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10 px-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
        <Suspense fallback={<div className="text-center py-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>}>
          <SuccessContent />
        </Suspense>
      </div>
    </div>
  );
}