"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, Users, X } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { MessageCircle } from "lucide-react"

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
  role?: 'owner' | 'user'
  unreadCount?: number
  lastMessage?: string
}

export function ChatPopover() {
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

  // Owner credentials - in a real app, this should come from your authentication system
  const OWNER_USERNAME = "Restaurant Owner"
  const isOwner = username === OWNER_USERNAME

  const colors = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
    "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9",
  ]

  const filteredMessages = useMemo(() => {
    if (!isOwner || !selectedUser) {
      return messages.filter(m => 
        !isOwner || m.username === username || m.username === OWNER_USERNAME
      )
    }
    return messages.filter(m => 
      m.username === selectedUser || m.username === OWNER_USERNAME
    )
  }, [messages, isOwner, selectedUser, username])

  const userChats = useMemo(() => {
    if (!isOwner) return []
    const chats: { [key: string]: User & { messages: Message[] } } = {}
    
    messages.forEach(message => {
      if (message.username !== OWNER_USERNAME) {
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Load existing messages
    const savedMessages = localStorage.getItem("chat-messages")
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    }

    // Load existing users
    const savedUsers = localStorage.getItem("chat-users")
    if (savedUsers) {
      setOnlineUsers(JSON.parse(savedUsers))
    }

    // Listen for storage changes (real-time updates)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "chat-messages" && e.newValue) {
        setMessages(JSON.parse(e.newValue))
      }
      if (e.key === "chat-users" && e.newValue) {
        setOnlineUsers(JSON.parse(e.newValue))
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // Update user presence every 5 seconds
    const presenceInterval = setInterval(() => {
      if (isUsernameSet) {
        updateUserPresence()
      }
    }, 5000)

    // Cleanup offline users every 30 seconds
    const cleanupInterval = setInterval(() => {
      cleanupOfflineUsers()
    }, 30000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(presenceInterval)
      clearInterval(cleanupInterval)
    }
  }, [isUsernameSet])

  const updateUserPresence = () => {
    const savedUsers = localStorage.getItem("chat-users")
    const users: User[] = savedUsers ? JSON.parse(savedUsers) : []

    const userIndex = users.findIndex((u) => u.username === username)
    const currentUser: User = { 
      username, 
      color: userColor, 
      lastSeen: Date.now(),
      role: username === OWNER_USERNAME ? 'owner' as const : 'user' as const
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
      if (username === OWNER_USERNAME) {
        setUserColor("#FFD700") // Gold color for owner
      }
    }
  }

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: input.trim(),
        username,
        timestamp: Date.now(),
        color: userColor,
        isOwner: username === OWNER_USERNAME,
        status: username === OWNER_USERNAME ? 'replied' : 'pending',
        replyTo: selectedUser || undefined
      }

      const savedMessages = localStorage.getItem("chat-messages")
      const existingMessages: Message[] = savedMessages ? JSON.parse(savedMessages) : []
      
      // Mark previous messages as read when owner replies
      const updatedMessages = existingMessages.map(msg => {
        if (isOwner && msg.username === selectedUser) {
          return { ...msg, status: 'read' as const }
        }
        return msg
      })

      const finalMessages = [...updatedMessages, newMessage]
      localStorage.setItem("chat-messages", JSON.stringify(finalMessages))
      setMessages(finalMessages)
      setInput("")
      updateUserPresence()
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
                {messages.filter(m => m.status === 'pending').length > 0 && (
                  <Badge variant="destructive">
                    {messages.filter(m => m.status === 'pending').length} unread
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
              {/* Conversations List */}
              <div className="w-[350px] border-r flex flex-col">
                <div className="p-3 border-b">
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex-1 overflow-y-auto">
                  {filteredChats.map((chat) => (
                    <button
                      key={chat.username}
                      onClick={() => setSelectedUser(chat.username)}
                      className={`w-full p-3 text-left hover:bg-accent/50 flex flex-col gap-1 border-b transition-colors ${
                        selectedUser === chat.username ? 'bg-accent' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback
                              style={{
                                backgroundColor: chat.color,
                                color: "white",
                              }}
                            >
                              {chat.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm flex items-center gap-2">
                              {chat.username}
                              {onlineUsers.find(u => u.username === chat.username) && (
                                <span className="w-2 h-2 rounded-full bg-green-500"/>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {chat.lastMessage}
                            </div>
                          </div>
                        </div>
                        {(chat.unreadCount || 0) > 0 && (
                          <Badge variant="default" className="bg-primary ml-2">
                            {chat.unreadCount || 0}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Last active: {new Date(chat.lastSeen).toLocaleTimeString()}</span>
                        {chat.messages.length > 0 && (
                          <span>{chat.messages.length} messages</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 flex flex-col bg-background">
                {selectedUser ? (
                  <>
                    <div className="p-3 border-b bg-muted/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback
                              style={{
                                backgroundColor: userChats.find(c => c.username === selectedUser)?.color || '#000',
                                color: "white",
                              }}
                            >
                              {selectedUser.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{selectedUser}</h3>
                            <div className="text-xs text-muted-foreground flex items-center gap-2">
                              {onlineUsers.find(u => u.username === selectedUser) ? (
                                <>
                                  <span className="w-2 h-2 rounded-full bg-green-500"/>
                                  Online
                                </>
                              ) : (
                                'Offline'
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {pinnedMessage && (
                      <div className="p-2 bg-muted/50 border-b flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">Pinned</Badge>
                          <span className="text-sm">{pinnedMessage.text}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => setPinnedMessage(null)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}

                    <div className="flex-1 overflow-y-auto p-3 space-y-4">
                      {filteredMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex animate-in slide-in-from-${
                            message.username === OWNER_USERNAME ? "right" : "left"
                          } duration-300 ${
                            message.username === OWNER_USERNAME
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] group ${
                              message.username === OWNER_USERNAME ? "order-2" : "order-1"
                            }`}
                          >
                            <div
                              className={`rounded-lg px-3 py-2 text-sm ${
                                message.username === OWNER_USERNAME
                                  ? "bg-yellow-500 text-white"
                                  : "bg-accent"
                              }`}
                              onClick={() => handlePinMessage(message)}
                              style={{ cursor: 'pointer' }}
                            >
                              {message.text}
                              <div className="text-[10px] opacity-70 mt-1 flex items-center gap-2">
                                {new Date(message.timestamp).toLocaleTimeString()}
                                {message.status === 'pending' && (
                                  <span className="text-primary-foreground">Unread</span>
                                )}
                                {message.status === 'read' && (
                                  <span>Read</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>

                    <div className="p-3 border-t bg-muted/30">
                      <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
                        {quickReplies.map((reply, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickReply(reply)}
                            className="whitespace-nowrap"
                          >
                            {reply}
                          </Button>
                        ))}
                      </div>
                      <form
                        onSubmit={handleMessageSubmit}
                        className="flex items-center gap-2"
                      >
                        <Input
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder={`Message ${selectedUser}...`}
                          className="flex-1"
                        />
                        <Button
                          type="submit"
                          className="px-4 h-10"
                          disabled={!input.trim()}
                        >
                          Send
                        </Button>
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-muted-foreground flex-col gap-2">
                    <MessageCircle className="h-8 w-8 mb-2" />
                    <p>Select a conversation to start chatting</p>
                    <p className="text-sm">You have {messages.filter(m => m.status === 'pending').length} unread messages</p>
                  </div>
                )}
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
              {messages.filter(m => m.status === 'pending').length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center animate-in zoom-in duration-200">
                  {messages.filter(m => m.status === 'pending').length}
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
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-3 space-y-4">
                    {filteredMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex animate-in slide-in-from-${
                          message.username === username ? "right" : "left"
                        } duration-300 ${
                          message.username === username
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] ${
                            message.username === username ? "order-2" : "order-1"
                          }`}
                        >
                          {message.username !== username && (
                            <div className="flex items-center gap-1 mb-1">
                              <Avatar className="h-4 w-4">
                                <AvatarFallback
                                  style={{
                                    backgroundColor: message.color,
                                    color: "white",
                                  }}
                                >
                                  {message.username.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground">
                                {message.username}
                                {message.isOwner && (
                                  <Badge variant="default" className="ml-1 bg-yellow-500 text-[10px]">Owner</Badge>
                                )}
                              </span>
                            </div>
                          )}
                          <div
                            className={`rounded-lg px-3 py-2 text-sm ${
                              message.username === username
                                ? "bg-primary text-primary-foreground"
                                : message.isOwner
                                ? "bg-yellow-500/10 border border-yellow-500/20"
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
                      />
                      <Button
                        type="submit"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        disabled={!input.trim()}
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