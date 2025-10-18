"use client";

import { useWeb3 } from '@/lib/web3-context';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';

export function WalletConnect() {
  const { address, connectWallet, balance } = useWeb3();

  if (address) {
    return (
      <div className="w-full p-3 rounded-lg border border-primary/50 bg-card text-left shadow-lg">
        <p className="text-sm text-muted-foreground">Connected as</p>
        <p className="font-mono text-sm truncate">{address}</p>
        <p className="text-2xl font-bold text-right text-primary">{balance.toLocaleString()} <span className="text-sm text-muted-foreground">$CROSS</span></p>
      </div>
    );
  }

  return (
    <Button onClick={connectWallet} size="lg" className="w-full font-bold bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground shadow-lg transform hover:scale-105 transition-transform duration-200">
      <Wallet className="mr-2 h-5 w-5" />
      Connect Wallet
    </Button>
  );
}
