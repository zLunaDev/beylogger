import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: Request) {
  try {
    // Verifica se o usuário está autenticado
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Decodifica o token para obter o ID do usuário
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string }
    const userId = parseInt(decoded.id)

    // Obtém o ID do beyblade do corpo da requisição
    const data = await request.json()
    const beybladeId = data.beybladeId

    if (!beybladeId) {
      return NextResponse.json(
        { error: 'ID do beyblade não fornecido' },
        { status: 400 }
      )
    }

    // Verifica se o beyblade já está na coleção do usuário
    const existingCollection = await prisma.userCollection.findFirst({
      where: {
        userId: userId,
        beybladeId: beybladeId
      }
    })

    if (existingCollection) {
      return NextResponse.json(
        { error: 'Esta beyblade já está na sua coleção' },
        { status: 400 }
      )
    }

    // Adiciona o beyblade à coleção do usuário
    const collection = await prisma.userCollection.create({
      data: {
        userId: userId,
        beybladeId: beybladeId
      },
      include: {
        beyblade: {
          include: {
            blade: true,
            ratchet: true,
            bit: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Beyblade adicionada à coleção com sucesso',
      collection
    })
  } catch (error) {
    console.error('Erro ao adicionar beyblade à coleção:', error)
    return NextResponse.json(
      { error: 'Erro ao adicionar beyblade à coleção' },
      { status: 500 }
    )
  }
} 