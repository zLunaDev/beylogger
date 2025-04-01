import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    // Pega a data de hoje (início do dia)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Busca o combo mais votado do dia
    const topCombo = await prisma.combo.findFirst({
      where: {
        createdAt: {
          gte: today
        }
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

    if (!topCombo) {
      return NextResponse.json(null)
    }

    // Formata o combo para a resposta
    const formattedCombo = {
      id: topCombo.id,
      nome: `${topCombo.blade.name} ${topCombo.ratchet.name} ${topCombo.bit.name}`,
      imagem: topCombo.blade.images[0]?.image ? Buffer.from(topCombo.blade.images[0].image).toString('base64') : null,
      likes: topCombo.likes
    }

    return NextResponse.json(formattedCombo)
  } catch (error) {
    console.error('Erro ao buscar combo mais votado do dia:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar combo mais votado do dia' },
      { status: 500 }
    )
  }
} 