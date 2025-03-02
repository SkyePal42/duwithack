// src/app/api/saveUserData/route.ts
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: "You need to determine a user's personality traits by asking questions that add confidence to how aligned they are with that trait. Some traits are singular (0 to 100%) and some are opposites (-100% to 100%). When you are confident with how aligned they are with each personality trait, you can stop asking questions and return the final result.\n\nThe traits are used to help determine potential teammate compatibility when forming a hackathon team, prioritising a balance of skills, work ethics, while hopefully avoiding potential conflict areas (like slow learners paired with impatient wolves).\n\nThe traits are as follows:\n- Curiosity: How willing someone is to learn something new\n- Lone Wolf vs Collaborative: How do they like to work in a team (solving problems and learning)\n- Focus: Are they eager to move on to the next task, goal, or milestone; or do they want to deep dive into the thing they're learning even if unproductive and effectively procrastination\n- Sheep vs Wolf: Do they contribute ideas (sometimes too forcefully) or do they go with the flow (sometimes to the point they contribute no input, opinions, or ideas)\n- Ingenuity: Can they solve problems and find a way forward\n- Determination: When things get tough and time starts running out, do they keep going to the best they can or give up\n- Patience: Are they willing to follow along other people's learning journey and problem-solving speed or will they lash out at their teammates for taking too long to understand beginner concepts\n- Communication Style: Are they to the point (not necessarily in a rude way) or do they prefer to be subtle, sugar coat, and nudge people in the desired direction instead (not necessarily via manipulation)\n- Detail-Oriented vs Conceptual: Do they solve problems by getting into the details or painting the broad strokes and how things connect together\n\nYou should respond with JSON that the back-end can process into a front-end response:\n{\n  \"done\": bool; true if returning the final result (no question)\n  \"question\": the next question you ask\n  \"trait_confidences\": object of traits and their numerical percentage confidence level so far (or the final values)\n  \"multi-choice\": an optional array of possible answers that correlate to certain traits\n}\n\nThe server will respond in JSON too:\n{\n  \"question\": the question asked\n  \"multi-choice\": bool; true if you provided a multi-choice option\n  \"answer\": a text response for freeform or a numerical index value of the multi-choice's index selected\n}\n\nReturn only the JSON as an unformatted string.",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

const client = new MongoClient(process.env.MONGODB_URI);

export async function POST(request: Request) {
  try {
    const { skills, interests, experience, sessionId, answer } = await request.json();

    await client.connect();
    const database = client.db("cluster");
    const collection = database.collection("user_info");

    const chatSession = model.startChat({
      generationConfig,
      history: [], 
    });

    const result = await chatSession.sendMessage(answer || "begin");
    const responseText = result.response.text();
    const responseJson = JSON.parse(responseText.replace(/```json\n|\n```/g, ""));

    if (!responseJson.done) {
      return NextResponse.json({
        done: false,
        question: responseJson.question,
        multiChoice: responseJson["multi-choice"],
        traitConfidences: responseJson.trait_confidences,
      });
    }

    const userData = {
      skills,
      interests,
      experience,
      personalityTraits: responseJson.trait_confidences,
      createdAt: new Date(),
    };

    const saveResult = await collection.insertOne(userData);

    return NextResponse.json({
      done: true,
      message: "User data and personality test results saved successfully",
      userId: saveResult.insertedId,
      personalityTraits: responseJson.trait_confidences,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}