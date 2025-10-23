'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { generatePuzzle, type Puzzle } from '@/ai/flows/puzzle-generator-flow';
import PuzzleView from '@/components/crossword/puzzle-view';
import { useToast } from '@/hooks/use-toast';

// We need to adapt PuzzleView to accept puzzle data, or create a new component.
// For now, let's create a display component here.

const GeneratedPuzzleDisplay = ({ puzzle }: { puzzle: Puzzle }) => {
    const [isPuzzleComplete, setPuzzleComplete] = useState(false);
    
    // This is a simplified version of the daily puzzle's logic.
    // A real implementation would share the PuzzleView component and pass data to it.
    const handlePuzzleComplete = () => {
        setPuzzleComplete(true);
    };

    // This is a placeholder since the generated puzzle isn't the "daily" one.
    // We need to pass the generated puzzle data to PuzzleView.
    // For now, we'll just display the metadata. A future step would be to
    // make PuzzleView reusable.
    
    const TempPuzzleView = ({puzzleData}: {puzzleData: Puzzle}) => {
        const grid: (string|null)[][] = Array(puzzleData.size).fill(null).map(() => Array(puzzleData.size).fill(null));
        puzzleData.words.forEach(word => {
            let [row, col] = word.start;
            for(let i=0; i<word.word.length; i++){
                if(row < puzzleData.size && col < puzzleData.size) {
                    grid[row][col] = word.word[i];
                }
                if(word.direction === 'across') col++;
                else row++;
            }
        });

        return (
            <div className="space-y-4">
                 <div className="aspect-square bg-card p-2 rounded-xl shadow-lg border border-primary/20">
                    <div className={`grid grid-cols-10 gap-1`}>
                    {grid.map((row, rowIndex) => (
                        row.map((cell, colIndex) => (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            className={`aspect-square w-full rounded-sm flex items-center justify-center font-headline text-lg uppercase select-none ${cell ? "bg-background" : "bg-card"}`}
                        >
                            {cell}
                        </div>
                        ))
                    ))}
                    </div>
                </div>
                <div>
                    <h3 className="font-headline text-xl">Clues</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div>
                            <h4 className="font-bold">Across</h4>
                            {puzzleData.words.filter(w => w.direction === 'across').map(w => <p key={w.word} className="text-sm">{w.start.join(',')}: {w.clue}</p>)}
                        </div>
                        <div>
                            <h4 className="font-bold">Down</h4>
                            {puzzleData.words.filter(w => w.direction === 'down').map(w => <p key={w.word} className="text-sm">{w.start.join(',')}: {w.clue}</p>)}
                        </div>
                    </div>
                </div>
            </div>
        )

    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">{puzzle.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <TempPuzzleView puzzleData={puzzle} />
            </CardContent>
        </Card>
    )
}


export default function GeneratePage() {
  const [theme, setTheme] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPuzzle, setGeneratedPuzzle] = useState<Puzzle | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!theme) {
      toast({
        variant: 'destructive',
        title: 'Theme is required',
        description: 'Please enter a theme for your puzzle.',
      });
      return;
    }
    setIsLoading(true);
    setGeneratedPuzzle(null);
    try {
      const puzzle = await generatePuzzle({ theme });
      setGeneratedPuzzle(puzzle);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'Could not generate a puzzle. Please try a different theme.',
      });
    }
    setIsLoading(false);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 pt-8">
        <header className="mb-8">
          <h1 className="font-headline text-4xl font-bold">Puzzle Generator</h1>
          <p className="text-muted-foreground">
            Create your own crossword puzzles using AI.
          </p>
        </header>

        <Card className="mb-8">
          <CardContent className="p-4 flex gap-4">
            <Input
              type="text"
              placeholder="Enter a puzzle theme (e.g., 'JavaScript' or 'Cloud Computing')"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              disabled={isLoading}
              className="flex-grow"
            />
            <Button onClick={handleGenerate} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Puzzle'
              )}
            </Button>
          </CardContent>
        </Card>

        {generatedPuzzle && (
            <GeneratedPuzzleDisplay puzzle={generatedPuzzle} />
        )}
      </div>
    </MainLayout>
  );
}
