'use client'

import { useEffect, useState, useCallback } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { PasswordsTable } from "./components/PasswordsTable"
import { AddPasswordDialog } from "./components/AddPasswordDialog"
import { Password } from "@/types/password"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LogOut, Search, Menu } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [passwords, setPasswords] = useState<Password[]>([])
  const [filteredPasswords, setFilteredPasswords] = useState<Password[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const fetchPasswords = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/passwords', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: 'Failed to fetch passwords'
        }))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Fetched passwords:', data)
      
      if (Array.isArray(data)) {
        setPasswords(data)
        setFilteredPasswords(data)
      } else {
        console.error('Invalid data format:', data)
        throw new Error('Invalid data format received')
      }
    } catch (error) {
      console.error('Error fetching passwords:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    const filtered = passwords.filter(password => 
      password.title.toLowerCase().includes(query.toLowerCase()) ||
      password.username.toLowerCase().includes(query.toLowerCase()) ||
      password.url?.toLowerCase().includes(query.toLowerCase()) ||
      password.description?.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredPasswords(filtered)
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchPasswords()
    }
  }, [session, fetchPasswords])

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="container py-6">
      {/* Desktop Header */}
      <div className="hidden md:flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Passwords</h1>
        <div className="flex items-center gap-4">
          <AddPasswordDialog />
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="flex md:hidden justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Your Passwords</h1>
        <div className="flex items-center gap-2">
          <AddPasswordDialog />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Search Bar - Responsive */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-2 w-4" />
        <Input
          type="search"
          placeholder="Search passwords..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 w-60"
        />
      </div>

      <PasswordsTable 
        passwords={filteredPasswords}
        isLoading={isLoading}
        onPasswordUpdated={fetchPasswords}
      />
    </div>
  )
}