import React from 'react';
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Role} from "@/lib/redux/counterSlice";
import {UserChatPopOver} from "@/app/(chat)/type/types";
import {IProfile} from "@/lib/redux/services/type";

interface TypingUsernameProps {
    username: string,
    setUserColor: React.Dispatch<React.SetStateAction<string>>,
    setIsUsernameSet: React.Dispatch<React.SetStateAction<boolean>>,
    isOwner: boolean
    setUsername: React.Dispatch<React.SetStateAction<string>>,
    setOnlineUsers: React.Dispatch<React.SetStateAction<UserChatPopOver[]>>,
    profile?: IProfile,
    userColor: string

}

const colors = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
    "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9",
]
const TypingUsername = ({
                            userColor,
                            profile,
                            username,
                            setIsUsernameSet,
                            setUserColor,
                            setUsername,
                            isOwner,
                            setOnlineUsers
                        }: TypingUsernameProps) => {


    const updateUserPresence = () => {
        const savedUsers = localStorage.getItem("chat-users")
        const users: UserChatPopOver[] = savedUsers ? JSON.parse(savedUsers) : []

        const userIndex = users.findIndex((u) => u.username === username)
        const currentUser: UserChatPopOver = {
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


    return <div className="p-4">
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
};

export default TypingUsername;