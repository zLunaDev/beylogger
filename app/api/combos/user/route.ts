import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET() {
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

    // Busca todos os combos do usuário
    const combos = await prisma.combo.findMany({
      where: {
        userId: userId
      },
      include: {
        blade: {
          include: {
            images: true
          }
        },
        ratchet: {
          include: {
            images: true
          }
        },
        bit: {
          include: {
            images: true
          }
        }
      }
    })

    // Formata os combos com as imagens em base64
    const formattedCombos = combos.map(combo => ({
      id: combo.id,
      nome: `${combo.blade.name} ${combo.ratchet.name} ${combo.bit.name}`,
      imagem: combo.blade.images[0]?.image ? Buffer.from(combo.blade.images[0].image).toString('base64') : null,
      likes: combo.likes,
      blade: combo.blade,
      ratchet: combo.ratchet,
      bit: combo.bit
    }))

    return NextResponse.json(formattedCombos)
  } catch (error) {
    console.error('Erro ao buscar combos do usuário:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar combos do usuário' },
      { status: 500 }
    )
  }
} 