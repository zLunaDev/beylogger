import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET() {
  try {
    console.log('Iniciando busca do último beyblade...')
    
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      console.log('Token não encontrado')
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Agora vamos buscar o último beyblade do sistema
    const lastBeyblade = await prisma.beyblade.findFirst({
      orderBy: {
        createdAt: 'desc'
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

    console.log('Último beyblade encontrado:', lastBeyblade)

    if (!lastBeyblade) {
      console.log('Nenhum beyblade encontrado no sistema')
      return NextResponse.json({
        id: null,
        nome: 'Nenhum beyblade adicionado',
        imagem: '/placeholder.svg?height=192&width=192',
        tipo: '-',
        stats: {
          attack: 0,
          stamina: 0,
          defesa: 0,
          equilibrio: 0
        }
      })
    }

    // Converte as imagens para base64
    const beybladeWithBase64Images = {
      ...lastBeyblade,
      blade: {
        ...lastBeyblade.blade,
        images: lastBeyblade.blade.images?.map(image => ({
          id: image.id,
          image: Buffer.from(image.image).toString('base64')
        })) || []
      },
      ratchet: {
        ...lastBeyblade.ratchet,
        images: lastBeyblade.ratchet.images?.map(image => ({
          id: image.id,
          image: Buffer.from(image.image).toString('base64')
        })) || []
      },
      bit: {
        ...lastBeyblade.bit,
        images: lastBeyblade.bit.images?.map(image => ({
          id: image.id,
          image: Buffer.from(image.image).toString('base64')
        })) || []
      }
    }

    const response = {
      id: beybladeWithBase64Images.id,
      nome: `${beybladeWithBase64Images.blade.name} ${beybladeWithBase64Images.ratchet.name}${beybladeWithBase64Images.bit.name}`,
      imagem: beybladeWithBase64Images.blade.images?.[0]?.image 
        ? `data:image/jpeg;base64,${beybladeWithBase64Images.blade.images[0].image}`
        : '/placeholder.svg?height=192&width=192',
      tipo: beybladeWithBase64Images.blade.name,
      stats: {
        attack: beybladeWithBase64Images.attack,
        stamina: beybladeWithBase64Images.stamina,
        defesa: beybladeWithBase64Images.defesa,
        equilibrio: beybladeWithBase64Images.equilibrio
      }
    }

    console.log('Resposta final:', response)
    return NextResponse.json(response)
  } catch (error) {
    console.error('Erro ao buscar último beyblade:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar último beyblade' },
      { status: 500 }
    )
  }
} 