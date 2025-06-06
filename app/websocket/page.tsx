'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Client, Frame, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useGlobalState } from '@/hooks/useGlobalState';
import { useProfileQuery } from '@/lib/redux/api';

interface IChatMessageDTO{
    content:string;
    senderId:number;
    roomId:string;
    senderName?: string;
}

interface IMessage {
    content: string;
    timestamp: string;
    senderId: number;
    senderName?: string;
}

const WebSocketPage = () => {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [client, setClient] = useState<Client | null>(null);
    const {data:profile}= useProfileQuery();
    const [chatDTO, setChatDTO] = useState<IChatMessageDTO>({
        content: '',
        senderId: 0,
        roomId: '2-12',
    });
    const clientRef = React.useRef<Client | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [connectionError, setConnectionError] = useState<string | null>(null);

    useEffect(() => {
        const connect = () => {
            console.log("Starting WebSocket connection...");
            
            const socket = new SockJS('http://localhost:5000/ws-chat');
            
            const stompClient = new Client({
                webSocketFactory: () => socket,
                debug: (str) => {
                    console.log('STOMP Debug:', str);
                },
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
                onConnect: (frame: Frame) => {
                    console.log('STOMP Connected:', frame);
                    setIsConnected(true);
                    setConnectionError(null);

                    // Subscribe to the messages topic
                    stompClient.subscribe('/topic/messages', (message: Message) => {
                        console.log('Raw message received:', message);
                        try {
                            const receivedMessage = JSON.parse(message.body);
                            console.log('Parsed message:', receivedMessage);
                            
                            // Add the message to state with all required fields
                            setMessages(prev => [...prev, {
                                content: receivedMessage.content,
                                senderId: receivedMessage.senderId,
                                senderName: receivedMessage.senderName || `User ${receivedMessage.senderId}`,
                                timestamp: receivedMessage.timestamp || new Date().toISOString()
                            }]);
                        } catch (err) {
                            console.error('Error parsing message:', err);
                            console.error('Raw message:', message);
                        }
                    });
                    console.log('Subscribed to /topic/messages');
                },
                onDisconnect: () => {
                    console.log('STOMP Disconnected');
                    setIsConnected(false);
                    setConnectionError('Disconnected from server');
                },
                onWebSocketError: (event) => {
                    console.error('WebSocket Error:', event);
                    setIsConnected(false);
                    setConnectionError('Failed to connect to server');
                },
                onStompError: (frame) => {
                    console.error('STOMP Error:', frame);
                    setIsConnected(false);
                    setConnectionError('STOMP protocol error');
                }
            });

            console.log('Activating STOMP client...');
            stompClient.activate();
            clientRef.current = stompClient;
            setClient(stompClient);
        };

        connect();

        return () => {
            console.log('Cleaning up connection...');
            if (clientRef.current?.active) {
                clientRef.current.deactivate();
            }
        };
    }, []);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!client || !client.active || !chatDTO.content.trim()) {
            console.log('Cannot send message:', {
                clientExists: !!client,
                clientActive: client?.active,
                hasContent: !!chatDTO.content.trim()
            });
            return;
        }

        const messageToSend = {
            content: chatDTO.content,
            senderId: profile?.id,
            roomId: chatDTO.roomId,
            senderName: profile?.fullName,
            timestamp: new Date().toISOString()
        };

        try {
            console.log('Attempting to send message:', messageToSend);
            client.publish({
                destination: '/app/chat/send',
                body: JSON.stringify(messageToSend),
                headers: {
                    'content-type': 'application/json'
                }
            });
            console.log('Message sent successfully');
            
            // Immediately add the sent message to the local state
            setMessages(prev => [...prev, {
                content: messageToSend.content,
                senderId: messageToSend.senderId!,
                senderName: messageToSend.senderName,
                timestamp: messageToSend.timestamp
            }]);
            
            setChatDTO(prev => ({
                ...prev,
                content: ''
            }));
        } catch (error) {
            console.error('Failed to send message:', error);
            setConnectionError('Failed to send message');
        }
    };

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <div className={`mb-4 p-2 rounded ${isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                Connection Status: {isConnected ? 'Connected' : 'Disconnected'}
                {connectionError && <div className="text-sm mt-1">{connectionError}</div>}
            </div>
            
            <h1 className="text-2xl font-bold mb-4">WebSocket Chat</h1>
            <div className='flex gap-2 mb-4'>
                <div>
                    <label htmlFor="senderId" className="block">Sender</label>
                    <input type="text" value={profile?.id} className="border rounded px-2 py-1" readOnly />
                </div>
                <div>
                    <label htmlFor="name" className="block">Name</label>
                    <input type="text" value={profile?.fullName} className="border rounded px-2 py-1" readOnly />
                </div>
                <div>
                    <label htmlFor="room" className="block">Room</label>
                    <input type="text" value={chatDTO.roomId} className="border rounded px-2 py-1" readOnly />
                </div>
            </div>
            
            <div className="bg-white shadow rounded-lg p-4 mb-4">
                <div className="h-80 overflow-y-auto mb-4 border rounded p-2">
                    {messages.length === 0 ? (
                        <div className="text-gray-500 text-center py-4">No messages yet</div>
                    ) : (
                        messages.map((msg, i) => (
                            <div 
                                key={i} 
                                className={`mb-2 p-2 rounded ${
                                    msg.senderId === profile?.id 
                                        ? 'bg-blue-100 ml-auto' 
                                        : 'bg-gray-100'
                                } max-w-[80%]`}
                            >
                                <div className="text-xs text-gray-600 mb-1">{msg.senderName}</div>
                                <div>{msg.content}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                </div>
                            </div>
                        ))
                    )}
                </div>
                
                <form onSubmit={sendMessage} className="flex gap-2">
                    <input
                        type="text"
                        value={chatDTO.content}
                        onChange={(e) => {
                            setChatDTO({
                                ...chatDTO,
                                content: e.target.value
                            })
                        }}
                        className="flex-1 border rounded px-2 py-1"
                        placeholder="Type your message..."
                        disabled={!isConnected}
                    />
                    <button 
                        type="submit"
                        className={`px-4 py-1 rounded ${
                            isConnected 
                                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={!isConnected}
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default WebSocketPage;