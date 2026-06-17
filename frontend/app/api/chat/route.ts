import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { messages, model, persona, context_depth } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { role: "assistant", content: "The AI agent is not configured yet. Please add your GROQ_API_KEY in Vercel environment variables." },
        { status: 200 }
      );
    }

    const personas: Record<string, string> = {
      academic: "You are a knowledgeable and helpful AI assistant. You can discuss any topic with technical depth and clarity. When book content is provided as context, use it to give accurate answers. When no book context is relevant, answer the question naturally using your general knowledge.",
      creative: "You are a creative and insightful AI assistant. You use analogies, examples, and creative connections to explain concepts. You can discuss any topic freely. When book content is provided, weave it into your explanations.",
      mentor: "You are a friendly and supportive AI mentor. You break down complex topics into simple parts, encourage learning, and guide users step by step. You can help with any question, not just book-related ones.",
      concise: "You are a helpful AI assistant that gives clear, concise answers. Use bullet points when appropriate. Answer any question directly without unnecessary filler."
    };

    const systemPrompt = (personas[persona] || personas.academic) +
      "\n\nIMPORTANT GUIDELINES:" +
      "\n- You are Nexus AI, a helpful and intelligent assistant." +
      "\n- Answer ALL questions naturally and helpfully, whether they are about the book content or general topics." +
      "\n- If the user asks about something from the book context provided, reference it accurately." +
      "\n- If the user asks a general question (greetings, coding help, explanations, etc.), answer it normally like any good AI assistant would." +
      "\n- Always be polite, clear, and thorough in your responses." +
      "\n- You can respond in the same language the user writes in (e.g., Urdu, Hindi, English, etc.)." +
      "\n- Use markdown formatting (bold, lists, code blocks) when it improves readability.";

    const depth = context_depth || 5;
    const chatHistory = messages.slice(-(depth * 2));
    
    const formattedMessages = [
      { role: "system", content: systemPrompt },
      ...chatHistory.map((m: any) => ({ role: m.role, content: m.content }))
    ];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: formattedMessages,
        max_tokens: 2048,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData?.error?.message || `API request failed with status ${response.status}`;
      console.error("Groq API Error:", errorMsg);
      return NextResponse.json({
        role: "assistant",
        content: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
      });
    }

    const data = await response.json();
    return NextResponse.json({
      role: "assistant",
      content: data.choices?.[0]?.message?.content || "I received your message but couldn't generate a response. Please try again.",
    });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({
      role: "assistant",
      content: "Something went wrong. Please try again.",
    });
  }
}
