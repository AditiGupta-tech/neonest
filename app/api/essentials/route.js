
import Essentials from "@/app/models/Essentials.model";
import { authenticateToken } from "@/lib/auth";
import connectDB from "@/lib/connectDB";
import { NextResponse } from "next/server";

// Enhanced error handling and logging
const handleError = (error, message = "Internal server error", status = 500) => {
  console.error(`API Error: ${message}`, error);
  return NextResponse.json(
    { 
      error: message,
      ...(process.env.NODE_ENV === "development" && { details: error.message })
    },
    { status }
  );
};

export async function GET(request) {
  try {
    await connectDB();
    
    const user = await authenticateToken(request);
    if (!user || !user.user || !user.user.id) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid or missing token" },
        { status: 401 }
      );
    }

    const userId = user.user.id;
    const essentials = await Essentials.find({ userId })
      .sort({ lastUpdated: -1 })
      .lean(); // Use lean() for better performance

    // Add computed fields
    const enhancedEssentials = essentials.map(item => ({
      ...item,
      isLowStock: item.currentStock <= item.minThreshold,
      isOutOfStock: item.currentStock === 0,
      stockStatus: item.currentStock === 0 ? 'out' : 
                   item.currentStock <= item.minThreshold ? 'low' : 'good'
    }));

    return NextResponse.json(enhancedEssentials);
  } catch (error) {
    return handleError(error, "Failed to fetch essentials");
  }
}

// Add new essential item
export async function POST(request) {
  try {
    await connectDB();
    
    const user = await authenticateToken(request);
    if (!user || !user.user || !user.user.id) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid or missing token" },
        { status: 401 }
      );
    }

    const userId = user.user.id;
    let requestData;
    
    try {
      requestData = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { name, category, currentStock, minThreshold, unit, notes } = requestData;

    // Enhanced validation
    const validationErrors = [];
    if (!name || name.trim().length === 0) validationErrors.push("Name is required");
    if (currentStock === undefined || currentStock === null) validationErrors.push("Current stock is required");
    if (minThreshold === undefined || minThreshold === null) validationErrors.push("Minimum threshold is required");
    if (parseInt(currentStock) < 0) validationErrors.push("Current stock cannot be negative");
    if (parseInt(minThreshold) < 0) validationErrors.push("Minimum threshold cannot be negative");

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: "Validation failed", details: validationErrors },
        { status: 400 }
      );
    }

    // Check for duplicate items
    const existingItem = await Essentials.findOne({ 
      userId, 
      name: name.trim(),
      category 
    });
    
    if (existingItem) {
      return NextResponse.json(
        { error: "An item with this name already exists in this category" },
        { status: 409 }
      );
    }

    const newEssential = new Essentials({
      userId,
      name: name.trim(),
      category,
      currentStock: parseInt(currentStock),
      minThreshold: parseInt(minThreshold),
      unit: unit || "pieces",
      notes: notes?.trim() || "",
    });

    await newEssential.save();

    // Add computed fields to response
    const enhancedItem = {
      ...newEssential.toObject(),
      isLowStock: newEssential.currentStock <= newEssential.minThreshold,
      isOutOfStock: newEssential.currentStock === 0,
      stockStatus: newEssential.currentStock === 0 ? 'out' : 
                   newEssential.currentStock <= newEssential.minThreshold ? 'low' : 'good'
    };

    return NextResponse.json(enhancedItem, { status: 201 });
  } catch (error) {
    return handleError(error, "Failed to create essential item");
  }
}