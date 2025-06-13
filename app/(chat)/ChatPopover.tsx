"use client"

import React, {useEffect, useMemo, useRef, useState} from "react"
import {Button} from "@/components/ui/button"
import {MessageCircle} from "lucide-react"
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"
import {useGetMessagesQuery, useProfileQuery} from "@/lib/redux/api"
import {resetChatClosePopOver, Role} from "@/lib/redux/counterSlice"
import {useWebSocket} from "@/app/(chat)/hooks/useWebSocket"
import {IMessage, IMessageChatPopOver, UserChatPopOver} from "@/app/(chat)/type/types"
import ChatMessageHeader from "@/app/(chat)/components/ChatMessageHeader";
import ChatMessageContent from "@/app/(chat)/components/ChatMessageContent";
import ChatMessageInput from "@/app/(chat)/components/ChatMessageInput";
import SignalConnect from "@/app/(chat)/components/SignalConnect";
import {useAppDispatch, useAppSelector} from "@/lib/redux/hooks";
import ChatList from "@/app/(chat)/components/ChatList";
import {useGlobalState} from "@/hooks/useGlobalState";
import {store} from "@/lib/redux/store";
import {uniqueArray} from "@/lib/commons/uniqueArray";


export function ChatPopover() {
    const token = store.getState().counter.login?.accessToken;
    if (!token) {
        return <></>;
    }
    const {data: profile} = useProfileQuery();


    const [username, setUsername] = useState("")
    const [isUsernameSet, setIsUsernameSet] = useState(false)
    const [onlineUsers, setOnlineUsers] = useState<UserChatPopOver[]>([])
    const [userColor, setUserColor] = useState("")
    const {chat} = useAppSelector(state => state.counter);
    const [isOpen, setIsOpen] = useState(Boolean(chat?.isChatOpen))
    const [view, setView] = useState<'minimized' | 'expanded'>('minimized')
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const dispatch = useAppDispatch();
    const {chatSelected} = useGlobalState();


    // Owner credentials
    const isOwner = profile?.role === Role.OWNER
    const roomId = isOwner ? chatSelected?.roomId : chat?.roomId // This could be dynamic based on your needs
    const open = isOwner ? isOpen : chat?.isChatOpen ?? isOpen;

    console.log(open,isOwner,chatSelected?.roomId,chat?.roomId);


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
        roomId: roomId!
    }, {
        skip: !roomId || !open,
        refetchOnFocus: true
    });

    // WebSocket connection
    const {
        messages: wsMessages,
        isSending,
        connectionStatus: {isConnected},
        sendMessage
    } = useWebSocket({
        subscribeUrl: process.env.NEXT_PUBLIC_SUBSCRIBE_URL ?? "/",
        publishUrl: process.env.NEXT_PUBLIC_PUBLIC_URL ?? "/",
        open
    });

    // Combine API messages with websocket messages
    let allMessages = useMemo(() => {
        const apiMessages = (messagesData?.contents || []).map((msg: any): IMessageChatPopOver => ({
            id: msg.id,
            text: msg.content,
            username: msg.senderName ?? `UserChatPopOver ${msg.senderId}`,
            timestamp: new Date(msg.timestamp).getTime(),
            color: userColor,
            isOwner: msg.senderId === profile?.id
        }));

        const wsMessagesConverted = wsMessages.map((msg: IMessage): IMessageChatPopOver => ({
            id: msg.id,
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
        if (roomId || chat?.isChatOpen || open) {
            allMessages = []
        }
    }, [profile, roomId, chat?.isChatOpen, open]);

    console.log(allMessages)


    useEffect(() => {
        scrollToBottom();
    }, [allMessages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    };


    return (
        <Popover open={open} onOpenChange={() => {
            setIsOpen(!isOpen);
            dispatch(resetChatClosePopOver())

        }}>
            <PopoverTrigger asChild>
                <Button
                    disabled={!isOwner}
                    variant="outline"
                    size="icon"
                    className={
                        `h-10 w-10 rounded-full hover:bg-accent hover:text-accent-foreground relative border-2 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-800 light:hover:bg-gray-100 transition-all duration-200 shadow-sm hover:shadow-md
                    ${!isOwner ? 'invisible' : "visible"}`
                    }
                >
                    <MessageCircle className="h-5 w-5 dark:text-gray-300 light:text-gray-600"/>
                    {/** SignalConnect **/}
                    <SignalConnect isConnected={isConnected}/>
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className={`${view === 'expanded' ? 'w-[1400px]' : 'w-[1000px]'} p-0 flex h-[600px]`}
                align="end"
                side="left"
                sideOffset={20}
            >
                {
                    isOwner &&
                    <div className={'w-[40%] h-[100%]'}>
                        <ChatList/>
                    </div>
                }

                {
                    (chatSelected || !isOwner) ? <div className={'w-full bg-gray-800 h-[100%] '}>
                        <div className="flex w-[100%] h-[100%]">
                            <div className="flex-1 flex flex-col w-[100%]">
                                {/** Chat Header */}
                                {
                                    roomId &&
                                    <ChatMessageHeader isOwner={isOwner} isConnected={isConnected} setView={setView}
                                                       view={view} name={chatSelected?.name ?? "unknown"}
                                                       roomId={roomId}/>
                                }

                                {/** Chat Area */}
                                <ChatMessageContent isOwner={isOwner}
                                                    allMessages={uniqueArray<IMessageChatPopOver>(allMessages, 'id')}
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
                    </div> : <div className={'flex h-full items-center justify-center w-full'}>No Chat</div>
                }

            </PopoverContent>
        </Popover>
    )
}

//{!isUsernameSet ? (
//                             <TypingUsername username={username} setUsername={setUsername} profile={profile}
//                                             setIsUsernameSet={setIsUsernameSet} userColor={userColor} isOwner={isOwner}
//                                             setOnlineUsers={setOnlineUsers} setUserColor={setUserColor}/>
//                         ) : (
//                             <div className="flex w-[100%] h-[100%]">
//                                 <div className="flex-1 flex flex-col w-[100%]">
//
//                                     {/** Chat Header */}
//                                     {
//                                         roomId&&
//                                         <ChatMessageHeader isOwner={isOwner} isConnected={isConnected} setView={setView}
//                                                            view={view} name={chatSelected?.name??"unknown"} roomId={roomId}/>
//                                     }
//
//
//                                     {/** Chat Area */}
//                                     <ChatMessageContent isOwner={isOwner} allMessages={allMessages}
//                                                         messagesEndRef={messagesEndRef}
//                                                         profile={profile} onlineUsers={onlineUsers}/>
//
//                                     {/** Message Input **/}
//                                     <ChatMessageInput
//                                         isConnected={isConnected}
//                                         isSending={isSending} isOwner={isOwner}
//                                         profile={profile}
//                                         roomId={roomId}
//                                         sendMessage={sendMessage}
//                                     />
//
//                                 </div>
//                             </div>
//                         )}