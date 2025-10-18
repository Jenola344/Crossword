"use client";

import { useState } from 'react';
import MainLayout from '@/components/layout/main-layout';
import PuzzleView from '@/components/crossword/puzzle-view';
import ClaimRewardModal from '@/components/rewards/claim-reward-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Star } from 'lucide-react';
import { dailyPuzzleData } from '@/lib/data';

export default function DailyPage() {
  const [isPuzzleComplete, setPuzzleComplete] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  
  const handlePuzzleComplete = () => {
    setPuzzleComplete(true);
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 pt-8 max-w-2xl">
        <header className="mb-8">
          <h1 className="font-headline text-4xl font-bold">Today's Puzzle</h1>
          <p className="text-muted-foreground">Solve the puzzle to earn rewards and keep your streak alive.</p>
        </header>
        
        <Card className="mb-8 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-headline">{dailyPuzzleData.name}</CardTitle>
            <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-orange-400">
                    <Flame className="w-4 h-4" />
                    <span className="font-bold">3-day streak!</span>
                </div>
                <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-4 h-4" />
                    <span className="font-bold">{dailyPuzzleData.reward.tokens} $CROSS</span>
                </div>
            </div>
          </CardHeader>
        </Card>
        
        {!isPuzzleComplete ? (
          <PuzzleView onPuzzleComplete={handlePuzzleComplete} />
        ) : (
          <Card className="text-center p-8 border-primary/50 shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Puzzle Complete!</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-6">Great job! You've solved today's puzzle.</p>
                <Button onClick={() => setShowRewardModal(true)} size="lg">Claim Your Rewards</Button>
            </CardContent>
          </Card>
        )}
      </div>
      <ClaimRewardModal isOpen={showRewardModal} onOpenChange={setShowRewardModal} />
    </MainLayout>
  );
}
