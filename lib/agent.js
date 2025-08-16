import { GoogleGenerativeAI } from "@google/generative-ai";

class Agent {
  constructor({
    prompt = "You are a generative model",
    model, // leave undefined at top level
    example_response = [
      {
        role: "user",
        parts: [{ text: `How are you.` }],
      },
      {
        role: "model",
        parts: [{ text: `How are you? How is your baby?` }],
      },
    ],
  }) {
    this.prompt = prompt;

    // Initialize GoogleGenerativeAI at runtime
    if (!model) {
      if (!process.env.GEMINI_API) {
        throw new Error("GEMINI_API key is missing in environment variables");
      }
      const genAi = new GoogleGenerativeAI(process.env.GEMINI_API);
      this.model = genAi.getGenerativeModel({ model: "gemini-2.0-flash" });
    } else {
      this.model = model.getGenerativeModel({ model: "gemini-2.0-flash" });
    }

    this.example_response = example_response;
  }

  async getResponse(text) {
    const result = await this.model.generateContent({
      contents: [
        ...this.example_response,
        {
          role: "user",
          parts: [{ text }],
        },
      ],
      systemInstruction: { parts: { text: this.prompt } },
    });

    const response = await result.response.text();
    return response;
  }
}

class JSONAgent extends Agent {
  constructor({
    prompt,
    model, // leave undefined at top level
    example_response,
  } = {}) {
    super({ prompt, model, example_response });
  }

  async getResponse(text) {
    try {
      const response = await super.getResponse(text);
      const json_response = JSON.parse(response.replaceAll("```", "").replace("json", ""));
      return json_response;
    } catch (err) {
      console.log("error in agent", err);
      return {
        isAction: false,
        actionName: "Invalid Request",
        request: "failed",
      };
    }
  }
}

export default JSONAgent;
