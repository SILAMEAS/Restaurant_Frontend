import {useMemo, useState} from 'react';
import {IMessageChatPopOver, UserChatPopOver} from "@/components/(chatPopOver)/type/types";

interface ExtraUtilChatProps {
    isOwner: boolean,
    onlineUsers: UserChatPopOver[],
    username: string
}

const useExtraUtilChat = ({isOwner, onlineUsers, username}: ExtraUtilChatProps) => {
    const [quickReplies] = useState([
        "Thank you for your message! How can I help you today?",
        "I'll check and get back to you shortly.",
        "Would you like to make a reservation?",
        "Please let me know if you need anything else.",
    ])
    const [messages, setMessages] = useState<IMessageChatPopOver[]>([])
    const [pinnedMessage, setPinnedMessage] = useState<IMessageChatPopOver | null>(null)
    const [selectedUser, setSelectedUser] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")

    const userChats = useMemo(() => {
        if (!isOwner) return []
        const chats: { [key: string]: UserChatPopOver & { messages: IMessageChatPopOver[] } } = {}

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

    const cleanupOfflineUsers = ({setOnlineUsers}: { setOnlineUsers: any }) => {
        const savedUsers = localStorage.getItem("chat-users")
        if (!savedUsers) return

        const users: UserChatPopOver[] = JSON.parse(savedUsers)
        const now = Date.now()
        const activeUsers = users.filter((user) => now - user.lastSeen < 60000) // 1 minute timeout

        localStorage.setItem("chat-users", JSON.stringify(activeUsers))
        setOnlineUsers(activeUsers)
    }

    const filteredChats = useMemo(() => {
        return userChats.filter(chat =>
            chat.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (chat.lastMessage || "").toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [userChats, searchQuery])


    const handlePinMessage = (message: IMessageChatPopOver) => {
        if (isOwner) {
            setPinnedMessage(message)
        }
    }

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

    return {
        cleanupOfflineUsers,
        filteredChats,
        handlePinMessage,
        filteredMessages,
        setMessages,
        pinnedMessage,
        setSelectedUser,
        setSearchQuery
    }
};

export default useExtraUtilChat;