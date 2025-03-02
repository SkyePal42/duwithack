import { NextResponse } from "next/server";
import { MongoClient, ServerApiVersion } from "mongodb";

const uri = `mongodb+srv://duwit:${process.env.DB_PASSWORD}@duwit-hacks.11ess.mongodb.net/?retryWrites=true&w=majority&appName=DUWIT-Hacks`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export async function POST() {
  try {
    await client.connect();
    const db = client.db("DUWITHacks2025");
    const collection = db.collection("User-History");

    const newEntry = { _id: "-1", value: 0 };
    await collection.insertOne(newEntry);

    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create entry" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
