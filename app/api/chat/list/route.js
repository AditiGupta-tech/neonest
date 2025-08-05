import connectDB from "@/lib/connectDB";
import { authenticateToken } from "@/lib/auth";
import Chat from "@/app/models/Chat.model";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role");
  const user = await authenticateToken(req);

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const userId = user.user.id;
  const filter = { userId };
  if (role) filter.role = role;

  const chats = await Chat.find(filter).sort({ startedAt: -1 }).select("_id title role startedAt messages").lean();
  console.log(chats);
  const chatSummaries = chats.map((chat) => ({
    _id: chat._id,
    title: chat.title,
    role: chat.role,
    startedAt: chat.startedAt,
  }));

  return Response.json(chatSummaries);
}
