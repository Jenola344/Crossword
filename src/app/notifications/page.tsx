"use client";

import MainLayout from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useNotificationSettings } from '@/hooks/use-notification-settings';
import { useToast } from '@/hooks/use-toast';
import { BellRing } from 'lucide-react';

export default function NotificationsPage() {
  const { settings, setSetting } = useNotificationSettings();
  const { toast } = useToast();

  const handleToggle = async (key: keyof typeof settings, value: boolean) => {
    if (value && Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        toast({
          variant: 'destructive',
          title: 'Notifications Denied',
          description: 'Please enable notifications in your browser settings.',
        });
        return;
      }
    }
    setSetting(key, value);
    if (value && Notification.permission === 'granted') {
        new Notification('Crossword Crusade', {
            body: `You've enabled ${key.replace(/([A-Z])/g, ' $1')} notifications!`,
            icon: '/logo.png', // Assuming you have a logo in public
        });
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 pt-8">
        <header className="mb-8">
          <h1 className="font-headline text-4xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">Manage your alert preferences.</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Push Notifications</CardTitle>
            <CardDescription>
              Get notified about important events even when you're not on the app.
              You may need to grant permission in your browser.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
              <Label htmlFor="dailyReminder" className="flex flex-col gap-1">
                <span className="font-semibold">Daily Puzzle Reminder</span>
                <span className="text-sm text-muted-foreground">
                  Get a ping when the new daily puzzle is available.
                </span>
              </Label>
              <Switch
                id="dailyReminder"
                checked={settings.dailyReminder}
                onCheckedChange={(checked) => handleToggle('dailyReminder', checked)}
              />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
              <Label htmlFor="rewardAlerts" className="flex flex-col gap-1">
                <span className="font-semibold">Reward Alerts</span>
                <span className="text-sm text-muted-foreground">
                  Know when you can claim rewards or unlock achievements.
                </span>
              </Label>
              <Switch
                id="rewardAlerts"
                checked={settings.rewardAlerts}
                onCheckedChange={(checked) => handleToggle('rewardAlerts', checked)}
              />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
              <Label htmlFor="friendActivity" className="flex flex-col gap-1">
                <span className="font-semibold">Friend Activity</span>
                <span className="text-sm text-muted-foreground">
                  Get updates on your friends' progress and challenges.
                </span>
              </Label>
              <Switch
                id="friendActivity"
                checked={settings.friendActivity}
                onCheckedChange={(checked) => handleToggle('friendActivity', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}