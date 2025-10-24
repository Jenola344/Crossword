"use client";

import { useState, useMemo, useEffect } from 'react';
import type { DailyPuzzle } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface PuzzleViewProps {
  puzzleData: any;
  onPuzzleComplete: () => void;
}

export default function PuzzleView({ puzzleData, onPuzzleComplete }: PuzzleViewProps) {
  const { toast } = useToast();
  const [answers, setAnswers] = useState<{[key: string]: string}>({});
  const [completedWords, setCompletedWords] = useState<string[]>([]);
  
  useEffect(() => {
    setAnswers({});
    setCompletedWords([]);
  }, [puzzleData]);

  const handleInputChange = (word: string, value: string) => {
    setAnswers(prev => ({...prev, [word]: value.toUpperCase()}));
  };

  const checkAnswer = (word: string) => {
    if (answers[word] === word) {
      if (!completedWords.includes(word)) {
        setCompletedWords(prev => {
            const newCompletedWords = [...prev, word];
            if (newCompletedWords.length === puzzleData.words.length) {
              onPuzzleComplete();
            }
            return newCompletedWords;
        });
        toast({ title: "Word Correct!", description: `You found "${word}"!` });
      }
    } else if (answers[word] && answers[word].length === word.length) {
      toast({ variant: 'destructive', title: "Not quite!", description: `"${answers[word]}" is not the correct word.` });
    }
  };

  const progress = (completedWords.length / puzzleData.words.length) * 100;

  const { grid, wordPositions } = useMemo(() => {
    const gridSize = puzzleData.size;
    const newGrid: (string | null)[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null));
    const positions: {[key: string]: number} = {};
    
    puzzleData.words.forEach(wordInfo => {
      let [row, col] = wordInfo.start;
      positions[wordInfo.word] = Object.keys(positions).length + 1;
      
      for (let i = 0; i < wordInfo.word.length; i++) {
        if(row < gridSize && col < gridSize) {
          if (i === 0) {
            newGrid[row][col] = newGrid[row][col] ? `${newGrid[row][col]}/${positions[wordInfo.word]}` : `${positions[wordInfo.word]}`;
          } else {
             newGrid[row][col] = ''
          }
        }
        if (wordInfo.direction === 'across') col++;
        else row++;
      }
    });

    const revealedGrid: (string | null)[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null));
    puzzleData.words.forEach(wordInfo => {
        if (completedWords.includes(wordInfo.word)) {
            let [row, col] = wordInfo.start;
            for (let i = 0; i < wordInfo.word.length; i++) {
                if (row < gridSize && col < gridSize) {
                    revealedGrid[row][col] = wordInfo.word[i];
                }
                if (wordInfo.direction === 'across') col++;
                else row++;
            }
        }
    });


    return { grid: newGrid, wordPositions: positions, revealedGrid };
  }, [puzzleData, completedWords]);
  
  const { revealedGrid } = useMemo(() => {
    const gridSize = puzzleData.size;
    const newRevealedGrid: (string | null)[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null));
    
    puzzleData.words.forEach(wordInfo => {
      let [row, col] = wordInfo.start;
      for (let i = 0; i < wordInfo.word.length; i++) {
        if (row < gridSize && col < gridSize) {
          newRevealedGrid[row][col] = '';
        }
        if (wordInfo.direction === 'across') col++;
        else row++;
      }
    });

    completedWords.forEach(word => {
        const wordInfo = puzzleData.words.find(w => w.word === word);
        if (wordInfo) {
            let [row, col] = wordInfo.start;
            for (let i = 0; i < wordInfo.word.length; i++) {
                if (row < gridSize && col < gridSize) {
                    newRevealedGrid[row][col] = word[i];
                }
                if (wordInfo.direction === 'across') col++;
                else row++;
            }
        }
    });

    return { revealedGrid: newRevealedGrid };
  }, [puzzleData, completedWords]);

  return (
    <div className="space-y-6">
      <div className="aspect-square bg-card p-1 sm:p-2 rounded-xl shadow-lg border border-primary/20">
        <div className={cn("grid gap-0.5", `grid-cols-12`)}>
          {grid.map((row, rowIndex) => (
            row.map((cell, colIndex) => {
              const isFilled = revealedGrid[rowIndex][colIndex];
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={cn(
                    "aspect-square w-full rounded-sm flex items-center justify-center font-headline text-[10px] sm:text-lg uppercase select-none transition-colors relative",
                    cell !== null ? "bg-background" : "bg-card",
                  )}
                >
                  {cell && cell.length > 0 && !isFilled && (
                    <span className="absolute top-0.5 left-0.5 text-[8px] sm:text-[10px] text-muted-foreground">{cell}</span>
                  )}
                  {isFilled}
                </div>
              )
            })
          ))}
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-muted-foreground">Progress</p>
            <p className="text-sm font-bold">{completedWords.length} / {puzzleData.words.length}</p>
        </div>
        <Progress value={progress} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-accent" />
      </div>

      <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
        <div>
            <h3 className="font-headline text-xl mb-2">Across</h3>
            {puzzleData.words.filter(w => w.direction === 'across').map(wordInfo => (
            <div key={wordInfo.word} className="flex items-center gap-3 p-2 rounded-md hover:bg-secondary/50">
                <span className="w-6 text-right font-bold text-muted-foreground">{wordPositions[wordInfo.word]}</span>
                <p className="flex-1 text-sm">{wordInfo.clue}</p>
                {completedWords.includes(wordInfo.word) ? (
                <CheckCircle className="text-green-500 w-5 h-5" />
                ) : (
                <Input
                    value={answers[wordInfo.word] || ''}
                    onChange={(e) => handleInputChange(wordInfo.word, e.target.value)}
                    onBlur={() => checkAnswer(wordInfo.word)}
                    maxLength={wordInfo.word.length}
                    className="w-24 sm:w-32 font-mono uppercase tracking-widest text-center"
                />
                )}
            </div>
            ))}
        </div>
        <div>
            <h3 className="font-headline text-xl mb-2">Down</h3>
            {puzzleData.words.filter(w => w.direction === 'down').map(wordInfo => (
            <div key={wordInfo.word} className="flex items-center gap-3 p-2 rounded-md hover:bg-secondary/50">
                <span className="w-6 text-right font-bold text-muted-foreground">{wordPositions[wordInfo.word]}</span>
                <p className="flex-1 text-sm">{wordInfo.clue}</p>
                {completedWords.includes(wordInfo.word) ? (
                <CheckCircle className="text-green-500 w-5 h-5" />
                ) : (
                <Input
                    value={answers[wordInfo.word] || ''}
                    onChange={(e) => handleInputChange(wordInfo.word, e.target.value)}
                    onBlur={() => checkAnswer(wordInfo.word)}
                    maxLength={wordInfo.word.length}
                    className="w-24 sm:w-32 font-mono uppercase tracking-widest text-center"
                />
                )}
            </div>
            ))}
        </div>
      </div>
      <div className="flex justify-between items-center pt-4">
        <Button variant="outline"><HelpCircle className="w-4 h-4 mr-2" />Get a Hint</Button>
        <Button onClick={onPuzzleComplete} disabled={completedWords.length !== puzzleData.words.length}>Complete Puzzle</Button>
      </div>
    </div>
  );
}