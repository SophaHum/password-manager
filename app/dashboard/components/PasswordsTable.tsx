"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { EditPasswordDialog } from "./EditPasswordDialog"
import { Password } from "@/types/password"
import { Edit, Trash2, Loader2, ArrowUpDown } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PasswordsTableProps {
  passwords: Password[]
  isLoading: boolean
  onPasswordUpdated: () => void
}

export function PasswordsTable({ 
  passwords = [],
  isLoading = false,
  onPasswordUpdated 
}: PasswordsTableProps) {
  const [editingPassword, setEditingPassword] = useState<Password | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Password | null;
    direction: 'asc' | 'desc';
  }>({ key: 'createdAt', direction: 'desc' })

  // Sorting function
  const sortedPasswords = [...passwords].sort((a, b) => {
    if (!sortConfig.key) return 0
    
    const aValue = a[sortConfig.key] ?? ''
    const bValue = b[sortConfig.key] ?? ''
    
    if (aValue === bValue) return 0
    if (aValue === null) return 1
    if (bValue === null) return -1
    
    const comparison = aValue < bValue ? -1 : 1
    return sortConfig.direction === 'asc' ? comparison : -comparison
  })

  // Pagination
  const totalPages = Math.ceil(sortedPasswords.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedPasswords = sortedPasswords.slice(startIndex, startIndex + itemsPerPage)

  const handleSort = (key: keyof Password) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this password?")) {
      return
    }

    try {
      const response = await fetch(`/api/passwords`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: 'Failed to delete password'
        }))
        throw new Error(errorData.error || 'Failed to delete password')
      }

      onPasswordUpdated()
    } catch (error) {
      console.error('Error deleting password:', error)
      setError(error instanceof Error ? error.message : 'Failed to delete password. Please try again.')
    }
  }

  const handleEdit = (password: Password) => {
    setEditingPassword(password)
    setIsEditDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {error}
      </div>
    )
  }

  if (!passwords || passwords.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No passwords found. Click &quot;Add Password&quot; to create one.
      </div>
    )
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-muted-foreground">
          Total records: {passwords.length}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Show</span>
          <Select
            value={String(itemsPerPage)}
            onValueChange={(value) => {
              setItemsPerPage(Number(value))
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue>{itemsPerPage}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">entries</span>
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">No.</TableHead>
              <TableHead onClick={() => handleSort('title')} className="cursor-pointer hover:bg-muted">
                Title <ArrowUpDown className="inline h-4 w-4 ml-1" />
              </TableHead>
              <TableHead onClick={() => handleSort('username')} className="cursor-pointer hover:bg-muted">
                Username <ArrowUpDown className="inline h-4 w-4 ml-1" />
              </TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Description</TableHead>
              <TableHead onClick={() => handleSort('createdAt')} className="cursor-pointer hover:bg-muted">
                Created <ArrowUpDown className="inline h-4 w-4 ml-1" />
              </TableHead>
              <TableHead onClick={() => handleSort('updatedAt')} className="cursor-pointer hover:bg-muted">
                Updated <ArrowUpDown className="inline h-4 w-4 ml-1" />
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPasswords.map((password, index) => (
              <TableRow key={password.id}>
                <TableCell>{startIndex + index + 1}</TableCell>
                <TableCell className="font-medium">{password.title}</TableCell>
                <TableCell>{password.username}</TableCell>
                <TableCell>
                  {password.url ? (
                    <a 
                      href={password.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-500 hover:underline"
                    >
                      {password.url}
                    </a>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>{password.description || '-'}</TableCell>
                <TableCell>{formatDate(new Date(password.createdAt))}</TableCell>
                <TableCell>{formatDate(new Date(password.updatedAt))}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(password)}
                      title="Edit"
                      className="hover:bg-blue-100 hover:text-blue-600"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(password.id)}
                      title="Delete"
                      className="hover:bg-red-100 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, passwords.length)} of {passwords.length} entries
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      <EditPasswordDialog
        password={editingPassword}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onPasswordUpdated={() => {
          onPasswordUpdated()
          setEditingPassword(null)
        }}
      />
    </>
  )
}