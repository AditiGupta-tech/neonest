
import Essentials from "@/app/models/Essentials.model";
import { authenticateToken } from "@/lib/auth";
import connectDB from "@/lib/connectDB";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectDB();
    const user = await authenticateToken(request);
    const userId = user.user.id;
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }

    const essentials = await Essentials.find({ userId }).sort({
      lastUpdated: -1,
    });

    return NextResponse.json(essentials);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch essentials" },
      { status: 500 }
    );
  }
}

// Add new essential item
export async function POST(request) {
  try {
    await connectDB();
    
    const user = await authenticateToken(request);
    const userId = user.user.id;
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }

    const { name, category, currentStock, minThreshold, unit, notes } =
      await request.json();

    if (!name || !currentStock || !minThreshold) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newEssential = new Essentials({
      userId,
      name,
      category,
      currentStock: parseInt(currentStock),
      minThreshold: parseInt(minThreshold),
      unit,
      notes,
    });

    await newEssential.save();

    return NextResponse.json(newEssential, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create essential item" },
      { status: 500 }
    );
  }
}