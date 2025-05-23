import React from 'react';
import {TabsContent} from "@/components/ui/tabs";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {Heart} from "lucide-react";
import {useEndpointProfile} from "@/app/(main)/profile/useEndpointProfile";
import {IFavorite} from "@/lib/redux/api";

const MainFavorite = ({favorites}:{favorites: IFavorite[]|[]}) => {
    const {method:{onUnFavorite}}=useEndpointProfile();
    return    <TabsContent value="favorites">
        <Card>
            <CardHeader>
                <CardTitle>My Favorite Restaurants</CardTitle>
                <CardDescription>Restaurants you've marked as favorites</CardDescription>
            </CardHeader>
            <CardContent>
                {favorites.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {favorites.map((favorite) => (
                            <div key={favorite.id} className="flex items-center gap-4 p-3 border rounded-lg">
                                <div className="relative h-16 w-16 rounded-md overflow-hidden">
                                    <Image
                                        src={ "/placeholder.svg"}
                                        alt={favorite.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium">{favorite.name}</h3>
                                    {/* <p className="text-sm text-muted-foreground">{favorite.cuisine}</p> */}
                                </div>
                                <Button variant="ghost" size="icon" onClick={()=>onUnFavorite(favorite.restaurantId)}>
                                    <Heart className="h-5 w-5 fill-primary text-primary" />
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                        <h3 className="font-medium text-lg">No favorites yet</h3>
                        <p className="text-muted-foreground">
                            Browse restaurants and click the heart icon to add favorites
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    </TabsContent>
};

export default MainFavorite;
