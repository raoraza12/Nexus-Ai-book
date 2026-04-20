import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { messages, model, persona, context_depth } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { detail: "Nexus Core Error: OPENAI_API_KEY is not configured on the server." },
        { status: 401 }
      );
    }

    // Define Personas
    const personas: Record<string, string> = {
      academic: "You are a highly technical, academic AI mentor. Focus on engineering deep-dives, architectural integrity, and precise terminology.",
      creative: "You are a creative AI explorer. Focus on analogies, future implications, and connecting disparate concepts from the book content.",
      mentor: "You are an empathetic learning mentor. Break down complex topics into digestible parts, offer encouragement, and guide the user through the curriculum.",
      concise: "You are a high-efficiency intelligence core. Provide ultra-concise, bulleted insights without fluff."
    };

    const systemPrompt = (personas[persona] || personas.academic) + 
      " You are the Nexus Core Intelligence. You have deep knowledge of the book content provided in the context.";

    // Limit history
    const depth = context_depth || 5;
    const chatHistory = messages.slice(-(depth * 2));
    
    const formattedMessages = [
      { role: "system", content: systemPrompt },
      ...chatHistory.map((m: any) => ({ role: m.role, content: m.content }))
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model || "gpt-3.5-turbo",
        messages: formattedMessages,
        max_tokens: 600,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "OpenAI API error");
    }

    const data = await response.json();
    return NextResponse.json({
      role: "assistant",
      content: data.choices[0].message.content,
    });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { detail: `Nexus Neural Error: ${error.message}` },
      { status: 500 }
    );
  }
}
