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
        { error: 'ID da blade não fornecido' },
        { status: 400 }
      )
    }

    const bladeId = parseInt(params.id)

    // Verifica se o ID é um número válido
    if (isNaN(bladeId)) {
      return NextResponse.json(
        { error: 'ID da blade inválido' },
        { status: 400 }
      )
    }

    // Busca a imagem da blade
    const bladeImage = await prisma.bladeImage.findFirst({
      where: {
        bladeId: bladeId
      }
    })

    if (!bladeImage) {
      return NextResponse.json(
        { error: 'Imagem não encontrada' },
        { status: 404 }
      )
    }

    // Converte o buffer da imagem para base64
    const base64Image = Buffer.from(bladeImage.image).toString('base64')

    return NextResponse.json({ image: base64Image })
  } catch (error) {
    console.error('Erro ao buscar imagem da blade:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar imagem da blade' },
      { status: 500 }
    )
  }
} 