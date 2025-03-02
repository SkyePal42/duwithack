"use client";
import React, { useState, useEffect } from "react";
import "../globals.css";


const initialTraitConfidences = {
  curiosity: 0,
  collaboration: 0,
  focus: 0,
  sheep_vs_wolf: 0,
  ingenuity: 0,
  determination: 0,
  patience: 0,
  communication_style: 0,
  detail_vs_conceptual: 0,
};

interface GeminiResponse {
  done: boolean;
  question?: string;
  trait_confidences?: typeof initialTraitConfidences;
  multi_choice?: string[];
  keywords?: string[]; 
  role_description?: string; 
}

const ResultsPage = ({
  traitConfidences,
  keywords,
  roleDescription,
}: {
  traitConfidences: typeof initialTraitConfidences;
  keywords: string[];
  roleDescription: string;
}) => {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-semibold mb-6">Your Personality Results</h2>
      <div className="space-y-4">
        {}
        <div>
          <h3 className="text-xl font-semibold mb-2">Personality Traits</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(traitConfidences).map(([trait, confidence]) => (
              <div key={trait} className="bg-gray-100 p-4 rounded-lg">
                <p className="font-medium">{trait.replace(/_/g, " ")}</p>
                <p>{confidence}%</p>
              </div>
            ))}
          </div>
        </div>

        {}
        {keywords && keywords.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mt-6 mb-2">Keywords</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}

        {}
        {roleDescription && (
          <div>
            <h3 className="text-xl font-semibold mt-6 mb-2">Role in Hackathon</h3>
            <p className="bg-gray-100 p-4 rounded-lg text-left">{roleDescription}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Quiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [multiChoice, setMultiChoice] = useState<string[]>([]);
  const [traitConfidences, setTraitConfidences] = useState(initialTraitConfidences);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [keywords, setKeywords] = useState<string[]>([]); 
  const [roleDescription, setRoleDescription] = useState<string>(""); 
  const [error, setError] = useState<string | null>(null); 

  useEffect(() => {
    startQuiz();
  }, []);

  const startQuiz = async () => {
    try {
      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: "begin" }), 
      });

      if (!response.ok) {
        throw new Error("Failed to start quiz");
      }

      const data: GeminiResponse = await response.json();
      handleGeminiResponse(data);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to start the quiz. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeminiResponse = (data: GeminiResponse) => {
    if (data.done) {
      setShowResults(true);
      setTraitConfidences(data.trait_confidences || initialTraitConfidences);
      setKeywords(data.keywords || []); // 确保 keywords 被正确设置
      setRoleDescription(data.role_description || "");
    } else {
      setCurrentQuestion(data.question || "");
      setMultiChoice(data.multi_choice || []);
      setTraitConfidences(data.trait_confidences || initialTraitConfidences);
    }
  };

  const handleAnswer = async (answer: string | number) => {
    try {
      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: typeof answer === "number" ? multiChoice[answer] : answer,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send answer");
      }

      const data: GeminiResponse = await response.json();
      handleGeminiResponse(data);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to send your answer. Please try again.");
    }
  };

  return (
    <div className="hero bg-gradient-to-r from-indigo-600 to-blue-500 min-h-screen text-white">
      <div className="hero-content flex justify-center items-center">
        <button
          onClick={() => (window.location.href = "/")}
          className="absolute top-20 left-4 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700"
        >
          &larr; Home
        </button>
        <div className="max-w-xl bg-white p-8 rounded-lg shadow-lg text-gray-800 relative">
          <h1 className="text-4xl font-semibold text-center mb-6">Personality Quiz</h1>

          {error ? (
            <div className="text-center text-red-600">
              <p>{error}</p>
              <button
                onClick={startQuiz}
                className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Retry
              </button>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="ml-2">Loading...</p>
            </div>
          ) : !showResults ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">{currentQuestion}</h2>
              <div className="space-y-4">
                {multiChoice.length > 0 ? (
                  multiChoice.map((option, index) => (
                    <div key={index}>
                      <button
                        className="btn btn-primary w-full py-3 rounded-lg text-white font-semibold bg-indigo-600 hover:bg-indigo-700 transition duration-300"
                        onClick={() => handleAnswer(index)}
                      >
                        {option}
                      </button>
                    </div>
                  ))
                ) : (
                  <div>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      placeholder="Type your answer..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAnswer(e.currentTarget.value);
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <ResultsPage
              traitConfidences={traitConfidences}
              keywords={keywords}
              roleDescription={roleDescription}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;