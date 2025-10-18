import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Web3Provider } from '@/lib/web3-context';

export const metadata: Metadata = {
  title: 'Crossword Crusade',
  description: 'Solve. Earn. Own. A Web3 Crossword Puzzle Game.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <Web3Provider>
          {children}
        </Web3Provider>
        <Toaster />
      </body>
    </html>
  );
}
