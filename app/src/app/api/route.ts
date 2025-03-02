import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    const API_KEY = "AIzaSyAXqL_S1PjjBMTvyYBOKJIIv6MiMKAEd9M"; 
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    const systemInstruction = {
      parts: [
        {
          text: `You need to determine a user's personality traits by asking questions that add confidence to how aligned they are with that trait. Some traits are singular (0 to 100%) and some are opposites (-100% to 100%). When you are confident with how aligned they are with each personality trait you can stop asking questions and return the final result.

The traits are as follows:
- Curiosity: How willing someone is to learn something new
- Lone Wolf vs Collaborative: How do they like to work in a team (solving problems and learning)
- Focus: Are they eager to move on to the next task, goal, or milestone; or do they want to deep dive into things they are learning?
- Sheep vs Wolf: Do they contribute ideas forcefully or do they go with the flow and avoid contributing?
- Ingenuity: Can they solve problems and find ways forward?
- Determination: When things get tough, do they keep going or give up?
- Patience: Are they willing to follow along with others' learning and problem-solving speed?
- Communication Style: Are they to the point, or do they prefer subtlety and nudging people?
- Detail-Oriented vs Conceptual: Do they solve problems by focusing on details or the big picture?

Once you have determined the personality traits and their confidence levels, you should return them as follows:
{
  "done": true,
  "trait_confidences": {
    "curiosity": 75,
    "collaboration": 45,
    "focus": 80,
    "sheep_vs_wolf": -30,
    "ingenuity": 60,
    "determination": 85,
    "patience": 70,
    "communication_style": 55,
    "detail_vs_conceptual": 65
  }
}

**Do not include any suggestions or additional text in the response. Only return the JSON object with the trait confidences.**`
        },
      ],
    };

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
    };

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: message, 
            },
          ],
        },
      ],
      systemInstruction, 
      generationConfig, 
    };

    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error("ERROR");
    }

    const data = await response.json();
    const botResponse = data.candidates[0].content.parts[0].text;

    const responseJson = JSON.parse(botResponse.replace(/```json\n|\n```/g, ""));
    
    return NextResponse.json(responseJson);
  } catch (error) {
    console.error("ERROR:", error);
    return NextResponse.json({ error: "ERROR" }, { status: 500 });
  }
}