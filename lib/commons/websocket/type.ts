

export type ChatMessageDTO={
    id: string;
    content:string,
    sendId:number,
    roomId:string,
    timestamp:string,
    senderName:string
}

export type NotificationDTO={
    content:string,
    receiverId:number,
    type:string
}

export type AlertDTO={
    message:string,
    title:string
}

export interface IWebSocket<T> {
    subscribeUrl: string;
    publishUrl: string;
    open: boolean;
    parseMessage?: (raw: any) => T;
    onMessage?: (message: T) => void;
}

