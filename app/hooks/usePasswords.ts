import { useState } from 'react'
import { Password } from '@/types/password'

export function usePasswords() {
  const [passwords, setPasswords] = useState<Password[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchPasswords = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/passwords')
      const data = await response.json()
      setPasswords(data.passwords)
    } catch (error) {
      console.error('Error fetching passwords:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const deletePassword = async (id: string) => {
    try {
      const response = await fetch(`/api/passwords/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete password')
      await fetchPasswords() // Refresh the list
    } catch (error) {
      console.error('Error deleting password:', error)
      throw error
    }
  }

  const updatePassword = async (password: Password) => {
    try {
      const response = await fetch(`/api/passwords/${password.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(password),
      })
      if (!response.ok) throw new Error('Failed to update password')
      await fetchPasswords() // Refresh the list
    } catch (error) {
      console.error('Error updating password:', error)
      throw error
    }
  }

  return {
    passwords,
    isLoading,
    fetchPasswords,
    deletePassword,
    updatePassword,
  }
} 