import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './index.css';
import './globals.css';
import { env } from './env';

const inter = Inter({ subsets: ['latin'] });

const gameName = env.TIMER_40K_GAME_NAME ?? "Unknown Game";

export const metadata: Metadata = {
  title: `Is ${gameName} out yet?`,
  description: `Timer until ${gameName} is out`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
