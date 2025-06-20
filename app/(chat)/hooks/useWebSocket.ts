import {useCallback, useEffect, useRef, useState} from 'react';
import {Client, Frame} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {getWebSocketUrl, STOMP_CONFIG} from '@/lib/config/config';
import {ChatState, IChatMessageDTO} from '@/app/(chat)/type/types';

const INITIAL_STATE: ChatState = {
    messages: [],
    isSending: false,
    connectionStatus: {
        isConnected: false,
        error: null
    }
};

interface IWebSocket {
    roomId?: string,
    subscribeUrl: string,
    publishUrl: string,
    open: boolean

}

export const useWebSocket = ({subscribeUrl, publishUrl, open}: IWebSocket) => {
    const [state, setState] = useState<ChatState>(INITIAL_STATE);
    const clientRef = useRef<Client | null>(null);

    const generateMessageId = useCallback(() => {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }, []);

    const connect = useCallback(() => {
        try {
            console.log('sub : ',subscribeUrl);
            console.log("url : ",publishUrl);
            const socket = new SockJS(getWebSocketUrl());

            socket.onclose = () => {
                setState(prev => ({
                    ...prev,
                    connectionStatus: {
                        isConnected: false,
                        error: 'Connection closed'
                    }
                }));
            };

            socket.onerror = () => {
                setState(prev => ({
                    ...prev,
                    connectionStatus: {
                        isConnected: false,
                        error: 'Connection error'
                    }
                }));
            };

            const stompClient = new Client({
                ...STOMP_CONFIG,
                webSocketFactory: () => socket,
                onConnect: (frame: Frame) => {
                    setState(prev => ({
                        ...prev,
                        connectionStatus: {
                            isConnected: true,
                            error: null
                        }
                    }));

                    stompClient.subscribe(subscribeUrl, (message) => {
                        try {
                            const receivedMessage = JSON.parse(message.body);
                            const messageId = receivedMessage.messageId ?? generateMessageId();

                            setState(prev => {
                                // Prevent duplicate messages
                                if (prev.messages.some(msg => msg.messageId === messageId)) {
                                    return prev;
                                }

                                return {
                                    ...prev,
                                    messages: [...prev.messages, {
                                        id:receivedMessage.id,
                                        content: receivedMessage.content,
                                        senderId: receivedMessage.senderId,
                                        senderName: receivedMessage.senderName ?? `User ${receivedMessage.senderId}`,
                                        timestamp: receivedMessage.timestamp ?? new Date().toISOString(),
                                        messageId
                                    }]
                                };
                            });
                            setState(prev => ({...prev, isSending: false}));
                        } catch (err) {
                            console.error('Error parsing message:', err);
                        }
                    });
                },
                onDisconnect: () => {
                    setState(prev => ({
                        ...prev,
                        connectionStatus: {
                            isConnected: false,
                            error: 'Disconnected from server'
                        }
                    }));
                    console.log("ws : onDisconnect")
                },
                onWebSocketError: () => {
                    setState(prev => ({
                        ...prev,
                        connectionStatus: {
                            isConnected: false,
                            error: 'Failed to connect to server'
                        }
                    }));
                    console.log("ws : onWebSocketError")
                },
                onStompError: () => {
                    setState(prev => ({
                        ...prev,
                        connectionStatus: {
                            isConnected: false,
                            error: 'STOMP protocol error'
                        }
                    }));
                    console.log("ws : onStompError")
                }
            });

            stompClient.activate();
            clientRef.current = stompClient;
        } catch (error) {
            setState(prev => ({
                ...prev,
                connectionStatus: {
                    isConnected: false,
                    error: 'Failed to create connection'
                }
            }));
        }
    }, [generateMessageId, open]);

    const sendMessage = useCallback(async (message: IChatMessageDTO) => {
        if (!clientRef.current?.active || !message.content.trim() || state.isSending) {
            return;
        }

        setState(prev => ({...prev, isSending: true}));

        try {
            console.log('sending ... ')
            const messageToSend = {
                ...message,
                messageId: generateMessageId(),
                timestamp: new Date().toISOString()
            };

            clientRef.current.publish({
                destination: publishUrl,
                body: JSON.stringify(messageToSend),
                headers: {'content-type': 'application/json'}
            });
        } catch (error) {
            setState(prev => ({
                ...prev,
                connectionStatus: {
                    ...prev.connectionStatus,
                    error: 'Failed to send message'
                }
            }));
        }
    }, [generateMessageId, state.isSending]);

    useEffect(() => {
        connect();

        return () => {
            if (clientRef.current?.active) {
                clientRef.current.deactivate();
            }
        };
    }, [connect]);

    return {
        ...state,
        sendMessage
    };
}; 