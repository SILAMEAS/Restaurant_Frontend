import React, {RefObject} from 'react';
import {IMessageChatPopOver, UserChatPopOver} from "@/app/(chat)/type/types";
import {IProfile} from "@/lib/redux/type";
import {formatDateTimeToPP} from "@/lib/commons/formatDateTimeToPP";

interface ChatMessageContentProps {
    allMessages: IMessageChatPopOver[]
    messagesEndRef: RefObject<HTMLDivElement | null>
    isOwner: boolean,
    profile?: IProfile,
    onlineUsers: UserChatPopOver[]

}

const ChatMessageContent = ({messagesEndRef, allMessages, isOwner}: ChatMessageContentProps) => {
    return <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {allMessages.map((message) => (
            <div
                key={message.id}
                className={`flex animate-in slide-in-from-${
                    message.isOwner ? "right" : "left"
                } duration-300 ${
                    message.isOwner ? "justify-end" : "justify-start"
                }`}
            >
                <div
                    className={`max-w-[80%] ${
                        message.isOwner ? "order-2" : "order-1"
                    }`}
                >
                    <div
                        className={`rounded-lg px-3 py-2 text-sm ${
                            message.isOwner
                                ? isOwner
                                    ? "bg-yellow-500 text-white"
                                    : "bg-primary text-primary-foreground"
                                : "bg-accent"
                        }`}
                    >
                        <p>{message.isOwner?message.username: message.username}</p>
                        {message.text}
                        <div className="text-[10px] opacity-70 mt-1">
                            {formatDateTimeToPP(message.timestamp)}
                        </div>
                    </div>
                </div>
            </div>
        ))}
        <div ref={messagesEndRef}/>
    </div>
};

export default ChatMessageContent;