import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Garante que params.id está definido e é uma string antes de usar
    if (!params || !params.id) {
      return NextResponse.json(
        { error: 'ID do ratchet não fornecido' },
        { status: 400 }
      )
    }

    const ratchetId = parseInt(params.id)

    // Verifica se o ID é um número válido
    if (isNaN(ratchetId)) {
      return NextResponse.json(
        { error: 'ID do ratchet inválido' },
        { status: 400 }
      )
    }

    // Busca a imagem do ratchet
    const ratchetImage = await prisma.ratchetImage.findFirst({
      where: {
        ratchetId: ratchetId
      }
    })

    if (!ratchetImage) {
      return NextResponse.json(
        { error: 'Imagem não encontrada' },
        { status: 404 }
      )
    }

    // Converte o buffer da imagem para base64
    const base64Image = Buffer.from(ratchetImage.image).toString('base64')

    return NextResponse.json({ image: base64Image })
  } catch (error) {
    console.error('Erro ao buscar imagem do ratchet:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar imagem do ratchet' },
      { status: 500 }
    )
  }
} 