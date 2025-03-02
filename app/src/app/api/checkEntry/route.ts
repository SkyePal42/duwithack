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

export async function GET() {
  try {
    await client.connect();
    const db = client.db("DUWITHacks2025");
    const collection = db.collection("User-History");

    const entry = await collection.findOne({ _id: "-1" });

    if (entry) {
      return NextResponse.json(entry);
    } else {
      return NextResponse.json({ message: "Entry not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check entry" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
