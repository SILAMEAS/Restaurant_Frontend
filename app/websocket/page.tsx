'use client';

import React from 'react';
import { useGetMessagesQuery, useProfileQuery } from '@/lib/redux/api';
import { useWebSocket } from './hooks/useWebSocket';
import { MessageList } from './components/MessageList';
import { MessageInput } from './components/MessageInput';
import useParamQuery from '@/hooks/useParamQuery';

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

    // Combine API messages with websocket messages
    const allMessages = [
        ...(messagesData?.contents || []),
        ...wsMessages
    ];

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <div className={`mb-4 p-2 rounded ${isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                Connection Status: {isConnected ? 'Connected' : 'Disconnected'}
                {error && <div className="text-sm mt-1">{error}</div>}
            </div>
            
            <h1 className="text-2xl font-bold mb-4">WebSocket Chat</h1>
            
            <div className="flex gap-2 mb-4">
                <div>
                    <label htmlFor="senderId" className="block">Sender</label>
                    <input 
                        type="text" 
                        value={profile?.id} 
                        className="border rounded px-2 py-1" 
                        readOnly 
                    />
                </div>
                <div>
                    <label htmlFor="name" className="block">Name</label>
                    <input 
                        type="text" 
                        value={profile?.fullName} 
                        className="border rounded px-2 py-1" 
                        readOnly 
                    />
                </div>
                <div>
                    <label htmlFor="room" className="block">Room</label>
                    <input 
                        type="text" 
                        value={roomId} 
                        className="border rounded px-2 py-1" 
                        readOnly 
                    />
                </div>
            </div>
            
            <div className="bg-white shadow rounded-lg p-4 mb-4">
                <MessageList 
                    messages={allMessages}
                    currentUserId={profile?.id}
                />
                
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
    );
};

export default WebSocketPage;