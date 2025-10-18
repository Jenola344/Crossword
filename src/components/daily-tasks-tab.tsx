"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { dailyTasks } from "@/lib/data";
import { CheckCircle, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function DailyTasksTab() {
    const { toast } = useToast();

    const handleClaim = (reward: number) => {
        // Here you would integrate with a backend or context to update user balance
        toast({
            title: "Reward Claimed!",
            description: `You've earned ${reward} $CROSS tokens.`
        })
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Daily Tasks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {dailyTasks.map(task => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                        <div className="flex items-center gap-3">
                            {task.completed ? <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" /> : <div className="w-5 h-5 rounded-full border-2 border-muted-foreground flex-shrink-0" />}
                            <div>
                                <p className="font-semibold">{task.task}</p>
                                <p className="text-sm text-yellow-400 flex items-center gap-1">
                                    <Star className="w-3 h-3" />
                                    {task.reward} $CROSS
                                </p>
                            </div>
                        </div>
                        {task.completed ? (
                            <Button variant="ghost" disabled>Completed</Button>
                        ) : (
                             <Button size="sm" onClick={() => handleClaim(task.reward)}>Claim</Button>
                        )}
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
