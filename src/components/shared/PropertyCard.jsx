"use client";

import Link from 'next/link';
import { createAuthClient } from 'better-auth/react';

const authClient = createAuthClient();

export default function PropertyCard({ property }) {
  const { data: session } = authClient.useSession();
  
  // প্রপার্টি আইডি নিশ্চিত করা (MongoDB _id যদি হয়)
  const id = property._id || property.id;
  const { title, image, location, propertyType, price, bedrooms, bathrooms } = property;

  const handleWishlist = async () => {
    if (!session?.user?.id) {
      alert("Please login to add to wishlist!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/wishlist/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: session.user.id, 
          propertyId: id 
        }),
      });
      
      const data = await res.json();
      if (data.success) {
        alert("❤️ Added to Wishlist!");
      } else {
        alert("⚠️ " + data.message);
      }
    } catch (error) {
      alert("Error adding to wishlist");
    }
  };

  return (
    <div className="card w-full bg-base-100 shadow-xl border border-gray-100 transition-transform duration-300 hover:-translate-y-2 relative">
      
      {/* Wishlist Heart Button */}
      <button 
        onClick={handleWishlist}
        className="absolute top-4 left-4 z-10 btn btn-circle btn-sm bg-white/90 hover:bg-white text-red-500 shadow-md border-none"
      >
        ❤️
      </button>

      <figure className="relative h-60 w-full">
        <img src={image} alt={title} className="object-cover w-full h-full" />
        <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold capitalize">
          {propertyType}
        </div>
      </figure>

      <div className="card-body p-5">
        <h2 className="card-title text-xl text-neutral font-bold truncate">
          {title}
        </h2>
        <p className="text-gray-500 flex items-center gap-1 text-sm mt-1">
          📍 {location}
        </p>
        
        <div className="flex justify-between items-center mt-4 border-t pt-4 border-gray-100">
          <div className="flex gap-4 text-sm text-gray-600 font-medium">
            <span>🛏️ {bedrooms} Beds</span>
            <span>🛁 {bathrooms} Baths</span>
          </div>
          <div className="text-lg font-bold text-primary">
            ${price} <span className="text-sm text-gray-500 font-normal">/mo</span>
          </div>
        </div>

        <div className="card-actions justify-end mt-4">
          <Link href={`/properties/${id}`} className="btn btn-primary w-full text-white">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}