"use client"

import Link from "next/link"
import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

export function ChatButton() {
  const pathname = usePathname()
  const isActive = pathname === "/chat"

  return (
    <Link href="/chat" className="fixed bottom-6 right-6 z-50">
      <Button 
        size="lg" 
        className={`rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all ${
          isActive ? "bg-primary" : "bg-primary/90 hover:bg-primary"
        }`}
      >
        <MessageCircle className="h-6 w-6" />
        <span className="sr-only">Open Chat</span>
      </Button>
    </Link>
  )
} 