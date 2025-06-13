import React, {Dispatch, SetStateAction} from 'react';
import {Badge} from "@/components/ui/badge";
import {WifiIcon, WifiOff} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useGlobalState} from "@/hooks/useGlobalState";

interface ChatHeaderProp {
    isOwner: boolean,
    isConnected: boolean,
    setView: Dispatch<SetStateAction<"minimized" | "expanded">>
    view: "minimized" | "expanded",
    name: string,
    roomId: string
}

const ChatMessageHeader = ({isOwner, isConnected, setView, view, name, roomId}: ChatHeaderProp) => {
    const {chat} = useGlobalState();
    return <div className="p-3 border-b flex items-center justify-between bg-muted/50">
        <div className="flex items-center gap-2">
            <h3 className="font-semibold">{isOwner ? name : chat?.selectedOrder?.restaurant?.name ?? "Chat with Restaurant"}</h3>
            {isConnected ? (
                <Badge variant="default" className="bg-green-500">
                    <WifiIcon className="w-3 h-3 mr-1"/>
                    Connected
                </Badge>
            ) : (
                <Badge variant="destructive">
                    <WifiOff className="w-3 h-3 mr-1"/>
                    Disconnected
                </Badge>
            )}
            <Badge variant="default">Room : {roomId}</Badge>
        </div>
        {isOwner && (
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setView(view === 'minimized' ? 'expanded' : 'minimized')}
                >
                    {view === 'minimized' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 3h6v6M14 10l7-7M9 21H3v-6M10 14l-7 7"/>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path
                                d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3m8-3v3a2 2 0 0 0 2 2h3"/>
                        </svg>
                    )}
                </Button>
            </div>
        )}
    </div>
};

export default ChatMessageHeader;