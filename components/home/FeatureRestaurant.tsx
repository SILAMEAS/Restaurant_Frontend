import React from 'react';
import {Card, CardContent} from "@/components/ui/card";
import Image from "next/image";
import {useGetRestaurantsQuery} from "@/lib/redux/api";

const FeatureRestaurant = () => {
    const {currentData} = useGetRestaurantsQuery({});
    return <section className="container px-4 md:px-6 py-8">
        <h2 className="text-3xl font-bold tracking-tight mb-6">Featured Restaurants</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentData?.contents?.map((i) => (<Card key={i.id} className="overflow-hidden">
                <div className="relative h-48">
                    <Image
                        src={`/placeholder.svg?height=200&width=300`}
                        alt={`Restaurant ${i}`}
                        fill
                        className="object-cover"
                    />
                </div>
                <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-1">Restaurant {i.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{i.cuisineType} • $$</p>
                    <div className="flex items-center text-sm">
                                    <span
                                        className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">{i.rating} ★</span>
                        <span className="ml-2 text-muted-foreground">30-45 min</span>
                    </div>
                </CardContent>
            </Card>))}
        </div>
    </section>

};

export default FeatureRestaurant;
