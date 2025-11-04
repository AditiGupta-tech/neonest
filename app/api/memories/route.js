import { NextResponse } from "next/server";
import Memory from "@/app/models/Memory.model";
import { authenticateToken } from "@/lib/auth";
import connectDB from "@/lib/connectDB";
import User from "@/app/models/User.model";
import { cloudinary } from "@/lib/cloudinary";

// GET - Get public memories
export async function GET(request) {
  try {
    await connectDB();
    console.log(request.headers)
    const user = await authenticateToken(request);
    console.log(user)
    const userId = user?.user?.id;
    const privateMemories = await Memory.find({user : userId , isPublic: false});
    console.log(privateMemories);
    const publicMemories = await Memory.find({ isPublic: true })
      .sort({ createdAt: -1 })
      .populate("user", "name");

    return NextResponse.json({privateMemories ,publicMemories});
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Error fetching memories" },
      { status: 500 }
    );
  }
}
export async function POST(request) {
  try {
    await connectDB();
    const formData = await request.formData();
    console.log(formData);
    const user = await authenticateToken(request);
    const userId = user?.user?.id;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const file = formData.get("file");
    const title = formData.get("title") || "";
    const description = formData.get("description") || "";
    const isPublic = formData.get("isPublic") === "true";

    if (!file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = await file.arrayBuffer();
    const bytes = Buffer.from(buffer);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "auto" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(bytes);
    });

    // Create and save memory
    const newMemory = new Memory({
      user: userId,
      title,
      description,
      isPublic,
      type: result.resource_type,
      file: result.secure_url,
      likes: [],
      comments: [],
    });

    await newMemory.save();

    return NextResponse.json(newMemory);
  } catch (err) {
    console.error("Memory upload error:", err);
    return NextResponse.json(
      { message: "Error uploading memory", error: err.message },
      { status: 500 }
    );
  }
}