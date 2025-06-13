'use client';

import {useEffect, useState} from 'react';
import {usePathname} from 'next/navigation';

export default function RouteChangeSpinner() {
    const pathname = usePathname();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        const timeout = setTimeout(() => {
            setLoading(false);
        }, 500); // adjust to match your loading duration

        return () => clearTimeout(timeout);
    }, [pathname]); // triggers on route change

    if (!loading) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center  backdrop-blur">
            <span className="loader"></span>
        </div>
    );
}
