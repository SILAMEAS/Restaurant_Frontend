"use client"

import React, {useEffect, useState} from "react"
import Image from "next/image"
import {Filter, Leaf, Search, Star, Minus, Plus, ChevronLeft, ChevronRight} from "lucide-react"
import Link from "next/link"

import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Card, CardContent, CardFooter} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Sheet, SheetContent, SheetTrigger,} from "@/components/ui/sheet"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {useAddCartMutation, useGetCategoriesQuery, useGetFoodsQuery} from "@/lib/redux/services/api";
import useParamQuery from "@/hooks/useParamQuery";
import SkeletonCard from "@/components/skeleton/SkeletonCard";
import {FoodType} from "@/constant/FoodType";
import ModernFilterPanel from "@/app/(main)/menu/ModernFilterPanel";
import {FoodResponse} from "@/lib/redux/services/type";
import {handleApiCall} from "@/lib/handleApiCall";
import {Slide, toast} from "react-toastify";
import { useSearchParams } from "next/navigation"

const ITEMS_PER_PAGE_OPTIONS = [8,12, 24, 36, 48] // Options for items per page

export default function MenuPage() {
  const param = useSearchParams();
  const {paramQuery, setParamQuery} = useParamQuery();
  const getCategoryQuery = useGetCategoriesQuery();
  const {currentData, isLoading, isFetching} = useGetFoodsQuery(
    {
      params: {
        ...paramQuery,
        pageNo: paramQuery.pageNo || 1,
        pageSize: paramQuery.pageSize || ITEMS_PER_PAGE_OPTIONS[0],
      },
      caseIgnoreFilter: paramQuery.filterBy === "All"
    },
    {refetchOnMountOrArgChange: true}
  );
  
  const foods = currentData?.contents ?? [];
  const totalPages = currentData?.totalPages ?? 1;
  const currentPage = currentData?.page ?? 1;
  
  const [itemClick, setItemClick] = useState<number|null>(null)
  const [quantities, setQuantities] = useState<{[key: number]: number}>({});

  const categories = ["All"]

  /** Passing Categories from backend */
  if(getCategoryQuery.currentData){
    getCategoryQuery.currentData.contents.map(r=>categories.push(r.name));
  }
  const [addCart,resultAddCart]=useAddCartMutation();

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setParamQuery({...paramQuery, pageNo: newPage});
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    const newPageSize = parseInt(value);
    setParamQuery({...paramQuery, pageSize: newPageSize, pageNo: 1});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = async (food:FoodResponse,quantity:number) => {
    await handleApiCall({
      apiFn: () => addCart({foodId:food.id,quantity}).unwrap(),
      onSuccess: () => {
        toast.success(`${food.name} has been added to your cart.`, {
          theme: "dark",
          transition: Slide,
        });
      },
      onError:(e)=>{
        toast.error(`${e.data.message}`, {
          theme: "dark",
          transition: Slide,
        });
      }
    });
  }
  
  useEffect(()=>{
    const categoryQuery = param.get("category");
    if(categoryQuery){
      setParamQuery({...paramQuery, filterBy:categoryQuery.toUpperCase(), pageNo: 1,pageSize:ITEMS_PER_PAGE_OPTIONS[0]});
    }else{
      setParamQuery({...paramQuery, filterBy:"All", pageNo: 1,pageSize:ITEMS_PER_PAGE_OPTIONS[0]});
    }
  },[])

  return (
    <div className="container py-8 w-[100vw]">
      {/** Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search for food, restaurants..."
            className="pl-10"
            value={paramQuery.search}
            onChange={(e) => setParamQuery({...paramQuery, search:e.target.value, pageNo: 1})}
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
      <Tabs value={paramQuery.filterBy} onValueChange={(e)=>setParamQuery({...paramQuery, filterBy:e, pageNo: 1})} className="mb-8">
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
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-5 sm:px-0">
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
                  <Link 
                      href={`/restaurants/${food.restaurantId}`}
                      className="text-sm text-muted-foreground mb-1 hover:text-primary transition-colors"
                  >
                      {food.restaurantName}
                  </Link>
                  <h3 className="font-semibold text-lg mb-1">{food.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{food.description}</p>
                  <div className="font-medium mb-4">
                    {
                        food.price.toFixed(2)===food.priceDiscount.toFixed(2)?
                            <p className="text-lg">${food.price.toFixed(2)}</p>:
                            <div>
                              <p className="text-sm line-through text-muted-foreground">${food.price.toFixed(2)}</p>
                              <p className="text-lg text-primary">${food.priceDiscount.toFixed(2)}</p>
                            </div>
                    }
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-between bg-secondary rounded-md">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-l-md hover:bg-primary/20"
                        onClick={() => {
                          const currentQty = quantities[food.id] || 1;
                          if (currentQty > 1) {
                            setQuantities({...quantities, [food.id]: currentQty - 1});
                          }
                        }}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">
                        {quantities[food.id] || 1}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-r-md hover:bg-primary/20"
                        onClick={() => {
                          const currentQty = quantities[food.id] || 1;
                          setQuantities({...quantities, [food.id]: currentQty + 1});
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button 
                      disabled={!food.open} 
                      variant="default"
                      className="flex-1 h-9 font-medium" 
                      onClick={async () => {
                        setItemClick(food.id);
                        addToCart(food, quantities[food.id] || 1).then(r => r);
                      }}
                    >
                      {resultAddCart.isLoading && food.id === itemClick ? 
                        "Adding..." : "Add to Cart"
                      }
                    </Button>
                  </div>
                  {!food.open && (
                    <p className="text-sm text-red-500 mt-2">
                      Currently restaurant is closed
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Pagination Controls */}
          <div className="flex flex-row justify-between items-center gap-4 mt-8">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden lg:felx">Items per page</span>
              <Select
                value={String(paramQuery.pageSize || ITEMS_PER_PAGE_OPTIONS[0])}
                onValueChange={handleItemsPerPageChange}
              >
                <SelectTrigger className="w-[80px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ITEMS_PER_PAGE_OPTIONS.map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        (isLoading||isFetching) ?
          <SkeletonCard column={6}/> :
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No items found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
      )}
    </div>
  )
}
