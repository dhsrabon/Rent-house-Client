"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient();

export default function AddPropertyPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [loading, setLoading] = useState(false);
  
  // স্টেটের মধ্যে isFeatured যোগ করা হলো
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "Apartment",
    price: "",
    location: "",
    bedrooms: "",
    bathrooms: "",
    image: "", 
    isFeatured: false, // 🔴 নতুন ফিল্ড
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // চেকবক্সের জন্য একটু আলাদাভাবে হ্যান্ডেল করতে হয়
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const propertyData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        price: Number(formData.price),
        location: formData.location,
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        images: [formData.image],
        ownerId: session?.user?.id || "unknown",
        isFeatured: formData.isFeatured, // 🔴 ডাটাবেসে পাঠানো হচ্ছে
      };

      const response = await fetch("http://localhost:5000/api/properties/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(propertyData),
      });

      const data = await response.json();

      if (data.success) {
        alert("🎉 Property added successfully!");
        router.push("/dashboard/my-properties");
      } else {
        alert("❌ Failed: " + data.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("❌ Something went wrong! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral mb-2">Add New Property</h1>
        <p className="text-gray-500">Fill in the details below to list your property on the platform.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="form-control w-full">
              <label className="label"><span className="label-text font-semibold">Property Title</span></label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Modern Luxury Villa" className="input input-bordered w-full focus:outline-primary" />
            </div>

            {/* Location */}
            <div className="form-control w-full">
              <label className="label"><span className="label-text font-semibold">Location</span></label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} required placeholder="e.g. Gulshan, Dhaka" className="input input-bordered w-full focus:outline-primary" />
            </div>

            {/* Type */}
            <div className="form-control w-full">
              <label className="label"><span className="label-text font-semibold">Property Type</span></label>
              <select name="type" value={formData.type} onChange={handleChange} className="select select-bordered w-full focus:outline-primary">
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Commercial">Commercial</option>
                <option value="Studio">Studio</option>
              </select>
            </div>

            {/* Price */}
            <div className="form-control w-full">
              <label className="label"><span className="label-text font-semibold">Monthly Rent ($)</span></label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} required placeholder="e.g. 1500" min="0" className="input input-bordered w-full focus:outline-primary" />
            </div>

            {/* Bedrooms */}
            <div className="form-control w-full">
              <label className="label"><span className="label-text font-semibold">Bedrooms</span></label>
              <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} required placeholder="e.g. 3" min="0" className="input input-bordered w-full focus:outline-primary" />
            </div>

            {/* Bathrooms */}
            <div className="form-control w-full">
              <label className="label"><span className="label-text font-semibold">Bathrooms</span></label>
              <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} required placeholder="e.g. 2" min="0" className="input input-bordered w-full focus:outline-primary" />
            </div>
          </div>

          {/* Image URL */}
          <div className="form-control w-full">
            <label className="label"><span className="label-text font-semibold">Image URL</span></label>
            <input type="url" name="image" value={formData.image} onChange={handleChange} required placeholder="Paste an image URL here..." className="input input-bordered w-full focus:outline-primary" />
          </div>

          {/* Description */}
          <div className="form-control w-full">
            <label className="label"><span className="label-text font-semibold">Description</span></label>
            <textarea name="description" value={formData.description} onChange={handleChange} required placeholder="Write a detailed description about the property..." className="textarea textarea-bordered h-32 focus:outline-primary"></textarea>
          </div>

          {/* 🔴 Featured Checkbox (নতুন যোগ করা হয়েছে) */}
          <div className="form-control p-4 bg-gray-50 rounded-xl border border-gray-200 mt-4">
            <label className="label cursor-pointer justify-start gap-4">
              <input 
                type="checkbox" 
                name="isFeatured"
                className="checkbox checkbox-primary" 
                checked={formData.isFeatured}
                onChange={handleChange}
              />
              <span className="label-text font-medium text-lg">Make this a Featured Property (Show on Home Page)</span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button type="submit" disabled={loading} className="btn btn-primary w-full text-white text-lg">
              {loading ? <span className="loading loading-spinner"></span> : "List Property"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}