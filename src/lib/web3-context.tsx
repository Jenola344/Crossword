"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import { createWeb3Modal, defaultConfig, useWeb3Modal, useWeb3ModalAccount, useDisconnect } from '@web3modal/ethers/react';

// 1. Get projectID from https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';
if (!projectId) {
  console.warn("You need to provide a NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID env variable");
}


// 2. Set chains
const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://cloudflare-eth.com'
}

// 3. Create modal
const metadata = {
  name: 'Crossword Crusade',
  description: 'Solve. Earn. Own. A Web3 Crossword Puzzle Game.',
  url: 'https://crosswordcrusade.com', // origin must match your domain & subdomain
  icons: ['https://crosswordcrusade.com/logo.png']
}

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [mainnet],
  projectId,
  enableAnalytics: true // Optional - defaults to your Cloud configuration
})

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
  puzzlesSolved: number;
  longestStreak: number;
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
  const [balance, setBalance] = useState(0);
  const [nfts, setNfts] = useState<Nft[]>([]);
  const [puzzlesSolved, setPuzzlesSolved] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const { toast } = useToast();

  const { open } = useWeb3Modal();
  const { address, isConnected } = useWeb3ModalAccount();
  const { disconnect } = useDisconnect();

  const connectWallet = () => open();
  const disconnectWallet = () => disconnect();

  useEffect(() => {
    if (isConnected && address) {
        setBalance(1000); 
        setNfts(MOCK_NFTS);
        setPuzzlesSolved(42);
        setLongestStreak(12);
        toast({
          title: 'Wallet Connected',
          description: `Connected with address: ${address.slice(0, 10)}...${address.slice(-4)}`,
        });
    } else {
        setBalance(0);
        setNfts([]);
        setPuzzlesSolved(0);
        setLongestStreak(0);
    }
  }, [isConnected, address, toast]);
  
  const claimTokens = (amount: number) => {
    if (!isConnected) {
        toast({ variant: 'destructive', title: "Not Connected", description: "Please connect your wallet to claim tokens."});
        return;
    }
    // This will be replaced with a real contract call.
    setBalance(prev => prev + amount);
    toast({
      title: "Tokens Claimed!",
      description: `You received ${amount} $CROSS tokens.`,
    });
  };

  const revealNft = () => {
    // This will be replaced with a real contract call.
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
    if (!isConnected) {
        toast({ variant: 'destructive', title: "Not Connected", description: "Please connect your wallet to make a purchase."});
        return false;
    }
    // This will be replaced with a real contract call.
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
    <Web3Context.Provider value={{ address: address || null, connectWallet, disconnectWallet, balance, nfts, claimTokens, revealNft, spendTokens, puzzlesSolved, longestStreak }}>
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
