'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Shield, Plus, RefreshCw, AlertTriangle, Eye, EyeOff } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Password {
  id: string;
  title: string;
  username: string;
  password: string;
  url?: string;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const [totalPasswords, setTotalPasswords] = useState<number>(0)
  const [recentPasswords, setRecentPasswords] = useState<Password[]>([])
  const [weakPasswords, setWeakPasswords] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({})
  const [isAddPasswordOpen, setIsAddPasswordOpen] = useState<boolean>(false)
  const [newPassword, setNewPassword] = useState<Omit<Password, 'id' | 'createdAt' | 'updatedAt'>>({
    title: '',
    username: '',
    password: '',
    url: '',
  })

  useEffect(() => {
    fetchPasswords()
  }, [])

  const fetchPasswords = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/passwords')
      if (!response.ok) {
        throw new Error('Failed to fetch passwords')
      }
      const data = await response.json()
      setRecentPasswords(data.passwords || []); // Ensure it's an array
      setTotalPasswords(data.totalPasswords || 0)
      setWeakPasswords(data.weakPasswords || 0)
    } catch (err) {
      setError('An error occurred while fetching passwords')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    // Implement search logic here
  }

  const togglePasswordVisibility = (id: string) => {
    setShowPassword(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleAddPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/passwords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPassword),
      })
      if (!response.ok) {
        throw new Error('Failed to add password')
      }
      setIsAddPasswordOpen(false)
      setNewPassword({ title: '', username: '', password: '', url: '' })
      fetchPasswords()
    } catch (err) {
      console.error(err)
      setError('An error occurred while adding the password')
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Password Dashboard</h1>
        <Input 
          type="search" 
          placeholder="Search passwords..." 
          className="max-w-sm" 
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Passwords</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPasswords}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weak Passwords</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weakPasswords}</div>
            <p className="text-xs text-muted-foreground">
              {weakPasswords > 0 ? 'Needs attention' : 'All passwords are strong'}
            </p>
          </CardContent>
        </Card>
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-around">
            <Dialog open={isAddPasswordOpen} onOpenChange={setIsAddPasswordOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add New Password
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Password</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new password entry.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddPassword}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="title" className="text-right">
                        Title
                      </Label>
                      <Input
                        id="title"
                        value={newPassword.title}
                        onChange={(e) => setNewPassword({ ...newPassword, title: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="username" className="text-right">
                        Username
                      </Label>
                      <Input
                        id="username"
                        value={newPassword.username}
                        onChange={(e) => setNewPassword({ ...newPassword, username: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="password" className="text-right">
                        Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={newPassword.password}
                        onChange={(e) => setNewPassword({ ...newPassword, password: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="url" className="text-right">
                        URL
                      </Label>
                      <Input
                        id="url"
                        value={newPassword.url}
                        onChange={(e) => setNewPassword({ ...newPassword, url: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Add Password</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <Button variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" /> Generate Strong Password
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Passwords</CardTitle>
          <CardDescription>Your recently added or updated passwords</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Password</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentPasswords.length > 0 ? (
                recentPasswords.map((pwd) => (
                  <TableRow key={pwd.id}>
                    <TableCell className="font-medium">{pwd.title}</TableCell>
                    <TableCell>{pwd.username}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Input
                          type={showPassword[pwd.id] ? 'text' : 'password'}
                          value={pwd.password}
                          readOnly
                          className="w-32"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => togglePasswordVisibility(pwd.id)}
                        >
                          {showPassword[pwd.id] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(pwd.updatedAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button variant="ghost">Edit</Button>
                      <Button variant="ghost" className="text-destructive">Delete</Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">No recent passwords found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}