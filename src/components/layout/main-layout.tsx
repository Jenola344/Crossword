import type { ReactNode } from 'react';
import BottomNav from '@/components/layout/bottom-nav';
import Header from './header';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-16 pb-24">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}