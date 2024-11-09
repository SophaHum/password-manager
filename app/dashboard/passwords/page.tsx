'use client'

import { useEffect, useState, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { PasswordsTable } from "../components/PasswordsTable"
import { AddPasswordDialog } from "../components/AddPasswordDialog"
import { Password } from "@/types/password"

export default function PasswordsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [passwords, setPasswords] = useState<Password[]>([])
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
      console.log('Fetched passwords:', data) // Debug log
      
      if (Array.isArray(data)) {
        setPasswords(data)
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Passwords</h1>
        <AddPasswordDialog />
      </div>
      <PasswordsTable 
        passwords={passwords}
        isLoading={isLoading}
        onPasswordUpdated={fetchPasswords}
      />
    </div>
  )
}