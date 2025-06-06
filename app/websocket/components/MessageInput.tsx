import React, { useState } from 'react';
import { IChatMessageDTO } from '../types';

interface MessageInputProps {
    onSendMessage: (message: IChatMessageDTO) => void;
    isConnected: boolean;
    isSending: boolean;
    userId?: number;
    roomId: string;
    userName?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
    onSendMessage,
    isConnected,
    isSending,
    userId,
    roomId,
    userName
}) => {
    const [content, setContent] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!content.trim() || !userId) return;

        onSendMessage({
            content: content.trim(),
            senderId: userId,
            roomId,
            senderName: userName
        });

        setContent('');
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="flex-1 border rounded px-2 py-1"
                placeholder="Type your message..."
                disabled={!isConnected || isSending}
            />
            <button 
                type="submit"
                className={`px-4 py-1 rounded ${
                    isConnected && !isSending
                        ? 'bg-blue-500 text-white hover:bg-blue-600' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!isConnected || isSending}
            >
                {isSending ? 'Sending...' : 'Send'}
            </button>
        </form>
    );
}; 