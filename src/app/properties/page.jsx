"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AllProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ location: "", type: "All", minPrice: "", maxPrice: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      const query = new URLSearchParams();
      if (filters.location) query.append("location", filters.location);
      if (filters.type !== "All") query.append("type", filters.type);
      if (filters.minPrice) query.append("minPrice", filters.minPrice);
      if (filters.maxPrice) query.append("maxPrice", filters.maxPrice);

      try {
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/properties/all?${query.toString()}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.success) {
          setProperties(data.properties || []);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    setCurrentPage(1);
    fetchProperties();
  }, [filters]);

  const totalPages = Math.max(1, Math.ceil(properties.length / itemsPerPage));
  const paginatedProperties = properties.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Explore Properties</h1>

      <div className="bg-gray-100 p-4 rounded-xl mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input type="text" placeholder="Location..." className="input input-bordered" value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} />
        <select className="select select-bordered" value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
          <option value="All">All Types</option>
          <option value="Apartment">Apartment</option>
          <option value="Villa">Villa</option>
          <option value="Commercial">Commercial</option>
        </select>
        <input type="number" placeholder="Min Price" className="input input-bordered" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} />
        <input type="number" placeholder="Max Price" className="input input-bordered" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} />
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><span className="loading loading-spinner loading-lg text-primary"></span></div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {paginatedProperties.length > 0 ? (
              paginatedProperties.map((prop) => (
                <div key={prop._id} className="card bg-white shadow-md p-4">
                  <img src={prop.images?.[0] || "https://via.placeholder.com/400x300"} className="h-40 w-full object-cover rounded-lg" alt={prop.title} />
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

          <div className="flex justify-center gap-2 mt-8">
            <button className="btn btn-sm" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1}>
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button key={index + 1} className={`btn btn-sm ${currentPage === index + 1 ? "btn-primary text-white" : "btn-outline"}`} onClick={() => setCurrentPage(index + 1)}>
                {index + 1}
              </button>
            ))}
            <button className="btn btn-sm" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}