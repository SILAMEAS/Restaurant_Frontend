"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// Sample cart data
const initialCartItems = [
  {
    id: 1,
    name: "Margherita Pizza",
    price: 12.99,
    quantity: 1,
    image: "/placeholder.svg?height=100&width=100",
    restaurant: "Pizza Palace",
  },
  {
    id: 2,
    name: "Cheeseburger",
    price: 9.99,
    quantity: 2,
    image: "/placeholder.svg?height=100&width=100",
    restaurant: "Burger Joint",
  },
  {
    id: 3,
    name: "Caesar Salad",
    price: 8.99,
    quantity: 1,
    image: "/placeholder.svg?height=100&width=100",
    restaurant: "Green Eats",
  },
]

export default function CartPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState(initialCartItems)

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return

    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = 2.99
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + deliveryFee + tax

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Cart Items ({cartItems.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-4 py-4">
                    <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.restaurant}</p>
                      <div className="mt-2 font-medium">${item.price.toFixed(2)}</div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <div className="flex items-center border rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" size="lg" onClick={() => router.push("/checkout")}>
                  Proceed to Checkout
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Looks like you haven't added any items to your cart yet.</p>
          <Link href="/menu">
            <Button size="lg">Browse Menu</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
