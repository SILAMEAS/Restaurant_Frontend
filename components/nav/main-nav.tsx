"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, User, ShoppingCart, MenuIcon, LogOut ,ListOrderedIcon} from "lucide-react"
import { useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/provider/theme-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useLogout } from "@/lib/hooks/useLogout"
import Cookies from "js-cookie"
import { COOKIES } from "@/constant/COOKIES"

export function MainNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const logout = useLogout()
  const isAuthenticated = !!Cookies.get(COOKIES.TOKEN)

  const routes = [
    {
      href: "/",
      label: "Home",
      icon: Home,
      active: pathname === "/",
    },
    {
      href: "/menu",
      label: "Menu",
      icon: MenuIcon,
      active: pathname === "/menu",
    },
    {
      href: "/profile",
      label: "Profile",
      icon: User,
      active: pathname === "/profile",
    },
    {
      href: "/cart",
      label: "Cart",
      icon: ShoppingCart,
      active: pathname === "/cart",
    },
    {
      href: "/order",
      label: "Order",
      icon: ListOrderedIcon,
      active: pathname === "/order",
    },
  ]

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/50 border-b">
      <div className="container mx-auto flex items-center justify-between py-4 px-4 md:px-6">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold">LaCy</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary flex items-center gap-1",
                route.active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <route.icon className="h-4 w-4" />
              {route.label}
            </Link>
          ))}
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* Mobile Navigation */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className={"w-[150px] max-w-full sm:w-[300px] py-10"}>
              <div className="flex flex-col gap-6 mt-8">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary flex items-center gap-2",
                      route.active ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    <route.icon className="h-5 w-5" />
                    {route.label}
                  </Link>
                ))}
                <Link
                    href={"/"}
                    className="absolute right-[10px] bottom-[10px] z-1"
                    onClick={logout}
                >
                  <LogOut className="h-5 w-5" />

                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}
