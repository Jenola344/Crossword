"use client";

import { useState } from 'react';
import MainLayout from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useWeb3 } from '@/lib/web3-context';
import { storeData } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Star, Bitcoin, Sun, TrendingUp, TrendingDown, Zap, Pen } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const icons: { [key: string]: LucideIcon } = {
  Bitcoin,
  Sun,
  TrendingUp,
  TrendingDown,
  Zap,
  Pen,
};

export default function StorePage() {
  const { address, balance, spendTokens } = useWeb3();
  const { toast } = useToast();
  const [ownedItems, setOwnedItems] = useState<string[]>([]);

  const handlePurchase = (itemId: string, price: number, name: string) => {
    if (!address) {
      toast({
        variant: "destructive",
        title: "Wallet Not Connected",
        description: "Please connect your wallet to make a purchase.",
      });
      return;
    }
    if (spendTokens(price, name)) {
      setOwnedItems(prev => [...prev, itemId]);
    }
  };

  const isOwned = (itemId: string) => ownedItems.includes(itemId);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 pt-8">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="font-headline text-4xl font-bold">Store</h1>
            <p className="text-muted-foreground">Spend your $CROSS tokens on awesome items.</p>
          </div>
          {address && (
            <div className="text-right">
              <div className="font-bold text-2xl flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-400" />
                {balance.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">$CROSS Balance</p>
            </div>
          )}
        </header>

        <div className="space-y-12">
          {/* Puzzle Packs Section */}
          <section>
            <h2 className="font-headline text-2xl font-bold mb-4">Puzzle Packs</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {storeData.puzzlePacks.map(pack => {
                const Icon = icons[pack.icon];
                return (
                  <Card key={pack.id}>
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-secondary rounded-md">
                          {Icon && <Icon className="w-6 h-6 text-primary" />}
                        </div>
                        <CardTitle className="font-headline text-xl">{pack.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="flex justify-between items-center">
                      <div className="font-bold text-lg flex items-center gap-1">{pack.price} <Star className="w-4 h-4 text-yellow-400" /></div>
                      <Button onClick={() => handlePurchase(pack.id, pack.price, pack.name)} disabled={isOwned(pack.id)}>
                        {isOwned(pack.id) ? 'Owned' : 'Buy'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Hint Boosts Section */}
          <section>
            <h2 className="font-headline text-2xl font-bold mb-4">Hint Boosts</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {storeData.hintBoosts.map(boost => (
                <Card key={boost.id}>
                  <CardHeader>
                    <CardTitle className="font-headline text-xl">{boost.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-between items-center">
                    <div className="font-bold text-lg flex items-center gap-1">{boost.price} <Star className="w-4 h-4 text-yellow-400" /></div>
                    <Button onClick={() => handlePurchase(boost.id, boost.price, boost.name)}>
                      Purchase
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Profile Customization Section */}
          <section>
            <h2 className="font-headline text-2xl font-bold mb-4">Profile Customization</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {storeData.customization.map(item => {
                const Icon = icons[item.icon];
                return (
                  <Card key={item.id}>
                    <CardHeader>
                      <div className="p-3 bg-secondary rounded-md w-16 h-16 flex items-center justify-center mx-auto">
                        {Icon && <Icon className="w-8 h-8 text-primary" />}
                      </div>
                    </CardHeader>
                    <CardContent className="text-center">
                      <CardTitle className="font-headline text-lg">{item.name}</CardTitle>
                      <CardDescription>{item.type}</CardDescription>
                      <div className="font-bold text-lg flex items-center gap-1 justify-center my-4">{item.price} <Star className="w-4 h-4 text-yellow-400" /></div>
                      <Button className="w-full" onClick={() => handlePurchase(item.id, item.price, item.name)} disabled={isOwned(item.id)}>
                        {isOwned(item.id) ? 'Owned' : 'Buy'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}