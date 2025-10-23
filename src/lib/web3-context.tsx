"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
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

  const getProvider = () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      return new ethers.BrowserProvider(window.ethereum);
    }
    return null;
  };

  const connectWallet = async () => {
    const provider = getProvider();
    if (provider) {
      try {
        const accounts = await provider.send("eth_requestAccounts", []);
        if (accounts.length > 0) {
          const signer = await provider.getSigner();
          const signerAddress = await signer.getAddress();
          setAddress(signerAddress);
          // For now, we'll keep the mock balance and NFTs.
          // We can replace this with real contract calls later.
          setBalance(1000); 
          setNfts(MOCK_NFTS);
          toast({
            title: 'Wallet Connected',
            description: `Connected with address: ${signerAddress.slice(0, 10)}...${signerAddress.slice(-4)}`,
          });
        }
      } catch (error) {
        console.error("Error connecting to wallet:", error);
        toast({
          variant: "destructive",
          title: 'Connection Failed',
          description: 'Could not connect to the wallet.',
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: 'MetaMask Not Found',
        description: 'Please install a Web3 wallet like MetaMask.',
      });
    }
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

  const handleAccountsChanged = useCallback((accounts: string[]) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      setAddress(accounts[0]);
    }
  }, []);

  useEffect(() => {
    const ethereum = window.ethereum;
    if (ethereum) {
        // @ts-ignore
        ethereum.on('accountsChanged', handleAccountsChanged);

        return () => {
            // @ts-ignore
            ethereum.removeListener('accountsChanged', handleAccountsChanged);
        };
    }
  }, [handleAccountsChanged]);


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
