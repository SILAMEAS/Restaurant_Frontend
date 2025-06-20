"use client"

import {OrderList} from "@/app/(main)/order/components/OrderList";
import {useCreateOrGetRoomMutation, useGetOrdersQuery, useProfileQuery} from "@/lib/redux/services/api";
import {OrderResponse} from "@/lib/redux/services/type";
import {useAppDispatch} from "@/lib/redux/hooks";
import {setChat, setChatSelected} from "@/lib/redux/counterSlice";
import {Slide, toast} from "react-toastify";
import {ChatAsUI} from "@/app/(chat)/components/ChatList";
import EmptyOrder from "@/app/(main)/order/EmptyOrder";

export default function OrdersPage() {
    const profileQuery = useProfileQuery();
    const ordersQuery = useGetOrdersQuery({},{refetchOnMountOrArgChange:true});
    const dispatch = useAppDispatch();

    const [createRoom] = useCreateOrGetRoomMutation();

    const orders = ordersQuery.currentData?.contents ?? [];

    if(orders.length === 0) {
        return <EmptyOrder/>
    }

    return (
        <div className="min-h-screen ">
            <div className="container mx-auto px-4 py-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Orders</h1>
                    <p className="text-gray-600 mt-1">Track your orders and chat with restaurants</p>
                </div>

                <OrderList orders={orders} onChatOpen={async (order: OrderResponse) => {
                    const senderId = profileQuery.currentData?.id;
                    const receiverId = order.restaurant.ownerId;
                    if (senderId && receiverId) {
                        try {
                            const {id} = await createRoom({senderId, receiverId}).unwrap();
                            const roomId = `${senderId}_${receiverId}`
                            dispatch(setChat({isChatOpen: true, selectedOrder: order, roomId}));
                            dispatch(setChatSelected({
                                roomId: roomId,
                                id:`${id}`,
                                name: order.restaurant.name,
                                lastMessage: "I've escalated your issue to our team",
                                timestamp: "3 hours ago",
                                unreadCount: 2,
                                status: "online",
                                type: "customer",
                            } as ChatAsUI))
                        } catch (e: any) {
                            return toast.error(`${e.data.message}`, {
                                theme: "dark",
                                transition: Slide,
                            });
                        }

                    } else {
                        toast.error(`${profileQuery?.error}`, {
                            theme: "dark",
                            transition: Slide,
                        });
                    }
                }}/>
            </div>
        </div>
    )
}
