import MainLayout from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { WalletConnect } from '@/components/wallet-connect';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

export default function HomePage() {
  return (
    <MainLayout>
      <div className="container mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-128px)] px-4 text-center">
        <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Crossword Crusade
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground font-headline">
          Solve. Earn. Own.
        </p>

        <div className="mt-12 flex flex-col items-center gap-4 max-w-xs mx-auto w-full">
          <WalletConnect />
          <div className="flex items-center w-full">
            <Separator className="flex-1" />
            <span className="px-4 text-sm text-muted-foreground">OR</span>
            <Separator className="flex-1" />
          </div>
          <Link href="/daily" className="w-full">
            <Button variant="secondary" className="w-full">
              Play as Guest
            </Button>
          </Link>
          <Button variant="link" className="text-accent">
            Watch Tutorial
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
