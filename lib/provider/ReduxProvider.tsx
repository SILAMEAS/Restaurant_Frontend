// app/ReduxProvider.tsx
'use client';

import {Provider} from 'react-redux';
import dynamic from 'next/dynamic';
import {persistor, store} from '@/lib/redux/store';
import {ThemeProvider} from '@/components/provider/theme-provider';
import type React from 'react';
import {ChatPopover} from "@/app/(chat)/ChatPopover";

// Dynamically import PersistGate with SSR disabled
const PersistGate = dynamic(
    () => import('redux-persist/integration/react').then((mod) => mod.PersistGate),
    {ssr: false}
);

export default function ReduxProvider({children}: Readonly<{ children: React.ReactNode }>) {

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
                </ThemeProvider>
            </PersistGate>
        </Provider>
    );
}