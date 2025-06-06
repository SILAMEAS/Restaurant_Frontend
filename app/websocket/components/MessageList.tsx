import React, { useEffect, useRef } from 'react';
import { IMessage } from '../types';

interface MessageListProps {
    messages: IMessage[];
    currentUserId?: number;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    if (messages.length === 0) {
        return (
            <div className="h-80 flex items-center justify-center">
                <div className="text-gray-500 text-center py-4">No messages yet</div>
            </div>
        );
    }

    return (
        <div className="h-80 overflow-y-auto mb-4 border rounded p-2">
            {messages.map((msg) => (
                <div 
                    key={msg.messageId} 
                    className={`mb-2 p-2 rounded ${
                        msg.senderId === currentUserId 
                            ? 'bg-blue-100 ml-auto' 
                            : 'bg-gray-100'
                    } max-w-[80%]`}
                >
                    <div className="text-xs text-gray-600 mb-1">{msg.senderName}</div>
                    <div className="break-words">{msg.content}</div>
                    <div className="text-xs text-gray-500 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
}; 