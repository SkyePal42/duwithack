"use client";
import React, { useState } from 'react';
import "./globals.css";

// Define the structure of the scores object
const initialScores = {
  collaboration: { A: 0, B: 0 },
  introvert: { A: 0, B: 0 },
  ingenuity: { A: 0, B: 0 },
  thinking: { A: 0, B: 0 },
};

// Define the structure of a question
interface Question {
  question: string;
  options: { text: string; value: 'A' | 'B' }[];
  dimension: keyof typeof initialScores; // Use initialScores instead of scores
}

// Quiz questions
const questions: Question[] = [
  {
    question: "When working on a project, you prefer to:",
    options: [
      { text: "Work with a team, bouncing ideas off others.", value: "A" },
      { text: "Work independently, focusing on your own ideas.", value: "B" },
    ],
    dimension: "collaboration",
  },
  // 其他问题...
];

const Quiz: React.FC = () => {
  const [scores, setScores] = useState(initialScores);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [geminiResponse, setGeminiResponse] = useState(null); // 存储 Gemini 的响应

  // Handle user's answer
  const handleAnswer = (dimension: keyof typeof initialScores, choice: 'A' | 'B') => {
    setScores((prevScores) => ({
      ...prevScores,
      [dimension]: {
        ...prevScores[dimension],
        [choice]: prevScores[dimension][choice] + 1,
      },
    }));

    // Move to the next question or show results
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
      sendAnswersToGemini(); // 用户回答完所有问题后，发送答案给 Gemini
    }
  };

  // 发送用户答案给 Gemini
  const sendAnswersToGemini = async () => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: JSON.stringify(scores) }), // 将用户答案发送给后端
      });

      if (!response.ok) {
        throw new Error("Failed to get response from server");
      }

      const data = await response.json();
      setGeminiResponse(data); // 存储 Gemini 的响应
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Calculate results
  const calculateResults = () => {
    const results = {
      collaboration: scores.collaboration.A > scores.collaboration.B ? "Collaborator" : "Lone Wolf",
      introvert: scores.introvert.A > scores.introvert.B ? "Extrovert" : "Introvert",
      ingenuity: scores.ingenuity.A > scores.ingenuity.B ? "Ingenious" : "Moderate",
      thinking: scores.thinking.A > scores.thinking.B ? "Thinker" : "Feeler",
    };

    return results;
  };

  // Render the quiz or results
  return (
    <div className="text-center items-center p-4">
      <h1 className="text-5xl font-bold p-4">Personal Quiz</h1>

      {!showResults ? (
        <div>
          <h2 className="text-2xl font-bold p-4">{questions[currentQuestionIndex].question}</h2>
          <div className="text-center items-center text-center">
            {questions[currentQuestionIndex].options.map((option, index) => (
              <div className="card-dash items-center text-center" key={index}>
                <div className="card-body items-center text-center">
                  <div className="card-actions justify-end">
                    <button
                      className="btn btn-primary avatar"
                      onClick={() =>
                        handleAnswer(
                          questions[currentQuestionIndex].dimension,
                          option.value
                        )
                      }
                    >
                      {option.text}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
  <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
    Your Personality Results
  </h2>
  <div className="space-y-4">
    <div className="flex items-center bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors duration-200">
      <span className="text-lg font-semibold text-gray-700 flex-1">
        1. Collaboration vs. Lone Wolf:
      </span>
      <span className="text-xl font-bold text-blue-600">
        {calculateResults().collaboration}
      </span>
    </div>
    <div className="flex items-center bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors duration-200">
      <span className="text-lg font-semibold text-gray-700 flex-1">
        2. Introvert vs. Extrovert:
      </span>
      <span className="text-xl font-bold text-green-600">
        {calculateResults().introvert}
      </span>
    </div>
    <div className="flex items-center bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors duration-200">
      <span className="text-lg font-semibold text-gray-700 flex-1">
        3. Ingenuity vs. Moderate:
      </span>
      <span className="text-xl font-bold text-purple-600">
        {calculateResults().ingenuity}
      </span>
    </div>
    <div className="flex items-center bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors duration-200">
      <span className="text-lg font-semibold text-gray-700 flex-1">
        4. Thinking vs. Feeling:
      </span>
      <span className="text-xl font-bold text-orange-600">
        {calculateResults().thinking}
      </span>
    </div>
  </div>
</div>
          {/* 显示 Gemini 的分析结果 */}
          {geminiResponse && (
            <div>
              <h3>Gemini Analysis</h3>
              <p>{geminiResponse.question}</p>
              <pre>{JSON.stringify(geminiResponse.trait_confidences, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;