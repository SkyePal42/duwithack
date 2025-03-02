import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    // Gemini API 配置
    const API_KEY = "AIzaSyAXqL_S1PjjBMTvyYBOKJIIv6MiMKAEd9M"; // 替换为你的 API 密钥
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    // 发送请求到 Gemini API
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: message,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error("请求失败");
    }

    const data = await response.json();
    const botResponse = data.candidates[0].content.parts[0].text;

    // 返回 Gemini 的回复
    return NextResponse.json({ response: botResponse });
  } catch (error) {
    console.error("请求失败:", error);
    return NextResponse.json({ error: "请求失败" }, { status: 500 });
  }
}