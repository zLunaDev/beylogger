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
        { error: 'ID do bit não fornecido' },
        { status: 400 }
      )
    }

    const bitId = parseInt(params.id)

    // Verifica se o ID é um número válido
    if (isNaN(bitId)) {
      return NextResponse.json(
        { error: 'ID do bit inválido' },
        { status: 400 }
      )
    }

    // Busca a imagem do bit
    const bitImage = await prisma.bitImage.findFirst({
      where: {
        bitId: bitId
      }
    })

    if (!bitImage) {
      return NextResponse.json(
        { error: 'Imagem não encontrada' },
        { status: 404 }
      )
    }

    // Converte o buffer da imagem para base64
    const base64Image = Buffer.from(bitImage.image).toString('base64')

    return NextResponse.json({ image: base64Image })
  } catch (error) {
    console.error('Erro ao buscar imagem do bit:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar imagem do bit' },
      { status: 500 }
    )
  }
} 