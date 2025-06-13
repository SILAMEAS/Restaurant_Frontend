"use client"

import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader} from "@/components/ui/card"
import {Clock, MapPin, MessageCircle} from "lucide-react"
import {formatDistanceToNow} from "date-fns"
import {enumStatus, OrderResponse} from "@/lib/redux/type";
import {Badge} from "@/components/ui/badge";

interface OrderCardProps {
    order: OrderResponse
    onChatOpen: () => void
}

const statusConfig = {
    preparing: { label: "Preparing", color: "bg-yellow-100 text-yellow-800" },
    on_the_way: { label: "On the way", color: "bg-blue-100 text-blue-800" },
    delivered: { label: "Delivered", color: "bg-green-100 text-green-800" },
    cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800" },
}

export function OrderCard({ order, onChatOpen }: OrderCardProps) {
    const status = order.status
    const orderTime = formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })
    const estimatedTime = new Date(order.createdAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    })

    return (
        <Card className="w-full">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <img
                            src={ "/placeholder.svg"}
                            alt={order.restaurant.name}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                            <h3 className="font-semibold text-lg">{order.restaurant.name}</h3>
                            <p className="text-sm text-gray-600">{order.totalAmount}</p>
                        </div>
                    </div>
                    <Badge >{order.status}</Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="space-y-2">
                    {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
              <span>
                {item.quantity}x {item.name}
              </span>
                            <span>${item.price?.toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>Total</span>
                        <span>${order.totalAmount?.toFixed(2)}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>Ordered {orderTime}</span>
                    </div>
                    {order.status !== enumStatus.DELIVERED && (
                        <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>ETA: {estimatedTime}</span>
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center pt-2">
                    <Button variant="outline" size="sm" onClick={onChatOpen} className="flex items-center space-x-2">
                        <MessageCircle className="w-4 h-4" />
                        <span>Chat with Restaurant</span>
                        {/*{order.unreadMessages > 0 && (*/}
                        {/*    <Badge variant="destructive" className="ml-1 px-1.5 py-0.5 text-xs">*/}
                        {/*        {order.unreadMessages}*/}
                        {/*    </Badge>*/}
                        {/*)}*/}
                    </Button>

                    {order.status === enumStatus.DELIVERED && (
                        <Button variant="outline" size="sm">
                            Reorder
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
