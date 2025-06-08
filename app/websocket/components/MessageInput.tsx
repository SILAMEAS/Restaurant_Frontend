import React, { useState } from 'react';
import { IChatMessageDTO } from '../../../components/(chatPopOver)/type/types';
import { Send, Loader2, Sparkles } from 'lucide-react';

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
        <form onSubmit={handleSubmit} className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={`w-full pl-12 pr-24 py-3 bg-gradient-to-r from-gray-800/50 to-indigo-900/50 
                    border border-indigo-500/30 rounded-full text-white placeholder-indigo-300/50
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent
                    transition-all duration-300 backdrop-blur-sm
                    ${!isConnected || isSending ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
                placeholder="Cast your message into the realm..."
                disabled={!isConnected || isSending}
            />
            <button 
                type="submit"
                className={`absolute right-2 top-1/2 -translate-y-1/2
                    px-4 py-1.5 rounded-full flex items-center gap-2
                    transition-all duration-300
                    ${isConnected && !isSending
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                disabled={!isConnected || isSending}
            >
                {isSending ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending</span>
                    </>
                ) : (
                    <>
                        <Send className="w-4 h-4" />
                        <span>Send</span>
                    </>
                )}
            </button>
        </form>
    );
}; 