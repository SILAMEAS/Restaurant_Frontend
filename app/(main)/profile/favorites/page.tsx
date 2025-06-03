"use client"

import React from 'react';
import MainFavorite from '../(tab)/MainFavorite';
import ProfileLayout from '../(component)/ProfileLayout';

export default function FavoritesPage() {
    return (
        <ProfileLayout>
            <div className="w-full">
                <MainFavorite />
            </div>
        </ProfileLayout>
    );
} 