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
          <div className="text-center items-center text-center ">
            {questions[currentQuestionIndex].options.map((option, index) => (      
                
                <div className="card-dash items-center text-center">
                    <div className="card-body items-center text-center">
                     <div className="card-actions justify-end">
                        <button 
                        key={index}
                        className="btn btn-primary  avatar"
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
<<<<<<< HEAD
          <h2>Your Personality Results</h2>
          <p>1. Collaboration vs. Lone Wolf: You are a <strong>{calculateResults().collaboration}</strong>.</p>
          <p>2. Introvert vs. Extrovert: You are an <strong>{calculateResults().introvert}</strong>.</p>
          <p>3. Ingenuity vs. Moderate: You are <strong>{calculateResults().ingenuity}</strong>.</p>
          <p>4. Thinking vs. Feeling: You are a <strong>{calculateResults().thinking}</strong>.</p>
          <h3>Your Personality Profile</h3>
          <p>
            You are a {calculateResults().collaboration}, {calculateResults().introvert},{" "}
            {calculateResults().ingenuity}, {calculateResults().thinking}.
          </p>
=======
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
>>>>>>> f28beaccc061362703ff25fcbfb6089a247599a5
        </div>
      )}
    </div>
  );
};

export default Quiz;