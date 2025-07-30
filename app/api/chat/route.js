import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function POST(req) {
  try {
    const { messages, role } = await req.json();

    let systemInstruction = `You are NeoNest AI, a helpful, friendly, and English-speaking assistant for parents. You provide evidence-based guidance about baby care, sleep, feeding, and parenting in English only. Even if the user messages in another language, always reply in English. If you're unsure, suggest helpful resources like YouTube videos or pediatric articles.`;


    // Custom instructions based on role
    if (role === "parenting expert") {
      systemInstruction = `You are NeoNest AI, a helpful, empathetic, and evidence-based parenting expert specializing in baby care...`; // (full version as you wrote)
    } else if (role === "sleep consultant") {
      systemInstruction = `You are NeoNest AI, a supportive and knowledgeable sleep consultant for baby sleep...`; // trimmed for brevity
    }
    // ... (include other roles as-is from your code)

    // Defensive check
    const latestMessage = messages?.[messages.length - 1]?.content || "Hi, I need help with baby care.";

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${systemInstruction}\n\n${latestMessage}`,
            },
          ],
        },
      ],
    });

    const response = await result.response;
    const reply = response.text();

    return Response.json({
      id: Date.now(),
      role: "assistant",
      content: reply,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Gemini error:", err);
    return new Response(JSON.stringify({ error: "Gemini API error" }), {
      status: 500,
    });
  }
}
