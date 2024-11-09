import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "../auth/authOptions"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    // Get the session
    const session = await getServerSession(authOptions)
    console.log("Session:", session) // Debug log

    if (!session?.user?.email) {
      console.log("No authenticated user") // Debug log
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email
      },
      select: {
        id: true,
        passwords: {
          orderBy: {
            createdAt: 'desc'
          },
          select: {
            id: true,
            title: true,
            username: true,
            password: true,
            url: true,
            description: true,
            createdAt: true,
            updatedAt: true,
          }
        }
      }
    })

    console.log("User data:", user) // Debug log

    if (!user) {
      console.log("User not found") // Debug log
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    console.log("Passwords count:", user.passwords.length) // Debug log
    return NextResponse.json(user.passwords)

  } catch (error) {
    console.error('Error in GET /api/passwords:', error)
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Password ID is required' },
        { status: 400 }
      )
    }

    await prisma.password.delete({
      where: {
        id: id
      }
    })

    return NextResponse.json(
      { message: 'Password deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting password:', error)
    return NextResponse.json(
      { error: 'Failed to delete password' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  const session = await getServerSession()

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const body = await req.json()
  const { title, username, password, url, description } = body

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
      description,
      userId: user.id
    }
  })

  return NextResponse.json({ id: newPassword.id, title: newPassword.title, username: newPassword.username, url: newPassword.url })
}

export async function PUT(request: Request) {
  try {
    const data = await request.json()
    const { id, title, username, password, url } = data

    const updatedPassword = await prisma.password.update({
      where: { id },
      data: { title, username, password, url }
    })

    return NextResponse.json(updatedPassword)
  } catch (error) {
    console.error('Error updating password:', error)
    return NextResponse.json(
      { error: 'Failed to update password' },
      { status: 500 }
    )
  }
}