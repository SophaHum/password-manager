export interface Password {
    id: string
    title: string
    username: string
    password: string
    url?: string | null
    description?: string | null
    createdAt: Date
    updatedAt: Date
    userId: string
}
