import { NextResponse } from "next/server";
import mongoose from "mongoose";

// 1. Database Connection (MongoDB Connect korar jonno)
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGODB_URL;

if (!MONGODB_URI) {
    throw new Error(
        "MONGODB_URI or MONGODB_URL is not set. Add your MongoDB connection string to .env and restart the dev server."
    );
}

const connectDB = async () => {
    // Jodi already connected thake, tahole abar connect korbe na
    if (mongoose.connection.readyState >= 1) return;
    
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("✅ MongoDB Connected Successfully!");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        throw error;
    }
};

// 2. Job Model / Schema Toiri (Database e data kivabe save hobe tar structure)
const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    type: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: String },
    description: { type: String, required: true },
    status: { type: String, default: "Active" }, // Default vabe active thakbe
    createdAt: { type: Date, default: Date.now }
});

// Next.js e hot-reload er somoy jate duibar model toiri na hoy tar jonno eita dorkar
const Job = mongoose.models.Job || mongoose.model("Job", jobSchema);



export async function POST(req) {
    try {
        await connectDB();
        
        const body = await req.json();
        console.log("Backend Received Data:", body); 
        
        
        const newJob = await Job.create(body);
        
        return NextResponse.json({ success: true, message: "Job saved successfully!", job: newJob }, { status: 201 });

    } catch (error) {
        console.error("Failed to post job:", error);
        return NextResponse.json({ success: false, message: "Failed to save job" }, { status: 500 });
    }
}