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
    let userId: number | undefined

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string }
      userId = parseInt(decoded.id)
    }

    // Busca todos os combos
    const combos = await prisma.combo.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        },
        blade: {
          select: {
            name: true,
            images: {
              select: {
                image: true
              }
            }
          }
        },
        ratchet: {
          select: {
            name: true
          }
        },
        bit: {
          select: {
            name: true
          }
        }
      }
    })

    // Se o usuário estiver logado, busca os likes dele
    let userLikes: number[] = []
    if (userId) {
      const likes = await prisma.comboLike.findMany({
        where: { userId },
        select: { comboId: true }
      })
      userLikes = likes.map(like => like.comboId)
    }

    // Formata os combos para a resposta
    const formattedCombos = combos.map(combo => ({
      id: combo.id,
      nome: `${combo.blade.name} ${combo.ratchet.name} ${combo.bit.name}`,
      imagem: combo.blade.images[0]?.image ? Buffer.from(combo.blade.images[0].image).toString('base64') : null,
      likes: combo.likes,
      liked: userLikes.includes(combo.id),
      userId: combo.userId,
      usuario: combo.user ? {
        id: combo.user.id,
        username: combo.user.username
      } : null
    }))

    return NextResponse.json(formattedCombos)
  } catch (error) {
    console.error('Erro ao buscar combos da comunidade:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar combos da comunidade' },
      { status: 500 }
    )
  }
} 