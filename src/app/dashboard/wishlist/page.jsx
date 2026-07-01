"use client";

import { useEffect, useState } from "react";
import { createAuthClient } from "better-auth/react";
import Link from "next/link";
import toast from "react-hot-toast";

const authClient = createAuthClient();

export default function WishlistPage() {
  const { data: session } = authClient.useSession();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    const storageKey = `houseNest-wishlist-${session.user.id}`;
    const savedWishlist = JSON.parse(window.localStorage.getItem(storageKey) || "[]");
    setWishlist(savedWishlist);

    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/wishlist/${session.user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.wishlist)) {
          const merged = [...savedWishlist, ...data.wishlist.filter((item) => !savedWishlist.some((saved) => (saved.propertyId?._id || saved._id) === (item.propertyId?._id || item._id)))];
          setWishlist(merged);
          window.localStorage.setItem(storageKey, JSON.stringify(merged));
        }
      })
      .catch(() => {
        setWishlist(savedWishlist);
      })
      .finally(() => setLoading(false));
  }, [session]);

  const handleDelete = (id) => {
    const updated = wishlist.filter((item) => (item.propertyId?._id || item._id) !== id);
    setWishlist(updated);
    if (session?.user?.id) {
      window.localStorage.setItem(`houseNest-wishlist-${session.user.id}`, JSON.stringify(updated));
    }
    toast.success("Removed from wishlist.");
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
      <p className="text-gray-500 mb-8">Keep track of the properties you want to revisit later.</p>

      {wishlist.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-2xl border border-gray-100 shadow-sm">No properties in wishlist.</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
          <table className="table w-full">
            <thead className="bg-gray-50">
              <tr>
                <th>Property</th>
                <th>Location</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {wishlist.map((item) => {
                const property = item.propertyId || item;
                const propertyId = property._id || property.id;
                return (
                  <tr key={propertyId} className="hover:bg-gray-50">
                    <td>
                      <div className="font-semibold text-neutral">{property.title || "Unknown Property"}</div>
                    </td>
                    <td>{property.location || "Unknown location"}</td>
                    <td>${property.price || 0} / month</td>
                    <td>
                      <div className="flex gap-2">
                        <Link href={`/properties/${propertyId}`} className="btn btn-sm btn-primary text-white">View</Link>
                        <button onClick={() => handleDelete(propertyId)} className="btn btn-sm btn-ghost text-error">Remove</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}