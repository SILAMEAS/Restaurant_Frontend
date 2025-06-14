import React from 'react';
import { setChatSelected } from "@/lib/redux/counterSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch } from "@/lib/redux/hooks";
import { useGlobalState } from "@/hooks/useGlobalState";
import { ChatAsUI } from "@/app/(chat)/components/ChatList";
import { cn } from "@/lib/utils";

const ChatListItem = ({ chat }: { chat: ChatAsUI }) => {
    const dispatch = useAppDispatch();
    const { chatSelected } = useGlobalState();

    const getStatusColor = (status: string) => {
        switch (status) {
            case "online":
                return "bg-green-500";
            case "away":
                return "bg-yellow-500";
            case "offline":
            default:
                return "bg-gray-500";
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case "customer":
                return "bg-blue-600";
            case "support":
                return "bg-green-600";
            case "internal":
                return "bg-purple-600";
            default:
                return "bg-gray-600";
        }
    };

    const formattedTime = chat.timestamp
        ? new Date(chat.timestamp).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
        })
        : "";

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={() => dispatch(setChatSelected(chat))}
            className={cn(
                "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 mb-1",
                chatSelected?.id === chat?.id ? "bg-gray-700" : "hover:bg-gray-600"
            )}
        >
            {/* Avatar + Status Dot */}
            <div className="relative">
                <Avatar className="h-12 w-12">
                    <AvatarImage src={chat.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gray-600">
                        {chat.name
                            ? chat.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                            : "??"}
                    </AvatarFallback>
                </Avatar>
                <div
                    className={cn(
                        "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800",
                        getStatusColor(chat.status)
                    )}
                />
            </div>

            {/* Main Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium truncate">{chat.name || "Unknown"}</h3>
                    <span className="text-xs text-gray-400">{formattedTime}</span>
                </div>

                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-400 truncate">{chat.lastMessage}</p>
                    {chat.unreadCount > 0 && (
                        <Badge className="bg-blue-600 text-white text-xs ml-2">
                            {chat.unreadCount}
                        </Badge>
                    )}
                </div>

                <div className="mt-1">
                    <Badge
                        variant="secondary"
                        className={cn("text-xs text-white", getTypeColor(chat.type))}
                    >
                        {chat.type}
                    </Badge>
                </div>
            </div>
        </div>
    );
};

export default ChatListItem;
