import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

// MongoDB 连接字符串
const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI environment variable is not defined");
}

// 全局单例的 MongoClient 实例
let clientPromise: Promise<MongoClient>;

async function getDbClient() {
  if (!clientPromise) {
    clientPromise = MongoClient.connect(uri, {
      maxPoolSize: 10, // 设置连接池大小
      connectTimeoutMS: 30000, // 连接超时 30 秒
      socketTimeoutMS: 60000, // 操作超时 60 秒
    });
  }
  return clientPromise;
}

export async function POST(request: Request) {
  let client;
  try {
    // 解析请求体中的数据
    const requestBody = await request.json();
    console.log("Received data:", requestBody); // 打印请求体

    const { skills, interests, experience } = requestBody;

    // 验证请求体字段
    if (!skills || !interests || !experience) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 连接到 MongoDB
    client = await getDbClient();
    const database = client.db("user_data"); // 数据库名称
    const collection = database.collection("user_info"); // 集合名称

    // 创建要存储的数据对象
    const userData = {
      skills,
      interests,
      experience,
      createdAt: new Date(), // 添加时间戳
    };

    // 将数据插入到 MongoDB 集合中
    const result = await collection.insertOne(userData);
    console.log("Insert result:", result); // 打印插入结果

    // 返回成功响应
    return NextResponse.json({
      success: true,
      message: "User data saved successfully",
      userId: result.insertedId, // 返回插入的文档 ID
    });
  } catch (error) {
    console.error("Error saving user data:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save user data" }, // 返回具体错误信息
      { status: 500 }
    );
  }
}