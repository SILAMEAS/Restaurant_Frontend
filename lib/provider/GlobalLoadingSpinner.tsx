'use client';


import {useGlobalLoading} from "@/lib/provider/GlobalLoadingProvider";

export default function GlobalLoadingSpinner() {
    const { isLoading } = useGlobalLoading();

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );
}
