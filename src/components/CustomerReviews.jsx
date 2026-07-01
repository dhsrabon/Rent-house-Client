"use client";

import { useEffect, useState } from "react";

const defaultReviews = [
  {
    id: 1,
    name: "Rahim Uddin",
    role: "Tenant",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&q=80",
    rating: 5,
    text: "HouseNest made finding my new apartment incredibly easy. The booking process was seamless, and the owner was very cooperative. Highly recommended!",
  },
  {
    id: 2,
    name: "Sadia Islam",
    role: "Tenant",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80",
    rating: 5,
    text: "I loved how detailed the property cards are! It gave me all the information I needed before booking. The whole experience was just fantastic.",
  },
  {
    id: 3,
    name: "Tanvir Ahmed",
    role: "Tenant",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80",
    rating: 4,
    text: "Very reliable platform. I was able to find a secure and beautiful home for my family. Customer support was also very helpful during the move.",
  },
  {
    id: 4,
    name: "Nusrat Jahan",
    role: "Tenant",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&q=80",
    rating: 5,
    text: "The best house rental service I have ever used. Everything is transparent, and the property was exactly as shown in the pictures.",
  },
];

export default function CustomerReviews() {
  const [reviews, setReviews] = useState(defaultReviews);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedReviews = window.localStorage.getItem("houseNest-home-reviews");
    if (storedReviews) {
      try {
        setReviews(JSON.parse(storedReviews));
      } catch {
        setReviews(defaultReviews);
      }
    }
  }, []);

  return (
    <div className="py-16 bg-base-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-neutral mb-4">
            What Our <span className="text-primary">Tenants</span> Say
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto font-medium">
            Real stories from our happy tenants who found their perfect home through HouseNest.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-base-100 p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
            >
              <div className="flex gap-1 mb-4 text-warning">
                {[...Array(5)].map((_, index) => (
                  <svg
                    key={index}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 ${index < review.rating ? "fill-current" : "fill-gray-200 text-gray-200"}`}
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>

              <p className="text-gray-600 mb-6 grow italic text-sm">"{review.text}"</p>

              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-50">
                <div className="avatar">
                  <div className="w-10 h-10 rounded-full ring-2 ring-primary/20 ring-offset-2">
                    <img src={review.image} alt={review.name} />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-neutral text-sm">{review.name}</h4>
                  <p className="text-xs text-gray-400 font-medium">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}