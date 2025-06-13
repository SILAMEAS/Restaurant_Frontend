import React from 'react';
import {ShoppingBag} from "lucide-react";
import Link from "next/link";
import {Button} from "@/components/ui/button";

const EmptyCart = () => {
    return <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
            <div className="bg-primary/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">
                Looks like you haven't added any items to your cart yet.
                Start exploring our delicious menu!
            </p>
            <Link href="/menu">
                <Button size="lg" className="hover:scale-105 transition-transform">
                    Browse Menu
                </Button>
            </Link>
        </div>
    </div>
};

export default EmptyCart;