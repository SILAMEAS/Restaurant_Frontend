"use client"

import { useState } from "react"
import {Order} from "@/components/(user)/order/types/order";
import {OrderList} from "@/components/(user)/order/components/OrderList";
import {useGetOrdersQuery} from "@/lib/redux/api";
import {OrderResponse} from "@/lib/redux/type";

// Mock data for orders
const mockOrders: Order[] = [
    {
        id: "1",
        restaurantName: "Pizza Palace",
        restaurantImage: "/placeholder.svg?height=40&width=40",
        orderNumber: "#ORD-001",
        status: "preparing",
        items: [
            { name: "Margherita Pizza", quantity: 1, price: 18.99 },
            { name: "Garlic Bread", quantity: 2, price: 6.99 },
        ],
        total: 25.98,
        orderTime: "2024-01-15T14:30:00Z",
        estimatedDelivery: "2024-01-15T15:15:00Z",
        unreadMessages: 2,
    },
    {
        id: "2",
        restaurantName: "Burger Barn",
        restaurantImage: "/placeholder.svg?height=40&width=40",
        orderNumber: "#ORD-002",
        status: "delivered",
        items: [
            { name: "Classic Burger", quantity: 1, price: 12.99 },
            { name: "French Fries", quantity: 1, price: 4.99 },
            { name: "Coke", quantity: 1, price: 2.99 },
        ],
        total: 20.97,
        orderTime: "2024-01-14T19:45:00Z",
        estimatedDelivery: "2024-01-14T20:30:00Z",
        unreadMessages: 0,
    },
    {
        id: "3",
        restaurantName: "Sushi Zen",
        restaurantImage: "/placeholder.svg?height=40&width=40",
        orderNumber: "#ORD-003",
        status: "on_the_way",
        items: [
            { name: "California Roll", quantity: 2, price: 24.98 },
            { name: "Miso Soup", quantity: 1, price: 4.99 },
        ],
        total: 29.97,
        orderTime: "2024-01-15T18:20:00Z",
        estimatedDelivery: "2024-01-15T19:05:00Z",
        unreadMessages: 1,
    },
]

export default function OrdersPage() {
    const ordersQuery = useGetOrdersQuery();
    const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null)
    const [isChatOpen, setIsChatOpen] = useState(false)

    const orders = ordersQuery.currentData?.contents ??[];

    const handleChatOpen = (order:  OrderResponse) => {
        setSelectedOrder(order)
        setIsChatOpen(true)
    }

    const handleChatClose = () => {
        setIsChatOpen(false)
        setSelectedOrder(null)
    }

    return (
        <div className="min-h-screen ">
            <div className="container mx-auto px-4 py-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
                    <p className="text-gray-600 mt-1">Track your orders and chat with restaurants</p>
                </div>

                <OrderList orders={orders} onChatOpen={handleChatOpen} />

                {/*{selectedOrder && <ChatDialog order={selectedOrder} isOpen={isChatOpen} onClose={handleChatClose} />}*/}
            </div>
        </div>
    )
}
