"use client"

import { useState, useEffect, useRef } from "react"
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
}

interface User {
  username: string
  color: string
  lastSeen: number
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
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const colors = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
    "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9",
  ]

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
    const currentUser = { username, color: userColor, lastSeen: Date.now() }

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
      }

      const savedMessages = localStorage.getItem("chat-messages")
      const existingMessages: Message[] = savedMessages ? JSON.parse(savedMessages) : []
      const updatedMessages = [...existingMessages, newMessage]

      localStorage.setItem("chat-messages", JSON.stringify(updatedMessages))
      setMessages(updatedMessages)
      setInput("")
      updateUserPresence()
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full hover:bg-accent hover:text-accent-foreground relative"
        >
          <MessageCircle className="h-5 w-5" />
          {messages.length > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
              {messages.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 md:w-96 p-0" 
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
          <div className="flex flex-col h-[500px]">
            <div className="flex items-center justify-between p-3 border-b">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">Chat</h3>
                <Badge variant="secondary">{onlineUsers.length} online</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setShowUserList(!showUserList)}
                >
                  <Users className="h-4 w-4" />
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

            <div className="flex flex-1 overflow-hidden">
              <div className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto p-3 space-y-4">
                  {messages.map((message) => (
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
                            </span>
                          </div>
                        )}
                        <div
                          className={`rounded-lg px-3 py-2 text-sm ${
                            message.username === username
                              ? "bg-primary text-primary-foreground"
                              : "bg-accent"
                          }`}
                        >
                          {message.text}
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

              {showUserList && (
                <div className="w-48 border-l overflow-y-auto">
                  <div className="p-3 space-y-2">
                    {onlineUsers.map((user) => (
                      <div
                        key={user.username}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent/50"
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarFallback
                            style={{
                              backgroundColor: user.color,
                              color: "white",
                            }}
                          >
                            {user.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm truncate">{user.username}</span>
                        {user.username === username && (
                          <Badge variant="secondary" className="ml-auto text-xs">
                            You
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
} 