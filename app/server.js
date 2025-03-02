const express = require("express");
const path = require("path");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT =5000;

// 允许跨域请求
app.use(cors());
app.use(express.json());

// 托管静态文件（前端文件）
app.use(express.static(path.join(__dirname)));

// Gemini API 配置
const API_KEY = "AIzaSyAXqL_S1PjjBMTvyYBOKJIIv6MiMKAEd9M"; // 替换为你的 API 密钥
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

// 代理端点
app.post("/api/gemini", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await axios.post(GEMINI_URL, {
      contents: [
        {
          parts: [
            {
              text: message,
            },
          ],
        },
      ],
    });

    const botResponse = response.data.candidates[0].content.parts[0].text;
    res.json({ response: botResponse });
  } catch (error) {
    console.error("请求失败:", error);
    res.status(500).json({ error: "请求失败" });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});