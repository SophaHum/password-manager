"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Key, Menu, X } from "lucide-react"
import { Session } from "next-auth"
interface DashboardLayoutClientProps {
  children: React.ReactNode
  session: Session
}

export function DashboardLayoutClient({ children, session }: DashboardLayoutClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40
          w-64 bg-card text-card-foreground p-4
          flex flex-col justify-between
          transition-transform duration-200 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        <div>
          <div className="flex items-center space-x-2 mb-6">
            <Avatar>
              <AvatarImage src={session.user?.image || undefined} />
              <AvatarFallback>{session.user?.name?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{session.user?.name}</p>
              <p className="text-sm text-muted-foreground">{session.user?.email}</p>
            </div>
          </div>
          <nav className="space-y-2">
            <Link href="/dashboard" passHref>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => setIsSidebarOpen(false)}
              >
                <Key className="mr-2 h-4 w-4" />
                Passwords
              </Button>
            </Link>
          </nav>
        </div>
        <div className="space-y-2">
          <ThemeToggle />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-auto ml-0 md:ml-0 mt-16 md:mt-0">
        {children}
      </main>
    </div>
  )
} 