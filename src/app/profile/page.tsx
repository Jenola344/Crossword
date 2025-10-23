"use client";

import { useState, useRef } from 'react';
import MainLayout from '@/components/layout/main-layout';
import { useWeb3, type Nft } from '@/lib/web3-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { userProfile } from '@/lib/data';
import Image from 'next/image';
import { LogOut, MessageSquare, Edit, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LeaderboardTab } from '@/components/leaderboard-tab';
import { DailyTasksTab } from '@/components/daily-tasks-tab';
import { ReferralTab } from '@/components/referral-tab';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const getFriendAvatar = (avatarId: string) => PlaceHolderImages.find(p => p.id === avatarId);

const getRarityClass = (rarity: Nft['rarity']) => {
    switch (rarity) {
      case 'Common': return 'border-gray-500 hover:border-gray-400';
      case 'Rare': return 'border-blue-700 hover:border-blue-500';
      case 'Epic': return 'border-purple-700 hover:border-purple-500';
      case 'Legendary': return 'border-yellow-600 hover:border-yellow-400';
    }
}
const getRarityTextClass = (rarity: Nft['rarity']) => {
    switch (rarity) {
      case 'Common': return 'text-gray-400';
      case 'Rare': return 'text-blue-400';
      case 'Epic': return 'text-purple-400';
      case 'Legendary': return 'text-yellow-400';
    }
}

const profileAvatars = PlaceHolderImages.filter(p => p.id.startsWith('profile-avatar-'));

export default function ProfilePage() {
  const { address, balance, nfts, disconnectWallet, puzzlesSolved, longestStreak } = useWeb3();
  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState("Your Profile");
  const [selectedAvatar, setSelectedAvatar] = useState(profileAvatars[0]);
  const [tempName, setTempName] = useState(userName);
  const [tempAvatar, setTempAvatar] = useState(selectedAvatar);
  const fileInputRef = useRef<HTMLInputElement>(null);


  if (!address) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 pt-16 text-center">
          <h1 className="font-headline text-3xl">Profile</h1>
          <p className="mt-4 text-muted-foreground">Please connect your wallet to see your profile.</p>
        </div>
      </MainLayout>
    );
  }

  const handleSaveProfile = () => {
    setUserName(tempName);
    setSelectedAvatar(tempAvatar);
    setIsEditing(false);
  }

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempAvatar({ id: 'custom', imageUrl: reader.result as string, description: 'custom avatar', imageHint: 'custom' });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 pt-8 pb-12">
        <header className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-primary">
              <AvatarImage src={selectedAvatar?.imageUrl} alt="User Avatar" />
              <AvatarFallback>YOU</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-headline text-3xl font-bold">{userName}</h1>
              <p className="font-mono text-sm text-muted-foreground truncate max-w-[200px] md:max-w-full">{address}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Edit className="h-5 w-5" />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" value={tempName} onChange={(e) => setTempName(e.target.value)} />
                        </div>
                        <div>
                            <Label>Avatar</Label>
                            <div className="grid grid-cols-4 gap-4 mt-2">
                                {profileAvatars.map(avatar => (
                                    <button key={avatar.id} onClick={() => setTempAvatar(avatar)} className={cn("rounded-full border-4", tempAvatar.id === avatar.id ? "border-primary" : "border-transparent")}>
                                        <Avatar className="w-full h-auto">
                                            <AvatarImage src={avatar.imageUrl} />
                                            <AvatarFallback>{avatar.id.slice(-2)}</AvatarFallback>
                                        </Avatar>
                                    </button>
                                ))}
                                <button onClick={() => fileInputRef.current?.click()} className={cn("rounded-full border-4 bg-secondary flex items-center justify-center", tempAvatar.id === 'custom' ? "border-primary" : "border-transparent")}>
                                  {tempAvatar.id === 'custom' ? (
                                    <Avatar className="w-full h-auto">
                                      <AvatarImage src={tempAvatar.imageUrl} />
                                      <AvatarFallback>UP</AvatarFallback>
                                    </Avatar>
                                  ) : (
                                    <Upload className="w-1/2 h-1/2 text-muted-foreground" />
                                  )}
                                </button>
                                <Input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                        <Button onClick={handleSaveProfile}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Button variant="ghost" size="icon" onClick={disconnectWallet}>
                <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <Card className="mb-8">
            <CardContent className="p-4 grid grid-cols-3 divide-x divide-border">
                <div className="text-center px-2">
                    <p className="text-2xl font-bold font-headline">{puzzlesSolved}</p>
                    <p className="text-xs text-muted-foreground">Puzzles Solved</p>
                </div>
                <div className="text-center px-2">
                    <p className="text-2xl font-bold font-headline">{longestStreak}</p>
                    <p className="text-xs text-muted-foreground">Longest Streak</p>
                </div>
                <div className="text-center px-2">
                    <p className="text-2xl font-bold font-headline">{balance.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">$CROSS</p>
                </div>
            </CardContent>
        </Card>

        <Tabs defaultValue="nfts" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="nfts">NFTs</TabsTrigger>
            <TabsTrigger value="friends">Friends</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
          </TabsList>
          
          <TabsContent value="nfts" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">NFT Showcase</CardTitle>
                </CardHeader>
                <CardContent>
                    {nfts.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {nfts.map(nft => (
                            <div key={nft.id} className={cn("rounded-lg overflow-hidden border-2 bg-secondary transition-all transform hover:scale-105 hover:shadow-2xl", getRarityClass(nft.rarity))}>
                                <Image src={nft.image.imageUrl} alt={nft.name} width={200} height={200} className="w-full aspect-square object-cover" data-ai-hint={nft.image.imageHint} />
                                <div className="p-2">
                                    <p className="font-bold text-sm truncate">{nft.name}</p>
                                    <p className={cn("text-xs font-bold uppercase", getRarityTextClass(nft.rarity))}>{nft.rarity}</p>
                                </div>
                            </div>
                        ))}
                        </div>
                    ) : <p className="text-muted-foreground text-center py-8">You don't have any NFTs yet. Solve puzzles to earn them!</p>}
                </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="friends" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Friends Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userProfile.friends.map(friend => (
                  <div key={friend.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={getFriendAvatar(friend.avatar)?.imageUrl} alt={`${friend.name} avatar`} />
                        <AvatarFallback>{friend.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold">{friend.name}</p>
                        <p className="text-sm text-muted-foreground">{friend.activity}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Challenge <MessageSquare className="w-3 h-3 ml-2" /></Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-6">
             <LeaderboardTab />
          </TabsContent>

          <TabsContent value="tasks" className="mt-6">
            <DailyTasksTab />
          </TabsContent>

          <TabsContent value="referrals" className="mt-6">
            <ReferralTab />
          </TabsContent>

        </Tabs>
      </div>
    </MainLayout>
  );
}
