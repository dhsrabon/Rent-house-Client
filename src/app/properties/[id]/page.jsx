"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient();

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id; 
  
  const { data: session } = authClient.useSession();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal Fields
  const [moveInDate, setMoveInDate] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchProperty = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/properties/${id}`);
        const data = await res.json();
        if (data.success) setProperty(data.property);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleOpenModal = () => {
    if (!session?.user) {
      alert("Please login first to book this property!");
      router.push("/login");
      return;
    }
    if (session.user.id === property.ownerId) {
      alert("You cannot book your own property!");
      return;
    }
    setIsModalOpen(true);
  };

  const handleProceedToPayment = async (e) => {
    e.preventDefault();
    setPaymentLoading(true);

    try {
      console.log("১. ব্যাকএন্ডে ডেটা পাঠানো হচ্ছে...");
      const requestBody = {
        propertyId: property._id,
        propertyTitle: property.title,
        amount: property.price,
        tenantId: session?.user?.id || session?.user?._id, 
        tenantName: session?.user?.name,
        ownerId: property.ownerId,
        moveInDate,
        contactNumber,
        notes
      };
      
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      console.log("২. ব্যাকএন্ড থেকে রেসপন্স এসেছে...");
      const sessionData = await res.json(); 

      // সরাসরি URL-এ রিডাইরেক্ট (কোনো Stripe.js ফাংশন ছাড়াই)
      if (sessionData.url) {
        window.location.href = sessionData.url; 
      } else {
        alert("Payment session failed! Error: " + (sessionData.message || "Unknown backend error"));
      }
    } catch (error) {
      console.error("❌ Payment catch block error:", error);
      alert("Error Details: " + error.message);
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
  if (!property) return <div className="text-center py-20 text-xl font-bold text-red-500">Property not found!</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900">{property.title}</h1>
        <p className="text-gray-500 text-lg mt-1 mb-6">📍 {property.location}</p>

        <img src={property.images?.[0] || "/placeholder.jpg"} className="w-full h-[500px] object-cover rounded-2xl mb-8 shadow-md" alt={property.title} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold mb-4">Description</h3>
            <p className="text-gray-600">{property.description}</p>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-lg sticky top-24 border border-gray-100">
              <h2 className="text-3xl font-bold text-primary mb-4">${property.price} / month</h2>
              
              <button onClick={handleOpenModal} className="btn btn-primary w-full text-white mb-3">
                Book Property
              </button>
              
              <button className="btn btn-outline btn-secondary w-full">
                ❤️ Add to Favorites
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Complete Booking Info</h2>
            <form onSubmit={handleProceedToPayment}>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">User Info (Read Only)</label>
                <input type="text" value={session?.user?.name || ""} disabled className="input input-bordered w-full bg-gray-100" />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Move-in Date *</label>
                <input type="date" required value={moveInDate} onChange={(e) => setMoveInDate(e.target.value)} className="input input-bordered w-full" />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Contact Number *</label>
                <input type="text" required value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className="input input-bordered w-full" placeholder="+880..." />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Additional Notes</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="textarea textarea-bordered w-full" placeholder="Any special requests?"></textarea>
              </div>
              
              <div className="flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-ghost w-1/2">Cancel</button>
                <button type="submit" disabled={paymentLoading} className="btn btn-success text-white w-1/2">
                  {paymentLoading ? "Redirecting..." : `Pay $${property.price}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}