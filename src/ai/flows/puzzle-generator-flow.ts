'use server';
/**
 * @fileOverview A crossword puzzle generation AI flow.
 *
 * - generatePuzzle - A function that handles the puzzle generation process.
 * - PuzzleGeneratorInput - The input type for the generatePuzzle function.
 * - Puzzle - The return type for the generatePuzzle function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const PuzzleGeneratorInputSchema = z.object({
  theme: z.string().describe('The theme for the crossword puzzle.'),
  size: z.number().optional().default(10).describe('The grid size of the puzzle (e.g., 10 for a 10x10 grid).'),
  wordCount: z.number().optional().default(7).describe('The number of words to include in the puzzle.'),
});
export type PuzzleGeneratorInput = z.infer<typeof PuzzleGeneratorInputSchema>;

const PuzzleWordSchema = z.object({
    word: z.string().describe('The answer word.'),
    clue: z.string().describe('The clue for the word.'),
    start: z.array(z.number()).length(2).describe('The starting [row, col] of the word.'),
    direction: z.enum(['across', 'down']).describe('The direction of the word.'),
});

export const PuzzleSchema = z.object({
  id: z.string().describe('A unique ID for the puzzle.'),
  name: z.string().describe('The name of the puzzle, derived from the theme.'),
  size: z.number().describe('The grid size.'),
  words: z.array(PuzzleWordSchema).describe('The list of words in the puzzle.'),
});
export type Puzzle = z.infer<typeof PuzzleSchema>;


export async function generatePuzzle(input: PuzzleGeneratorInput): Promise<Puzzle> {
  return puzzleGeneratorFlow(input);
}

const prompt = ai.definePrompt({
    name: 'puzzleGeneratorPrompt',
    input: { schema: PuzzleGeneratorInputSchema },
    output: { schema: PuzzleSchema },
    prompt: `You are a master crossword puzzle creator. Your task is to generate a complete, valid, and fully intersecting crossword puzzle based on a given theme.

    **Instructions:**
    1.  **Theme:** The puzzle must be based on the theme: {{{theme}}}.
    2.  **Word Count:** Generate exactly {{{wordCount}}} words.
    3.  **Grid Size:** The puzzle must fit within a {{{size}}}x{{{size}}} grid. The top-left corner is [0, 0].
    4.  **High Intersection:** Words must be tightly interconnected. Every word must intersect with at least one other word, and ideally more. Avoid isolated words or small, disconnected clusters.
    5.  **Valid Placement:**
        - Words cannot overlap incorrectly. If two words cross, they must share the same letter at the intersection point.
        - Words must stay within the grid boundaries.
    6.  **Output Format:** Provide the output as a valid JSON object matching the output schema. Ensure all fields, including \`id\`, \`name\`, \`size\`, and the full \`words\` array with \`word\`, \`clue\`, \`start\` coordinates, and \`direction\`, are populated correctly. The puzzle name should be a creative title based on the theme. The puzzle ID should be a URL-safe slug based on the name.

    Generate the puzzle now.`,
});

const puzzleGeneratorFlow = ai.defineFlow(
  {
    name: 'puzzleGeneratorFlow',
    inputSchema: PuzzleGeneratorInputSchema,
    outputSchema: PuzzleSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
        throw new Error('Failed to generate puzzle.');
    }
    return output;
  }
);
