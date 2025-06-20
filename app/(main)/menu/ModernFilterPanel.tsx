"use client"

import React, {useEffect, useState} from "react"
import {Calendar, DollarSign, Leaf, Sparkles, X} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Slider} from "@/components/ui/slider"
import {Badge} from "@/components/ui/badge"
import {Separator} from "@/components/ui/separator"
import {Card, CardContent} from "@/components/ui/card"
import {PaginationRequest} from "@/lib/redux/services/type";
import {FoodType} from "@/constant/FoodType";


export default function ModernFilterPanel({setParamQuery}:{ setParamQuery: React.Dispatch<React.SetStateAction<PaginationRequest>>}) {
    const [priceRange, setPriceRange] = useState([0, 50])
    const [minPrice, setMinPrice] = useState("")
    const [maxPrice, setMaxPrice] = useState("")
    const [selectedFoodTypes, setSelectedFoodTypes] = useState<FoodType|null>(null)

    const foodTypeOptions = [
        {
            value: "SEASONAL" as FoodType,
            label: "Seasonal",
            icon: Calendar,
            color: "bg-orange-100 text-orange-700 border-orange-200",
            description: "Fresh seasonal ingredients",
        },
        {
            value: "VEGETARIAN" as FoodType,
            label: "Vegetarian",
            icon: Leaf,
            color: "bg-green-100 text-green-700 border-green-200",
            description: "Plant-based options",
        },
    ]

    const toggleFoodType = (type: FoodType | "NONE") => {
        if (type === "NONE") {
            setSelectedFoodTypes(null)
            return
        }
        setSelectedFoodTypes(type)
    }

    const handlePriceRangeChange = (values: number[]) => {
        setPriceRange(values)
        setMinPrice(values[0].toString())
        setMaxPrice(values[1].toString())
    }

    const handleMinPriceChange = (value: string) => {
        setMinPrice(value)
        const numValue = Number.parseInt(value) || 0
        setPriceRange([numValue, priceRange[1]])
    }

    const handleMaxPriceChange = (value: string) => {
        setMaxPrice(value)
        const numValue = Number.parseInt(value) || 50
        setPriceRange([priceRange[0], numValue])
    }

    const resetFilters = () => {
        setPriceRange([0, 50])
        setMinPrice("")
        setMaxPrice("")
        setSelectedFoodTypes(null)
    }

    const hasActiveFilters = priceRange[0] > 0 || priceRange[1] < 50 || selectedFoodTypes!==null;

    useEffect(()=>{
        if(priceRange[0]||priceRange[1]){
            setParamQuery(prevState => {
                return {...prevState,minPrice:priceRange[0],maxPrice:priceRange[1]}
            })
        }
        setParamQuery(prevState => {
            return {...prevState,foodType:selectedFoodTypes || undefined}
        })

    },[priceRange,selectedFoodTypes])

    return (
        <div className="w-[100%] bg-background rounded-2xl shadow-2xl border border-border overflow-hidden">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-blue-50/10 to-purple-50/10 dark:from-blue-950/20 dark:to-purple-950/20 p-6 border-b border-border">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-background rounded-lg shadow-sm">
                            <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-foreground">Filters</h2>
                            <p className="text-sm text-muted-foreground">Refine your search</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {hasActiveFilters && (
                    <div className="mt-4 flex items-center gap-2">
                        <Badge variant="secondary" className="bg-background/70">
                            {(priceRange[0] > 0 || priceRange[1] < 50 ? 1 : 0)} active filters
                        </Badge>
                    </div>
                )}
            </div>

            <div className="p-6 space-y-8">
                {/* Price Range Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <Label className="text-lg font-semibold text-foreground">Price Range</Label>
                    </div>

                    {/* Visual Price Range Slider */}
                    <div className="space-y-4">
                        <div className="px-2">
                            <Slider
                                value={priceRange}
                                onValueChange={handlePriceRangeChange}
                                max={50}
                                min={0}
                                step={1}
                                className="w-full"
                            />
                        </div>

                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>$0</span>
                            <span className="font-medium text-foreground">
                                ${priceRange[0]} - ${priceRange[1]}
                            </span>
                            <span>$50+</span>
                        </div>
                    </div>

                    {/* Manual Price Inputs */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="min-price" className="text-sm font-medium text-foreground">
                                Min Price
                            </Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="min-price"
                                    type="number"
                                    placeholder="0"
                                    value={minPrice}
                                    onChange={(e) => handleMinPriceChange(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="max-price" className="text-sm font-medium text-foreground">
                                Max Price
                            </Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="max-price"
                                    type="number"
                                    placeholder="50"
                                    value={maxPrice}
                                    onChange={(e) => handleMaxPriceChange(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <Separator className="bg-border" />

                {/* Food Type Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <Leaf className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <Label className="text-lg font-semibold text-foreground">Food Type</Label>
                    </div>

                    <div className="space-y-3">
                        {/* None Option */}
                        <Card
                            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                                selectedFoodTypes === null
                                    ? "ring-2 ring-primary bg-primary/5 border-primary/20"
                                    : "border-border hover:border-border/80"
                            }`}
                            onClick={() => toggleFoodType("NONE")}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                            <X className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">No Preference</p>
                                            <p className="text-sm text-muted-foreground">Show all food types</p>
                                        </div>
                                    </div>
                                    {selectedFoodTypes===null && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Food Type Options */}
                        {foodTypeOptions.map((option) => {
                            const Icon = option.icon
                            const isSelected = selectedFoodTypes===option.value

                            return (
                                <Card
                                    key={option.value}
                                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                                        isSelected
                                            ? "ring-2 ring-primary bg-primary/5 border-primary/20"
                                            : "border-border hover:border-border/80"
                                    }`}
                                    onClick={() => toggleFoodType(option.value)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${
                                                    option.value === "SEASONAL" 
                                                        ? "bg-orange-100 dark:bg-orange-900" 
                                                        : "bg-green-100 dark:bg-green-900"
                                                }`}>
                                                    <Icon className={`h-4 w-4 ${
                                                        option.value === "SEASONAL"
                                                            ? "text-orange-600 dark:text-orange-400"
                                                            : "text-green-600 dark:text-green-400"
                                                    }`} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground">{option.label}</p>
                                                    <p className="text-sm text-muted-foreground">{option.description}</p>
                                                </div>
                                            </div>
                                            {isSelected && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>

                    {/* Selected Types Summary */}
                    {selectedFoodTypes!==null && (
                        <div className="flex flex-wrap gap-2 pt-2">
                            {[selectedFoodTypes].map((type) => {
                                const option = foodTypeOptions.find((opt) => opt.value === type)
                                if (!option) return null
                                const Icon = option.icon

                                return (
                                    <Badge
                                        key={type}
                                        variant="secondary"
                                        className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 border-blue-200"
                                    >
                                        <Icon className="h-3 w-3" />
                                        {option.label}
                                    </Badge>
                                )
                            })}
                        </div>
                    )}
                </div>

                <Separator className="bg-border" />

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                    <Button
                        onClick={resetFilters}
                        variant="outline"
                        className="flex-1 border-border hover:bg-background"
                        disabled={!hasActiveFilters}
                    >
                        Reset
                    </Button>
                    <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        Apply Filters
                    </Button>
                </div>
            </div>
        </div>
    )
}
