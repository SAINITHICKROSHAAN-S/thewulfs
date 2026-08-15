'use client';

import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import { Inter } from 'next/font/google';
import { RootProviders } from './RootProviders'; // ✅ Use the new RootProviders
import { dark } from '@clerk/themes';

const inter = Inter({ subsets: ['latin'] });

// Custom appearance for Clerk
const darkBrandRed = "#b91c1c"; 
const darkBackground = "#1a1a1a"; 

const clerkAppearance = {
  baseTheme: dark,
  variables: {
    colorPrimary: darkBrandRed,
    colorBackground: darkBackground, 
    colorText: '#ffffff', 
    colorTextOnPrimaryBackground: '#ffffff',
  },
  elements: {
    userButtonPopoverCard: `bg-[${darkBackground}] rounded-xl shadow-2xl border border-gray-800`,
    userButtonPopoverActionButton: `hover:bg-gray-800`,
    userButtonPopoverHeader: `bg-gray-900 border-b border-gray-800 p-4`,
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider appearance={clerkAppearance}>
      <html lang="en">
        <body className={inter.className}>
          <RootProviders>
            {children}
          </RootProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
