"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';

export type Nft = {
  id: number;
  name: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  image: ImagePlaceholder;
}

interface Web3ContextType {
  address: string | null;
  connectWallet: () => void;
  disconnectWallet: () => void;
  balance: number;
  nfts: Nft[];
  claimTokens: (amount: number) => void;
  revealNft: () => Nft;
  spendTokens: (amount: number, itemName: string) => boolean;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

const getImageForRarity = (rarity: Nft['rarity']): ImagePlaceholder => {
  const id = `nft-${rarity.toLowerCase()}`;
  const image = PlaceHolderImages.find(img => img.id === id);
  if (!image) {
    // Fallback to a default image if not found
    return PlaceHolderImages.find(img => img.id === 'nft-common') || PlaceHolderImages[0];
  }
  return image;
}

const MOCK_NFTS: Nft[] = [
  { id: 1, name: 'Genesis Crosser', rarity: 'Common', image: getImageForRarity('Common') },
  { id: 2, name: 'Word Smith', rarity: 'Rare', image: getImageForRarity('Rare') },
];

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);
  const [nfts, setNfts] = useState<Nft[]>([]);
  const { toast } = useToast();

  const connectWallet = () => {
    const mockAddress = "0x1234AbCd...EfGh5678";
    setAddress(mockAddress);
    setBalance(1000);
    setNfts(MOCK_NFTS);
    toast({
      title: 'Wallet Connected',
      description: `Connected with address: ${mockAddress.slice(0, 10)}...${mockAddress.slice(-4)}`,
    });
  };

  const disconnectWallet = () => {
    setAddress(null);
    setBalance(0);
    setNfts([]);
    toast({
      title: 'Wallet Disconnected',
    });
  };
  
  const claimTokens = (amount: number) => {
    setBalance(prev => prev + amount);
    toast({
      title: "Tokens Claimed!",
      description: `You received ${amount} $CROSS tokens.`,
    });
  };

  const revealNft = () => {
    const rarities: Nft['rarity'][] = ['Common', 'Rare', 'Epic', 'Legendary'];
    const rarity = rarities[Math.floor(Math.random() * rarities.length)];
    const newNft: Nft = {
      id: Date.now(),
      name: `Rarity Beast #${nfts.length + 1}`,
      rarity: rarity,
      image: getImageForRarity(rarity),
    }
    setNfts(prev => [newNft, ...prev]);
    toast({
      title: "NFT Revealed!",
      description: `You got a ${rarity} NFT!`,
    });
    return newNft;
  };
  
  const spendTokens = (amount: number, itemName: string) => {
    if (balance >= amount) {
      setBalance(prev => prev - amount);
      toast({
        title: "Purchase Successful!",
        description: `You bought ${itemName} for ${amount} $CROSS.`
      })
      return true;
    } else {
      toast({
        variant: "destructive",
        title: "Insufficient Funds",
        description: `You need ${amount} $CROSS to buy ${itemName}.`
      })
      return false;
    }
  }

  return (
    <Web3Context.Provider value={{ address, connectWallet, disconnectWallet, balance, nfts, claimTokens, revealNft, spendTokens }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
