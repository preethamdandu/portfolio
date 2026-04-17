import { Inter, JetBrains_Mono, Instrument_Serif, Geist } from 'next/font/google';

export const geist = Geist({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'optional',
});

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'optional',
});
