import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CartResponse } from "@/lib/redux/type"

interface OrderSummaryProps {
  isLoadingProcess: boolean,
  selectedCartId: number|null,
  selectedCart?: CartResponse,
  notes: string
}

export default function OrderSummary({
    selectedCart,
    selectedCartId,
  isLoadingProcess,
  notes
}: OrderSummaryProps) {
  const router = useRouter();
    // Calculate totals based on selected cart
    const calculateTotals = () => {
        if (!selectedCart) return { subtotal: 0, subtotalDiscount: 0, deliveryFee: 0, tax: 0, total: 0 }
        
        const subtotal = selectedCart.items.reduce((sum, item) => sum + item.food.price * item.quantity, 0)
        const subtotalDiscount = subtotal // You can modify this based on your discount logic
        const deliveryFee = 0 // You can set this based on your delivery fee logic
        const tax = 0 // You can calculate tax based on your business logic
        const total = subtotalDiscount + deliveryFee + tax
        
        return { subtotal, subtotalDiscount, deliveryFee, tax, total }
      }
    
      const { subtotal, subtotalDiscount, deliveryFee, tax, total } = calculateTotals()

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Subtotal</span>
          <div className="text-right">
            <span className="line-through text-sm text-muted-foreground mr-2">${subtotal.toFixed(2)}</span>
            <span className="font-medium">${subtotalDiscount.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Delivery Fee</span>
          <span className="font-medium">${deliveryFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Tax</span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>
        <Separator />
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg">Total</span>
          <span className="font-semibold text-lg">${total.toFixed(2)}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          disabled={isLoadingProcess}
          className="w-full h-12 text-lg font-medium hover:scale-[1.02] transition-transform"
          onClick={() => router.push("/checkout")}
        >
          {isLoadingProcess ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </div>
          ) : (
            "Place order"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
} 