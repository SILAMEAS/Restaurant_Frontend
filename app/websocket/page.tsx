'use client';

import React from 'react';
import { useGetMessagesQuery, useProfileQuery } from '@/lib/redux/api';
import { useWebSocket } from './hooks/useWebSocket';
import { MessageList } from './components/MessageList';
import { MessageInput } from './components/MessageInput';
import useParamQuery from '@/hooks/useParamQuery';
import { Shield, User, Home, Wifi, WifiOff } from 'lucide-react';
import { IMessage } from './types';

const WebSocketPage = () => {
    const { data: profile } = useProfileQuery();
    const roomId = '2_12'; // This could be dynamic based on your needs
    const {paramQuery}= useParamQuery();

    // Get messages from API
    const {data: messagesData}=useGetMessagesQuery({
        req:{
            params:{
                ...paramQuery,
                pageNo: 0,
                pageSize: 50,
                sortBy: 'id',
                sortOrder: 'asc'
            },
            caseIgnoreFilter:true
        },
        roomId
    });
    
    const {
        messages: wsMessages,
        isSending,
        connectionStatus: { isConnected, error },
        sendMessage
    } = useWebSocket(roomId);

    // Combine API messages with websocket messages and ensure type safety
    const allMessages: IMessage[] = [
        ...(messagesData?.contents || []).map((msg: any): IMessage => ({
            content: msg.content,
            timestamp: msg.timestamp,
            senderId: msg.senderId,
            senderName: msg.senderName,
            messageId: msg.messageId
        })),
        ...wsMessages
    ];

    return (
        <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 p-4 md:p-8">
            <div className="max-w-4xl mx-auto h-full flex flex-col">
                <div className={`mb-4 p-3 rounded-lg backdrop-blur-sm border flex-shrink-0
                    ${isConnected 
                        ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-300' 
                        : 'bg-red-900/20 border-red-500/30 text-red-300'
                    }`}
                >
                    <div className="flex items-center gap-2">
                        {isConnected ? (
                            <Wifi className="w-5 h-5 animate-pulse" />
                        ) : (
                            <WifiOff className="w-5 h-5" />
                        )}
                        <span className="font-medium">
                            {isConnected ? 'Connected to the Realm' : 'Disconnected from the Realm'}
                        </span>
                    </div>
                    {error && (
                        <div className="text-sm mt-2 text-red-400 pl-7">{error}</div>
                    )}
                </div>
                
                <h1 className="text-3xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 flex-shrink-0">
                    Mystic Messenger
                </h1>
                
                <div className="grid grid-cols-3 gap-4 mb-4 flex-shrink-0">
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-indigo-500/20">
                        <label className="text-xs text-indigo-300 mb-1 block">Identity</label>
                        <div className="flex items-center gap-2 text-white">
                            <User className="w-4 h-4 text-indigo-400" />
                            <span>{profile?.id}</span>
                        </div>
                    </div>
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-indigo-500/20">
                        <label className="text-xs text-indigo-300 mb-1 block">Title</label>
                        <div className="flex items-center gap-2 text-white">
                            <Shield className="w-4 h-4 text-purple-400" />
                            <span>{profile?.fullName}</span>
                        </div>
                    </div>
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-indigo-500/20">
                        <label className="text-xs text-indigo-300 mb-1 block">Chamber</label>
                        <div className="flex items-center gap-2 text-white">
                            <Home className="w-4 h-4 text-blue-400" />
                            <span>{roomId}</span>
                        </div>
                    </div>
                </div>
                
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg border border-indigo-500/20 flex-1 flex flex-col min-h-0">
                    <div className="flex-1 overflow-hidden p-6">
                        <MessageList 
                            messages={allMessages}
                            currentUserId={profile?.id}
                        />
                    </div>
                    
                    <div className="p-4 border-t border-indigo-500/20">
                        <MessageInput
                            onSendMessage={sendMessage}
                            isConnected={isConnected}
                            isSending={isSending}
                            userId={profile?.id}
                            roomId={roomId}
                            userName={profile?.fullName}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WebSocketPage;