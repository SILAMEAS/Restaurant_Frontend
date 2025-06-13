"use client"

import React, {useState} from "react"
import {Card, CardContent} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Filter, Heart, Leaf, MapPin, Phone, Search, Star} from "lucide-react"
import Image from "next/image"
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet"
import {useAddCartMutation, useGetFoodsByRestaurantIdQuery, useFavUnFavMutation, useGetRestaurantByIdQuery, useMyFavQuery} from "@/lib/redux/services/api"
import {FoodType} from "@/constant/FoodType"
import ModernFilterPanel from "@/app/(main)/menu/ModernFilterPanel"
import {handleApiCall} from "@/lib/handleApiCall"
import {Slide, toast} from "react-toastify"
import useParamQuery from "@/hooks/useParamQuery"
import SkeletonCard from "@/components/skeleton/SkeletonCard"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface RestaurantPageProps {
    params: {
        id: string
    }
}

export default function RestaurantPage({params}: RestaurantPageProps) {
    const restaurantId = parseInt(params.id)
    const getMyFav = useMyFavQuery();
    const {paramQuery, setParamQuery} = useParamQuery()
    const {data: restaurant, isLoading: isLoadingRestaurant, isError: isRestaurantError} = useGetRestaurantByIdQuery(restaurantId)
    const {data: foods, isLoading: isLoadingFoods, isFetching} = useGetFoodsByRestaurantIdQuery({
        params: paramQuery,
        restaurantId
    }, {refetchOnMountOrArgChange: true})
    const [itemClick, setItemClick] = useState<number | null>(null)
    const [quantities, setQuantities] = useState<{ [key: number]: number }>({})
    const [addCart] = useAddCartMutation()
    const [favUnFav] = useFavUnFavMutation()

    const addToCart = async (foodId: number, quantity: number) => {
        await handleApiCall({
            apiFn: () => addCart({foodId, quantity}).unwrap(),
            onSuccess: () => {
                toast.success("Item has been added to your cart.", {
                    theme: "dark",
                    transition: Slide,
                })
            },
            onError: (e) => {
                toast.error(e.data.message, {
                    theme: "dark",
                    transition: Slide,
                })
            }
        })
    }

    const toggleFavorite = async () => {
        await handleApiCall({
            apiFn: () => favUnFav({restaurantId}).unwrap(),
            onSuccess: () => {
                toast.success("Favorite status updated!", {
                    theme: "dark",
                    transition: Slide,
                })
            }
        })
    }

    if (isLoadingRestaurant) {
        return (
            <div className="container py-8">
                <div className="animate-pulse">
                    <div className="h-[300px] w-full bg-muted rounded-xl mb-6"/>
                    <div className="h-8 w-1/3 bg-muted rounded mb-4"/>
                    <div className="h-4 w-2/3 bg-muted rounded mb-2"/>
                    <div className="h-4 w-1/2 bg-muted rounded"/>
                </div>
            </div>
        )
    }

    if (isRestaurantError || !restaurant) {
        return (
            <div className="container py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">Restaurant not found</h1>
                    <p className="text-muted-foreground">The restaurant you're looking for doesn't exist or there was an error loading it.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container py-8">
            {/* Restaurant Header */}
            <div className="mb-8">
                <div className="relative h-[300px] w-full rounded-xl overflow-hidden mb-6">
                    <Image
                        src={restaurant?.imageUrls?.[0]?.url || "/placeholder.svg"}
                        alt={restaurant?.name || "Restaurant"}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-2">
                            <Badge variant={restaurant.open ? "default" : "secondary"}>
                                {restaurant.open ? "Open" : "Closed"}
                            </Badge>
                            <span>•</span>
                            <span>{restaurant.cuisineType}</span>
                            <span>•</span>
                            <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1"/>
                                <span>{restaurant.rating}</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1"/>
                                <span>{restaurant.address.city}</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center">
                                <Phone className="h-4 w-4 mr-1"/>
                                <span>{restaurant.contactInformation.phone}</span>
                            </div>
                        </div>
                        <p className="text-muted-foreground max-w-2xl">{restaurant.description}</p>
                    </div>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10"
                        onClick={toggleFavorite}
                    >
                          <Heart className={`h-5 w-5 ${getMyFav?.currentData?.find(it=>it.restaurantId==restaurant.id)?'fill-red-800':"fill-primary"} text-primary`} />
                    </Button>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                    <Input
                        placeholder="Search menu items..."
                        className="pl-10"
                        value={paramQuery.search}
                        onChange={(e) => setParamQuery({...paramQuery, search: e.target.value})}
                    />
                </div>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="flex gap-2">
                            <Filter className="h-4 w-4"/>
                            Filters
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <ModernFilterPanel setParamQuery={setParamQuery}/>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {foods?.contents?.map((food) => (
                    <Card key={food.id} className="overflow-hidden">
                        <div className="relative h-48">
                            <Image
                                src={food.images[0] || "/placeholder.svg"}
                                alt={food.name}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute top-2 right-2 flex gap-1">
                                {food.foodType === FoodType.VEGETARIAN && (
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        <Leaf className="h-3 w-3"/>
                                        Veg
                                    </Badge>
                                )}
                                {food.foodType === FoodType.SEASONAL && (
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        <Star className="h-3 w-3"/>
                                        Seasonal
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <CardContent className="p-4">
                            <h3 className="font-semibold text-lg mb-1">{food.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                {food.description}
                            </p>
                            <div className="font-medium mb-4">
                                {food.price.toFixed(2) === food.priceDiscount.toFixed(2) ? (
                                    <p>${food.price.toFixed(2)}</p>
                                ) : (
                                    <div>
                                        <p className="line-through">${food.price.toFixed(2)}</p>
                                        <p>${food.priceDiscount.toFixed(2)}</p>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2 w-full items-center">
                                <Input
                                    type="number"
                                    min="1"
                                    value={quantities[food.id] || 1}
                                    onChange={(e) => setQuantities({
                                        ...quantities,
                                        [food.id]: parseInt(e.target.value) || 1
                                    })}
                                    className="w-20"
                                    disabled={!food.open}
                                />
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                className="flex-1"
                                                disabled={!food.open}
                                                onClick={async () => {
                                                    setItemClick(food.id)
                                                    await addToCart(food.id, quantities[food.id] || 1)
                                                }}
                                            >
                                                {itemClick === food.id ? "Adding..." : "Add to Cart"}
                                            </Button>
                                        </TooltipTrigger>
                                        {!restaurant.open && (
                                            <TooltipContent>
                                                <p>This restaurant is currently closed</p>
                                            </TooltipContent>
                                        )}
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Loading and Empty States */}
            {(isLoadingFoods || isFetching) ? (
                <SkeletonCard column={4}/>
            ) : foods?.contents?.length === 0 ? (
                <div className="text-center py-12">
                    <h3 className="text-xl font-medium mb-2">No items found</h3>
                    <p className="text-muted-foreground">
                        Try adjusting your search or filters to find what you're looking for.
                    </p>
                </div>
            ) : null}
        </div>
    )
} 