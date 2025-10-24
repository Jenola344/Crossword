'use server';
/**
 * @fileOverview A crossword puzzle generation AI agent.
 *
 * - generatePuzzle - A function that handles the puzzle generation process.
 */

import {ai} from '@/ai/genkit';
import { z } from 'zod';
import { PuzzleGeneratorInputSchema, PuzzleGeneratorOutputSchema, type PuzzleGeneratorInput, type PuzzleGeneratorOutput } from '@/lib/data';


export async function generatePuzzle(input: PuzzleGeneratorInput): Promise<PuzzleGeneratorOutput> {
  return puzzleGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'puzzleGeneratorPrompt',
  input: {schema: PuzzleGeneratorInputSchema},
  output: {schema: PuzzleGeneratorOutputSchema},
  prompt: `You are a master crossword puzzle creator. Your task is to generate a complete, valid, and engaging 8x8 crossword puzzle based on a given theme.

  THEME: {{{theme}}}
  
  Follow these rules STRICTLY:
  1.  **Grid Size**: The puzzle grid MUST be 8x8.
  2.  **Word Selection**: All words MUST be strongly related to the theme: '{{{theme}}}'.
  3.  **Word Count**: Include 4-5 'across' words and 3-4 'down' words.
  4.  **Intersections**:
      -   Every single word MUST intersect with at least TWO other words.
      -   All intersections must be valid (i.e., the letters must match where words cross).
      -   Do not create any words that are isolated or only cross one other word. The puzzle must be a single, fully connected component.
  5.  **Word Length**: The words should have a balanced mix of lengths:
      -   Include short words (3-4 letters).
      -   Include medium words (5-7 letters).
      -   Include at least one long word (8 letters if possible).
  6.  **Numbering and Placement**:
      -   Determine the correct starting [row, col] for each word. The grid is 0-indexed.
      -   Assign the direction ('across' or 'down').
      -   The final output must be a valid, playable crossword puzzle.
  7.  **Clues**: Write clear and concise clues for each word.
  8.  **Output Format**: Provide the output as a valid JSON object matching the specified Zod schema. Ensure all fields are correctly populated. Give the puzzle a creative name.
  
  Analyze the word list, plan the layout to maximize intersections, and then define the final coordinates and clues. Double-check that every word is connected at least twice before finalizing the output.`,
});

const puzzleGeneratorFlow = ai.defineFlow(
  {
    name: 'puzzleGeneratorFlow',
    inputSchema: PuzzleGeneratorInputSchema,
    outputSchema: PuzzleGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
