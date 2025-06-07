"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, Users, X, Wifi, WifiOff } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { MessageCircle } from "lucide-react"
import { useGlobalState } from "@/hooks/useGlobalState"
import { useProfileQuery, useGetMessagesQuery } from "@/lib/redux/api"
import { Role } from "@/lib/redux/counterSlice"
import { useWebSocket } from "@/app/websocket/hooks/useWebSocket"
import { IMessage, IChatMessageDTO } from "@/app/websocket/types"

interface Message {
  id: string
  text: string
  username: string
  timestamp: number
  color: string
  isOwner?: boolean
  isPinned?: boolean
  status?: 'pending' | 'read' | 'replied'
  replyTo?: string
}

interface User {
  username: string
  color: string
  lastSeen: number
  role?: Role
  unreadCount?: number
  lastMessage?: string
}

export function ChatPopover() {
  const { data: profile } = useProfileQuery();
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [username, setUsername] = useState("")
  const [isUsernameSet, setIsUsernameSet] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<User[]>([])
  const [userColor, setUserColor] = useState("")
  const [showUserList, setShowUserList] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [pinnedMessage, setPinnedMessage] = useState<Message | null>(null)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [view, setView] = useState<'minimized' | 'expanded'>('minimized')
  const [quickReplies] = useState([
    "Thank you for your message! How can I help you today?",
    "I'll check and get back to you shortly.",
    "Would you like to make a reservation?",
    "Please let me know if you need anything else.",
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Owner credentials
  const isOwner = profile?.role === Role.OWNER
  const roomId = '2_12' // This could be dynamic based on your needs

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
    connectionStatus: { isConnected, error },
    sendMessage
  } = useWebSocket(roomId);

  // Combine API messages with websocket messages
  const allMessages = useMemo(() => {
    const apiMessages = (messagesData?.contents || []).map((msg: any): Message => ({
      id: msg.messageId,
      text: msg.content,
      username: msg.senderName || `User ${msg.senderId}`,
      timestamp: new Date(msg.timestamp).getTime(),
      color: userColor,
      isOwner: msg.senderId === profile?.id
    }));

    const wsMessagesConverted = wsMessages.map((msg: IMessage): Message => ({
      id: msg.messageId,
      text: msg.content,
      username: msg.senderName || `User ${msg.senderId}`,
      timestamp: new Date(msg.timestamp).getTime(),
      color: userColor,
      isOwner: msg.senderId === profile?.id
    }));

    return [...apiMessages, ...wsMessagesConverted];
  }, [messagesData, wsMessages, profile?.id, userColor]);

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && profile?.id) {
      const message: IChatMessageDTO = {
        content: input.trim(),
        senderId: profile.id,
        roomId,
        senderName: profile.fullName
      };

      sendMessage(message);
      setInput("");
    }
  }

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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const colors = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
    "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9",
  ]

  const filteredMessages = useMemo(() => {
    if (!isOwner || !selectedUser) {
      return messages.filter(m => 
        !isOwner || m.username === username 
      )
    }
    return messages.filter(m => 
      m.username === selectedUser 
    )
  }, [messages, isOwner, selectedUser, username])

  const userChats = useMemo(() => {
    if (!isOwner) return []
    const chats: { [key: string]: User & { messages: Message[] } } = {}
    
    messages.forEach(message => {
      if (!isOwner) {
        if (!chats[message.username]) {
          const user = onlineUsers.find(u => u.username === message.username) || {
            username: message.username,
            color: message.color,
            lastSeen: message.timestamp,
            unreadCount: 0
          }
          chats[message.username] = {
            ...user,
            messages: [],
            lastMessage: message.text,
            unreadCount: message.status === 'pending' ? 1 : 0
          }
        }
        chats[message.username].messages.push(message)
        if (message.status === 'pending') {
          chats[message.username].unreadCount = (chats[message.username].unreadCount || 0) + 1
        }
      }
    })

    return Object.values(chats).sort((a, b) => {
      const aLastMessage = a.messages[a.messages.length - 1]
      const bLastMessage = b.messages[b.messages.length - 1]
      return bLastMessage.timestamp - aLastMessage.timestamp
    })
  }, [messages, onlineUsers, isOwner])

  const filteredChats = useMemo(() => {
    return userChats.filter(chat => 
      chat.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (chat.lastMessage || "").toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [userChats, searchQuery])

  const updateUserPresence = () => {
    const savedUsers = localStorage.getItem("chat-users")
    const users: User[] = savedUsers ? JSON.parse(savedUsers) : []

    const userIndex = users.findIndex((u) => u.username === username)
    const currentUser: User = { 
      username, 
      color: userColor, 
      lastSeen: Date.now(),
      role: profile?.role as Role
    }

    if (userIndex >= 0) {
      users[userIndex] = currentUser
    } else {
      users.push(currentUser)
    }

    localStorage.setItem("chat-users", JSON.stringify(users))
    setOnlineUsers(users)
  }

  const cleanupOfflineUsers = () => {
    const savedUsers = localStorage.getItem("chat-users")
    if (!savedUsers) return

    const users: User[] = JSON.parse(savedUsers)
    const now = Date.now()
    const activeUsers = users.filter((user) => now - user.lastSeen < 60000) // 1 minute timeout

    localStorage.setItem("chat-users", JSON.stringify(activeUsers))
    setOnlineUsers(activeUsers)
  }

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      const randomColor = colors[Math.floor(Math.random() * colors.length)]
      setUserColor(randomColor)
      setIsUsernameSet(true)
      updateUserPresence()
      
      // If it's the owner logging in, use a special color and role
      if (isOwner) {
        setUserColor("#FFD700") // Gold color for owner
      }
    }
  }

  const handlePinMessage = (message: Message) => {
    if (isOwner) {
      setPinnedMessage(message)
    }
  }

  const handleQuickReply = (reply: string) => {
    setInput(reply)
  }

  return (
    <>
      {isOwner ? (
        <div className={`fixed bottom-0 right-0 z-50 flex ${view === 'expanded' ? 'w-[1200px]' : 'w-[350px]'} transition-all duration-300 ease-in-out`}>
          <div className="flex flex-col w-full bg-background border rounded-t-lg shadow-lg">
            {/* Header */}
            <div className="p-3 border-b flex items-center justify-between bg-muted/50">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">Customer Support</h3>
                <Badge variant="default" className="bg-yellow-500">Owner</Badge>
                {!isConnected && (
                  <Badge variant="destructive">
                    <WifiOff className="w-3 h-3 mr-1" />
                    Disconnected
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setView(view === 'minimized' ? 'expanded' : 'minimized')}
                >
                  {view === 'minimized' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M14 10l7-7M9 21H3v-6M10 14l-7 7"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3m8-3v3a2 2 0 0 0 2 2h3"/></svg>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex h-[600px]">
              {/* Chat Area */}
              <div className="flex-1 flex flex-col bg-background">
                <div className="flex-1 overflow-y-auto p-3 space-y-4">
                  {allMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex animate-in slide-in-from-${
                        message.isOwner ? "right" : "left"
                      } duration-300 ${
                        message.isOwner ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] ${
                          message.isOwner ? "order-2" : "order-1"
                        }`}
                      >
                        <div
                          className={`rounded-lg px-3 py-2 text-sm ${
                            message.isOwner
                              ? "bg-yellow-500 text-white"
                              : "bg-accent"
                          }`}
                        >
                          {message.text}
                          <div className="text-[10px] opacity-70 mt-1">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-3 border-t bg-muted/30">
                  <form
                    onSubmit={handleMessageSubmit}
                    className="flex items-center gap-2"
                  >
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1"
                      disabled={!isConnected || isSending}
                    />
                    <Button
                      type="submit"
                      className="px-4 h-10"
                      disabled={!input.trim() || !isConnected || isSending}
                    >
                      {isSending ? "Sending..." : "Send"}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full hover:bg-accent hover:text-accent-foreground relative border-2 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-800 light:hover:bg-gray-100 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <MessageCircle className="h-5 w-5 dark:text-gray-300 light:text-gray-600" />
              {!isConnected && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center animate-in zoom-in duration-200">
                  <WifiOff className="w-3 h-3" />
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-[800px] p-0" 
            align="end"
            side="left"
            sideOffset={20}
          >
            {!isUsernameSet ? (
              <div className="p-4">
                <form onSubmit={handleUsernameSubmit} className="space-y-3">
                  <h3 className="font-semibold">Enter your name to start chatting</h3>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Your name..."
                    className="w-full"
                  />
                  <Button type="submit" className="w-full">
                    Start Chatting
                  </Button>
                </form>
              </div>
            ) : (
              <div className="flex h-[600px]">
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center justify-between p-3 border-b">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">Chat with Restaurant</h3>
                      <Badge variant="secondary">Support</Badge>
                      {!isConnected && (
                        <Badge variant="destructive">
                          <WifiOff className="w-3 h-3 mr-1" />
                          Disconnected
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-3 space-y-4">
                    {allMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex animate-in slide-in-from-${
                          message.isOwner ? "right" : "left"
                        } duration-300 ${
                          message.isOwner ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] ${
                            message.isOwner ? "order-2" : "order-1"
                          }`}
                        >
                          <div
                            className={`rounded-lg px-3 py-2 text-sm ${
                              message.isOwner
                                ? "bg-primary text-primary-foreground"
                                : "bg-accent"
                            }`}
                          >
                            {message.text}
                            <div className="text-[10px] opacity-70 mt-1">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="p-3 border-t">
                    <form
                      onSubmit={handleMessageSubmit}
                      className="flex items-center gap-2"
                    >
                      <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1"
                        disabled={!isConnected || isSending}
                      />
                      <Button
                        type="submit"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        disabled={!input.trim() || !isConnected || isSending}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </PopoverContent>
        </Popover>
      )}
    </>
  )
} 