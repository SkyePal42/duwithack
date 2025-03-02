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

    // Update the entry by incrementing it by 1
    const result = await collection.findOneAndUpdate(
      { _id: "-1" },
      { $inc: { value: 1 } },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    return NextResponse.json(result.value);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update entry" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
