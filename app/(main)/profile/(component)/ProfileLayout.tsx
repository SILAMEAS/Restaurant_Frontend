"use client"

import React from "react"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {useProfileQuery} from "@/lib/redux/services/api"
import {useRouter} from "next/navigation"
import Link from "next/link"
import {Button} from "@/components/ui/button"
import {usePathname} from "next/navigation"

interface ProfileLayoutProps {
    children: React.ReactNode
}

export default function ProfileLayout({children}: ProfileLayoutProps) {
    const getProfile = useProfileQuery();
    const router = useRouter();
    const pathname = usePathname();

    React.useEffect(() => {
        if (getProfile.isError) {
            router.push('/auth/login')
        }
    }, [getProfile.currentData, getProfile.isError]);

    const profile = getProfile?.currentData;

    const navigation = [
        {
            name: 'My Profile',
            href: '/profile',
        },
        {
            name: 'My Favorites',
            href: '/profile/favorites',
        },
        {
            name: 'My Addresses',
            href: '/profile/addresses',
        },
    ]

    return (
        <div className="container py-10">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Profile Sidebar */}
                <div className="w-full md:w-1/3">
                    <Card>
                        <CardHeader className="text-center">
                            <div className="flex justify-center mb-4">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage
                                        src={profile?.profileImage || "/placeholder.svg?height=96&width=96"}
                                        alt={profile?.fullName || "User"}
                                    />
                                    <AvatarFallback>{profile?.fullName?.charAt(0) || "U"}</AvatarFallback>
                                </Avatar>
                            </div>
                            <CardTitle>{profile?.fullName}</CardTitle>
                            <CardDescription>{profile?.email}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-2">
                                {navigation.map((item) => (
                                    <Button
                                        key={item.href}
                                        variant={pathname === item.href ? "default" : "ghost"}
                                        className="w-full justify-start"
                                        asChild
                                    >
                                        <Link href={item.href}>
                                            {item.name}
                                        </Link>
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="w-full md:w-2/3">
                    {children}
                </div>
            </div>
        </div>
    )
} 