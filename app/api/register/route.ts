import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  const body = await req.json()
  const { name, email, password } = body

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const exist = await prisma.user.findUnique({
    where: {
      email: email
    }
  })

  if (exist) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword
    }
  })

  return NextResponse.json({ user: { name: user.name, email: user.email } })
}