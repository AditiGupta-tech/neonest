
import Essentials from "@/app/models/Essentials.model";
import { authenticateToken } from "@/lib/auth";
import connectDB from "@/lib/connectDB";
import { NextResponse } from "next/server";

// Update an essential item
export async function PUT(request, { params }) {
  try {
    await connectDB();
    // Verify token and get user ID
    const user = await authenticateToken(request);
    const userId = user.user.id;
        
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }

    const { id } = params;
    const { name, category, currentStock, minThreshold, unit, notes } =
      await request.json();

    const essential = await Essentials.findOneAndUpdate(
      {
        _id: id,
        userId,
      },
      {
        name: name,
        category: category,
        currentStock: parseInt(currentStock),
        minThreshold: parseInt(minThreshold),
        unit: unit,
        notes: notes,
        lastUpdated: Date.now()
      },
      { new: true }
    );

    if (!essential) {
      return NextResponse.json(
        { error: "Essential item not found or not owned by user" },
        { status: 404 }
      );
    }

    return NextResponse.json(essential);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update essential item" },
      { status: 500 }
    );
  }
}

// Delete an essential item
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    // Verify token and get user ID
    const user = await authenticateToken(request);
    const userId = user.user.id;
        
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }

    const { id } = params;

    const essential = await Essentials.findOneAndDelete({
      _id: id,
      userId // Ensure the item belongs to the requesting user
    });

    if (!essential) {
      return NextResponse.json(
        { error: "Essential item not found or not owned by user" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Essential item deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete essential item" },
      { status: 500 }
    );
  }
}