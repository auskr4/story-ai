/**
 * Templates index file
 * Centralizes all story generation templates for different genres
 */

import { SciFiPromptAnswers, generateSciFiTemplate } from './scifi';

export type { SciFiPromptAnswers };

export interface TemplateMap {
  'Sci-Fi': (answers: SciFiPromptAnswers) => string;
  // We'll add other genres here in the future
  // Adventure: (answers: AdventurePromptAnswers) => string;
  // Mystery: (answers: MysteryPromptAnswers) => string;
  // 'Fairy Tale': (answers: FairyTalePromptAnswers) => string;
}

/**
 * Mapping of all available templates by genre
 */
export const templates: TemplateMap = {
  'Sci-Fi': generateSciFiTemplate,
  // Add other genre templates as they are created
};

/**
 * Generic function to generate a template for any supported genre
 */
export function generateTemplate(genre: keyof TemplateMap, answers: any): string {
  if (!templates[genre]) {
    throw new Error(`Template for genre "${genre}" not found`);
  }
  
  return templates[genre](answers);
} 