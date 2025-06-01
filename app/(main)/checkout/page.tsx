"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, CreditCard, MapPin, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import MainAddresses from "@/app/(main)/profile/(tab)/MainAddresses";

// Sample cart data for order summary
const cartItems = [
  {
    id: 1,
    name: "Margherita Pizza",
    price: 12.99,
    quantity: 1,
    restaurant: "Pizza Palace",
  },
  {
    id: 2,
    name: "Cheeseburger",
    price: 9.99,
    quantity: 2,
    restaurant: "Burger Joint",
  },
  {
    id: 3,
    name: "Caesar Salad",
    price: 8.99,
    quantity: 1,
    restaurant: "Green Eats",
  },
]

// Sample addresses
const addresses = [
  { id: 1, name: "Home", address: "123 Main St, Anytown, USA", default: true },
  { id: 2, name: "Work", address: "456 Office Blvd, Workville, USA", default: false },
]

// Sample payment methods
const paymentMethods = [
  { id: "card", name: "Credit Card", description: "Pay with your saved card" },
  { id: "cash", name: "Cash on Delivery", description: "Pay when your order arrives" },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedAddress, setSelectedAddress] = useState(addresses[0].id)
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0].id)
  const [notes, setNotes] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = 2.99
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + deliveryFee + tax

  const handlePlaceOrder = () => {
    setIsProcessing(true)

    // Simulate order processing
    setTimeout(() => {
      setIsProcessing(false)
      toast({
        title: "Order Placed Successfully!",
        description: "Your order has been placed and will be delivered soon.",
      })
      router.push("/")
    }, 2000)
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Address */}
         <MainAddresses/>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Choose how you want to pay</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment} className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={method.id} id={`payment-${method.id}`} className="mt-1" />
                    <div className="flex-1 border rounded-lg p-4">
                      <Label htmlFor={`payment-${method.id}`} className="flex items-center gap-2">
                        {method.id === "card" ? <CreditCard className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                        <span className="font-medium">{method.name}</span>
                      </Label>
                      <p className="text-sm text-muted-foreground mt-2 ml-6">{method.description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Order Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Order Notes</CardTitle>
              <CardDescription>Add any special instructions for your order</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="E.g., Ring the doorbell, leave at the door, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Items */}
              <div className="space-y-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-sm">
                      {item.quantity} x {item.name}
                    </span>
                    <span className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Costs */}
              <div className="space-y-2">
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
              </div>

              <Separator />

              <div className="flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg" onClick={handlePlaceOrder} disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Place Order"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
