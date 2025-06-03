import type React from "react"
import { MainNav } from "@/components/main-nav"
import { ChatButton } from "@/components/chat-button"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col items-center">
      <MainNav />
      <main className="flex-col flex-1 items-center justify-center w-full pt-[72px]">{children}</main>
      <footer className="border-t py-6 px-4 md:px-6 w-full">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} LaCy. All rights reserved.
        </div>
      </footer>
      <ChatButton />
    </div>
  )
}
