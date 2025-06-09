"use client"

import {OrderList} from "@/components/(user)/order/components/OrderList";
import {useCreateOrGetRoomMutation, useGetOrdersQuery, useProfileQuery} from "@/lib/redux/api";
import {OrderResponse} from "@/lib/redux/type";
import {useAppDispatch} from "@/lib/redux/hooks";
import {setChat} from "@/lib/redux/counterSlice";
import {Slide, toast} from "react-toastify";
import {handleApiCall} from "@/lib/handleApiCall";

export default function OrdersPage() {
    const profileQuery = useProfileQuery();
    const ordersQuery = useGetOrdersQuery();
    const dispatch = useAppDispatch();

    const [createRoom]=useCreateOrGetRoomMutation();

    const orders = ordersQuery.currentData?.contents ?? [];

    return (
        <div className="min-h-screen ">
            <div className="container mx-auto px-4 py-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Orders</h1>
                    <p className="text-gray-600 mt-1">Track your orders and chat with restaurants</p>
                </div>

                <OrderList orders={orders} onChatOpen={async (order: OrderResponse) => {
                    const senderId =  profileQuery.currentData?.id;
                    const receiverId = order.restaurant.ownerId;
                    if(senderId&&receiverId) {
                        await handleApiCall({
                            apiFn: () => createRoom({senderId,receiverId}).unwrap(),
                            onSuccess: (r) => {
                                const roomId= `${senderId}_${receiverId}`
                                dispatch(setChat({isChatOpen: true, selectedOrder: order,roomId}));
                                toast.success(`Go to Room ${roomId}`, {
                                    theme: "dark",
                                    transition: Slide,
                                });
                            },
                            onError:(e)=>{
                                toast.error(`${e.data.message}`, {
                                    theme: "dark",
                                    transition: Slide,
                                });
                            }
                        });


                    }else {
                        toast.error(`${profileQuery?.error??"UNKNOWN ERROR"}`, {
                            theme: "dark",
                            transition: Slide,
                        });
                    }
                }}/>
            </div>
        </div>
    )
}
