export interface OrderItem {
    name: string
    quantity: number
    price: number
}

export interface Order {
    id: string
    restaurantName: string
    restaurantImage: string
    orderNumber: string
    status: "preparing" | "on_the_way" | "delivered" | "cancelled"
    items: OrderItem[]
    total: number
    orderTime: string
    estimatedDelivery: string
    unreadMessages: number
}
