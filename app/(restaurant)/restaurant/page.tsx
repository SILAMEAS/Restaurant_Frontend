"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  Clock,
  MapPin,
  Mail,
  Phone,
  Instagram,
  Twitter,
  Plus,
  Pencil,
  Trash2,
  Upload,
  Package,
  Settings,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Sample restaurant data
const restaurantData = {
  name: "Pizza Palace",
  description: "Authentic Italian pizza made with fresh ingredients and traditional recipes.",
  cuisineType: "Italian",
  openingHours: "Mon-Fri: 11:00 AM - 10:00 PM, Sat-Sun: 12:00 PM - 11:00 PM",
  isOpen: true,
  address: "123 Main St, Anytown, USA",
  contact: {
    email: "info@pizzapalace.com",
    phone: "+1 (555) 123-4567",
    twitter: "@pizzapalace",
    instagram: "@pizzapalace",
  },
  images: [
    "/placeholder.svg?height=300&width=500",
    "/placeholder.svg?height=300&width=500",
    "/placeholder.svg?height=300&width=500",
  ],
}

// Sample food items
const foodItems = [
  {
    id: 1,
    name: "Margherita Pizza",
    description: "Classic pizza with tomato sauce, mozzarella, and basil",
    price: 12.99,
    image: "/placeholder.svg?height=200&width=300",
    category: "Pizza",
    isAvailable: true,
  },
  {
    id: 2,
    name: "Pepperoni Pizza",
    description: "Classic pizza with tomato sauce, mozzarella, and pepperoni",
    price: 14.99,
    image: "/placeholder.svg?height=200&width=300",
    category: "Pizza",
    isAvailable: true,
  },
  {
    id: 3,
    name: "Garlic Bread",
    description: "Freshly baked bread with garlic butter and herbs",
    price: 5.99,
    image: "/placeholder.svg?height=200&width=300",
    category: "Sides",
    isAvailable: true,
  },
  {
    id: 4,
    name: "Caesar Salad",
    description: "Romaine lettuce with Caesar dressing, croutons, and parmesan",
    price: 8.99,
    image: "/placeholder.svg?height=200&width=300",
    category: "Salads",
    isAvailable: false,
  },
]

// Sample orders
const orders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    items: [
      { name: "Margherita Pizza", quantity: 1, price: 12.99 },
      { name: "Garlic Bread", quantity: 1, price: 5.99 },
    ],
    total: 18.98,
    status: "Delivered",
    date: "2023-04-10T14:30:00Z",
    address: "123 Main St, Anytown, USA",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    items: [{ name: "Pepperoni Pizza", quantity: 2, price: 29.98 }],
    total: 29.98,
    status: "In Progress",
    date: "2023-04-10T15:45:00Z",
    address: "456 Oak St, Anytown, USA",
  },
  {
    id: "ORD-003",
    customer: "Bob Johnson",
    items: [
      { name: "Margherita Pizza", quantity: 1, price: 12.99 },
      { name: "Caesar Salad", quantity: 1, price: 8.99 },
    ],
    total: 21.98,
    status: "Pending",
    date: "2023-04-10T16:15:00Z",
    address: "789 Pine St, Anytown, USA",
  },
]

