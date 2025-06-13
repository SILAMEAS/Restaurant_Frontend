import React from 'react';
import {Skeleton} from "@/components/ui/skeleton";

const LoadingCart = () => {
    return <div className="container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <Skeleton className="h-[200px] w-full mb-4" />
                <Skeleton className="h-[400px] w-full" />
            </div>
            <div className="lg:col-span-1">
                <Skeleton className="h-[600px] w-full" />
            </div>
        </div>
    </div>
};

export default LoadingCart;