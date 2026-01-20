'use client';

import { useLearnMode } from '@/lib/learnMode';

export function LearnModeToggle() {
  const { isLearnMode, toggleLearnMode } = useLearnMode();

  return (
    <div className="flex items-center gap-2">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={isLearnMode}
          onChange={toggleLearnMode}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
        />
        <span className="text-sm font-medium">Learn Mode</span>
      </label>
      {isLearnMode && (
        <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded">
          Learn Mode: ON
        </span>
      )}
    </div>
  );
}
