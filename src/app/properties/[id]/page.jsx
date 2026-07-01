"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createAuthClient } from "better-auth/react";
import toast from "react-hot-toast";

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
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ name: "", comment: "", rating: "5" });
  const [submittingReview, setSubmittingReview] = useState(false);

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

    const savedReviews = JSON.parse(window.localStorage.getItem(`houseNest-reviews-${id}`) || "[]");
    setReviews(savedReviews);
    fetchProperty();
  }, [id]);

  useEffect(() => {
    if (property?.title) {
      document.title = `${property.title} | HouseNest`;
    }
  }, [property]);

  const handleOpenModal = () => {
    if (!session?.user) {
      toast.error("Please login first to book this property!");
      router.push("/login");
      return;
    }
    if (session.user.id === property.ownerId) {
      toast.error("You cannot book your own property!");
      return;
    }
    setIsModalOpen(true);
  };

  const handleProceedToPayment = async (e) => {
    e.preventDefault();
    setPaymentLoading(true);

    try {
      const requestBody = {
        propertyId: property._id,
        propertyTitle: property.title,
        amount: property.price,
        tenantId: session?.user?.id || session?.user?._id,
        tenantName: session?.user?.name,
        ownerId: property.ownerId,
        moveInDate,
        contactNumber,
        notes,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const sessionData = await res.json();

      if (sessionData.url) {
        const savedBookings = JSON.parse(window.localStorage.getItem("houseNest-bookings") || "[]");
        savedBookings.push({
          _id: `local-${Date.now()}`,
          propertyId: { _id: property._id, title: property.title, location: property.location, price: property.price, images: property.images },
          tenantId: session?.user?.id || session?.user?._id,
          ownerId: property.ownerId,
          status: "Pending",
          moveInDate,
          contactNumber,
          notes,
        });
        window.localStorage.setItem("houseNest-bookings", JSON.stringify(savedBookings));
        window.location.href = sessionData.url;
      } else {
        toast.error(sessionData.message || "Payment session failed!");
      }
    } catch (error) {
      console.error("Payment catch block error:", error);
      toast.error("Payment could not be started right now.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewForm.name.trim() || !reviewForm.comment.trim()) {
      toast.error("Name and review message are required.");
      return;
    }

    setSubmittingReview(true);
    const newReview = {
      id: Date.now(),
      name: reviewForm.name.trim(),
      role: "Tenant",
      rating: Number(reviewForm.rating),
      text: reviewForm.comment.trim(),
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&q=80",
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    window.localStorage.setItem(`houseNest-reviews-${id}`, JSON.stringify(updatedReviews));
    setReviewForm({ name: "", comment: "", rating: "5" });
    toast.success("Your review has been added.");
    setSubmittingReview(false);
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
  if (!property) return <div className="text-center py-20 text-xl font-bold text-red-500">Property not found!</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900">{property.title}</h1>
        <p className="text-gray-500 text-lg mt-1 mb-6">📍 {property.location}</p>

        <img src={property.images?.[0] || "/placeholder.jpg"} className="w-full h-125 object-cover rounded-2xl mb-8 shadow-md" alt={property.title} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold mb-4">Description</h3>
              <p className="text-gray-600">{property.description}</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold mb-4">Tenant Reviews</h3>
              <form onSubmit={handleReviewSubmit} className="space-y-3 mb-6">
                <div className="grid md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Your name"
                    className="input input-bordered w-full"
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                  />
                  <select
                    className="select select-bordered w-full"
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
                  >
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>
                <textarea
                  placeholder="Share your experience"
                  className="textarea textarea-bordered w-full"
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                />
                <button className="btn btn-primary text-white" disabled={submittingReview} type="submit">
                  {submittingReview ? "Saving..." : "Submit Review"}
                </button>
              </form>

              {reviews.length === 0 ? (
                <p className="text-gray-500">No reviews yet. Be the first to share your experience.</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="rounded-xl border border-gray-100 p-4">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-neutral">{review.name}</div>
                        <div className="text-warning">{"★".repeat(review.rating)}</div>
                      </div>
                      <p className="text-gray-600 mt-2">{review.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
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