import connectDB from "@/lib/connectDB";
import { authenticateToken } from "@/lib/auth";
import Chat from "@/app/models/Chat.model";

export async function DELETE(req, { params }) {
  await connectDB();
  const user = await authenticateToken(req);
  if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  const { id } = params;

  const chat = await Chat.findOneAndDelete({ _id: id, userId: user.user.id });

  if (!chat) {
    return new Response(JSON.stringify({ error: "Chat not found" }), { status: 404 });
  }

  return new Response(JSON.stringify({ success: true }));
}
