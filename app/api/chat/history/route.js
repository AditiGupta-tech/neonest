import connectDB from "@/lib/connectDB";
import { authenticateToken } from "@/lib/auth";
import Chat from "@/app/models/Chat.model";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const user = await authenticateToken(req);

  if (!user || !id) {
    return new Response(JSON.stringify({ error: "Unauthorized or missing chat id" }), { status: 400 });
  }

  const userId = user.user.id;
  const chat = await Chat.findOne({ _id: id, userId });
  return Response.json({ messages: chat?.messages || [] });
}
