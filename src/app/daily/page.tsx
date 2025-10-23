"use client";

import { useState } from 'react';
import MainLayout from '@/components/layout/main-layout';
import PuzzleView from '@/components/crossword/puzzle-view';
import ClaimRewardModal from '@/components/rewards/claim-reward-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Star, Sparkles } from 'lucide-react';
import { dailyPuzzleData, type DailyPuzzle } from '@/lib/data';
import { generatePuzzle } from '@/ai/flows/puzzle-generator-flow';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function DailyPage() {
  const [currentPuzzle, setCurrentPuzzle] = useState<DailyPuzzle>(dailyPuzzleData);
  const [isPuzzleComplete, setPuzzleComplete] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handlePuzzleComplete = () => {
    if (currentPuzzle.id === 'daily-2024-07-29') {
      setShowRewardModal(true);
    }
    setPuzzleComplete(true);
  };

  const handleGenerateNewPuzzle = async () => {
    setIsGenerating(true);
    try {
        const newPuzzle = await generatePuzzle({ theme: 'Technology' });
        // @ts-ignore
        setCurrentPuzzle({ ...newPuzzle, reward: { tokens: 10, hint: 0 }});
        setPuzzleComplete(false);
    } catch (e) {
        toast({
            variant: "destructive",
            title: "Generation Failed",
            description: "Could not generate a new puzzle. Please try again."
        })
    } finally {
        setIsGenerating(false);
    }
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 pt-8 max-w-2xl">
        <header className="mb-8">
          <h1 className="font-headline text-4xl font-bold">Today's Puzzle</h1>
          <p className="text-muted-foreground">Solve the puzzle to earn rewards and keep your streak alive.</p>
        </header>
        
        <Card className="mb-8 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-headline">{currentPuzzle.name}</CardTitle>
            <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-orange-400">
                    <Flame className="w-4 h-4" />
                    <span className="font-bold">3-day streak!</span>
                </div>
                {currentPuzzle.reward.tokens > 0 && (
                  <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4" />
                      <span className="font-bold">{currentPuzzle.reward.tokens} $CROSS</span>
                  </div>
                )}
            </div>
          </CardHeader>
        </Card>
        
        {isGenerating ? (
            <div className="space-y-4">
                <Skeleton className="aspect-square w-full rounded-xl" />
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        ) : !isPuzzleComplete ? (
          <PuzzleView puzzleData={currentPuzzle} onPuzzleComplete={handlePuzzleComplete} />
        ) : (
          <Card className="text-center p-8 border-primary/50 shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Puzzle Complete!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-muted-foreground mb-6">Great job! You've solved the puzzle.</p>
                <div className="flex flex-col gap-4">
                    {currentPuzzle.id === 'daily-2024-07-29' && <Button onClick={() => setShowRewardModal(true)} size="lg">Claim Your Rewards</Button>}
                    <Button onClick={handleGenerateNewPuzzle} size="lg" variant="secondary">
                        <Sparkles className="w-4 h-4 mr-2"/>
                        Generate Another Puzzle
                    </Button>
                </div>
            </CardContent>
          </Card>
        )}
      </div>
      <ClaimRewardModal isOpen={showRewardModal} onOpenChange={setShowRewardModal} />
    </MainLayout>
  );
}
