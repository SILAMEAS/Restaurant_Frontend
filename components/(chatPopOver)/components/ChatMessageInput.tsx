import React, {useState} from 'react';
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Send} from "lucide-react";
import {IChatMessageDTO} from "@/components/(chatPopOver)/type/types";

interface ChatMessageInputProps{
    isConnected:boolean,
    isSending:boolean,
    isOwner:boolean,
    sendMessage:any,
    profile:any,
    roomId:any
}

const ChatMessageInput = ({isConnected,isSending,isOwner,sendMessage,profile,roomId}:ChatMessageInputProps) => {
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
    return  <div className="p-3 border-t bg-muted/30">
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
                className={isOwner ? "px-4 h-10" : "h-8 w-8 rounded-full"}
                disabled={!input.trim() || !isConnected || isSending}
            >
                {isOwner ? (isSending ? "Sending..." : "Send") : <Send className="h-4 w-4" />}
            </Button>
        </form>
    </div>
};

export default ChatMessageInput;