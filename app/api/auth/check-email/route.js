import User from "@/app/models/User.model";
import connectDB from "@/lib/connectDB";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return Response.json({ error: "Invalid email" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });

    return Response.json({ exists: !!user }, { status: 200 });
  } catch (error) {
    console.error("Email check error:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
