import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      console.log('Token não encontrado')
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string }
    const userId = parseInt(decoded.id)

    console.log('Buscando beyblades da coleção do usuário:', userId)

    const userCollections = await prisma.userCollection.findMany({
      where: {
        userId: userId
      },
      include: {
        beyblade: {
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
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log('Beyblades encontrados:', userCollections)

    // Converte as imagens para base64
    const beybladesWithBase64Images = userCollections.map(collection => ({
      ...collection.beyblade,
      blade: {
        ...collection.beyblade.blade,
        images: collection.beyblade.blade.images?.map(image => ({
          id: image.id,
          image: Buffer.from(image.image).toString('base64')
        })) || []
      },
      ratchet: {
        ...collection.beyblade.ratchet,
        images: collection.beyblade.ratchet.images?.map(image => ({
          id: image.id,
          image: Buffer.from(image.image).toString('base64')
        })) || []
      },
      bit: {
        ...collection.beyblade.bit,
        images: collection.beyblade.bit.images?.map(image => ({
          id: image.id,
          image: Buffer.from(image.image).toString('base64')
        })) || []
      }
    }))

    return NextResponse.json(beybladesWithBase64Images)
  } catch (error) {
    console.error('Erro ao buscar beyblades da coleção:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar beyblades da coleção' },
      { status: 500 }
    )
  }
} 