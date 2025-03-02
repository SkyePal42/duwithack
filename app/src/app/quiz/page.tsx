const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction:
    'You need to determine a users personality traits by asking questions that add confidence to how aligned they are with that trait. Some traits are singular (0 to 100%) and some are opposites (-100% to 100%). When you are confident with how aligned they are with each personality trait you can stop asking questions and return the final result.\n\nThe traits are used to help determine potential teammate compatibility when forming a hackathon team, prioritising a balance of skills, work ethics, while hopefully avoiding potential conflict areas (like slow learners paired with inpatient wolfs).\n\nThe traits are as follow:\nCuriosity - how willing someone is to learn something new\nlone wolf vs collaborative - how do they like to work in a team (solving problems and learning)\nfocus - are they eager to move on to the next task, goal, or milestone; or do they want to deep dive into the thing they\'re learning even if unproductive and effectively procastination\nsheep vs wolf - do they contribute ideas (sometimes too forcefully) or do they go with the flow (sometimes to the point they contribute no input, opinions, or ideas)\ningenuity - can they solve problems and find a way forward\ndetermination - when things get tough and time starts running out, do they keep going to the best they can or give up\npatience - are they willing to follow along other people\'s learning journey and problem solving speed or will they lash out at their team mates for taking too long to understand beginner concepts\ncommunication style - are they to the point (not neccesarily in a rude way) or do they prefer to be subtle, sugar coat, and ndge people in the desired direction instead (not neccesarily via manipulation)\ndetail-orientated vs conceptual - do they solve problem by getting into the details or painting the broad strokes and how things connect together\n\nuse a json schema in your responses:\n{\n"done": bool; true if returning the final result (no question)\n"question": the next question you ask\n"trait confidences": object of traits and their numerical percentage confidence level so far (or the final values)\n"multi-choice": and optional array of possible answers and the related traits and their differences\n}\n\nthe server will responds in this JSON schema:\n{\n"question": the question asked\n"multi-choice": bool; true if you provided a multi-choice option\n"answer": a text response for freeform or a numerical index value of the multichoice\'s index selected\n}\n\nreturn only the json and as an unformated string',
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
  responseSchema: {
    type: "object",
    properties: {
      done: {
        type: "boolean",
      },
      question: {
        type: "string",
      },
      traits: {
        type: "object",
        properties: {
          curiosity: {
            type: "number",
          },
          "lone wolf vs collaborative": {
            type: "number",
          },
          focus: {
            type: "number",
          },
          "sheep vs wolf": {
            type: "number",
          },
          ingenuity: {
            type: "number",
          },
          determination: {
            type: "number",
          },
          patience: {
            type: "number",
          },
          "blunt vs vague": {
            type: "number",
          },
          "detail-oriented vs conceptual": {
            type: "number",
          },
        },
        required: [
          "curiosity",
          "lone wolf vs collaborative",
          "focus",
          "sheep vs wolf",
          "ingenuity",
          "determination",
          "patience",
          "blunt vs vague",
          "detail-oriented vs conceptual",
        ],
      },
      "multi-choice": {
        type: "array",
        items: {
          type: "object",
          properties: {
            "answer choice": {
              type: "string",
            },
            "trait(s)": {
              type: "array",
              items: {
                type: "object",
                properties: {
                  trait: {
                    type: "string",
                  },
                  "confidence shift": {
                    type: "number",
                  },
                },
                required: ["trait"],
              },
            },
          },
          required: ["trait(s)"],
        },
      },
    },
    required: ["done", "traits", "multi-choice"],
  },
};

async function run() {
  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [{ text: "begin" }],
      },
      {
        role: "model",
        parts: [
          {
            text: '```json\n{\n  "done": false,\n  "multi-choice": [],\n  "traits": {\n    "blunt vs vague": 0.0,\n    "curiosity": 0.0,\n    "detail-oriented vs conceptual": 0.0,\n    "determination": 0.0,\n    "focus": 0.0,\n    "ingenuity": 0.0,\n    "lone wolf vs collaborative": 0.0,\n    "patience": 0.0,\n    "sheep vs wolf": 0.0\n  },\n  "question": "When learning something new, do you prefer to jump right in and experiment, or do you start by reading documentation and tutorials?"\n}\n```',
          },
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage({
    "question": "the question asked",
    "multi-choice": bool, if you provided a multi-choice option
    "answer": a text response for freeform or a numerical index value of the multichoice's index selected
    });
  console.log(result.response.text());

  return chatSession;
}

export default function Quiz() {
  chatSession = run();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", text: input },
    ]);

    setInput("");

    try {
      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error("Error");
      }

      const data = await response.json();
      const botResponse = data.response;

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "Gemini", text: botResponse },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "Gemini",
          text: "Sorry, there was an error. Please try again later.",
        },
      ]);
    }
  };

  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  if (user) {
    return (
      <div
        className="bg-base-200 flex flex-col justify-center items-center h-full w-screen"
        // style={styles.body}
      >
        <div
          id="chat"
          className="card p-3 bg-base-100 shadow-sm h-[500px] w-[400px] mb-5"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat ${
                msg.role === "user" ? "chat-end" : "chat-start"
              }`}
            >
              <div
                key={index}
                className={`chat-bubble ${
                  msg.role === "user"
                    ? "chat-bubble-primary"
                    : "chat-bubble-info"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat ${
              msg.role === "user" ? "chat-end" : "chat-start"
            }`}
          >
            <div
              key={index}
              className={`chat-bubble ${
                msg.role === "user" ? "chat-bubble-primary" : "chat-bubble-info"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <input
          type="text"
          id="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
          className="input w-[400px]"
        />
      </div>
    );
  }
  return (
    <div className="bg-base-200 flex flex-col justify-center items-center h-full w-screen">
      <p className="text-7xl font-black text-red-600 text-center mb-10">
        YOU ARE NOT LOGGED IN!!!!!!
      </p>
      <a className="btn btn-error btn-xl" href="/api/auth/login">
        Login
      </a>
    </div>
  );

  const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
  console.log(result.response.text());
}
