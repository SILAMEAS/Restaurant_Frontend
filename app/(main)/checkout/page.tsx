"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import MainAddresses from "@/app/(main)/profile/(tab)/MainAddresses"
import PaymentMethod from "@/components/(user)/cart/PaymentMethod"
import OrderNotes from "@/components/(user)/cart/OrderNotes"
import OrderSummary from "@/components/(user)/cart/OrderSummary"

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

// Sample payment methods
const paymentMethods = [
  { id: "card", name: "Credit Card", description: "Pay with your saved card" },
  { id: "cash", name: "Cash on Delivery", description: "Pay when your order arrives" },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0].id)
  const [notes, setNotes] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

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
          <MainAddresses />

          {/* Payment Method */}
          <PaymentMethod
            selectedPayment={selectedPayment}
            onPaymentChange={setSelectedPayment}
          />

          {/* Order Notes */}
          <OrderNotes
            notes={notes}
            onNotesChange={setNotes}
          />
        </div>

        {/* Order Summary */}
      
      </div>
    </div>
  )
}
