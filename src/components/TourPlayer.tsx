'use client';

import { useState } from 'react';
import { useTourState } from '@/lib/tourState';
import { ChapterCard } from './ChapterCard';
import { Quiz } from './Quiz';
import { tourQuizQuestions } from '@/content/tourQuiz';

export function TourPlayer() {
  const {
    currentChapter,
    currentChapterIndex,
    totalChapters,
    isFirstChapter,
    isLastChapter,
    isComplete,
    nextChapter,
    prevChapter,
    goToChapter,
    resetTour,
  } = useTourState();
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  if (!currentChapter) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">No chapters available.</p>
      </div>
    );
  }

  if (isComplete && !showQuiz && !quizCompleted) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-4">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Tour Complete!</h2>
          <p className="text-gray-600 mb-6">
            You've completed all chapters. Great job learning about Bitcoin transactions!
          </p>
          <p className="text-gray-600 mb-6">
            Test your knowledge with a quick quiz.
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setShowQuiz(true)}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Take Quiz
          </button>
          <button
            onClick={resetTour}
            className="px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  if (showQuiz && !quizCompleted) {
    return (
      <Quiz
        questions={tourQuizQuestions}
        onComplete={(score, total) => {
          setQuizCompleted(true);
          setShowQuiz(false);
        }}
      />
    );
  }

  if (quizCompleted) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-4">
          <div className="text-6xl mb-4">🎓</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Congratulations!</h2>
          <p className="text-gray-600 mb-6">
            You've completed the tour and quiz. You now understand how Bitcoin transactions work!
          </p>
        </div>
        <button
          onClick={() => {
            resetTour();
            setShowQuiz(false);
            setQuizCompleted(false);
          }}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Start Over
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ChapterCard
        chapter={currentChapter}
        chapterNumber={currentChapterIndex + 1}
        totalChapters={totalChapters}
      />

      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-lg border border-gray-200">
        <button
          onClick={prevChapter}
          disabled={isFirstChapter}
          className="px-8 py-4 text-lg font-bold rounded-lg transition-all focus:outline-none focus:ring-4 focus:ring-offset-2"
          style={
            isFirstChapter
              ? {
                  backgroundColor: '#e5e7eb',
                  color: '#6b7280',
                  borderColor: '#d1d5db',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  cursor: 'not-allowed',
                }
              : {
                  backgroundColor: '#4f46e5',
                  color: '#ffffff',
                  borderColor: '#6366f1',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3), 0 4px 6px -2px rgba(79, 70, 229, 0.2)',
                  cursor: 'pointer',
                }
          }
          onMouseEnter={(e) => {
            if (!isFirstChapter) {
              e.currentTarget.style.backgroundColor = '#4338ca';
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(79, 70, 229, 0.3), 0 10px 10px -5px rgba(79, 70, 229, 0.2)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isFirstChapter) {
              e.currentTarget.style.backgroundColor = '#4f46e5';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(79, 70, 229, 0.3), 0 4px 6px -2px rgba(79, 70, 229, 0.2)';
            }
          }}
          aria-label="Go to previous chapter"
        >
          <span className="flex items-center gap-2">
            <span className="text-xl font-bold">←</span>
            <span className="font-bold">Back</span>
          </span>
        </button>

        <div className="flex gap-2 flex-1 justify-center">
          {Array.from({ length: totalChapters }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToChapter(index)}
              className={`w-3 h-3 rounded-full transition-colors hover:scale-125 ${
                index === currentChapterIndex
                  ? 'bg-blue-600'
                  : index < currentChapterIndex
                  ? 'bg-blue-300'
                  : 'bg-gray-300'
              }`}
              title={`Chapter ${index + 1}`}
              aria-label={`Go to chapter ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={nextChapter}
          disabled={isLastChapter}
          className={
            isLastChapter
              ? 'px-8 py-4 text-lg font-semibold rounded-lg bg-gray-200 text-gray-500 cursor-not-allowed border-2 border-gray-300'
              : 'px-8 py-4 text-lg font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2 shadow-xl hover:shadow-2xl border-2 border-blue-500 transition-all'
          }
          style={
            !isLastChapter
              ? {
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  borderColor: '#3b82f6',
                  boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3), 0 4px 6px -2px rgba(37, 99, 235, 0.2)',
                }
              : undefined
          }
          aria-label="Go to next chapter"
        >
          <span className="flex items-center gap-2">
            <span className="font-bold">Next</span>
            <span className="text-xl font-bold">→</span>
          </span>
        </button>
      </div>
    </div>
  );
}
