'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // <-- App Router uses this!

export default function PageLoader() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // next/navigation's useRouter doesn't expose events anymore
        // so you can't listen to routeChangeStart/Complete like next/router

        // We'll need another strategy here.

    }, [router]);

    if (!loading) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );
}
