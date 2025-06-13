import {OrderCard} from "@/app/(main)/order/components/OrderCart";
import {OrderResponse} from "@/lib/redux/services/type";

interface OrderListProps {
    orders: OrderResponse[]
    onChatOpen: (order: OrderResponse) => void
}

export function OrderList({orders, onChatOpen}: Readonly<OrderListProps>) {
    return (
        <div className="space-y-4">
            {orders?.map((order) => (
                <OrderCard key={order.id} order={order} onChatOpen={() => onChatOpen(order)}/>
            ))}
        </div>
    )
}
