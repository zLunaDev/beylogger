import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET() {
  try {
    const [blades, ratchets, bits] = await Promise.all([
      prisma.blade.findMany({
        include: {
          beyblades: true,
          combos: true,
          images: true
        }
      }),
      prisma.ratchet.findMany({
        include: {
          beyblades: true,
          combos: true,
          images: true
        }
      }),
      prisma.bit.findMany({
        include: {
          beyblades: true,
          combos: true,
          images: true
        }
      })
    ])

    // Converter o buffer da imagem para base64
    const partsWithBase64Images = {
      blades: blades.map(blade => ({
        ...blade,
        images: blade.images && blade.images.length > 0 ? [{
          id: blade.images[0].id,
          image: Buffer.from(blade.images[0].image).toString('base64')
        }] : []
      })),
      ratchets: ratchets.map(ratchet => ({
        ...ratchet,
        images: ratchet.images && ratchet.images.length > 0 ? [{
          id: ratchet.images[0].id,
          image: Buffer.from(ratchet.images[0].image).toString('base64')
        }] : []
      })),
      bits: bits.map(bit => ({
        ...bit,
        images: bit.images && bit.images.length > 0 ? [{
          id: bit.images[0].id,
          image: Buffer.from(bit.images[0].image).toString('base64')
        }] : []
      }))
    }

    return NextResponse.json(partsWithBase64Images)
  } catch (error) {
    console.error('Erro ao buscar peças:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar peças' },
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

    // Verifica se o usuário é administrador
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string, isAdmin: boolean }
    
    if (!decoded.isAdmin) {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas administradores podem adicionar peças.' },
        { status: 403 }
      )
    }

    const data = await request.json()

    // Validação dos dados
    if (!data.name || !data.type) {
      return NextResponse.json(
        { error: 'Nome e tipo são obrigatórios' },
        { status: 400 }
      )
    }

    // Converte a imagem base64 para buffer se existir
    let imageBuffer = null
    if (data.image) {
      const base64Data = data.image.replace(/^data:image\/\w+;base64,/, '')
      imageBuffer = Buffer.from(base64Data, 'base64')
    }

    // Cria a peça baseado no tipo
    let part
    switch (data.type) {
      case 'Blade':
        part = await prisma.blade.create({
          data: {
            name: data.name,
            images: imageBuffer ? {
              create: {
                image: imageBuffer
              }
            } : undefined
          },
          include: {
            images: true
          }
        })
        break
      case 'Ratchet':
        part = await prisma.ratchet.create({
          data: {
            name: data.name,
            images: imageBuffer ? {
              create: {
                image: imageBuffer
              }
            } : undefined
          },
          include: {
            images: true
          }
        })
        break
      case 'Bit':
        part = await prisma.bit.create({
          data: {
            name: data.name,
            images: imageBuffer ? {
              create: {
                image: imageBuffer
              }
            } : undefined
          },
          include: {
            images: true
          }
        })
        break
      default:
        return NextResponse.json(
          { error: 'Tipo de peça inválido' },
          { status: 400 }
        )
    }

    // Formata a resposta para incluir a imagem em base64
    const formattedPart = {
      ...part,
      images: part.images && part.images.length > 0 ? [{
        id: part.images[0].id,
        image: Buffer.from(part.images[0].image).toString('base64')
      }] : []
    }

    return NextResponse.json(formattedPart)
  } catch (error) {
    console.error('Erro ao adicionar peça:', error)
    return NextResponse.json(
      { error: 'Erro ao adicionar peça' },
      { status: 500 }
    )
  }
} 