import React, {useState} from 'react';
import {Card, CardContent} from "@/components/ui/card";
import Image from "next/image";
import {useGetRestaurantsQuery, useMyFavQuery} from "@/lib/redux/services/api";
import {Button} from "@/components/ui/button"
import {Heart, Loader2} from 'lucide-react';
import {useEndpointProfile} from '@/app/(main)/profile/useEndpointProfile';
import {RestaurantResponse} from "@/lib/redux/services/type";
import { useRouter } from 'next/navigation';
import LoadingRestaurant from "@/app/(main)/restaurants/LoadingRestaurant";


const FeatureRestaurant = () => {
    const router = useRouter();
    const {currentData,isLoading} = useGetRestaurantsQuery({});
    const getMyFav = useMyFavQuery();
    const {method:{onUnFavorite},trigger:{resultFavUnFavMutation}}=useEndpointProfile();
    const [clickItem,setClickItem]=useState<RestaurantResponse|undefined>();
    if(isLoading){
        return <LoadingRestaurant/>
    }
    return <section className="container px-4 md:px-6 py-8">
        <h2 className="text-xl lg:text-3xl font-bold tracking-tight mb-6">Restaurants</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentData?.contents?.map((i) => (
                <Card key={i.id} className="overflow-hidden cursor-pointer" onClick={(e)=>{
                    e.preventDefault();
                    router.push(`/restaurants/${i.id}`);
                }}>
                <div className="relative h-48">
                    <Image
                        src={`${i.imageUrls.length>0?i.imageUrls[0].url : "/placeholder.svg"}?height=200&width=300`}
                        alt={`Restaurant ${i}`}
                        fill
                        className="object-contain"
                    />
                </div>
                <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{i.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{i.cuisineType} • $$</p>
                    <div className="flex items-center text-sm">
                                    <span
                                        className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">{i.rating} ★</span>
                        <span className="ml-2 text-muted-foreground">30-45 min</span>
                        <Button variant="ghost" size="icon" onClick={(e)=>{
                            e.stopPropagation();
                            setClickItem(i);
                            onUnFavorite(i.id).then(r => r)
                        }}>
                            {
                                    resultFavUnFavMutation?.isLoading&&clickItem?.id===i.id?
                                    <Loader2 className='rotate-center'/>:
                                    <Heart className={`h-5 w-5 ${getMyFav?.currentData?.find(it=>it.restaurantId==i.id)?'fill-red-800':"fill-primary"} text-primary`} />
                            }
                        
                          </Button>
                    </div>
                     
                </CardContent>
            </Card>))}
        </div>
    </section>

};

export default FeatureRestaurant;
