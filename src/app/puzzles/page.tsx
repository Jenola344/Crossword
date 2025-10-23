"use client";

import MainLayout from '@/components/layout/main-layout';
import PuzzleView from '@/components/crossword/puzzle-view';
import { generatedPuzzles } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import type { DailyPuzzle } from '@/lib/data';
import { Button } from '@/components/ui/button';

export default function PuzzlesPage() {
    const [selectedPuzzle, setSelectedPuzzle] = useState<DailyPuzzle | null>(null);

    const handleSelectPuzzle = (puzzle: any) => {
        setSelectedPuzzle({...puzzle, reward: {tokens: 0, hint: 0}});
    }

    if (selectedPuzzle) {
        return (
            <MainLayout>
                 <div className="container mx-auto px-4 pt-8 max-w-2xl">
                    <Button onClick={() => setSelectedPuzzle(null)} className="mb-4">Back to Puzzles</Button>
                    <PuzzleView puzzleData={selectedPuzzle} onPuzzleComplete={() => alert("Congratulations!")} />
                 </div>
            </MainLayout>
        )
    }

    return (
        <MainLayout>
            <div className="container mx-auto px-4 pt-8">
                <header className="mb-8">
                <h1 className="font-headline text-4xl font-bold">Generated Puzzles</h1>
                <p className="text-muted-foreground">A collection of AI-generated puzzles.</p>
                </header>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {generatedPuzzles.map(puzzle => (
                        <Card key={puzzle.id} className="flex flex-col hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <CardTitle>{puzzle.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow flex items-end justify-between">
                                <p>{puzzle.words.length} words</p>
                                <Button onClick={() => handleSelectPuzzle(puzzle)}>Play</Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </MainLayout>
    )
}
