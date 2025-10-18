"use client";

import Link from 'next/link';
import { NotificationBell } from '@/components/notifications/notification-bell';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-card/80 backdrop-blur-lg border-b border-border z-40 flex items-center justify-between px-4">
      <Link href="/" className="font-headline text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
        Crossword Crusade
      </Link>
      <NotificationBell />
    </header>
  );
}