"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, Users } from "lucide-react"

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

export default function RealtimeChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [username, setUsername] = useState("")
  const [isUsernameSet, setIsUsernameSet] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<User[]>([])
  const [userColor, setUserColor] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E9",
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

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="container mx-auto h-[100%] flex bg-background my-8 rounded-lg overflow-hidden border">
      {/* Sidebar */}
      <div className="w-80 border-r border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Users className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Online Users</h3>
            <Badge variant="secondary" className="ml-auto animate-in fade-in zoom-in duration-300">
              {onlineUsers.length}
            </Badge>
          </div>
          <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-12rem)]">
            {onlineUsers.map((user) => (
              <div 
                key={user.username} 
                className="flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-accent/50 group"
              >
                <Avatar className="h-9 w-9 ring-2 ring-background shadow-sm transition-transform group-hover:scale-105">
                  <AvatarFallback style={{ backgroundColor: user.color, color: "white" }}>
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">{user.username}</span>
                  <span className="text-xs text-muted-foreground">Active now</span>
                </div>
                {user.username === username && (
                  <Badge variant="outline" className="ml-auto text-xs">
                    You
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <Card className="flex-1 flex flex-col border-0 rounded-none bg-card/50">
          <CardHeader className="border-b border-border/50 shrink-0 px-6 py-4">
            <CardTitle className="flex items-center gap-3 text-foreground">
              <div className="relative">
                <span className="text-xl">💬</span>
                <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              </div>
              Real-time Chat
              <Badge variant="secondary" className="animate-in fade-in zoom-in duration-300">
                Frontend Only
              </Badge>
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 max-h-[calc(100vh-16rem)]">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <div className="w-16 h-16 mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                  <Send className="h-8 w-8 text-accent-foreground/50" />
                </div>
                <p className="text-lg font-medium">No messages yet</p>
                <p className="text-sm mt-2 text-muted-foreground/80">
                  Start the conversation! Open this page in multiple tabs to see real-time updates.
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex animate-in slide-in-from-${message.username === username ? 'right' : 'left'} duration-300 ${
                    message.username === username ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className={`max-w-sm lg:max-w-lg ${message.username === username ? "order-2" : "order-1"}`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Avatar className="h-6 w-6 ring-2 ring-background">
                        <AvatarFallback style={{ backgroundColor: message.color, color: "white" }}>
                          {message.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium text-muted-foreground">{message.username}</span>
                      <span className="text-xs text-muted-foreground/60">{formatTime(message.timestamp)}</span>
                    </div>
                    <div
                      className={`rounded-2xl px-4 py-2.5 shadow-sm transition-all hover:shadow-md ${
                        message.username === username
                          ? "bg-primary text-primary-foreground ml-8"
                          : "bg-card text-card-foreground mr-8"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          <CardFooter className="border-t border-border/50 p-4 mt-auto bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50">
            <form onSubmit={handleMessageSubmit} className="flex items-center gap-3 w-full">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-card/50 border-accent/20 focus-visible:ring-accent"
              />
              <Button 
                type="submit" 
                size="icon"
                className="h-10 w-10 rounded-full shrink-0 transition-all hover:scale-105"
                disabled={!input.trim()}
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
