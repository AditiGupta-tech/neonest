import connectDB from "@/lib/connectDB";
import { authenticateToken } from "@/lib/auth";
import Chat from "@/app/models/Chat.model";

export async function POST(req) {
  await connectDB();
  const user = await authenticateToken(req);
  if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  const userId = user.user.id;
  const { messages, role } = await req.json();

  try {
    let chat = await Chat.findOne({ userId, role });

    if (!chat) {
      chat = new Chat({ userId, role, messages });
    } else {
      chat.messages = messages;
    }

    await chat.save();
    return Response.json({ success: true });
  } catch (error) {
    console.error("Save chat error:", error);
    return new Response(JSON.stringify({ error: "Save failed" }), { status: 500 });
  }
}
