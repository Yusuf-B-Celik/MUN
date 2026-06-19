import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages array in request body." },
        { status: 400 }
      );
    }

    // 1. Get the API key from env or header
    let apiKey = process.env.MINIMAX_API_KEY;
    const clientKey = request.headers.get("x-minimax-api-key");

    if (!apiKey && clientKey) {
      apiKey = clientKey;
    }

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "MiniMax API key is missing. Please add your API key in the settings panel (gear icon).",
        },
        { status: 401 }
      );
    }

    // 2. Prepare payload for MiniMax M3 Chat Completion
    const payload = {
      model: "MiniMax-M3",
      messages: messages,
      temperature: 1.0,
      top_p: 0.95,
      // Adaptive thinking is recommended for M3's reasoning path
      thinking: {
        type: "adaptive",
      },
    };

    // 3. Request MiniMax API
    const response = await fetch("https://api.minimax.io/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("MiniMax API returned error:", response.status, errorText);
      
      let parsedError = errorText;
      try {
        parsedError = JSON.parse(errorText);
      } catch (e) {}

      return NextResponse.json(
        { 
          error: "MiniMax API request failed.", 
          details: parsedError 
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Clean up content by stripping any <think>...</think> tags if they leak into the message content
    if (data.choices && data.choices[0]?.message) {
      let content = data.choices[0].message.content || "";
      
      // 1. Remove anything inside <think>...</think> tags
      content = content.replace(/<think>[\s\S]*?<\/think>/g, "");
      
      // 2. Remove any orphaned think tags just in case
      content = content.replace(/<\/?think>/g, "");
      
      // 3. Clean up leading/trailing white spaces
      data.choices[0].message.content = content.trim();
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error in MiniMax proxy:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error in API proxy." },
      { status: 500 }
    );
  }
}
