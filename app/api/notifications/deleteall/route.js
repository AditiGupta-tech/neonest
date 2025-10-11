import Notification from "@/app/models/Notification.model";
import { authenticateToken } from "@/lib/auth";
import connectDB from "@/lib/connectDB";

await connectDB();

// Delete all notifications for a user
export async function DELETE(req) {
  try {
    const user = await authenticateToken(req);
    const userId = user.user.id;

    // Delete all notifications for the authenticated user
    const result = await Notification.deleteMany({
      babyId: userId,
    });

    return Response.json(
      {
        success: "All notifications deleted successfully",
        deletedCount: result.deletedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        error: "Failed to delete all notifications",
      },
      { status: 500 }
    );
  }
}
