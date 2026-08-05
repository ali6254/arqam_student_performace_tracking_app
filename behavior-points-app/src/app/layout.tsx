import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Behavior Points',
  description: 'Student behavior points tracking',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 antialiased">{children}</body>
    </html>
  );
}
