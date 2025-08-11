import Feeding from "@/app/models/Feeding.model";
import User from "@/app/models/User.model";
import { authenticateToken } from "@/lib/auth";
import connectDB from "@/lib/connectDB";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { time, type, amount, notes } = body;

    if (!time || !type || !amount) {
      return Response.json(
        { error: "Kindly fill all the fields" },
        { status: 422 }
      );
    }

    const user = await authenticateToken(req);
  
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = user.user.id;
    const userExists = await User.findById(userId);
    if (!userExists) {
      return Response.json({ error: "Invalid user" }, { status: 400 });
    }

    const newFeed = new Feeding({
      babyId: userId,
      time,
      type,
      amount,
      notes,
    });
    await newFeed.save();

    return Response.json(
      { success: "Feed added successfully!", feed: newFeed },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding feed:", error);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const user = await authenticateToken(req);
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = user.user.id;

    const feeds = await Feeding.find({ babyId: userId }).sort({
      createdAt: -1,
    });

    return Response.json(
      {
        success: "Feeds fetched successfully",
        feed: feeds || [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching feeds:", error);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    await connectDB();
    const user = await authenticateToken(req);
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = user.user.id;
    const body = await req.json();
    const { feedId, time, type, amount, notes } = body;

    if (!feedId) {
      return Response.json({ error: "feedId is required" }, { status: 400 });
    }

    const updatedFeed = await Feeding.findOneAndUpdate(
      { _id: feedId, babyId: userId },
      { time, type, amount, notes },
      { new: true } 
    );

    if (!updatedFeed) {
      return Response.json({ error: "Feed not found" }, { status: 404 });
    }

    return Response.json(
      { success: "Feed updated successfully", feed: updatedFeed },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating feed:", error);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const user = await authenticateToken(req);
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = user.user.id;

    const { searchParams } = new URL(req.url);
    const feedId = searchParams.get("feedId");

    if (!feedId) {
      return Response.json({ error: "feedId is required" }, { status: 400 });
    }

    const deletedFeed = await Feeding.findOneAndDelete({ _id: feedId, babyId: userId });

    if (!deletedFeed) {
      return Response.json({ error: "Feed not found" }, { status: 404 });
    }

    return Response.json(
      { success: "Feed deleted successfully", feed: deletedFeed },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting feed:", error);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}