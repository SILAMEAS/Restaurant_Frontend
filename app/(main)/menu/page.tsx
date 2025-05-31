"use client"

import React from "react"
import Image from "next/image"
import {Filter, Leaf, Search, Star} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Card, CardContent, CardFooter} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Sheet, SheetContent, SheetTrigger,} from "@/components/ui/sheet"
import {useToast} from "@/components/ui/use-toast"
import {useGetCategoriesQuery, useGetFoodsQuery} from "@/lib/redux/api";
import useParamQuery from "@/hooks/useParamQuery";
import SkeletonCard from "@/components/skeleton/SkeletonCard";
import {FoodType} from "@/constant/FoodType";
import ModernFilterPanel from "@/app/(main)/menu/ModernFilterPanel";


export default function MenuPage() {
  const {paramQuery,setParamQuery} = useParamQuery();
  const getCategoryQuery = useGetCategoriesQuery();
  const {currentData,isLoading,isFetching} = useGetFoodsQuery({params:paramQuery,caseIgnoreFilter:paramQuery.filterBy==="All"},{refetchOnMountOrArgChange:true});
  const { toast } = useToast()
  const foods = currentData?.contents??[];

  const categories = ["All"]

  /** Passing Categories from backend */
  if(getCategoryQuery.currentData){
    getCategoryQuery.currentData.contents.map(r=>categories.push(r.name));
  }


  const addToCart = (food: any) => {
    toast({
      title: "Added to cart",
      description: `${food.name} has been added to your cart.`,
    })
  }

  return (
    <div className="container py-8  w-[100vw]">
      {/** Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search for food, restaurants..."
            className="pl-10"
            value={paramQuery.search}
            onChange={(e) => setParamQuery({...paramQuery,search:e.target.value})}
          />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent>
            <ModernFilterPanel setParamQuery={setParamQuery}/>
          </SheetContent>
        </Sheet>
      </div>

      {/** Category Tabs */}
      <Tabs defaultValue="All" value={paramQuery.filterBy} onValueChange={(e)=>setParamQuery({...paramQuery,filterBy:e})} className="mb-8">
        <TabsList className="w-full overflow-auto">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="min-w-[100px]">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/** Food Items Grid */}
      {foods?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {foods?.map((food) => (
            <Card key={food.id} className="overflow-hidden">
              <div className="relative h-48">
                <Image src={food.images[0] || "/placeholder.svg"} alt={food.name} fill className="object-cover" />
                <div className="absolute top-2 right-2 flex gap-1">
                  {food.foodType===FoodType.VEGETARIAN && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Leaf className="h-3 w-3" />
                      Veg
                    </Badge>
                  )}
                  {food.foodType===FoodType.SEASONAL  && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      Seasonal
                    </Badge>
                  )}
                </div>
              </div>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground mb-1">{food.restaurantName}</div>
                <h3 className="font-semibold text-lg mb-1">{food.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{food.description}</p>
                <div className="font-medium">${food.price.toFixed(2)}</div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full" onClick={() => addToCart(food)}>
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
            (isLoading||isFetching)?
                <SkeletonCard column={6}/>:
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No items found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters to find what you're looking for.</p>
                </div>

      )}
    </div>
  )
}
