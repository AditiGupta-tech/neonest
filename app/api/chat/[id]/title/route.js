import connectDB from "@/lib/connectDB";
import { authenticateToken } from "@/lib/auth";
import Chat from "@/app/models/Chat.model";

export async function PUT(req, { params }) {
  await connectDB();
  const user = await authenticateToken(req);
  if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  const { id } = params;
  const { title } = await req.json();
  if (!title || typeof title !== "string" || !title.trim()) {
    return new Response(JSON.stringify({ error: "Invalid title" }), { status: 400 });
  }

  const chat = await Chat.findOneAndUpdate({ _id: id, userId: user.user.id }, { title: title.trim() }, { new: true }).select("_id title role startedAt");

  if (!chat) {
    return new Response(JSON.stringify({ error: "Chat not found" }), { status: 404 });
  }

  return Response.json({
    _id: chat._id,
    title: chat.title,
    role: chat.role,
    startedAt: chat.startedAt,
  });
}
