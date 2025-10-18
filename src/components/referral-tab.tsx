"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Copy, Gift, Send, Users } from "lucide-react";

export function ReferralTab() {
    const { toast } = useToast();
    const referralLink = "https://crossword.xyz/invite/CryptoKing";
    const referralStats = {
        total: 5,
        pending: 125,
        claimed: 350
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralLink);
        toast({ title: "Copied to clipboard!", description: "Share your referral link with friends." });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Referral Program</CardTitle>
                <CardDescription>Earn 15% of your friends' first-week token earnings!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="text-sm font-medium mb-2">Your Unique Referral Link</h3>
                    <div className="flex gap-2">
                        <Input value={referralLink} readOnly />
                        <Button variant="outline" size="icon" onClick={copyToClipboard}><Copy className="w-4 h-4" /></Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <Card className="bg-secondary/50">
                        <CardContent className="p-4">
                            <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
                            <p className="text-2xl font-bold">{referralStats.total}</p>
                            <p className="text-xs text-muted-foreground">Total Referrals</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-secondary/50">
                        <CardContent className="p-4">
                            <p className="text-2xl font-bold">{referralStats.pending}</p>
                            <p className="text-xs text-muted-foreground">Pending Rewards</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-secondary/50">
                         <CardContent className="p-4">
                            <p className="text-2xl font-bold">{referralStats.claimed}</p>
                            <p className="text-xs text-muted-foreground">Claimed Rewards</p>
                        </CardContent>
                    </Card>
                </div>
                
                <div className="space-y-3">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                        <Gift className="w-4 h-4 mr-2" />
                        Claim {referralStats.pending} $CROSS
                    </Button>
                    <div className="flex gap-3">
                        <Button variant="outline" className="w-full">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.244 8.274l-2.457.975c-.34.135-.58.463-.58.82v.033c0 .41.28.76.67.864l2.55 1.012c.4.16.63.537.63.95v.033c0 .41-.28.76-.67.864l-2.55 1.012c-.4.16-.63.537-.63.95v.033c0 .285-.16.54-.41.675l-1.446.725c-.25.125-.54.125-.79 0l-1.445-.725a.82.82 0 01-.41-.675v-4.57c0-.357.24-.685.58-.82l2.457-.975c.34-.135.58-.463.58-.82V8.24c0-.41-.28-.76-.67-.864l-2.55-1.012a.96.96 0 00-.95-.033.82.82 0 00-.675.41l-1.445.725c-.25.125-.54.125-.79 0L7.5 7.74c-.25-.125-.41-.38-.41-.675v-.033c0-.41.28-.76.67-.864l2.55-1.012c.4-.16.63-.537.63-.95v-.033c0-.285.16-.54.41-.675l1.446-.725c.25-.125.54-.125.79 0l1.445.725c.25.125.41.38.41.675v4.57c0 .357-.24.685-.58.82z" /></svg>
                            Share on Discord
                        </Button>
                        <Button variant="outline" className="w-full">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                            Share on X
                        </Button>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
}