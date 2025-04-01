import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { email, password, username } = await request.json()

    // Validação dos dados
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Verifica se o email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 400 }
      )
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10)

    // Prepara os dados do usuário
    const userData = {
      email,
      password: hashedPassword,
      username: username || 'Blader',
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Cria o usuário
    const user = await prisma.user.create({
      data: userData
    })

    // Retorna os dados do usuário (sem a senha)
    return NextResponse.json({
      success: true,
      message: 'Conta criada com sucesso!',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        isAdmin: user.isAdmin
      }
    })
  } catch (error) {
    console.error('Erro no registro:', error)
    return NextResponse.json(
      { error: 'Erro ao criar usuário' },
      { status: 500 }
    )
  }
} 