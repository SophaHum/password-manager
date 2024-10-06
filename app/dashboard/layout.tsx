import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { LogOut, Settings, Key } from "lucide-react"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex h-screen bg-background">
        <aside className="w-64 bg-card text-card-foreground p-4 flex flex-col justify-between">
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
                <Button variant="ghost" className="w-full justify-start">
                  <Key className="mr-2 h-4 w-4" />
                  Passwords
                </Button>
              </Link>
              <Link href="/dashboard/settings" passHref>
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </Link>
            </nav>
          </div>
          <div className="space-y-2">
            <ThemeToggle />
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/api/auth/signout">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Link>
            </Button>
          </div>
        </aside>
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </ThemeProvider>
  )
}