export interface IChatMessageDTO {
    content: string;
    senderId: number;
    roomId: string;
    senderName?: string;
    messageId?: string;
    timestamp?: string;
}

export interface IMessage {
    content: string;
    timestamp: string;
    senderId: number;
    senderName?: string;
    messageId: string;
}

export interface ConnectionStatus {
    isConnected: boolean;
    error: string | null;
}

export interface ChatState {
    messages: IMessage[];
    isSending: boolean;
    connectionStatus: ConnectionStatus;
} 