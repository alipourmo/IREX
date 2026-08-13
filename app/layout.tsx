import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'IREX — Make Better Drill Decisions',
  description: 'IREX transforms fragmented exploration data into structured knowledge for invariant-driven geological reasoning.',
  icons: { icon: '/brand/irex-logo.png' },
  openGraph: {
    title: 'IREX — Make Better Drill Decisions',
    description: 'Reasoning under uncertainty for exploration decisions.',
    images: ['/media/frame-05-layers.png'],
    type: 'website',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
