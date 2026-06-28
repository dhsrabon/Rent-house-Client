"use client";

// 🟢 এখানে @ এর বদলে ../ ব্যবহার করা হয়েছে
import CustomerReviews from "../components/shared/CustomerReviews"; 
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  const router = useRouter();
  const [featured, setFeatured] = useState([]);
  
  // Search Form State
  const [searchQuery, setSearchQuery] = useState({
    location: "",
    type: "All",
    minPrice: "",
    maxPrice: "",
  });

  // Featured Properties Fetch
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/properties/featured`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setFeatured(data.properties);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams(searchQuery).toString();
    router.push(`/properties?${query}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. Banner Section with Framer Motion */}
      <section className="relative w-full h-[600px] flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/50"></div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-10">
          <motion.h1 
            initial={{ opacity: 0, y: -30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            Find Your Perfect Home
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 1, delay: 0.3 }}
            className="text-lg text-gray-200 mb-10"
          >
            Discover top-rated properties, seamlessly book your stay, and enjoy a transparent rental experience.
          </motion.p>

          {/* Search Bar */}
          <motion.form 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.5, delay: 0.5 }}
            onSubmit={handleSearch} 
            className="bg-white p-4 rounded-2xl shadow-lg flex flex-col md:flex-row gap-4 w-full"
          >
            <input 
              type="text" 
              placeholder="Location..." 
              className="input input-bordered w-full"
              value={searchQuery.location}
              onChange={(e) => setSearchQuery({ ...searchQuery, location: e.target.value })}
            />
            <select 
              className="select select-bordered w-full"
              value={searchQuery.type}
              onChange={(e) => setSearchQuery({ ...searchQuery, type: e.target.value })}
            >
              <option value="All">Property Type</option>
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Villa">Villa</option>
              <option value="Office">Office</option>
            </select>
            <input 
              type="number" 
              placeholder="Min Price" 
              className="input input-bordered w-full"
              value={searchQuery.minPrice}
              onChange={(e) => setSearchQuery({ ...searchQuery, minPrice: e.target.value })}
            />
            <input 
              type="number" 
              placeholder="Max Price" 
              className="input input-bordered w-full"
              value={searchQuery.maxPrice}
              onChange={(e) => setSearchQuery({ ...searchQuery, maxPrice: e.target.value })}
            />
            <button type="submit" className="btn btn-primary text-white w-full md:w-auto px-8">
              Search
            </button>
          </motion.form>
        </div>
      </section>

      {/* 2. Featured Properties Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Featured Properties</h2>
          <p className="text-gray-500">Hand-picked properties for you</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((property, index) => (
            <motion.div 
              key={property._id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
            >
              <img 
                src={property.images?.[0] || "https://via.placeholder.com/400x250"} 
                alt={property.title} 
                className="w-full h-56 object-cover"
              />
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="badge badge-primary badge-outline">{property.type}</span>
                    <span className="text-xl font-bold text-primary">${property.price}/mo</span>
                  </div>
                  <h3 className="font-bold text-xl mb-2">{property.title}</h3>
                  <p className="text-gray-500 text-sm mb-4">📍 {property.location}</p>
                </div>
                <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-auto">
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>🛏️ {property.bedrooms} Beds</span>
                    <span>🛁 {property.bathrooms} Baths</span>
                  </div>
                  <Link href={`/properties/${property._id}`} className="btn btn-sm btn-primary text-white">
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Why Choose Us Section */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-12">Why Choose HouseNest?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-2">Secure Payments</h3>
              <p className="text-gray-500">Your transactions are protected by industry-leading Stripe security.</p>
            </div>
            <div className="p-6">
              <div className="text-5xl mb-4">🏠</div>
              <h3 className="text-xl font-bold mb-2">Verified Properties</h3>
              <p className="text-gray-500">Every property goes through a strict admin approval process.</p>
            </div>
            <div className="p-6">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">Fast Booking</h3>
              <p className="text-gray-500">Instantly request bookings and get fast responses from owners.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Customer Reviews */}
      <CustomerReviews />
    </div>
  );
}