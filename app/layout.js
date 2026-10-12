import { Cormorant_Garamond, Noto_Serif } from 'next/font/google';
import './globals.css';

const display = Cormorant_Garamond({ subsets: ['latin'], weight: ['500', '600'], variable: '--f-display' });
const body = Noto_Serif({ subsets: ['latin'], weight: ['400', '600'], variable: '--f-body' });

export const metadata = {
  title: 'Wishes',
  robots: { index: false, follow: false },
};

export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#2a0a0e' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable}`}>{children}</body>
    </html>
  );
}