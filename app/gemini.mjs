import { GoogleGenerativeAI } from "@google/generative-ai";
import readline from "readline";

// 初始化 Gemini
const genAI = new GoogleGenerativeAI("AIzaSyAXqL_S1PjjBMTvyYBOKJIIv6MiMKAEd9M"); // 替换为你的 API 密钥

// 选择模型
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// 创建 readline 接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// 发送请求到 Gemini
async function sendMessage(message) {
  try {
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("请求失败:", error);
    return "抱歉，请求失败，请稍后重试。";
  }
}

// 启动对话
async function startChat() {
  console.log("欢迎使用 Gemini 对话系统！输入 'exit' 退出。");

  // 递归函数，持续对话
  const chat = async () => {
    rl.question("你: ", async (input) => {
      if (input.toLowerCase() === "exit") {
        console.log("对话结束，再见！");
        rl.close();
        return;
      }

      // 发送用户输入到 Gemini
      const botResponse = await sendMessage(input);
      console.log("Gemini:", botResponse);

      // 继续对话
      chat();
    });
  };

  // 开始对话
  chat();
}

// 启动程序
startChat().catch((error) => {
  console.error("程序出错:", error);
});