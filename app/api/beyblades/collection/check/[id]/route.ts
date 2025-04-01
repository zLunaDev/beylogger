import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Decodifica o token para obter o ID do usuário
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string }
    const userId = parseInt(decoded.id)

    // Validação do ID da beyblade
    const beybladeId = parseInt(params.id)
    if (isNaN(beybladeId)) {
      return NextResponse.json({ error: 'ID da beyblade inválido' }, { status: 400 })
    }

    // Verifica se a beyblade existe
    const beyblade = await prisma.beyblade.findUnique({
      where: { id: beybladeId }
    })

    if (!beyblade) {
      return NextResponse.json({ error: 'Beyblade não encontrada' }, { status: 404 })
    }

    // Verifica se está na coleção do usuário
    const collection = await prisma.userCollection.findFirst({
      where: {
        userId: userId,
        beybladeId: beybladeId
      }
    })

    return NextResponse.json({ isInCollection: !!collection })
  } catch (error) {
    console.error('Erro ao verificar coleção:', error)
    return NextResponse.json({ error: 'Erro ao verificar coleção' }, { status: 500 })
  }
} 