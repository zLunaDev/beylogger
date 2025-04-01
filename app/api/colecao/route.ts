import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        combos: {
          include: {
            beyblade: {
              include: {
                blade: true,
                ratchet: true,
                bit: true
              }
            }
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(user.combos)
  } catch (error) {
    console.error('Erro ao buscar coleção:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar coleção' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string }
    const data = await request.json()

    // Verifica se o beyblade existe
    const beyblade = await prisma.beyblade.findUnique({
      where: { id: parseInt(data.beybladeId) }
    })

    if (!beyblade) {
      return NextResponse.json(
        { error: 'Beyblade não encontrado' },
        { status: 404 }
      )
    }

    // Cria o combo
    const combo = await prisma.combo.create({
      data: {
        userId: decoded.id,
        beybladeId: parseInt(data.beybladeId)
      }
    })

    return NextResponse.json(combo)
  } catch (error) {
    console.error('Erro ao adicionar beyblade à coleção:', error)
    return NextResponse.json(
      { error: 'Erro ao adicionar beyblade à coleção' },
      { status: 500 }
    )
  }
} 