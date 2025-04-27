'use client';

import { createContext, useState, useEffect, useContext } from 'react';
import { usePathname } from 'next/navigation';

const LoadingContext = createContext<{ isLoading: boolean }>({ isLoading: false });

export function GlobalLoadingProvider({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsLoading(true);

        const timeout = setTimeout(() => {
            setIsLoading(false);
        }, 500); // simulate loading for 0.5s

        return () => clearTimeout(timeout);
    }, [pathname]); // when pathname changes, trigger loading

    return (
        <LoadingContext.Provider value={{ isLoading }}>
            {children}
        </LoadingContext.Provider>
    );
}

export function useGlobalLoading() {
    return useContext(LoadingContext);
}
