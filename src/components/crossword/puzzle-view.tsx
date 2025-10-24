
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
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [completedWords, setCompletedWords] = useState<string[]>([]);
  
  const totalWords = puzzleData.words.length;
  const progress = (completedWords.length / totalWords) * 100;

  const handleInputChange = (word: string, value: string) => {
    setAnswers(prev => ({ ...prev, [word]: value.toUpperCase() }));
  };

  const checkAnswer = (word: string) => {
    if (answers[word] === word) {
      if (!completedWords.includes(word)) {
        setCompletedWords(prev => [...prev, word]);
        toast({ title: "Word Correct!", description: `You found "${word}"!` });
      }
    } else if (answers[word] && answers[word].length === word.length) {
      toast({ variant: 'destructive', title: "Not quite!", description: `"${answers[word]}" is not the correct word.` });
    }
  };

  useEffect(() => {
    if (completedWords.length > 0 && completedWords.length === totalWords) {
      onPuzzleComplete();
    }
  }, [completedWords, totalWords, onPuzzleComplete]);

  const { grid, wordPositions, solvedGrid } = useMemo(() => {
    const gridSize = puzzleData.size;
    const newGrid: (string | null)[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null));
    const newSolvedGrid: (string | null)[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null));
    const positions: { [key: string]: number } = {};
    
    puzzleData.words.forEach(wordInfo => {
      let [row, col] = wordInfo.start;
      if (!Object.values(positions).some(p => p === wordInfo.start[0] * 100 + wordInfo.start[1])) {
          positions[wordInfo.word] = Object.keys(positions).length + 1;
      }
      
      for (let i = 0; i < wordInfo.word.length; i++) {
        if(row < gridSize && col < gridSize) {
           newGrid[row][col] = ''
           newSolvedGrid[row][col] = wordInfo.word[i];
        }
        if (wordInfo.direction === 'across') col++;
        else row++;
      }
    });

    // Re-assign numbers based on sorted positions
    const sortedWords = [...puzzleData.words].sort((a, b) => {
        if(a.start[0] !== b.start[0]) return a.start[0] - b.start[0];
        return a.start[1] - b.start[1];
    });

    const finalPositions: { [key: string]: number } = {};
    let currentNumber = 1;
    const assignedCoords = new Set();

    sortedWords.forEach(wordInfo => {
        const coordKey = `${wordInfo.start[0]},${wordInfo.start[1]}`;
        if (!assignedCoords.has(coordKey)) {
             puzzleData.words.filter(w => w.start[0] === wordInfo.start[0] && w.start[1] === wordInfo.start[1]).forEach(w => {
                finalPositions[w.word] = currentNumber;
            });
            assignedCoords.add(coordKey);
            currentNumber++;
        }
    });


    return { grid: newGrid, wordPositions: finalPositions, solvedGrid: newSolvedGrid };
  }, [puzzleData]);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Progress value={progress} className="w-full" />
        <span className="text-sm font-bold text-muted-foreground whitespace-nowrap">{completedWords.length} / {totalWords}</span>
      </div>

      <div className="aspect-square bg-card p-1 sm:p-2 rounded-xl shadow-lg border border-primary/20">
        <div className={cn("grid gap-0.5", `grid-cols-${puzzleData.size}`)} style={{gridTemplateColumns: `repeat(${puzzleData.size}, minmax(0, 1fr))`}}>
          {grid.map((row, rowIndex) => (
            row.map((cell, colIndex) => {
              const letter = solvedGrid[rowIndex][colIndex];
              const startingWord = puzzleData.words.find(w => w.start[0] === rowIndex && w.start[1] === colIndex);
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={cn(
                    "aspect-square w-full rounded-sm flex items-center justify-center font-headline text-[10px] sm:text-lg uppercase select-none transition-colors relative",
                    cell !== null ? "bg-background" : "bg-card",
                  )}
                >
                  {startingWord && <span className="absolute top-0 left-0.5 text-[6px] sm:text-[10px] text-muted-foreground">{wordPositions[startingWord.word]}</span>}
                  {letter}
                </div>
              )
            })
          ))}
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
        <div>
            <h3 className="font-headline text-xl mb-2">Across</h3>
            {puzzleData.words.filter(w => w.direction === 'across').sort((a,b) => wordPositions[a.word] - wordPositions[b.word]).map(wordInfo => {
                const isCompleted = completedWords.includes(wordInfo.word);
                return (
                    <div key={wordInfo.word} className="flex items-center gap-2 p-1.5 rounded-md hover:bg-secondary/50">
                        <span className="w-5 text-right font-bold text-muted-foreground text-sm">{wordPositions[wordInfo.word]}</span>
                        <p className="flex-1 text-sm">{wordInfo.clue}</p>
                        {isCompleted ? <CheckCircle className="text-green-500 w-5 h-5" /> :
                         <Input 
                            className="w-24 h-8 text-xs"
                            value={answers[wordInfo.word] || ''}
                            onChange={(e) => handleInputChange(wordInfo.word, e.target.value)}
                            onBlur={() => checkAnswer(wordInfo.word)}
                            maxLength={wordInfo.word.length}
                         />
                        }
                    </div>
                )
            })}
        </div>
        <div>
            <h3 className="font-headline text-xl mb-2">Down</h3>
            {puzzleData.words.filter(w => w.direction === 'down').sort((a,b) => wordPositions[a.word] - wordPositions[b.word]).map(wordInfo => {
                const isCompleted = completedWords.includes(wordInfo.word);
                return (
                    <div key={wordInfo.word} className="flex items-center gap-2 p-1.5 rounded-md hover:bg-secondary/50">
                        <span className="w-5 text-right font-bold text-muted-foreground text-sm">{wordPositions[wordInfo.word]}</span>
                        <p className="flex-1 text-sm">{wordInfo.clue}</p>
                        {isCompleted ? <CheckCircle className="text-green-500 w-5 h-5" /> :
                         <Input 
                            className="w-24 h-8 text-xs"
                            value={answers[wordInfo.word] || ''}
                            onChange={(e) => handleInputChange(wordInfo.word, e.target.value)}
                            onBlur={() => checkAnswer(wordInfo.word)}
                            maxLength={wordInfo.word.length}
                         />
                        }
                    </div>
                )
            })}
        </div>
      </div>
    </div>
  );
}
