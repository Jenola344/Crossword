"use client";

import Link from 'next/link';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NotificationBell() {
  const unreadCount = 0; // Replace with actual logic later

  return (
    <Link href="/notifications">
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
            {unreadCount}
          </span>
        )}
      </Button>
    </Link>
  );
}