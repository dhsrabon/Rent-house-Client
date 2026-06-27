"use client";

import { useEffect, useState } from "react";
import { createAuthClient } from "better-auth/react";
import Link from "next/link";

const authClient = createAuthClient();

export default function WishlistPage() {
  const { data: session } = authClient.useSession();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`http://localhost:5000/api/wishlist/${session.user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setWishlist(data.wishlist);
          setLoading(false);
        });
    }
  }, [session]);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
      
      {wishlist.length === 0 ? (
        <div className="text-center py-10">No properties in wishlist.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div key={item._id} className="card bg-base-100 shadow-lg">
              <figure><img src={item.propertyId.images?.[0]} alt={item.propertyId.title} /></figure>
              <div className="card-body">
                <h2 className="card-title">{item.propertyId.title}</h2>
                <p>${item.propertyId.price} / month</p>
                <div className="card-actions justify-end">
                  <Link href={`/properties/${item.propertyId._id}`} className="btn btn-primary btn-sm">View</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}