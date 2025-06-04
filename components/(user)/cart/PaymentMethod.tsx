import { CreditCard, Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

const paymentMethods = [
  { id: "card", name: "Credit Card", description: "Pay with your saved card" },
  { id: "cash", name: "Cash on Delivery", description: "Pay when your order arrives" },
]

interface PaymentMethodProps {
  selectedPayment: string;
  onPaymentChange: (value: string) => void;
}

export default function PaymentMethod({ selectedPayment, onPaymentChange }: PaymentMethodProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
        <CardDescription>Choose how you want to pay</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedPayment} onValueChange={onPaymentChange} className="space-y-4">
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
  )
} 