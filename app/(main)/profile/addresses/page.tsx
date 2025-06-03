"use client"

import React from 'react';
import MainAddresses from '../(tab)/MainAddresses';
import ProfileLayout from '../(component)/ProfileLayout';

export default function AddressesPage() {
    return (
        <ProfileLayout>
            <div className="w-full">
                <MainAddresses />
            </div>
        </ProfileLayout>
    );
} 