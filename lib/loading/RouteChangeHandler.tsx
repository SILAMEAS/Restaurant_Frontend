// lib/provider/RouteChangeHandler.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RouteChangeHandler() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleStart = () => setLoading(true);
        const handleEnd = () => setLoading(false);

        // These won't work in App Router: router.events is only in `next/router`
        // You need to simulate a delay with navigation.startTransition if needed

        // TEMP fallback: always hide loader after a delay
        setLoading(true);
        const timeout = setTimeout(() => setLoading(false), 400); // Simulate brief loading
        return () => clearTimeout(timeout);
    }, []);

    if (!loading) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-1 bg-blue-500 animate-pulse z-[9999]" />
    );
}
