import connectDB from "@/lib/connectDB";
import { authenticateToken } from "@/lib/auth";
import Chat from "@/app/models/Chat.model";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role");
  const user = await authenticateToken(req);

  if (!user || !role) {
    return new Response(JSON.stringify({ error: "Unauthorized or missing role" }), { status: 400 });
  }

  const userId = user.user.id;

  const chat = await Chat.findOne({ userId, role });
  return Response.json({ messages: chat?.messages || [] });
}
