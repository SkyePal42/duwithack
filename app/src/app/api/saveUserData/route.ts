// src/app/api/saveUserData/route.ts
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server"; 

const client = new MongoClient(process.env.MONGODB_URI);

export async function POST(request: Request) {
  try {
    const { skills, interests, experience } = await request.json();

    await client.connect();

    const database = client.db("cluster");
    const collection = database.collection("user_info"); 
    const result = await collection.insertOne({
      skills,
      interests,
      experience,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "User data saved successfully" });
  } catch (error) {
    console.error("Error saving user data:", error);
    return NextResponse.json(
      { error: "Failed to save user data" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
