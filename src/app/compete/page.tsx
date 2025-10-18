"use client";

import MainLayout from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { competitions } from '@/lib/data';
import { useWeb3 } from '@/lib/web3-context';
import { Trophy, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function CompetePage() {
  const { payEntryFee, address } = useWeb3();
  const { toast } = useToast();

  const handleJoin = (fee: number) => {
    if (!address) {
        toast({
            variant: "destructive",
            title: "Wallet not connected",
            description: "Please connect your wallet to join a competition."
        })
        return;
    }
    payEntryFee(fee);
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 pt-8">
        <header className="mb-8">
          <h1 className="font-headline text-4xl font-bold">Competitions</h1>
          <p className="text-muted-foreground">Test your skills and win big prizes.</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {competitions.map(comp => (
            <Card key={comp.id} className="flex flex-col hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-secondary rounded-md">
                    <Trophy className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="font-headline text-2xl">{comp.name}</CardTitle>
                </div>
                <CardDescription>{comp.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Entry Fee</span>
                    <span className="font-bold flex items-center gap-1">{comp.entryFee} <Star className="w-4 h-4 text-yellow-400" /></span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Prize Pool</span>
                    <span className="font-bold text-green-400">{comp.prizePool}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => handleJoin(comp.entryFee)}>
                  Join Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
