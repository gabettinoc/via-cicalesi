import type { Metadata, Viewport } from 'next';
import { Fraunces, Manrope } from 'next/font/google';
import './globals.css';

const display = Fraunces({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const sans = Manrope({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Attico Duplex con vista montagne – Via Cicalesi, Nocera Inferiore | € 330.000',
  description:
    'Attico in duplex su 4° e 5° piano in parco antisismico con ascensore, garage di 22 mq e vista sulle montagne. Open Day con visite private sabato 21 novembre: prenota il tuo slot.',
  openGraph: {
    title: 'Il Tuo Attico Duplex Esclusivo nel Cuore di Nocera Inferiore',
    description: 'Due livelli, vista montagne, garage 22 mq. Open Day sabato 21 novembre — prenota la tua visita privata.',
    images: ['/media/og.jpg'],
    locale: 'it_IT',
    type: 'website',
  },
};

export const viewport: Viewport = { themeColor: '#1C1A17', width: 'device-width', initialScale: 1 };

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateListing',
  name: 'Attico duplex in Via Cicalesi, Nocera Inferiore',
  url: siteUrl,
  offers: { '@type': 'Offer', price: 330000, priceCurrency: 'EUR' },
  about: {
    '@type': 'Apartment',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Via Cicalesi',
      addressLocality: 'Nocera Inferiore',
      addressRegion: 'SA',
      addressCountry: 'IT',
    },
    floorLevel: '4-5',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${display.variable} ${sans.variable}`}>
      <body className="bg-ivory font-sans text-ink antialiased">
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
