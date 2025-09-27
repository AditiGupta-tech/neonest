import { NextResponse } from "next/server";
import { authenticateToken } from "@/lib/auth";
import User from "@/app/models/User.model";

export async function GET(req) {
  try {
    const { user, error } = await authenticateToken(req);
    if (error) {
      return NextResponse.json({ error }, { status: 401 });
    }

    const userData = await User.findOne({ email: user.email }).select('-password');
    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
