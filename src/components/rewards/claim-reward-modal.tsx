"use client";
import { useState } from 'react';
import Image from 'next/image';
import { useWeb3 } from '@/lib/web3-context';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { dailyPuzzleData } from '@/lib/data';
import { Star, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Nft } from '@/lib/web3-context';

interface ClaimRewardModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ClaimRewardModal({ isOpen, onOpenChange }: ClaimRewardModalProps) {
  const { claimTokens, revealNft } = useWeb3();
  const [tokensClaimed, setTokensClaimed] = useState(false);
  const [nftRevealed, setNftRevealed] = useState<Nft | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);

  const handleClaimTokens = () => {
    claimTokens(dailyPuzzleData.reward.tokens);
    setTokensClaimed(true);
  };

  const handleRevealNft = () => {
    setIsRevealing(true);
    setTimeout(() => {
      const newNft = revealNft();
      setNftRevealed(newNft);
      setIsRevealing(false);
    }, 1500); // simulate reveal animation time
  };
  
  const handleClose = (open: boolean) => {
    if (!open) {
      // Reset state on close
      setTimeout(() => {
          setTokensClaimed(false);
          setNftRevealed(null);
      }, 300);
    }
    onOpenChange(open);
  }

  const getRarityClass = (rarity: Nft['rarity']) => {
    switch (rarity) {
      case 'Common': return 'text-gray-400 border-gray-400';
      case 'Rare': return 'text-blue-400 border-blue-400';
      case 'Epic': return 'text-purple-400 border-purple-400';
      case 'Legendary': return 'text-yellow-400 border-yellow-400';
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-center">Your Rewards</DialogTitle>
          <DialogDescription className="text-center">
            Congratulations on completing the puzzle!
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">You've earned</p>
            <p className="font-headline text-4xl font-bold flex items-center justify-center gap-2">
              <Star className="w-8 h-8 text-yellow-400" />
              {dailyPuzzleData.reward.tokens} $CROSS
            </p>
            <Button onClick={handleClaimTokens} disabled={tokensClaimed} className="w-full">
              {tokensClaimed ? 'Claimed!' : 'Claim Tokens'}
            </Button>
          </div>

          <Separator />
          
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">and a Mystery NFT!</p>
            <div className="relative aspect-square w-48 h-48 mx-auto rounded-lg overflow-hidden border-2 border-dashed border-primary/50 flex items-center justify-center bg-background">
              {isRevealing && <Sparkles className="w-16 h-16 text-accent animate-ping" />}
              {!isRevealing && !nftRevealed && (
                <div className="text-center">
                  <p className="font-headline text-5xl text-primary">?</p>
                </div>
              )}
              {nftRevealed && (
                <>
                  <Image
                    src={nftRevealed.image.imageUrl}
                    alt={nftRevealed.name}
                    width={192}
                    height={192}
                    data-ai-hint={nftRevealed.image.imageHint}
                    className="object-cover animate-in fade-in zoom-in-50 duration-500"
                  />
                  <div className={cn("absolute bottom-2 left-2 right-2 p-1 rounded-md bg-card/80 backdrop-blur-sm text-center border", getRarityClass(nftRevealed.rarity))}>
                    <p className="text-xs font-bold uppercase tracking-widest">{nftRevealed.rarity}</p>
                  </div>
                </>
              )}
            </div>
            <Button onClick={handleRevealNft} disabled={isRevealing || !!nftRevealed} variant="secondary" className="w-full">
              {isRevealing ? 'Revealing...' : nftRevealed ? 'Revealed!' : 'Reveal NFT'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}