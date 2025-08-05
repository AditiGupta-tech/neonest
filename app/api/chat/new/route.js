import connectDB from "@/lib/connectDB";
import { authenticateToken } from "@/lib/auth";
import Chat from "@/app/models/Chat.model";

export async function POST(req) {
  await connectDB();
  const user = await authenticateToken(req);
  if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  const { role, message } = await req.json();

  if (!message || !role) return new Response(JSON.stringify({ error: "Missing data" }), { status: 400 });

  const title = message.trim().split(/\s+/).slice(0, 8).join(" ");
  console.log(title);

  const userId = user?.user?.id || user?.id;
  if (!userId) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  const chat = await Chat.create({
    userId,
    role,
    title,
    messages: [
      {
        id: Date.now(),
        role: "user",
        content: message,
        createdAt: new Date().toISOString(),
      },
    ],
    startedAt: new Date(),
  });

  return Response.json({
    _id: chat._id,
    role: chat.role,
    title: chat.title,
    messages: chat.messages,
    startedAt: chat.startedAt,
  });
}
