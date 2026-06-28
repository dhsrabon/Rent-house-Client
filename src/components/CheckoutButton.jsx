"use client";

import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";

// আপনার .env.local ফাইলে থাকা পাবলিক কি
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutButton({ amount, title }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const stripe = await stripePromise;

      // 🔴 এখানে পরিবর্তন করা হয়েছে: localhost:5000 (আপনার এক্সপ্রেস ব্যাকএন্ড)
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, propertyTitle: title }),
      });

      const data = await res.json();

      if (data.error) {
        alert("Error: " + data.error);
        setLoading(false);
        return;
      }

      // স্ট্রাইপের পেজে রিডাইরেক্ট
      await stripe.redirectToCheckout({ sessionId: data.id });
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong with the payment!");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="btn btn-primary w-full text-white mt-4"
    >
      {loading ? "Processing..." : `Pay Now ($${amount})`}
    </button>
  );
}