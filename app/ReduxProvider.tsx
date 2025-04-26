// app/ReduxProvider.tsx
'use client';

import { Provider } from 'react-redux';
import dynamic from 'next/dynamic';
import { store, persistor } from '@/lib/redux/store';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import type React from 'react';

// Dynamically import PersistGate with SSR disabled
const PersistGate = dynamic(
    () => import('redux-persist/integration/react').then((mod) => mod.PersistGate),
    { ssr: false }
);

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                    <Toaster />
                </ThemeProvider>
            </PersistGate>
        </Provider>
    );
}