'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getGlossaryEntry } from '@/lib/glossary';

interface GlossaryTooltipProps {
  term: string;
  children: React.ReactNode;
  className?: string;
}

export function GlossaryTooltip({ term, children, className = '' }: GlossaryTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const entry = getGlossaryEntry(term);

  if (!entry) {
    // If term not found, just render children without tooltip
    return <span className={className}>{children}</span>;
  }

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        left: rect.left + rect.width / 2,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        triggerRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <span className="relative inline-block">
      <span
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className={`cursor-help underline decoration-dotted decoration-blue-500 hover:decoration-blue-700 ${className}`}
      >
        {children}
      </span>
      {isOpen && position && typeof window !== 'undefined' && createPortal(
        <div
          ref={tooltipRef}
          className="fixed z-50 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg pointer-events-auto"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            transform: 'translateX(-50%)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="font-semibold text-blue-300 mb-1">{entry.term}</div>
          <div className="text-gray-200">{entry.definition}</div>
          <div className="mt-2 pt-2 border-t border-gray-700 text-xs text-gray-400">
            {entry.category}
          </div>
        </div>,
        document.body
      )}
    </span>
  );
}
