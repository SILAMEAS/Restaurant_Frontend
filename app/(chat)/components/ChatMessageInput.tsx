import React, {useState} from 'react';
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Loader, Send} from "lucide-react";
import {IChatMessageDTO} from "@/app/(chat)/type/types";

interface ChatMessageInputProps {
    isConnected: boolean,
    isSending: boolean,
    isOwner: boolean,
    sendMessage: any,
    profile: any,
    roomId: any
}

const ChatMessageInput = ({isConnected, isSending, isOwner, sendMessage, profile, roomId}: ChatMessageInputProps) => {
    const [input, setInput] = useState("")
    const handleMessageSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (input.trim() && profile?.id) {
            const message: IChatMessageDTO = {
                content: input.trim(),
                senderId: profile.id,
                roomId,
                senderName: profile.fullName
            };

            sendMessage(message);
            setInput("");
        }
    }
    const handleQuickReply = (reply: string) => {
        setInput(reply)
    }
    return <div className="p-3 border-t bg-muted/30">
        <form
            onSubmit={handleMessageSubmit}
            className="flex items-center gap-2"
        >
            <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1"
                disabled={!isConnected || isSending}
            />
            <Button
                type="submit"
                className={"bg-inherit"}
                disabled={!input.trim() || !isConnected || isSending}
            >
                {isSending ? <Loader /> :<Send  className={'text-black dark:text-white'}/>}
            </Button>
        </form>
    </div>
};

export default ChatMessageInput;