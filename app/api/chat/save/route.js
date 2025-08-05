import connectDB from "@/lib/connectDB";
import { authenticateToken } from "@/lib/auth";
import Chat from "@/app/models/Chat.model";

export async function POST(req) {
  await connectDB();
  const user = await authenticateToken(req);
  if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  const userId = user.user.id;
  const { chatId, messages, role } = await req.json();

  try {
    let chat;
    if (chatId) {
      chat = await Chat.findOneAndUpdate({ _id: chatId, userId }, { messages }, { new: true });
    } else {
      chat = new Chat({ userId, role, messages });
      await chat.save();
    }

    return Response.json({ success: true, messages: chat.messages, _id: chat?._id });
  } catch (error) {
    console.error("Save chat error:", error);
    return new Response(JSON.stringify({ error: "Save failed" }), { status: 500 });
  }
}
