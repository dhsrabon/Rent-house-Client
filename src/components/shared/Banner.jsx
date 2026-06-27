"use client";

import { motion } from 'framer-motion';

export default function Banner() {
  return (
    <div 
      className="relative w-full h-[600px] flex items-center justify-center bg-cover bg-center" 
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}
    >
      {/* Dark Overlay যাতে টেক্সটগুলো স্পষ্ট বোঝা যায় */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      {/* Main Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-5xl w-full mt-10">
        
        {/* Title Animation */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-4"
        >
          Find Your Perfect Rental Home
        </motion.h1>

        {/* Description Animation */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg md:text-xl mb-10 text-gray-200"
        >
          Discover the best properties with secure booking, transparent pricing, and top-notch amenities.
        </motion.p>

        {/* Search Bar Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-base-100 p-4 md:p-6 rounded-xl shadow-2xl text-neutral"
        >
          <form className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            
            {/* Location Input */}
            <div className="form-control w-full text-left">
              <label className="label py-1"><span className="label-text font-semibold">Location</span></label>
              <input type="text" placeholder="e.g. Dhaka, Gulshan" className="input input-bordered w-full focus:outline-primary" />
            </div>

            {/* Property Type Select */}
            <div className="form-control w-full text-left">
              <label className="label py-1"><span className="label-text font-semibold">Property Type</span></label>
              <select className="select select-bordered w-full focus:outline-primary" defaultValue="">
                <option value="" disabled>Select Type</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>

            {/* Price Range (Min & Max) */}
            <div className="w-full flex gap-2">
              <div className="form-control w-1/2 text-left">
                <label className="label py-1"><span className="label-text font-semibold">Min Price</span></label>
                <input type="number" placeholder="$0" className="input input-bordered w-full px-2 focus:outline-primary" />
              </div>
              <div className="form-control w-1/2 text-left">
                <label className="label py-1"><span className="label-text font-semibold">Max Price</span></label>
                <input type="number" placeholder="$5000" className="input input-bordered w-full px-2 focus:outline-primary" />
              </div>
            </div>

            {/* Search Button */}
            <div className="form-control w-full">
              <button type="button" className="btn btn-primary w-full text-white text-lg">Search</button>
            </div>
            
          </form>
        </motion.div>
      </div>
    </div>
  );
}