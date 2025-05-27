"use client"

import {useState} from "react"
import Image from "next/image"
import {Filter, Leaf, Search, Star} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Card, CardContent, CardFooter} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {Checkbox} from "@/components/ui/checkbox"
import {Label} from "@/components/ui/label"
import {Slider} from "@/components/ui/slider"
import {useToast} from "@/components/ui/use-toast"

// Sample food data
const foodItems = [
  {
    id: 1,
    name: "Margherita Pizza",
    description: "Classic pizza with tomato sauce, mozzarella, and basil",
    price: 12.99,
    image: "/placeholder.svg?height=200&width=300",
    category: "pizza",
    tags: ["vegetarian"],
    restaurant: "Pizza Palace",
  },
  {
    id: 2,
    name: "Cheeseburger",
    description: "Juicy beef patty with cheese, lettuce, tomato, and special sauce",
    price: 9.99,
    image: "/placeholder.svg?height=200&width=300",
    category: "burgers",
    tags: [],
    restaurant: "Burger Joint",
  },
  {
    id: 3,
    name: "California Roll",
    description: "Sushi roll with crab, avocado, and cucumber",
    price: 14.99,
    image: "/placeholder.svg?height=200&width=300",
    category: "sushi",
    tags: ["seasonal"],
    restaurant: "Sushi Spot",
  },
  {
    id: 4,
    name: "Caesar Salad",
    description: "Romaine lettuce with Caesar dressing, croutons, and parmesan",
    price: 8.99,
    image: "/placeholder.svg?height=200&width=300",
    category: "salads",
    tags: ["vegetarian"],
    restaurant: "Green Eats",
  },
  {
    id: 5,
    name: "Chocolate Cake",
    description: "Rich chocolate cake with ganache frosting",
    price: 6.99,
    image: "/placeholder.svg?height=200&width=300",
    category: "desserts",
    tags: ["vegetarian"],
    restaurant: "Sweet Treats",
  },
  {
    id: 6,
    name: "Iced Coffee",
    description: "Cold brewed coffee served over ice",
    price: 4.99,
    image: "/placeholder.svg?height=200&width=300",
    category: "drinks",
    tags: ["vegetarian"],
    restaurant: "Coffee House",
  },
  {
    id: 7,
    name: "Pepperoni Pizza",
    description: "Classic pizza with tomato sauce, mozzarella, and pepperoni",
    price: 14.99,
    image: "/placeholder.svg?height=200&width=300",
    category: "pizza",
    tags: [],
    restaurant: "Pizza Palace",
  },
  {
    id: 8,
    name: "Veggie Burger",
    description: "Plant-based patty with lettuce, tomato, and special sauce",
    price: 10.99,
    image: "/placeholder.svg?height=200&width=300",
    category: "burgers",
    tags: ["vegetarian"],
    restaurant: "Burger Joint",
  },
]

const categories = ["All", "Pizza", "Burgers", "Sushi", "Salads", "Desserts", "Drinks"]

export default function MenuPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [priceRange, setPriceRange] = useState([0, 20])
  const [dietaryFilters, setDietaryFilters] = useState({
    vegetarian: false,
    seasonal: false,
  })
  const { toast } = useToast()

  // Filter foods based on search, category, and filters
  const filteredFoods = foodItems.filter((food) => {
    // Search filter
    const matchesSearch =
      food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.restaurant.toLowerCase().includes(searchQuery.toLowerCase())

    // Category filter
    const matchesCategory = selectedCategory === "All" || food.category.toLowerCase() === selectedCategory.toLowerCase()

    // Price filter
    const matchesPrice = food.price >= priceRange[0] && food.price <= priceRange[1]

    // Dietary filters
    const matchesDietary =
      (!dietaryFilters.vegetarian || food.tags.includes("vegetarian")) &&
      (!dietaryFilters.seasonal || food.tags.includes("seasonal"))

    return matchesSearch && matchesCategory && matchesPrice && matchesDietary
  })

  const addToCart = (food: any) => {
    toast({
      title: "Added to cart",
      description: `${food.name} has been added to your cart.`,
    })
  }

  return (
    <div className="container py-8  mx-auto">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search for food, restaurants..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>Refine your menu options</SheetDescription>
            </SheetHeader>
            <div className="py-6 space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Price Range</h3>
                <div className="space-y-2">
                  <Slider defaultValue={[0, 20]} max={50} step={1} value={priceRange} onValueChange={setPriceRange} />
                  <div className="flex justify-between">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-medium">Dietary Preferences</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="vegetarian"
                      checked={dietaryFilters.vegetarian}
                      onCheckedChange={(checked) =>
                        setDietaryFilters({ ...dietaryFilters, vegetarian: checked === true })
                      }
                    />
                    <Label htmlFor="vegetarian">Vegetarian</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="seasonal"
                      checked={dietaryFilters.seasonal}
                      onCheckedChange={(checked) =>
                        setDietaryFilters({ ...dietaryFilters, seasonal: checked === true })
                      }
                    />
                    <Label htmlFor="seasonal">Seasonal</Label>
                  </div>
                </div>
              </div>
            </div>
            <SheetFooter>
              <Button
                onClick={() => {
                  setPriceRange([0, 20])
                  setDietaryFilters({ vegetarian: false, seasonal: false })
                }}
              >
                Reset Filters
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* Category Tabs */}
      <Tabs defaultValue="All" value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
        <TabsList className="w-full overflow-auto">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="min-w-[100px]">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Food Items Grid */}
      {filteredFoods.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredFoods.map((food) => (
            <Card key={food.id} className="overflow-hidden">
              <div className="relative h-48">
                <Image src={food.image || "/placeholder.svg"} alt={food.name} fill className="object-cover" />
                <div className="absolute top-2 right-2 flex gap-1">
                  {food.tags.includes("vegetarian") && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Leaf className="h-3 w-3" />
                      Veg
                    </Badge>
                  )}
                  {food.tags.includes("seasonal") && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      Seasonal
                    </Badge>
                  )}
                </div>
              </div>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground mb-1">{food.restaurant}</div>
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
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No items found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      )}
    </div>
  )
}
