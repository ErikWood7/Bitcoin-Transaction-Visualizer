'use client';

import { type Chapter } from '@/content/txChapters';
import { AutoLinkGlossary } from './AutoLinkGlossary';

interface ChapterCardProps {
  chapter: Chapter;
  chapterNumber: number;
  totalChapters: number;
}

export function ChapterCard({ chapter, chapterNumber, totalChapters }: ChapterCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-900">{chapter.title}</h2>
          <span className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-full">
            {chapterNumber} / {totalChapters}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(chapterNumber / totalChapters) * 100}%` }}
          />
        </div>
      </div>

      <div className="prose prose-sm max-w-none">
        <p className="text-gray-700 leading-relaxed">
          <AutoLinkGlossary text={chapter.bodyText} />
        </p>
      </div>

      {chapter.quizQuestion && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-semibold text-blue-900 mb-2">
            💡 Quiz Question (Coming Soon)
          </p>
          <p className="text-sm text-blue-800">{chapter.quizQuestion.question}</p>
        </div>
      )}
    </div>
  );
}
