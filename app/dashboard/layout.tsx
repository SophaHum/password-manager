import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { DashboardLayoutClient } from "./components/DashboardLayoutClient"

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
      <DashboardLayoutClient session={session}>
        {children}
      </DashboardLayoutClient>
    </ThemeProvider>
  )
}