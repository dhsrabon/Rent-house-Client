"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createAuthClient } from "better-auth/react";
import toast from "react-hot-toast"; // 🟢 Toast ইমপোর্ট করা হলো

const authClient = createAuthClient();

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    image: "",
    role: "tenant", 
    adminSecret: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🟢 Password Validation লজিক যোগ করা হলো
  const validatePassword = (password) => {
    if (password.length < 6) return "Password must be at least 6 characters long.";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
    if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter.";
    return null; // পাসওয়ার্ড ঠিক থাকলে null রিটার্ন করবে
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // 🟢 ফর্ম সাবমিটের আগেই পাসওয়ার্ড চেক করে নেওয়া হচ্ছে
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      toast.error(passwordError); // পাসওয়ার্ড ভুল হলে Toast দেখাবে
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        image: formData.image,
        role: formData.role, 
        adminSecret: formData.adminSecret, 
        callbackURL: "/dashboard",
      });

      if (error) {
        toast.error(error.message || "Registration failed!"); // 🟢 Alert এর বদলে Toast.error
      } else {
        toast.success("Registration Successful!"); // 🟢 Alert এর বদলে Toast.success
        router.push("/dashboard");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-primary mb-2">Create Account</h2>
        <p className="text-center text-gray-500 mb-8">Join HouseNest today!</p>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="form-control">
            <label className="label font-semibold">Full Name</label>
            <input type="text" name="name" onChange={handleChange} required className="input input-bordered focus:outline-primary" placeholder="Enter your name" />
          </div>

          <div className="form-control">
            <label className="label font-semibold">Email Address</label>
            <input type="email" name="email" onChange={handleChange} required className="input input-bordered focus:outline-primary" placeholder="email@example.com" />
          </div>

          <div className="form-control">
            <label className="label font-semibold">I want to be a...</label>
            <select name="role" onChange={handleChange} className="select select-bordered focus:outline-primary w-full">
              <option value="tenant">Tenant (I want to rent a house)</option>
              <option value="owner">Owner (I want to list my house)</option>
              <option value="admin">Admin (I want to manage the platform)</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label font-semibold">Profile Image URL (Optional)</label>
            <input type="url" name="image" onChange={handleChange} className="input input-bordered focus:outline-primary" placeholder="https://image-link.com" />
          </div>

          <div className="form-control">
            <label className="label font-semibold">Password</label>
            <input type="password" name="password" onChange={handleChange} required className="input input-bordered focus:outline-primary" placeholder="••••••••" />
            {/* 🟢 পাসওয়ার্ডের রুলস ইউজারের সুবিধার জন্য দেখানো হলো */}
            <p className="text-xs text-gray-400 mt-1">Min. 6 chars, 1 uppercase, 1 lowercase</p>
          </div>

          <div className="form-control">
            <label className="label font-semibold">
              Admin Secret Key <span className="text-gray-400 font-normal text-sm">(Optional)</span>
            </label>
            <input 
              type="password" 
              name="adminSecret" 
              placeholder="Leave blank if you are not an admin"
              className="input input-bordered w-full focus:outline-primary"
              value={formData.adminSecret}
              onChange={(e) => setFormData({ ...formData, adminSecret: e.target.value })}
            />
            <p className="text-xs text-gray-400 mt-1">Only required for administrative accounts.</p>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-full text-white text-lg mt-4">
            {loading ? <span className="loading loading-spinner"></span> : "Register"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}