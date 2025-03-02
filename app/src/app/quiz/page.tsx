"use client";
import React, { useState } from 'react';
import "../globals.css"; 

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
    {
      question: "Your ideal work environment is:",
      options: [
        { text: "A bustling office with lots of interaction.", value: "A" },
        { text: "A quiet space where you can concentrate alone.", value: "B" },
      ],
      dimension: "collaboration",
    },
    {
      question: "When solving a problem, you:",
      options: [
        { text: "Seek input from others to find the best solution.", value: "A" },
        { text: "Trust your own instincts and problem-solving skills.", value: "B" },
      ],
      dimension: "collaboration",
    },
    {
      question: "After a long day, you recharge by:",
      options: [
        { text: "Spending time with friends or family.", value: "A" },
        { text: "Having some alone time to relax.", value: "B" },
      ],
      dimension: "introvert",
    },
    {
      question: "In social settings, you:",
      options: [
        { text: "Enjoy meeting new people and being the center of attention.", value: "A" },
        { text: "Prefer deep conversations with a few close friends.", value: "B" },
      ],
      dimension: "introvert",
    },
    {
      question: "When attending a large event, you:",
      options: [
        { text: "Feel energized and excited to network.", value: "A" },
        { text: "Feel drained and look forward to leaving early.", value: "B" },
      ],
      dimension: "introvert",
    },
    {
      question: "When faced with a challenge, you:",
      options: [
        { text: "Look for creative, outside-the-box solutions.", value: "A" },
        { text: "Stick to tried-and-true methods that you know work.", value: "B" },
      ],
      dimension: "ingenuity",
    },
    {
      question: "Your approach to life is:",
      options: [
        { text: "Innovative and always seeking new experiences.", value: "A" },
        { text: "Practical and focused on stability.", value: "B" },
      ],
      dimension: "ingenuity",
    },
    {
      question: "When learning something new, you:",
      options: [
        { text: "Experiment and explore unconventional methods.", value: "A" },
        { text: "Follow structured guidelines and step-by-step processes.", value: "B" },
      ],
      dimension: "ingenuity",
    },
    {
      question: "When making decisions, you prioritize:",
      options: [
        { text: "Logic, facts, and objective analysis.", value: "A" },
        { text: "Emotions, values, and how others will be affected.", value: "B" },
      ],
      dimension: "thinking",
    },
    {
      question: "In a disagreement, you:",
      options: [
        { text: "Focus on finding the most rational solution.", value: "A" },
        { text: "Try to understand the other person's feelings and perspective.", value: "B" },
      ],
      dimension: "thinking",
    },
    {
      question: "Your friends would describe you as:",
      options: [
        { text: "Analytical and level-headed.", value: "A" },
        { text: "Empathetic and compassionate.", value: "B" },
      ],
      dimension: "thinking",
    },
  ];
  

const Quiz: React.FC = () => {
  const [scores, setScores] = useState(initialScores);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [geminiResponse, setGeminiResponse] = useState(null); 

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
      sendAnswersToGemini(); 
    }
  };

  const sendAnswersToGemini = async () => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: JSON.stringify(scores) }), 
      });

      if (!response.ok) {
        throw new Error("Failed to get response from server");
      }

      const data = await response.json();
      setGeminiResponse(data); 
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
    <div className="hero bg-gradient-to-r from-indigo-600 to-blue-500 min-h-screen text-white">
      <div className="hero-content flex justify-center items-center">
      <button
            onClick={() => window.location.href = '/'}
            className="absolute top-20 left-4 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700"
          >
            &larr; Home
          </button>
        <div className="max-w-xl bg-white p-8 rounded-lg shadow-lg text-gray-800 relative">
          {/* Back to Home Button */}


          <h1 className="text-4xl font-semibold text-center mb-6">Personal Quiz</h1>

          {!showResults ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">{questions[currentQuestionIndex].question}</h2>
              <div className="space-y-4">
                {questions[currentQuestionIndex].options.map((option, index) => (
                  <div key={index}>
                    <button
                      className="btn btn-primary w-full py-3 rounded-lg text-white font-semibold bg-indigo-600 hover:bg-indigo-700 transition duration-300"
                      onClick={() =>
                        handleAnswer(questions[currentQuestionIndex].dimension, option.value)
                      }
                    >
                      {option.text}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-3xl font-semibold mb-6">Your Personality Results</h2>
              <p className="mb-2">
                <strong>Collaboration vs. Lone Wolf:</strong> You are a <strong>{calculateResults().collaboration}</strong>.
              </p>
              <p className="mb-2">
                <strong>Introvert vs. Extrovert:</strong> You are an <strong>{calculateResults().introvert}</strong>.
              </p>
              <p className="mb-2">
                <strong>Ingenuity vs. Moderate:</strong> You are <strong>{calculateResults().ingenuity}</strong>.
              </p>
              <p className="mb-6">
                <strong>Thinking vs. Feeling:</strong> You are a <strong>{calculateResults().thinking}</strong>.
              </p>

              <h3 className="text-2xl font-semibold mb-4">Your Personality Profile</h3>
              <p className="mb-4">
                You are a {calculateResults().collaboration}, {calculateResults().introvert}, {calculateResults().ingenuity}, and {calculateResults().thinking}.
              </p>

              {/* Gemini Analysis */}
              {geminiResponse && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Gemini Analysis</h3>
                  <p>{geminiResponse.question}</p>
                  <pre className="bg-gray-100 p-4 rounded-lg text-sm">{JSON.stringify(geminiResponse.trait_confidences, null, 2)}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
