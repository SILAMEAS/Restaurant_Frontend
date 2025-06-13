import {Role} from "@/lib/redux/counterSlice";

export interface IChatMessageDTO {
    content: string;
    senderId: number;
    roomId: string;
    senderName?: string;
    messageId?: string;
    timestamp?: string;
}

export interface IMessage {
    id: number;
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

export interface IMessageChatPopOver {
    id: string | number
    text: string
    username: string
    timestamp: number
    color: string
    isOwner?: boolean
    isPinned?: boolean
    status?: 'pending' | 'read' | 'replied'
    replyTo?: string
}

export interface UserChatPopOver {
    username: string
    color: string
    lastSeen: number
    role?: Role
    unreadCount?: number
    lastMessage?: string
}
