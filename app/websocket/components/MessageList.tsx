import React, { useEffect, useRef } from 'react';
import { IMessage } from '../types';
import { Sparkles, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MessageListProps {
    messages: IMessage[];
    currentUserId?: number;
}

const MessageItem = ({ msg, currentUserId }: { msg: IMessage; currentUserId?: number }) => {
    const content = (
        <div className={`relative group ${
            msg.senderId === currentUserId 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600' 
                : 'bg-gradient-to-r from-gray-700 to-gray-800'
        } rounded-2xl p-4 shadow-lg`}>
            {msg.senderId === currentUserId && (
                <Sparkles className="absolute -right-3 -top-2 w-4 h-4 text-yellow-400 opacity-75" />
            )}
            <div className="text-xs text-gray-300 mb-1 font-medium flex items-center gap-2">
                {msg.senderId === currentUserId ? (
                    <>
                        <Sun className="w-3 h-3 text-yellow-400" />
                        <span>You</span>
                    </>
                ) : (
                    <>
                        <Moon className="w-3 h-3 text-blue-400" />
                        <span>{msg.senderName || `Wanderer ${msg.senderId}`}</span>
                    </>
                )}
            </div>
            <div className="text-white whitespace-pre-wrap">{msg.content}</div>
            <div className="text-xs text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
        </div>
    );

    try {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
            >
                {content}
            </motion.div>
        );
    } catch {
        // Fallback without animation if framer-motion fails
        return (
            <div className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}>
                {content}
            </div>
        );
    }
};

export const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    if (messages.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center">
                <Moon className="w-12 h-12 text-indigo-400 animate-pulse mb-4" />
                <div className="text-indigo-300 text-center">
                    <p className="text-lg font-semibold mb-2">The realm awaits your first message...</p>
                    <p className="text-sm opacity-75">Begin your magical conversation</p>
                </div>
            </div>
        );
    }

    const scrollbarStyles = `
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar]:h-2
        [&::-webkit-scrollbar-track]:rounded-full
        [&::-webkit-scrollbar-track]:bg-gray-900/20
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-gradient-to-b 
        [&::-webkit-scrollbar-thumb]:from-indigo-500/50 
        [&::-webkit-scrollbar-thumb]:to-purple-500/50
        [&::-webkit-scrollbar-thumb]:border
        [&::-webkit-scrollbar-thumb]:border-indigo-900/50
        hover:[&::-webkit-scrollbar-thumb]:from-indigo-400/70 
        hover:[&::-webkit-scrollbar-thumb]:to-purple-400/70
        [&::-webkit-scrollbar-thumb]:shadow-lg
        [&::-webkit-scrollbar-thumb]:backdrop-blur-sm
        [&::-webkit-scrollbar-corner]:bg-transparent
    `;

    return (
        <div 
            ref={containerRef} 
            className={`h-full overflow-auto px-2 pb-2 relative ${scrollbarStyles}`}
        >
            <div className="space-y-4 min-h-full min-w-fit">
                <AnimatePresence>
                    {messages.map((msg) => (
                        <MessageItem 
                            key={msg.messageId} 
                            msg={msg} 
                            currentUserId={currentUserId} 
                        />
                    ))}
                </AnimatePresence>
            </div>
            <div ref={messagesEndRef} />
        </div>
    );
}; 