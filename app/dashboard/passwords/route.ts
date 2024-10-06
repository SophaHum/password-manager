import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import prisma from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession()

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const passwords = await prisma.password.findMany({
      where: {
        user: {
          email: session.user.email
        }
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: 10 // Limit to 10 most recent passwords
    })

    const totalPasswords = await prisma.password.count({
      where: {
        user: {
          email: session.user.email
        }
      }
    })

    // This is a simple weak password check. In a real app, you'd want more sophisticated checks.
    const weakPasswords = passwords.filter(pwd => pwd.password.length < 8).length

    return NextResponse.json({
      passwords,
      totalPasswords,
      weakPasswords
    })
  } catch (error) {
    console.error('Error fetching passwords:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession()

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const { title, username, password, url } = await req.json()

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

    return NextResponse.json(newPassword)
  } catch (error) {
    console.error('Error creating password:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}