'use client';

import { useState, useCallback } from 'react';
import { txChapters, type Chapter } from '@/content/txChapters';

export interface TourState {
  currentChapterIndex: number;
  completedChapters: Set<string>;
  totalChapters: number;
}

export function useTourState() {
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);
  const [completedChapters, setCompletedChapters] = useState<Set<string>>(new Set());

  const totalChapters = txChapters.length;

  const currentChapter: Chapter | undefined = txChapters[currentChapterIndex];
  const isFirstChapter = currentChapterIndex === 0;
  const isLastChapter = currentChapterIndex === totalChapters - 1;
  const isComplete = completedChapters.size === totalChapters;

  const nextChapter = useCallback(() => {
    if (currentChapter) {
      setCompletedChapters((prev) => new Set(prev).add(currentChapter.id));
    }
    if (!isLastChapter) {
      setCurrentChapterIndex((prev) => Math.min(prev + 1, totalChapters - 1));
    }
  }, [currentChapter, isLastChapter, totalChapters]);

  const prevChapter = useCallback(() => {
    setCurrentChapterIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToChapter = useCallback((index: number) => {
    if (index >= 0 && index < totalChapters) {
      setCurrentChapterIndex(index);
    }
  }, [totalChapters]);

  const resetTour = useCallback(() => {
    setCurrentChapterIndex(0);
    setCompletedChapters(new Set());
  }, []);

  return {
    currentChapterIndex,
    currentChapter,
    completedChapters,
    totalChapters,
    isFirstChapter,
    isLastChapter,
    isComplete,
    nextChapter,
    prevChapter,
    goToChapter,
    resetTour,
  };
}
