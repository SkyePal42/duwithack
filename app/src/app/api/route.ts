import { NextResponse } from "next/server";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

// 初始化 Gemini
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: {
    parts: [
      {
        text: `You need to determine a user's personality traits by asking questions that add confidence to how aligned they are with that trait. Some traits are singular (0 to 100%) and some are opposites (-100% to 100%). When you are confident with how aligned they are with each personality trait, you can stop asking questions and return the final result.
You can only ask up to 10 questions and then give the final result.
The traits are as follows:
- Curiosity: How willing someone is to learn something new
- Lone Wolf vs Collaborative: How do they like to work in a team
- Focus: Are they eager to move on or deep dive into things?
- Sheep vs Wolf: Do they contribute ideas forcefully or go with the flow?
- Ingenuity: Can they solve problems and find ways forward?
- Determination: When things get tough, do they keep going or give up?
- Patience: Are they willing to follow others' learning speed?
- Communication Style: Are they to the point or prefer subtlety?
- Detail-Oriented vs Conceptual: Do they focus on details or the big picture?

Return the response in JSON format:
{
  "done": boolean, // true if the test is complete
  "question": string, // the next question to ask
  "trait_confidences": object, // current confidence levels for each trait
  "multi_choice": string[] // optional array of choices for the question
}`,
      },
    ],
  },
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

// 记录已问过的问题
let questionHistory: string[] = [];
let questionCount = 0; // 问题计数器

// 检测问题是否重复
const isQuestionDuplicate = (newQuestion: string) => {
  const similarityThreshold = 0.8; // 相似度阈值
  for (const oldQuestion of questionHistory) {
    const similarity = calculateSimilarity(oldQuestion, newQuestion);
    if (similarity > similarityThreshold) {
      return true;
    }
  }
  return false;
};

// 计算字符串相似度（简单的 Levenshtein 距离）
const calculateSimilarity = (str1: string, str2: string) => {
  const len1 = str1.length;
  const len2 = str2.length;
  const maxLen = Math.max(len1, len2);
  const distance = levenshteinDistance(str1, str2);
  return 1 - distance / maxLen;
};

// Levenshtein 距离算法
const levenshteinDistance = (str1: string, str2: string) => {
  const matrix = Array.from({ length: str1.length + 1 }, () =>
    Array.from({ length: str2.length + 1 }, () => 0)
  );

  for (let i = 0; i <= str1.length; i++) {
    matrix[i][0] = i;
  }
  for (let j = 0; j <= str2.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str1.length; i++) {
    for (let j = 1; j <= str2.length; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // 删除
        matrix[i][j - 1] + 1, // 插入
        matrix[i - 1][j - 1] + cost // 替换
      );
    }
  }

  return matrix[str1.length][str2.length];
};

// 生成一个与历史问题完全不同的问题
const generateUniqueQuestion = async (chatSession: any, traits: any) => {
  const prompt = `Based on the following personality traits, ask a unique question that has not been asked before:
${JSON.stringify(traits, null, 2)}

Return the question as a JSON object:
{
  "question": string,
  "multi_choice": string[]
}`;

  const result = await chatSession.sendMessage(prompt);
  const responseText = result.response.text();
  return JSON.parse(responseText.replace(/```json\n|\n```/g, ""));
};

export async function POST(request: Request) {
  try {
    const { message, sessionId } = await request.json();

    // 初始化 Gemini 会话
    const chatSession = model.startChat({
      generationConfig,
      history: [], // 可以根据 sessionId 加载历史记录
    });

    // 发送用户回答或开始测试
    async function sendMessageWithRetry(chatSession: any, message: string, retries = 3) {
      try {
        const result = await chatSession.sendMessage(message || "begin");
        return result;
      } catch (error) {
        if (retries > 0) {
          console.log(`Retrying... (${retries} attempts left)`);
          await new Promise((resolve) => setTimeout(resolve, 1000)); // 延迟 1 秒
          return sendMessageWithRetry(chatSession, message, retries - 1);
        } else {
          throw new Error(`Failed after ${retries} retries: ${error}`);
        }
      }
    }

    const result = await sendMessageWithRetry(chatSession, message);
    const responseText = result.response.text();
    const responseJson = JSON.parse(responseText.replace(/```json\n|\n```/g, ""));

    // 如果测试未完成，检查问题数量
    if (!responseJson.done && responseJson.question) {
      questionCount++;
      if (questionCount >= 10) {
        // 达到 10 个问题，强制结束测试
        responseJson.done = true;
      } else if (isQuestionDuplicate(responseJson.question)) {
        // 如果问题重复，生成一个全新的问题
        const newQuestionResult = await generateUniqueQuestion(
          chatSession,
          responseJson.trait_confidences
        );
        responseJson.question = newQuestionResult.question;
        responseJson.multi_choice = newQuestionResult.multi_choice;
      }
      // 将新问题添加到历史记录中
      questionHistory.push(responseJson.question);
    }

    // 如果测试完成，生成关键词和具体描述
    if (responseJson.done) {
      const traits = responseJson.trait_confidences;

      // 生成关键词
      const keywordsPrompt = `Based on the following personality traits, generate 3-5 keywords that summarize the user's personality:
${JSON.stringify(traits, null, 2)}

Return the keywords as a JSON array:
{
  "keywords": string[]
}`;

      const keywordsResult = await chatSession.sendMessage(keywordsPrompt);
      const keywordsText = keywordsResult.response.text();
      const keywordsJson = JSON.parse(keywordsText.replace(/```json\n|\n```/g, ""));
      responseJson.keywords = keywordsJson.keywords;

      // 生成具体描述
      const descriptionPrompt = `Based on the following personality traits, provide a detailed description of the user's personality and how they might contribute to a hackathon team:
${JSON.stringify(traits, null, 2)}

Return the description as a JSON object:
{
  "description": string
}`;

      const descriptionResult = await chatSession.sendMessage(descriptionPrompt);
      const descriptionText = descriptionResult.response.text();
      const descriptionJson = JSON.parse(descriptionText.replace(/```json\n|\n```/g, ""));
      responseJson.description = descriptionJson.description;
    }

    return NextResponse.json(responseJson);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}