export default function RestaurantManagementPage() {
  const [restaurant, setRestaurant] = useState(restaurantData)
  const [foods, setFoods] = useState(foodItems)
  const [isEditing, setIsEditing] = useState(false)
  const [isAddingFood, setIsAddingFood] = useState(false)
  const [editingFood, setEditingFood] = useState<number | null>(null)
  const { toast } = useToast()

  const handleToggleOpen = () => {
    setRestaurant({
      ...restaurant,
      isOpen: !restaurant.isOpen,
    })

    toast({
      title: restaurant.isOpen ? "Restaurant Closed" : "Restaurant Opened",
      description: restaurant.isOpen
        ? "Your restaurant is now marked as closed."
        : "Your restaurant is now marked as open.",
    })
  }

  const handleSaveRestaurantInfo = (e: React.FormEvent) => {
    e.preventDefault()
    setIsEditing(false)

    toast({
      title: "Restaurant Information Updated",
      description: "Your restaurant information has been successfully updated.",
    })
  }

  const handleSaveFood = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingFood !== null) {
      toast({
        title: "Food Item Updated",
        description: "Your food item has been successfully updated.",
      })
    } else {
      toast({
        title: "Food Item Added",
        description: "Your new food item has been successfully added.",
      })
    }

    setIsAddingFood(false)
    setEditingFood(null)
  }

  const handleDeleteFood = (id: number) => {
    setFoods(foods.filter((food) => food.id !== id))

    toast({
      title: "Food Item Deleted",
      description: "Your food item has been successfully deleted.",
    })
  }

  const handleToggleFoodAvailability = (id: number) => {
    setFoods(foods.map((food) => (food.id === id ? { ...food, isAvailable: !food.isAvailable } : food)))
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">{restaurant.name}</h1>
          <p className="text-muted-foreground">{restaurant.cuisineType} Restaurant</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch checked={restaurant.isOpen} onCheckedChange={handleToggleOpen} id="restaurant-status" />
            <Label htmlFor="restaurant-status" className="font-medium">
              {restaurant.isOpen ? "Open" : "Closed"}
            </Label>
          </div>
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Edit Restaurant
          </Button>
        </div>
      </div>

      <Tabs defaultValue="info">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info">Restaurant Info</TabsTrigger>
          <TabsTrigger value="menu">Menu Management</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        {/* Restaurant Info Tab */}
        <TabsContent value="info">
          {isEditing ? (
            <Card>
              <CardHeader>
                <CardTitle>Edit Restaurant Information</CardTitle>
                <CardDescription>Update your restaurant details and contact information</CardDescription>
              </CardHeader>
              <form onSubmit={handleSaveRestaurantInfo}>
                <CardContent className="space-y-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Restaurant Name</Label>
                        <Input id="name" defaultValue={restaurant.name} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cuisineType">Cuisine Type</Label>
                        <Input id="cuisineType" defaultValue={restaurant.cuisineType} required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        defaultValue={restaurant.description}
                        className="min-h-[100px]"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="openingHours">Opening Hours</Label>
                      <Textarea id="openingHours" defaultValue={restaurant.openingHours} required />
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={restaurant.contact.email} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" defaultValue={restaurant.contact.phone} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="twitter">Twitter</Label>
                        <Input id="twitter" defaultValue={restaurant.contact.twitter} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instagram">Instagram</Label>
                        <Input id="instagram" defaultValue={restaurant.contact.instagram} />
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Address</h3>
                    <div className="space-y-2">
                      <Label htmlFor="address">Full Address</Label>
                      <Textarea id="address" defaultValue={restaurant.address} required />
                    </div>
                  </div>

                  {/* Images */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Restaurant Images</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {restaurant.images.map((image, index) => (
                        <div key={index} className="relative h-40 border rounded-md overflow-hidden">
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`Restaurant image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-8 w-8">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <div className="flex items-center justify-center h-40 border rounded-md border-dashed">
                        <Button variant="ghost" className="flex flex-col h-full w-full">
                          <Upload className="h-6 w-6 mb-2" />
                          <span>Upload Image</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </CardFooter>
              </form>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {/* Restaurant Images */}
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Restaurant Images</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {restaurant.images.map((image, index) => (
                        <div key={index} className="relative h-48 rounded-md overflow-hidden">
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`Restaurant image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Restaurant Details */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{restaurant.description}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Hours</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-start gap-2">
                    <Clock className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{restaurant.openingHours}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Location</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{restaurant.address}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Contact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 flex-shrink-0" />
                      <p className="text-sm">{restaurant.contact.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-5 w-5 flex-shrink-0" />
                      <p className="text-sm">{restaurant.contact.phone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Twitter className="h-5 w-5 flex-shrink-0" />
                      <p className="text-sm">{restaurant.contact.twitter}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Instagram className="h-5 w-5 flex-shrink-0" />
                      <p className="text-sm">{restaurant.contact.instagram}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Menu Management Tab */}
        <TabsContent value="menu">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Menu Items</h2>
            <Button
              onClick={() => {
                setIsAddingFood(true)
                setEditingFood(null)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Item
            </Button>
          </div>

          {isAddingFood || editingFood !== null ? (
            <Card>
              <CardHeader>
                <CardTitle>{editingFood !== null ? "Edit Food Item" : "Add New Food Item"}</CardTitle>
                <CardDescription>
                  {editingFood !== null
                    ? "Update the details of your food item"
                    : "Add a new item to your restaurant menu"}
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSaveFood}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="foodName">Name</Label>
                      <Input
                        id="foodName"
                        placeholder="e.g., Margherita Pizza"
                        defaultValue={editingFood !== null ? foods.find((f) => f.id === editingFood)?.name : ""}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="foodCategory">Category</Label>
                      <Input
                        id="foodCategory"
                        placeholder="e.g., Pizza, Pasta, Dessert"
                        defaultValue={editingFood !== null ? foods.find((f) => f.id === editingFood)?.category : ""}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="foodDescription">Description</Label>
                    <Textarea
                      id="foodDescription"
                      placeholder="Describe your food item"
                      defaultValue={editingFood !== null ? foods.find((f) => f.id === editingFood)?.description : ""}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="foodPrice">Price ($)</Label>
                      <Input
                        id="foodPrice"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="e.g., 12.99"
                        defaultValue={editingFood !== null ? foods.find((f) => f.id === editingFood)?.price : ""}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="foodImage">Image</Label>
                      <Input id="foodImage" type="file" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="foodAvailable"
                      defaultChecked={
                        editingFood !== null ? foods.find((f) => f.id === editingFood)?.isAvailable : true
                      }
                    />
                    <Label htmlFor="foodAvailable">Available for order</Label>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddingFood(false)
                      setEditingFood(null)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">{editingFood !== null ? "Update Item" : "Add Item"}</Button>
                </CardFooter>
              </form>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foods.map((food) => (
                <Card key={food.id} className={!food.isAvailable ? "opacity-70" : undefined}>
                  <div className="relative h-48">
                    <Image
                      src={food.image || "/placeholder.svg"}
                      alt={food.name}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                    {!food.isAvailable && (
                      <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                        <span className="font-medium text-lg">Not Available</span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{food.name}</h3>
                        <p className="text-sm text-muted-foreground">{food.category}</p>
                      </div>
                      <div className="font-medium">${food.price.toFixed(2)}</div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{food.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={food.isAvailable}
                          onCheckedChange={() => handleToggleFoodAvailability(food.id)}
                          id={`available-${food.id}`}
                        />
                        <Label htmlFor={`available-${food.id}`} className="text-sm">
                          {food.isAvailable ? "Available" : "Unavailable"}
                        </Label>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingFood(food.id)
                            setIsAddingFood(true)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteFood(food.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Recent Orders</h2>
              <div className="flex gap-2">
                <Button variant="outline">All Orders</Button>
                <Button variant="outline">New Orders</Button>
              </div>
            </div>

            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{order.id}</CardTitle>
                        <CardDescription>{new Date(order.date).toLocaleString()}</CardDescription>
                      </div>
                      <Badge
                        variant={
                          order.status === "Delivered"
                            ? "outline"
                            : order.status === "In Progress"
                              ? "secondary"
                              : "default"
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm mb-1">Customer</h4>
                        <p className="text-sm">{order.customer}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-1">Delivery Address</h4>
                        <p className="text-sm">{order.address}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-1">Order Items</h4>
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>
                                {item.quantity} x {item.name}
                              </span>
                              <span>${item.price.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex gap-2 w-full">
                      {order.status === "Pending" && (
                        <>
                          <Button className="flex-1">Accept Order</Button>
                          <Button variant="outline" className="flex-1">
                            Reject Order
                          </Button>
                        </>
                      )}
                      {order.status === "In Progress" && <Button className="w-full">Mark as Delivered</Button>}
                      {order.status === "Delivered" && (
                        <Button variant="outline" className="w-full">
                          <Package className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
