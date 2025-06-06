'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useGlobalState } from '@/hooks/useGlobalState';
import { useProfileQuery } from '@/lib/redux/api';
import { log } from 'console';

interface IChatMessageDTO{
    content:string;
    senderId:number;
    roomId:string;
}

const WebSocketPage = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [client, setClient] = useState<Client | null>(null);
    // const [inputMessage, setInputMessage] = useState('');
    const {data:profile}= useProfileQuery();
    const [chatDTO, setChatDTO] = useState<IChatMessageDTO>({
        content: '',
        senderId: 0,
        roomId: '2-12',
    });
    const clientRef = React.useRef<Client | null>(null);



    useEffect(() => {
        const url = process.env.NEXT_PUBLIC_BASE_URL?.replace('http://', 'ws://')+'/ws-chat';
        // Create the SockJS client and STOMP client
        const stompClient = new Client({
            brokerURL: url,
            debug: (str) => {
                console.log(str);
            },
            onUnhandledFrame: (frame) => {
                console.log("unhandledframe",frame);
            },
            onConnect: () => {
                console.log('Connected to the server');
                // Subscribe to topic
                stompClient.subscribe('/topic/messages', (message) => {
                    console.log("message",message);
                    // if (message.body) {
                    //     setMessages((prev) => [...prev, JSON.parse(message.body).content]);
                    // }
                });
            },
            onUnhandledMessage: (message) => {
                console.log("unhandledmessage",message);
            },
            onChangeState(state) {
                console.log("state",state);
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
        });


        clientRef.current = stompClient;

        stompClient.activate();
        setClient(stompClient);

        // Cleanup on unmount
        return () => {
            if (stompClient) {
                stompClient.deactivate();
            }
        };
    }, []);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (client) {
            client.publish({
                destination: '/app/chat.send',
                body: JSON.stringify({...chatDTO,senderId:profile?.id}),
            });
            setChatDTO({
                content: '',
                senderId: NaN,
                roomId: '2-12'
            });
        }
    };
  
    React.useEffect(()=>{
        if(profile){
            setChatDTO({
                ...chatDTO,
                senderId: profile.id
            })
        }
    },[profile])
    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">WebSocket Chat</h1>
                <div className='flex gap-2'>
                   <div>
                    <label htmlFor="senderId">Sender</label>
                    <input type="text" value={profile?.id}/>
                   </div>
                    <div>
                        <label htmlFor="senderId">Name</label>
                        <input type="text" value={profile?.fullName}/>
                    </div>
                    <div>
                    <label htmlFor="senderId">Room</label>
                    <input type="text" value={chatDTO.roomId}/>
                    </div>
                </div>
            
            
            <div className="bg-white shadow rounded-lg p-4 mb-4">
                <div className="h-80 overflow-y-auto mb-4 border rounded p-2">
                    {messages.map((msg, i) => (
                        <div key={i} className="mb-2 p-2 bg-gray-100 rounded">
                            {msg}
                        </div>
                    ))}
                </div>
                
                <form onSubmit={sendMessage} className="flex gap-2">
                    <input
                        type="text"
                        value={chatDTO.content}
                        onChange={(e) =>{
                            setChatDTO({
                                ...chatDTO,
                                content: e.target.value
                            })  
                        }}
                        className="flex-1 border rounded px-2 py-1"
                        placeholder="Type your message..."
                    />
                    <button 
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default WebSocketPage;