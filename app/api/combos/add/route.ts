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

    // Obtém os dados do combo do corpo da requisição
    const data = await request.json()
    const { bladeId, ratchetId, bitId } = data

    if (!bladeId || !ratchetId || !bitId) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      )
    }

    // Cria o novo combo
    const combo = await prisma.combo.create({
      data: {
        userId,
        bladeId,
        ratchetId,
        bitId
      },
      include: {
        user: {
          select: {
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
            name: true,
            images: {
              select: {
                image: true
              }
            }
          }
        },
        bit: {
          select: {
            name: true,
            images: {
              select: {
                image: true
              }
            }
          }
        }
      }
    })

    // Formata os dados para o formato esperado pelo frontend
    const formattedCombo = {
      id: combo.id,
      nome: `${combo.blade.name} ${combo.ratchet.name} ${combo.bit.name}`,
      imagem: combo.blade.images[0]?.image || null,
      likes: 0,
      usuario: {
        username: combo.user.username
      }
    }

    return NextResponse.json(formattedCombo)
  } catch (error) {
    console.error('Erro ao criar combo:', error)
    return NextResponse.json(
      { error: 'Erro ao criar combo' },
      { status: 500 }
    )
  }
} 