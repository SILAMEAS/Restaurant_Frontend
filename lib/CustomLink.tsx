'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useTransition } from 'react';
import {Button, ButtonProps} from "@/components/ui/button";

export default function CustomLink({ href, children,btnProps }: { href: string; children: React.ReactNode,btnProps?:ButtonProps }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleClick = () => {
        startTransition(() => {
            router.push(href);
        });
    };

    return (
        <>
            <Button size="lg" variant="outline" onClick={handleClick} disabled={isPending} {...btnProps}>
                {isPending ? "Loading..." : children}
            </Button>
        </>
    );
}
