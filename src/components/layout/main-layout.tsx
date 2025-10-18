import type { ReactNode } from 'react';
import BottomNav from '@/components/layout/bottom-nav';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow pb-24">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
