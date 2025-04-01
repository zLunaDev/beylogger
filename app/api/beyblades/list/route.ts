import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const beyblades = await prisma.beyblade.findMany({
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

    // Converte as imagens para base64
    const beybladesWithBase64Images = beyblades.map(beyblade => ({
      ...beyblade,
      blade: {
        ...beyblade.blade,
        images: beyblade.blade.images?.map(image => ({
          id: image.id,
          image: Buffer.from(image.image).toString('base64')
        })) || []
      },
      ratchet: {
        ...beyblade.ratchet,
        images: beyblade.ratchet.images?.map(image => ({
          id: image.id,
          image: Buffer.from(image.image).toString('base64')
        })) || []
      },
      bit: {
        ...beyblade.bit,
        images: beyblade.bit.images?.map(image => ({
          id: image.id,
          image: Buffer.from(image.image).toString('base64')
        })) || []
      }
    }))

    return NextResponse.json(beybladesWithBase64Images)
  } catch (error) {
    console.error('Erro ao buscar beyblades:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar beyblades' },
      { status: 500 }
    )
  }
} 