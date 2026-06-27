"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AllProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ location: "", type: "All", minPrice: "", maxPrice: "" });

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      const query = new URLSearchParams();
      if (filters.location) query.append("location", filters.location);
      if (filters.type !== "All") query.append("type", filters.type);
      if (filters.minPrice) query.append("minPrice", filters.minPrice);
      if (filters.maxPrice) query.append("maxPrice", filters.maxPrice);

      try {
        // রিকোয়েস্ট ইউআরএল
        const url = `http://localhost:5000/api/properties/all?${query.toString()}`;
        console.log("Fetching URL:", url); // কনসোলে দেখুন সঠিক ইউআরএল যাচ্ছে কিনা

        const res = await fetch(url);
        const data = await res.json();
        
        if (data.success) {
          setProperties(data.properties);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [filters]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Explore Properties</h1>
      
      <div className="bg-gray-100 p-4 rounded-xl mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input type="text" placeholder="Location..." className="input input-bordered" onChange={(e) => setFilters({...filters, location: e.target.value})} />
        <select className="select select-bordered" onChange={(e) => setFilters({...filters, type: e.target.value})}>
          <option value="All">All Types</option>
          <option value="Apartment">Apartment</option>
          <option value="Villa">Villa</option>
          <option value="Commercial">Commercial</option>
        </select>
        <input type="number" placeholder="Min Price" className="input input-bordered" onChange={(e) => setFilters({...filters, minPrice: e.target.value})} />
        <input type="number" placeholder="Max Price" className="input input-bordered" onChange={(e) => setFilters({...filters, maxPrice: e.target.value})} />
      </div>

      {loading ? <p>Loading...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {properties.length > 0 ? (
            properties.map((prop) => (
              <div key={prop._id} className="card bg-white shadow-md p-4">
                <img src={prop.images?.[0] || "https://via.placeholder.com/400x300"} className="h-40 w-full object-cover rounded-lg" alt={prop.title}/>
                <h2 className="font-bold mt-2 text-lg">{prop.title}</h2>
                <p className="text-gray-500">{prop.location}</p>
                <p className="text-primary font-bold text-xl">${prop.price}</p>
                <Link href={`/properties/${prop._id}`} className="btn btn-sm btn-primary mt-2 w-full">View Details</Link>
              </div>
            ))
          ) : (
            <p>No properties found.</p>
          )}
        </div>
      )}
    </div>
  );
}