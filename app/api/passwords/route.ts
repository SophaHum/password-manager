import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import prisma from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession()

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const passwords = await prisma.password.findMany({
    where: {
      user: {
        email: session.user.email
      }
    },
    select: {
      id: true,
      title: true,
      username: true,
      url: true,
    }
  })

  return NextResponse.json(passwords)
}

export async function POST(req: Request) {
  const session = await getServerSession()

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const body = await req.json()
  const { title, username, password, url } = body

  if (!title || !username || !password) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email
    }
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const newPassword = await prisma.password.create({
    data: {
      title,
      username,
      password,
      url,
      userId: user.id
    }
  })

  return NextResponse.json({ id: newPassword.id, title: newPassword.title, username: newPassword.username, url: newPassword.url })
}