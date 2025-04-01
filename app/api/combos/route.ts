import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(request: Request) {
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

    // Busca o combo com mais likes do usuário atual
    const userTopCombo = await prisma.combo.findFirst({
      where: {
        userId: userId
      },
      orderBy: {
        likes: 'desc'
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

    // Formata o combo com as imagens em base64
    const formattedTopCombo = userTopCombo ? {
      ...userTopCombo,
      blade: {
        ...userTopCombo.blade,
        images: userTopCombo.blade.images && userTopCombo.blade.images.length > 0 ? [{
          id: userTopCombo.blade.images[0].id,
          image: Buffer.from(userTopCombo.blade.images[0].image).toString('base64')
        }] : []
      },
      ratchet: {
        ...userTopCombo.ratchet,
        images: userTopCombo.ratchet.images && userTopCombo.ratchet.images.length > 0 ? [{
          id: userTopCombo.ratchet.images[0].id,
          image: Buffer.from(userTopCombo.ratchet.images[0].image).toString('base64')
        }] : []
      },
      bit: {
        ...userTopCombo.bit,
        images: userTopCombo.bit.images && userTopCombo.bit.images.length > 0 ? [{
          id: userTopCombo.bit.images[0].id,
          image: Buffer.from(userTopCombo.bit.images[0].image).toString('base64')
        }] : []
      }
    } : null

    return NextResponse.json({ topCombo: formattedTopCombo })
  } catch (error) {
    console.error('Erro ao buscar combo com mais likes:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar combo com mais likes' },
      { status: 500 }
    )
  }
}

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

    const { bladeId, ratchetId, bitId } = await request.json()

    // Verifica se todos os IDs foram fornecidos
    if (!bladeId || !ratchetId || !bitId) {
      return NextResponse.json(
        { error: 'Todos os componentes são obrigatórios' },
        { status: 400 }
      )
    }

    // Cria o combo no banco de dados
    const combo = await prisma.combo.create({
      data: {
        bladeId,
        ratchetId,
        bitId,
        userId,
        likes: 0 // Inicializa com 0 likes
      }
    })

    return NextResponse.json(combo)
  } catch (error) {
    console.error('Erro ao criar combo:', error)
    return NextResponse.json(
      { error: 'Erro ao criar combo' },
      { status: 500 }
    )
  }
} 