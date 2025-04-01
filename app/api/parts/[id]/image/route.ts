import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const partId = parseInt(params.id)

    // Busca a imagem em todas as tabelas de imagens
    const [bladeImage, ratchetImage, bitImage] = await Promise.all([
      prisma.bladeImage.findFirst({
        where: { bladeId: partId }
      }),
      prisma.ratchetImage.findFirst({
        where: { ratchetId: partId }
      }),
      prisma.bitImage.findFirst({
        where: { bitId: partId }
      })
    ])

    if (!bladeImage && !ratchetImage && !bitImage) {
      return NextResponse.json(
        { error: 'Imagem não encontrada' },
        { status: 404 }
      )
    }

    const image = bladeImage || ratchetImage || bitImage
    return new NextResponse(image?.image, {
      headers: {
        'Content-Type': 'image/jpeg'
      }
    })
  } catch (error) {
    console.error('Erro ao buscar imagem:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar imagem' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
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

    // Verifica se o usuário é administrador
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string, isAdmin: boolean }
    
    if (!decoded.isAdmin) {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas administradores podem adicionar imagens.' },
        { status: 403 }
      )
    }

    const data = await request.json()
    const partId = parseInt(params.id)

    // Validação dos dados
    if (!data.image) {
      return NextResponse.json(
        { error: 'Imagem é obrigatória' },
        { status: 400 }
      )
    }

    // Converte a imagem base64 para buffer
    const base64Data = data.image.replace(/^data:image\/\w+;base64,/, '')
    const imageBuffer = Buffer.from(base64Data, 'base64')

    // Verifica se a peça existe e seu tipo
    const [blade, ratchet, bit] = await Promise.all([
      prisma.blade.findUnique({ where: { id: partId } }),
      prisma.ratchet.findUnique({ where: { id: partId } }),
      prisma.bit.findUnique({ where: { id: partId } })
    ])

    if (!blade && !ratchet && !bit) {
      return NextResponse.json(
        { error: 'Peça não encontrada' },
        { status: 404 }
      )
    }

    let result

    // Salva a imagem na tabela correta baseado no tipo da peça encontrada
    if (blade) {
      await prisma.bladeImage.deleteMany({
        where: { bladeId: partId }
      })
      result = await prisma.bladeImage.create({
        data: {
          bladeId: partId,
          image: imageBuffer
        }
      })
    } else if (ratchet) {
      await prisma.ratchetImage.deleteMany({
        where: { ratchetId: partId }
      })
      result = await prisma.ratchetImage.create({
        data: {
          ratchetId: partId,
          image: imageBuffer
        }
      })
    } else if (bit) {
      await prisma.bitImage.deleteMany({
        where: { bitId: partId }
      })
      result = await prisma.bitImage.create({
        data: {
          bitId: partId,
          image: imageBuffer
        }
      })
    }

    return NextResponse.json({
      message: 'Imagem adicionada com sucesso',
      image: result
    })
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error)
    return NextResponse.json(
      { error: 'Erro ao fazer upload da imagem' },
      { status: 500 }
    )
  }
} 