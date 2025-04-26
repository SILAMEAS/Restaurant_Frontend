import type React from "react"
import { MainNav } from "@/components/main-nav"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col items-center">
      <MainNav />
      <main className="flex-col flex-1 items-center justify-center ">{children}</main>
      <footer className="border-t py-6 px-4 md:px-6">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Foodie. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
