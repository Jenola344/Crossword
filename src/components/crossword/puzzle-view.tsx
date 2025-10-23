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
  puzzleData: DailyPuzzle;
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

  const grid = useMemo(() => {
    const gridSize = puzzleData.size;
    const newGrid: (string | null)[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null));
    puzzleData.words.forEach(wordInfo => {
      let [row, col] = wordInfo.start;
      for (let i = 0; i < wordInfo.word.length; i++) {
        if(row < gridSize && col < gridSize) {
            newGrid[row][col] = wordInfo.word[i];
        }
        if (wordInfo.direction === 'across') col++;
        else row++;
      }
    });
    return newGrid;
  }, [puzzleData]);

  return (
    <div className="space-y-6">
      <div className={`aspect-square bg-card p-2 rounded-xl shadow-lg border border-primary/20`}>
        <div className={`grid grid-cols-${puzzleData.size} gap-1`}>
          {grid.map((row, rowIndex) => (
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={cn(
                  "aspect-square w-full rounded-sm flex items-center justify-center font-headline text-lg uppercase select-none transition-colors",
                  cell ? "bg-background" : "bg-card",
                  completedWords.some(w => {
                    const wordInfo = puzzleData.words.find(wi => wi.word === w);
                    if (!wordInfo) return false;
                    let [startRow, startCol] = wordInfo.start;
                    if (wordInfo.direction === 'across') {
                      return rowIndex === startRow && colIndex >= startCol && colIndex < startCol + w.length;
                    } else {
                      return colIndex === startCol && rowIndex >= startRow && rowIndex < startRow + w.length;
                    }
                  }) && "bg-primary text-primary-foreground"
                )}
              >
                {cell}
              </div>
            ))
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

      <div className="space-y-4">
        <h3 className="font-headline text-xl">Clues</h3>
        {puzzleData.words.map(wordInfo => (
          <div key={wordInfo.word} className="flex items-center gap-3 p-2 rounded-md hover:bg-secondary/50">
            <p className="flex-1 text-sm">{wordInfo.clue}</p>
            {completedWords.includes(wordInfo.word) ? (
              <CheckCircle className="text-green-500" />
            ) : (
              <Input
                value={answers[wordInfo.word] || ''}
                onChange={(e) => handleInputChange(wordInfo.word, e.target.value)}
                onBlur={() => checkAnswer(wordInfo.word)}
                maxLength={wordInfo.word.length}
                className="w-32 font-mono uppercase tracking-widest text-center"
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center pt-4">
        <Button variant="outline"><HelpCircle className="w-4 h-4 mr-2" />Get a Hint</Button>
        <Button onClick={onPuzzleComplete} disabled={completedWords.length !== puzzleData.words.length}>Complete Puzzle</Button>
      </div>
    </div>
  );
}
