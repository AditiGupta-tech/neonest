import Notification from "@/app/models/Notification.model";
import User from "@/app/models/User.model";
import { authenticateToken } from "@/lib/auth";
import connectDB from "@/lib/connectDB";

await connectDB();

// Create a new notification
export async function POST(req) {
  try {
    const body = await req.json();
    const { type, title, message, priority, scheduledFor, actionUrl, metadata, category } = body;

    if (!type || !title || !message || !scheduledFor) {
      return Response.json(
        {
          error: "Please provide type, title, message, and scheduledFor",
        },
        { status: 422 }
      );
    }

    const user = await authenticateToken(req);
    const userId = user.user.id;
    const userExists = await User.findById(userId);
    
    if (!userExists) {
      return Response.json(
        {
          error: "User not found",
        },
        { status: 400 }
      );
    }

    const newNotification = new Notification({
      babyId: userId,
      type,
      title,
      message,
      priority: priority || "medium",
      scheduledFor: new Date(scheduledFor),
      actionUrl,
      metadata,
      category: category || "reminder",
    });

    await newNotification.save();

    return Response.json(
      {
        success: "Notification created successfully!",
        notification: newNotification,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        error: "Failed to create notification",
      },
      { status: 500 }
    );
  }
}

// Get all notifications for a user
export async function GET(req) {
  try {
    const user = await authenticateToken(req);
    const userId = user.user.id;

    const { searchParams } = new URL(req.url);
    const isRead = searchParams.get("isRead");
    const type = searchParams.get("type");
    const limit = parseInt(searchParams.get("limit")) || 50;

    let query = { babyId: userId };

    if (isRead !== null) {
      query.isRead = isRead === "true";
    }

    if (type) {
      query.type = type;
    }

    const notifications = await Notification.find(query)
      .sort({ scheduledFor: -1 })
      .limit(limit);

    return Response.json(
      {
        success: "Notifications fetched successfully",
        notifications,
        count: notifications.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        error: "Failed to fetch notifications",
      },
      { status: 500 }
    );
  }
}

// Update notification (mark as read, etc.)
export async function PATCH(req) {
  try {
    const body = await req.json();
    const { notificationId, isRead, isSent } = body;

    if (!notificationId) {
      return Response.json(
        {
          error: "Notification ID is required",
        },
        { status: 422 }
      );
    }

    const user = await authenticateToken(req);
    const userId = user.user.id;

    const updateData = {};
    if (isRead !== undefined) updateData.isRead = isRead;
    if (isSent !== undefined) updateData.isSent = isSent;

    const updatedNotification = await Notification.findOneAndUpdate(
      { _id: notificationId, babyId: userId },
      updateData,
      { new: true }
    );

    if (!updatedNotification) {
      return Response.json(
        {
          error: "Notification not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: "Notification updated successfully",
        notification: updatedNotification,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        error: "Failed to update notification",
      },
      { status: 500 }
    );
  }
}

// Delete a notification
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const notificationId = searchParams.get("id");

    if (!notificationId) {
      return Response.json(
        {
          error: "Notification ID is required",
        },
        { status: 422 }
      );
    }

    const user = await authenticateToken(req);
    const userId = user.user.id;

    const deletedNotification = await Notification.findOneAndDelete({
      _id: notificationId,
      babyId: userId,
    });

    if (!deletedNotification) {
      return Response.json(
        {
          error: "Notification not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: "Notification deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        error: "Failed to delete notification",
      },
      { status: 500 }
    );
  }
} 