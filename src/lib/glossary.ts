import glossaryData from '@/content/glossary.json';

export interface GlossaryEntry {
  term: string;
  definition: string;
  category: string;
}

export type GlossaryData = Record<string, GlossaryEntry>;

/**
 * Get the full glossary data
 */
export function getGlossary(): GlossaryData {
  return glossaryData as GlossaryData;
}

/**
 * Get a specific glossary entry by key
 * @param key - The glossary key (e.g., 'bitcoin', 'utxo')
 * @returns The glossary entry or undefined if not found
 */
export function getGlossaryEntry(key: string): GlossaryEntry | undefined {
  const glossary = getGlossary();
  return glossary[key.toLowerCase()];
}

/**
 * Search glossary entries by term or definition
 * @param query - Search query
 * @returns Array of matching glossary entries with their keys
 */
export function searchGlossary(query: string): Array<{ key: string; entry: GlossaryEntry }> {
  const glossary = getGlossary();
  const lowerQuery = query.toLowerCase().trim();
  
  if (!lowerQuery) {
    return Object.entries(glossary).map(([key, entry]) => ({ key, entry }));
  }

  const results: Array<{ key: string; entry: GlossaryEntry }> = [];

  for (const [key, entry] of Object.entries(glossary)) {
    const termMatch = entry.term.toLowerCase().includes(lowerQuery);
    const definitionMatch = entry.definition.toLowerCase().includes(lowerQuery);
    const keyMatch = key.toLowerCase().includes(lowerQuery);

    if (termMatch || definitionMatch || keyMatch) {
      results.push({ key, entry });
    }
  }

  return results;
}

/**
 * Get all glossary keys
 */
export function getAllGlossaryKeys(): string[] {
  return Object.keys(getGlossary());
}

/**
 * Check if a term exists in the glossary
 */
export function hasGlossaryTerm(term: string): boolean {
  return getGlossaryEntry(term.toLowerCase()) !== undefined;
}
