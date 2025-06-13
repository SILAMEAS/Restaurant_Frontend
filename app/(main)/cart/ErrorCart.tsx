import React from 'react';
import {Button} from "@/components/ui/button";

const ErrorCart = () => {
    return  <div className="container min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
            <div className="text-red-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h2 className="text-2xl font-medium mb-2">Failed to load cart</h2>
            <p className="text-muted-foreground mb-6">There was an error loading your cart data. Please try again.</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
    </div>
};

export default ErrorCart;