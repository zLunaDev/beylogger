import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verifica se o usuário está autenticado
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      )
    }

    // Decodifica o token para obter o ID do usuário
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string }
    const userId = parseInt(decoded.id)
    const comboId = parseInt(params.id)

    // Verifica se o combo existe
    const combo = await prisma.combo.findUnique({
      where: { id: comboId },
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

    if (!combo) {
      return NextResponse.json(
        { error: 'Combo não encontrado' },
        { status: 404 }
      )
    }

    // Verifica se o usuário já deu like
    const existingLike = await prisma.comboLike.findUnique({
      where: {
        comboId_userId: {
          comboId,
          userId
        }
      }
    })

    // Se já deu like, remove o like
    if (existingLike) {
      await prisma.$transaction([
        prisma.comboLike.delete({
          where: {
            comboId_userId: {
              comboId,
              userId
            }
          }
        }),
        prisma.combo.update({
          where: { id: comboId },
          data: {
            likes: {
              decrement: 1
            }
          }
        })
      ])
    } else {
      // Se não deu like, adiciona o like
      await prisma.$transaction([
        prisma.comboLike.create({
          data: {
            comboId,
            userId
          }
        }),
        prisma.combo.update({
          where: { id: comboId },
          data: {
            likes: {
              increment: 1
            }
          }
        })
      ])
    }

    // Busca o combo atualizado
    const updatedCombo = await prisma.combo.findUnique({
      where: { id: comboId },
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

    // Formata o combo para a resposta
    const formattedCombo = {
      id: updatedCombo.id,
      nome: `${updatedCombo.blade.name} ${updatedCombo.ratchet.name} ${updatedCombo.bit.name}`,
      imagem: updatedCombo.blade.images[0]?.image ? Buffer.from(updatedCombo.blade.images[0].image).toString('base64') : null,
      likes: updatedCombo.likes,
      liked: !existingLike,
      userId: updatedCombo.userId,
      usuario: updatedCombo.user ? {
        id: updatedCombo.user.id,
        username: updatedCombo.user.username
      } : null
    }

    return NextResponse.json(formattedCombo)
  } catch (error) {
    console.error('Erro ao atualizar like do combo:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar like do combo' },
      { status: 500 }
    )
  }
} 