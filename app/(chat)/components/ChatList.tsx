import React, {useEffect, useMemo, useState} from 'react';
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Plus, Search, Settings} from "lucide-react"
import {useDispatch} from "react-redux";
import {setChatSelected} from "@/lib/redux/counterSlice";
import {useListRoomsQuery, useProfileQuery} from "@/lib/redux/services/api";
import {useGlobalState} from "@/hooks/useGlobalState";
import ChatListItem from "@/app/(chat)/components/ChatListItem";

export interface ChatAsUI {
    roomId: string;
    id: string
    name: string
    lastMessage: string
    timestamp: string
    unreadCount: number
    status: "online" | "offline" | "away"
    avatar?: string
    type: "customer" | "internal" | "support"
}

const ChatList = () => {
    const profileQuery = useProfileQuery();
    const profile = profileQuery?.currentData;
    const chatListQuery = useListRoomsQuery({}, {refetchOnMountOrArgChange: true});
    const chatRooms: ChatAsUI[] | [] = useMemo(() => {
        return chatListQuery?.currentData?.contents?.map(i => {
            return {
                roomId: i.roomId,
                id: i.id,
                name: i.members.filter(m => m.id !== profile?.id)[0].fullName,
                lastMessage: "I've escalated your issue to our team",
                timestamp: "3 hours ago",
                unreadCount: 2,
                status: "online",
                type: "internal",
            } as ChatAsUI;
        }) ?? [];
    }, [chatListQuery?.currentData]);
    // const [selectedChat, setSelectedChat] = useState<Chat|null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const dispatch = useDispatch();


    const filteredChats = chatRooms?.filter(
        (chat) =>
            chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
    )


    useEffect(() => {
        if (chatRooms?.length > 0) {
            dispatch(setChatSelected(chatRooms[0]))
        }
    }, [chatRooms])

    return <div className={'flex w-[100%] flex-col bg-inherit h-[100%]'}>
        <div className="bg-inherit border-r border-gray-700 flex flex-col w-[100%] h-[100%]">
            {/* Header */}
            <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-semibold">Chats</h1>
                    <div className="flex gap-2">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Plus className="h-4 w-4"/>
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Settings className="h-4 w-4"/>
                        </Button>
                    </div>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
                    <Input
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                </div>
            </div>

            {/* Chat List */}
            <ScrollArea className="flex-1  w-[100%]">
                <div className="p-2">
                    {filteredChats?.map((chat) => (
                        <ChatListItem chat={chat} key={chat.id}/>
                    ))}
                </div>
            </ScrollArea>
        </div>

    </div>
};

export default ChatList;