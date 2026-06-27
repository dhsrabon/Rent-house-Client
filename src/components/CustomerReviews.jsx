"use client";

import { motion } from 'framer-motion';

// ডামি রিভিউ ডাটা (পরে ডাটাবেস থেকে আসবে)
const reviews = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    date: "June 15, 2026",
    rating: 5,
    comment: "This platform is amazing! I found my dream apartment within days. The booking process was incredibly smooth and completely transparent."
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    date: "May 28, 2026",
    rating: 5,
    comment: "Highly recommended. The verified properties gave me peace of mind, and the customer support team was very helpful when I had questions."
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michaelb@example.com",
    date: "April 10, 2026",
    rating: 4,
    comment: "Great experience overall. The property looked exactly like the pictures, and the payment gateway was very secure. Will use again!"
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.d@example.com",
    date: "March 22, 2026",
    rating: 5,
    comment: "As a tenant, I loved the clear communication with the owner through this platform. Everything is very well organized and professional."
  }
];

export default function CustomerReviews() {
  return (
    <section className="py-20 px-4 md:px-8 bg-base-200">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral mb-4">What Our Tenants Say</h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Real stories from our happy customers who found their perfect rental homes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((review, index) => (
            <motion.div 
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-base-100 p-8 rounded-2xl shadow-md border border-gray-100 relative"
            >
              {/* Quote Icon Background */}
              <div className="absolute top-6 right-8 text-primary opacity-10">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-16 h-16"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
              </div>

              {/* Rating Stars */}
              <div className="flex gap-1 text-orange-400 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                  </svg>
                ))}
              </div>

              {/* Comment */}
              <p className="text-gray-600 mb-6 italic text-lg leading-relaxed z-10 relative">
                "{review.comment}"
              </p>

              {/* User Info */}
              <div className="flex items-center gap-4 mt-auto border-t border-gray-100 pt-4">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-neutral">{review.name}</h4>
                  <p className="text-sm text-gray-400">{review.date}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}