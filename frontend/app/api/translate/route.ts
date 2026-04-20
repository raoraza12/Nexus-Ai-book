import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { text, target_lang } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { detail: "Nexus Translation Error: GROQ_API_KEY is not configured on Vercel." },
        { status: 401 }
      );
    }

    if (!text || !text.trim()) {
      return NextResponse.json({ translated_text: "" });
    }

    // Map language codes to full names
    const langMap: Record<string, string> = {
      ur: "Urdu",
      ar: "Arabic",
      es: "Spanish",
      fr: "French",
      de: "German",
      hi: "Hindi",
      ja: "Japanese",
      "zh-CN": "Chinese (Simplified)"
    };

    const targetLangFull = langMap[target_lang] || target_lang;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-specdec",
        messages: [
          {
            role: "system",
            content: `You are a professional technical translator. Translate the following technical book content into ${targetLangFull}. Maintain the Markdown formatting, code blocks, and technical terms precisely. Return ONLY the translated markdown text.`
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "OpenAI API error");
    }

    const data = await response.json();
    return NextResponse.json({
      translated_text: data.choices[0].message.content,
    });
  } catch (error: any) {
    console.error("Translation API Error:", error);
    return NextResponse.json(
      { detail: `Nexus Translation Error: ${error.message}` },
      { status: 500 }
    );
  }
}
