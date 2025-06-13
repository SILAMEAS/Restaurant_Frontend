// app/layout.tsx
import type React from 'react';
import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import './globals.css';
import './custom.css';
import ReduxProvider from '../lib/provider/ReduxProvider';
import {GlobalLoadingProvider} from "@/lib/provider/GlobalLoadingProvider";
import GlobalLoadingSpinner from "@/lib/provider/GlobalLoadingSpinner"; // Import the new Client Component
import {ToastContainer} from 'react-toastify';
import {ThemeProvider} from '@/components/theme-provider';
import {ChatPopover} from "@/app/(chat)/ChatPopover";

const inter = Inter({subsets: ['latin']});

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
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <GlobalLoadingProvider>
                <ReduxProvider>
                    {/* 🔥 Add RouteChangeHandler here */}
                    {/*<RouteChangeHandler />*/}
                    {children}
                    <ToastContainer/>
                    <div className="fixed bottom-4 right-4 z-50">
                        <ChatPopover/>
                    </div>
                </ReduxProvider>
                <GlobalLoadingSpinner/>
            </GlobalLoadingProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}