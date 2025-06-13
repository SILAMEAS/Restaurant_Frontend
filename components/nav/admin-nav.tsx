"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, LogOut, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLogout } from "@/lib/hooks/useLogout"
import { CheckRole } from "@/app/admin/components/(hooks)/useUsersByRole"

export function AdminNav() {
  const pathname = usePathname()
  const logout = useLogout()
  const { isAdmin, isOwner } = CheckRole()

  const routes = isAdmin ? [
    {
      href: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
      active: pathname === "/admin",
    }
  ] : [
    {
      href: "/owner",
      label: "Dashboard",
      icon: LayoutDashboard,
      active: pathname === "/owner",
    },
    {
      href: "/owner/restaurant",
      label: "My Restaurant",
      icon: Store,
      active: pathname === "/owner/restaurant",
    }
  ]

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/50 border-b">
      <div className="container mx-auto flex items-center justify-between py-4 px-4 md:px-6">
        <div className="flex items-center">
          <Link href={isAdmin ? "/admin" : "/owner"} className="flex items-center">
            <span className="text-xl font-bold">LaCy {isAdmin ? "Admin" : "Owner"}</span>
          </Link>
        </div>

        <nav className="flex items-center space-x-6">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 ${
                route.active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <route.icon className="h-4 w-4" />
              {route.label}
            </Link>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </nav>
      </div>
    </div>
  )
} 