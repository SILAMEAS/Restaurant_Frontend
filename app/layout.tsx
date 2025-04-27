// app/layout.tsx
import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ReduxProvider from '../lib/provider/ReduxProvider';
import {GlobalLoadingProvider} from "@/lib/provider/GlobalLoadingProvider";
import GlobalLoadingSpinner from "@/lib/provider/GlobalLoadingSpinner"; // Import the new Client Component

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'LaCy - Restaurant',
    description: 'Order food from your favorite restaurants',
    generator: 'v0.dev',
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
            <GlobalLoadingProvider>
                <ReduxProvider>{children}</ReduxProvider>
                <GlobalLoadingSpinner />
            </GlobalLoadingProvider>
            </body>
        </html>
    );
}