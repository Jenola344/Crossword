"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Trophy, User, ShoppingBag, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/daily', label: 'Daily', icon: LayoutGrid },
  { href: '/puzzles', label: 'Puzzles', icon: Bot },
  { href: '/store', label: 'Store', icon: ShoppingBag },
  { href: '/compete', label: 'Compete', icon: Trophy },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-card/80 backdrop-blur-lg border-t border-border z-50">
      <div className="flex justify-around items-center h-full max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href) && (item.href !== '/' || pathname === '/');
          const Icon = item.icon;
          return (
            <Link href={item.href} key={item.href} className="flex flex-col items-center justify-center flex-1 text-sm transition-transform duration-200 ease-in-out hover:scale-105">
              <Icon className={cn('h-6 w-6 mb-1 transition-colors', isActive ? 'text-primary' : 'text-muted-foreground')} />
              <span className={cn('text-xs transition-colors', isActive ? 'text-primary' : 'text-muted-foreground')}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
