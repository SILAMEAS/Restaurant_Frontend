"use client"

import React, {useEffect, useMemo, useRef, useState} from "react"
import {Button} from "@/components/ui/button"
import {Box, MessageCircle} from "lucide-react"
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"
import {useGetMessagesQuery, useProfileQuery} from "@/lib/redux/api"
import {resetChat, Role, setChat} from "@/lib/redux/counterSlice"
import {useWebSocket} from "@/components/(chatPopOver)/hooks/useWebSocket"
import {IMessage, IMessageChatPopOver, UserChatPopOver} from "@/components/(chatPopOver)/type/types"
import ChatMessageHeader from "@/components/(chatPopOver)/components/ChatMessageHeader";
import ChatMessageContent from "@/components/(chatPopOver)/components/ChatMessageContent";
import ChatMessageInput from "@/components/(chatPopOver)/components/ChatMessageInput";
import TypingUsername from "@/components/(chatPopOver)/components/TypingUsername";
import SignalConnect from "@/components/(chatPopOver)/components/SignalConnect";
import {useAppDispatch, useAppSelector} from "@/lib/redux/hooks";
import ChatList from "@/components/(chatPopOver)/components/ChatList";
import {useGlobalState} from "@/hooks/useGlobalState";


export function ChatPopover() {
    const {data: profile} = useProfileQuery();


    const [username, setUsername] = useState("")
    const [isUsernameSet, setIsUsernameSet] = useState(false)
    const [onlineUsers, setOnlineUsers] = useState<UserChatPopOver[]>([])
    const [userColor, setUserColor] = useState("")
    const {chat}=useAppSelector(state=>state.counter);
    const [isOpen, setIsOpen] = useState(Boolean(chat?.isChatOpen))
    const [view, setView] = useState<'minimized' | 'expanded'>('minimized')
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const dispatch = useAppDispatch();
    const {chatSelected}=useGlobalState();



    // Owner credentials
    const isOwner = profile?.role === Role.OWNER
    const roomId =chat?.roomId?? '2_12' // This could be dynamic based on your needs

    // Get messages from API
    const {data: messagesData} = useGetMessagesQuery({
        req: {
            params: {
                pageNo: 0,
                pageSize: 50,
                sortBy: 'id',
                sortOrder: 'asc'
            },
            caseIgnoreFilter: true
        },
        roomId
    });

    // WebSocket connection
    const {
        messages: wsMessages,
        isSending,
        connectionStatus: {isConnected},
        sendMessage
    } = useWebSocket({roomId,subscribeUrl:'/topic/messages',publishUrl:'/app/chat/send'});

    // Combine API messages with websocket messages
    const allMessages = useMemo(() => {
        const apiMessages = (messagesData?.contents || []).map((msg: any): IMessageChatPopOver => ({
            id: msg.messageId,
            text: msg.content,
            username: msg.senderName ?? `UserChatPopOver ${msg.senderId}`,
            timestamp: new Date(msg.timestamp).getTime(),
            color: userColor,
            isOwner: msg.senderId === profile?.id
        }));

        const wsMessagesConverted = wsMessages.map((msg: IMessage): IMessageChatPopOver => ({
            id: msg.messageId,
            text: msg.content,
            username: msg.senderName ?? `UserChatPopOver ${msg.senderId}`,
            timestamp: new Date(msg.timestamp).getTime(),
            color: userColor,
            isOwner: msg.senderId === profile?.id
        }));

        return [...apiMessages, ...wsMessagesConverted];
    }, [messagesData, wsMessages, profile?.id, userColor]);


    useEffect(() => {
        if (profile) {
            setUsername(profile.fullName);
            setIsUsernameSet(true);
        }
    }, [profile]);

    useEffect(() => {
        scrollToBottom();
    }, [allMessages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    };

    useEffect(() => {
        if (!isOpen) {
            dispatch(resetChat());
        }
    }, [isOpen]);
console.log('view',view)
    return (
        <Popover open={isOwner?isOpen: chat?.isChatOpen?? isOpen} onOpenChange={()=>{
            setIsOpen(!isOpen);
            dispatch(setChat({isChatOpen:false}))
        }}>
            <PopoverTrigger asChild>
                <Button
                    disabled={!isOwner}
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full hover:bg-accent hover:text-accent-foreground relative border-2 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-800 light:hover:bg-gray-100 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                    <MessageCircle className="h-5 w-5 dark:text-gray-300 light:text-gray-600"/>
                    {/** SignalConnect **/}
                    <SignalConnect isConnected={isConnected}/>
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className={`${view==='expanded'? 'w-[1400px]' : 'w-[1000px]'} p-0 flex`}
                align="end"
                side="left"
                sideOffset={20}
            >
               <div className={'w-[40%]'}>
                   <ChatList/>
               </div>
            <div className={'w-full bg-gray-800'}>
                {!isUsernameSet ? (
                    <TypingUsername username={username} setUsername={setUsername} profile={profile}
                                    setIsUsernameSet={setIsUsernameSet} userColor={userColor} isOwner={isOwner}
                                    setOnlineUsers={setOnlineUsers} setUserColor={setUserColor}/>
                ) : (
                    <div className="flex h-[600px] w-[100%]">
                        <div className="flex-1 flex flex-col w-[100%]">

                            {/** Chat Header */}
                            <ChatMessageHeader isOwner={isOwner} isConnected={isConnected} setView={setView}
                                               view={view} name={chatSelected?.name??"unknown"}/>

                            <p>Room : {roomId}</p>

                            {/** Chat Area */}
                            <ChatMessageContent isOwner={isOwner} allMessages={allMessages}
                                                messagesEndRef={messagesEndRef}
                                                profile={profile} onlineUsers={onlineUsers}/>

                            {/** Message Input **/}
                            <ChatMessageInput
                                isConnected={isConnected}
                                isSending={isSending} isOwner={isOwner}
                                profile={profile}
                                roomId={roomId}
                                sendMessage={sendMessage}
                            />

                        </div>
                    </div>
                )}
            </div>
            </PopoverContent>
        </Popover>
    )
} 