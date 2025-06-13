import React, {useEffect, useMemo, useState} from 'react';
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Plus, Search, Settings} from "lucide-react"
import {useDispatch} from "react-redux";
import {setChatSelected} from "@/lib/redux/counterSlice";
import {useListRoomsQuery, useProfileQuery} from "@/lib/redux/api";
import {useGlobalState} from "@/hooks/useGlobalState";

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
    const {chatSelected} = useGlobalState();
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
    const getStatusColor = (status: string) => {
        switch (status) {
            case "online":
                return "bg-green-500"
            case "away":
                return "bg-yellow-500"
            case "offline":
                return "bg-gray-500"
            default:
                return "bg-gray-500"
        }
    }
    const getTypeColor = (type: string) => {
        switch (type) {
            case "customer":
                return "bg-blue-600"
            case "support":
                return "bg-green-600"
            case "internal":
                return "bg-purple-600"
            default:
                return "bg-gray-600"
        }
    }

    useEffect(() => {
        if (chatRooms?.length > 0) {
            dispatch(setChatSelected(chatRooms[0]))
        }
    }, [chatRooms])

    return <div className={'flex w-[100%] flex-col bg-amber-300 h-[100%]'}>
        <div className="bg-gray-800 border-r border-gray-700 flex flex-col w-[100%] h-[100%]">
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
                        <div
                            key={chat?.id}
                            onClick={() => dispatch(setChatSelected(chat))}
                            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors mb-1 ${
                                chatSelected?.id === chat?.id ? "bg-gray-700" : "hover:bg-gray-750"
                            }`}
                        >
                            <div className="relative">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={chat.avatar || "/placeholder.svg"}/>
                                    <AvatarFallback className="bg-gray-600">
                                        {chat.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div
                                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800 ${getStatusColor(chat.status)}`}
                                />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="font-medium truncate">{chat.name}</h3>
                                    <span className="text-xs text-gray-400">{chat.timestamp}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-400 truncate">{chat.lastMessage}</p>
                                    {chat.unreadCount > 0 && (
                                        <Badge
                                            className="bg-blue-600 text-white text-xs ml-2">{chat.unreadCount}</Badge>
                                    )}
                                </div>
                                <div className="mt-1">
                                    <Badge variant="secondary"
                                           className={`text-xs ${getTypeColor(chat.type)} text-white`}>
                                        {chat.type}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>

    </div>
};

export default ChatList;