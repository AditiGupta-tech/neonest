import User from "@/app/models/User.model";
import { authenticateToken } from "@/lib/auth";
import connectDB from "@/lib/connectDB";

await connectDB();
export async function GET(req) {
  try {
    const user = await authenticateToken(req);
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = user.user.id;
    const userExists = await User.findById(userId);
    if (!userExists) {
      return Response.json({ error: "Invalid user" }, { status: 400 });
    }

    const { password, ...rest } = userExists.toObject();

    return Response.json({ success: "Users data successfully", userDetails: rest });
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
