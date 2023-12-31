import { ClerkProvider } from '@clerk/nextjs';
import { Metadata } from 'next';
import { Indie_Flower } from 'next/font/google';
import * as React from 'react';

import '@/styles/globals.css';

import TrpcProvider from '@/lib/trpc/Provider';
import { cn } from '@/lib/utils';

import { Toaster } from '@/components/ui/toaster';

import { siteConfig } from '@/constant/config';

// !STARTERCONF Change these default meta
// !STARTERCONF Look at @/constant/config to change them
export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  robots: { index: true, follow: true },
  // !STARTERCONF this is the default favicon, you can generate your own from https://realfavicongenerator.net/
  // ! copy to /favicon folder
  icons: {
    icon: '/favicon/favicon.ico',
    shortcut: '/favicon/favicon-16x16.png',
    apple: '/favicon/apple-touch-icon.png',
  },
  manifest: `/favicon/site.webmanifest`,
  openGraph: {
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.title,
    images: [`${siteConfig.url}/images/og.jpg`],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [`${siteConfig.url}/images/og.jpg`],
    // creator: '@th_clarence',
  },
  // authors: [
  //   {
  //     name: 'Theodorus Clarence',
  //     url: 'https://theodorusclarence.com',
  //   },
  // ],
};

const indie_flower = Indie_Flower({
  weight: '400',
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-indie-flower',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      className={cn(indie_flower.variable, '!scroll-smooth overflow-x-hidden')}
    >
      <body className='bg-slate-200'>
        <ClerkProvider>
          <TrpcProvider>
            {children}
            <Toaster />
          </TrpcProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
