import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface OrderNotesProps {
  notes: string;
  onNotesChange: (value: string) => void;
}

export default function OrderNotes({ notes, onNotesChange }: OrderNotesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Notes</CardTitle>
        <CardDescription>Add any special instructions for your order</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="E.g., Ring the doorbell, leave at the door, etc."
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="min-h-[100px]"
        />
      </CardContent>
    </Card>
  )
} 