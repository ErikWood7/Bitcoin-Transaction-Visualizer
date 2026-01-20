'use client';

import { useState } from 'react';
import { AutoLinkGlossary } from './AutoLinkGlossary';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // 0-based index
  explanation: string;
}

interface QuizProps {
  questions: QuizQuestion[];
  onComplete?: (score: number, total: number) => void;
}

export function Quiz({ questions, onComplete }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const question = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;

  const handleAnswerSelect = (index: number) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === question.correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }

    setAnswers([...answers, selectedAnswer]);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // Quiz complete
      if (onComplete) {
        onComplete(score + (selectedAnswer === question.correctAnswer ? 1 : 0), questions.length);
      }
      return;
    }

    setCurrentQuestion(currentQuestion + 1);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  if (currentQuestion >= questions.length) {
    const finalScore = score;
    const percentage = Math.round((finalScore / questions.length) * 100);

    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">
          {percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '📚'}
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
        <p className="text-xl text-gray-600 mb-6">
          You scored {finalScore} out of {questions.length} ({percentage}%)
        </p>
        {percentage >= 80 && (
          <p className="text-green-600 font-semibold mb-4">Excellent work! You understand Bitcoin transactions well.</p>
        )}
        {percentage >= 60 && percentage < 80 && (
          <p className="text-blue-600 font-semibold mb-4">Good job! Review the explanations to strengthen your understanding.</p>
        )}
        {percentage < 60 && (
          <p className="text-orange-600 font-semibold mb-4">Keep learning! Review the tour chapters and try again.</p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-900">Quiz</h2>
          <span className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-full">
            Question {currentQuestion + 1} of {questions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          <AutoLinkGlossary text={question.question} />
        </h3>

        <div className="space-y-2">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === question.correctAnswer;
            const showResult = showExplanation;

            let className = 'w-full text-left p-4 border-2 rounded-lg transition-all cursor-pointer ';
            if (showResult) {
              if (isCorrect) {
                className += 'bg-green-50 border-green-500 text-green-900';
              } else if (isSelected && !isCorrect) {
                className += 'bg-red-50 border-red-500 text-red-900';
              } else {
                className += 'bg-gray-50 border-gray-200 text-gray-600';
              }
            } else {
              className += isSelected
                ? 'bg-blue-50 border-blue-500 text-blue-900'
                : 'bg-white border-gray-300 text-gray-900 hover:border-blue-300 hover:bg-blue-50';
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
                className={className}
              >
                <div className="flex items-center gap-2">
                  {showResult && isCorrect && <span className="text-green-600 font-bold">✓</span>}
                  {showResult && isSelected && !isCorrect && <span className="text-red-600 font-bold">✗</span>}
                  <span>{option}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {showExplanation && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-900">
            <strong>Explanation:</strong> <AutoLinkGlossary text={question.explanation} />
          </p>
        </div>
      )}

      <div className="flex justify-end">
        {!showExplanation ? (
          <button
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            className={`px-6 py-3 font-medium rounded-lg transition-colors ${
              selectedAnswer === null
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
            }`}
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
          </button>
        )}
      </div>
    </div>
  );
}
