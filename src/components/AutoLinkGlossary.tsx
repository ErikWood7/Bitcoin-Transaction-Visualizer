'use client';

import { useMemo } from 'react';
import { getAllGlossaryKeys, getGlossary } from '@/lib/glossary';
import { GlossaryTooltip } from './GlossaryTooltip';

interface AutoLinkGlossaryProps {
  text: string;
  className?: string;
}

/**
 * Component that automatically links glossary terms in text
 * Wraps known terms with GlossaryTooltip
 */
export function AutoLinkGlossary({ text, className = '' }: AutoLinkGlossaryProps) {
  const processedText = useMemo(() => {
    const glossary = getGlossary();
    const keys = getAllGlossaryKeys();
    
    // Sort keys by length (longest first) to match longer terms first
    const sortedKeys = [...keys].sort((a, b) => {
      const termA = glossary[a].term.toLowerCase();
      const termB = glossary[b].term.toLowerCase();
      return termB.length - termA.length;
    });

    // Create a regex pattern that matches glossary terms (case-insensitive, word boundaries)
    const parts: Array<{ type: 'text' | 'term'; content: string; key?: string }> = [];
    let lastIndex = 0;

    // Find all matches
    const matches: Array<{ key: string; term: string; index: number; length: number }> = [];

    for (const key of sortedKeys) {
      const entry = glossary[key];
      const term = entry.term;
      const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      let match;
      
      while ((match = regex.exec(text)) !== null) {
        matches.push({
          key,
          term: match[0],
          index: match.index,
          length: match[0].length,
        });
      }
    }

    // Sort matches by index
    matches.sort((a, b) => a.index - b.index);

    // Remove overlapping matches (keep the first one)
    const nonOverlapping: typeof matches = [];
    for (const match of matches) {
      const overlaps = nonOverlapping.some(
        (existing) =>
          (match.index >= existing.index && match.index < existing.index + existing.length) ||
          (existing.index >= match.index && existing.index < match.index + match.length)
      );
      if (!overlaps) {
        nonOverlapping.push(match);
      }
    }

    // Build parts array
    for (const match of nonOverlapping) {
      // Add text before match
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: text.substring(lastIndex, match.index),
        });
      }

      // Add matched term
      parts.push({
        type: 'term',
        content: match.term,
        key: match.key,
      });

      lastIndex = match.index + match.length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.substring(lastIndex),
      });
    }

    // If no matches, return original text
    if (parts.length === 0) {
      parts.push({ type: 'text', content: text });
    }

    return parts;
  }, [text]);

  return (
    <span className={className}>
      {processedText.map((part, index) => {
        if (part.type === 'term' && part.key) {
          return (
            <GlossaryTooltip key={index} term={part.key}>
              {part.content}
            </GlossaryTooltip>
          );
        }
        return <span key={index}>{part.content}</span>;
      })}
    </span>
  );
}
