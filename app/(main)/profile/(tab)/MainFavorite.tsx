import React from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {Heart, ExternalLink} from "lucide-react";
import {useEndpointProfile} from "@/app/(main)/profile/useEndpointProfile";
import {useMyFavQuery} from "@/lib/redux/api";
import Link from "next/link";

const MainFavorite = () => {
    
    const {method: {onUnFavorite}} = useEndpointProfile();
    const getFav = useMyFavQuery();
    const favorites = getFav?.currentData ?? [];

    return (
        <Card>
            <CardHeader>
                <CardTitle>My Favorite Restaurants</CardTitle>
                <CardDescription>Restaurants you've marked as favorites</CardDescription>
            </CardHeader>
            <CardContent>
                {favorites.length > 0 ? (
                    <div className="grid gap-4">
                        {favorites.map((favorite) => (
                            <div
                                key={favorite.id}
                                className="group relative flex flex-col sm:flex-row items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                            >
                                {/* Restaurant Image */}
                                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                                    <Image
                                        src={favorite.images[0]?favorite.images[0].url:"/placeholder.svg"}
                                        alt={favorite.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Restaurant Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <Link 
                                                href={`/restaurants/${favorite.restaurantId}`}
                                                className="group inline-flex items-center gap-2 hover:text-primary"
                                            >
                                                <h3 className="font-medium truncate">{favorite.name}</h3>
                                                <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </Link>
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {favorite.description}
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onUnFavorite(favorite.restaurantId)}
                                            className="flex-shrink-0 text-primary hover:text-primary/80"
                                        >
                                            <Heart className="h-5 w-5 fill-current" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6">
                        <p className="text-muted-foreground">No favorite restaurants yet</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default MainFavorite;
