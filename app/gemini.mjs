// 后端代理地址
const API_URL = "http://localhost:3000/api/gemini";

// 获取 DOM 元素
const chat = document.getElementById("chat");
const input = document.getElementById("input");

// 添加消息到聊天窗口
function addMessage(role, text) {
  const message = document.createElement("div");
  message.classList.add("message", role);
  message.textContent = text;
  chat.appendChild(message);
  chat.scrollTop = chat.scrollHeight; // 滚动到底部
}

// 发送消息到 Gemini API
async function sendMessage(message) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error("请求失败");
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("请求失败:", error);
    return "抱歉，请求失败，请稍后重试。";
  }
}

// 处理用户输入
input.addEventListener("keypress", async (e) => {
  if (e.key === "Enter") {
    const userMessage = input.value.trim();
    if (!userMessage) return;

    // 显示用户消息
    addMessage("user", userMessage);
    input.value = "";

    // 发送消息到 Gemini 并显示响应
    const botResponse = await sendMessage(userMessage);
    addMessage("bot", botResponse);
  }
});