"use client";

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { leaderboardData } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useWeb3 } from '@/lib/web3-context';
import { Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

type LeaderboardEntry = {
    rank: number;
    name: string;
    score: number;
    avatar: string;
}

const getAvatar = (avatarId: string) => PlaceHolderImages.find(p => p.id === avatarId);

function LeaderboardList({ data, userScore }: {data: Omit<LeaderboardEntry, 'rank'>[], userScore: number}) {
    
    const processedData = useMemo(() => {
        const userEntry = data.find(p => p.name === 'You');
        if (userEntry) {
            userEntry.score = userScore;
        }

        const sortedData = [...data].sort((a, b) => b.score - a.score);

        return sortedData.map((player, index) => ({
            ...player,
            rank: index + 1,
        }));

    }, [data, userScore]);

    return (
        <div className="space-y-2">
            {processedData.map((player, index) => (
                <div key={player.name + player.rank} className={cn(
                    "flex items-center gap-4 p-2 rounded-lg", 
                    player.name === 'You' ? 'bg-primary/20 border border-primary/30' : 'bg-secondary/50'
                )}>
                    <div className="flex items-center justify-center gap-2 w-12">
                        {index < 3 && <Crown className={cn("w-5 h-5", index === 0 && "text-yellow-400", index === 1 && "text-gray-400", index === 2 && "text-orange-400")} />}
                        <span className="font-bold text-lg">{player.rank}</span>
                    </div>
                    <Avatar>
                        <AvatarImage src={getAvatar(player.avatar)?.imageUrl} />
                        <AvatarFallback>{player.name.substring(0,2)}</AvatarFallback>
                    </Avatar>
                    <p className="font-bold flex-1">{player.name}</p>
                    <p className="font-mono text-primary">{player.score.toLocaleString()} <span className="text-xs text-muted-foreground">$CROSS</span></p>
                </div>
            ))}
        </div>
    )
}

export function LeaderboardTab() {
    const { balance } = useWeb3();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="daily">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="daily">Daily</TabsTrigger>
                        <TabsTrigger value="weekly">Weekly</TabsTrigger>
                        <TabsTrigger value="all-time">All-Time</TabsTrigger>
                    </TabsList>
                    <TabsContent value="daily" className="mt-4"><LeaderboardList data={leaderboardData.daily} userScore={balance} /></TabsContent>
                    <TabsContent value="weekly" className="mt-4"><LeaderboardList data={leaderboardData.weekly} userScore={balance} /></TabsContent>
                    <TabsContent value="all-time" className="mt-4"><LeaderboardList data={leaderboardData.allTime} userScore={balance} /></TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
