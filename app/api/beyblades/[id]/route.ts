import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Dados mockados para exemplo
const beyblades = [
  {
    id: 1,
    nome: "GolemRock 1-60UN",
    imagem: "/placeholder.svg",
    descricao: "Beyblade de ataque com alta resistência",
    tipo: "Attack",
    peso: "60g",
    detalhes: {
      energia: 85,
      velocidade: 75,
      defesa: 90,
      stamina: 80
    }
  },
  {
    id: 2,
    nome: "CrimsonGaruda 4-70TP",
    imagem: "/placeholder.svg",
    descricao: "Beyblade de defesa com excelente equilíbrio",
    tipo: "Defense",
    peso: "70g",
    detalhes: {
      energia: 70,
      velocidade: 85,
      defesa: 95,
      stamina: 85
    }
  },
  {
    id: 3,
    nome: "ShelterDrake 7-80 GP",
    imagem: "/placeholder.svg",
    descricao: "Beyblade versátil com boa performance",
    tipo: "Balance",
    peso: "80g",
    detalhes: {
      energia: 80,
      velocidade: 80,
      defesa: 80,
      stamina: 90
    }
  }
]

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Aguarda os parâmetros antes de usá-los
    const { id } = await params
    const beybladeId = parseInt(id)

    const beyblade = await prisma.beyblade.findUnique({
      where: {
        id: beybladeId
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

    if (!beyblade) {
      return NextResponse.json(
        { error: 'Beyblade não encontrada' },
        { status: 404 }
      )
    }

    // Converter o buffer da imagem para base64
    const beybladeWithBase64Images = {
      ...beyblade,
      blade: {
        ...beyblade.blade,
        images: beyblade.blade.images && beyblade.blade.images.length > 0 ? [{
          id: beyblade.blade.images[0].id,
          image: Buffer.from(beyblade.blade.images[0].image).toString('base64')
        }] : []
      },
      ratchet: {
        ...beyblade.ratchet,
        images: beyblade.ratchet.images && beyblade.ratchet.images.length > 0 ? [{
          id: beyblade.ratchet.images[0].id,
          image: Buffer.from(beyblade.ratchet.images[0].image).toString('base64')
        }] : []
      },
      bit: {
        ...beyblade.bit,
        images: beyblade.bit.images && beyblade.bit.images.length > 0 ? [{
          id: beyblade.bit.images[0].id,
          image: Buffer.from(beyblade.bit.images[0].image).toString('base64')
        }] : []
      }
    }

    return NextResponse.json(beybladeWithBase64Images)
  } catch (error) {
    console.error('Erro ao buscar beyblade:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar beyblade' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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
        { error: 'Acesso negado. Apenas administradores podem atualizar beyblades.' },
        { status: 403 }
      )
    }

    const id = parseInt(params.id)
    const data = await request.json()

    const beyblade = await prisma.beyblade.update({
      where: { id },
      data: {
        attack: data.attack,
        stamina: data.stamina,
        defesa: data.defesa,
        ratchetId: data.ratchetId,
        bitId: data.bitId,
        equilibrio: Math.round((data.attack + data.defesa + data.stamina) / 3)
      }
    })

    return NextResponse.json(beyblade)
  } catch (error) {
    console.error('Erro ao atualizar beyblade:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar beyblade' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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
        { error: 'Acesso negado. Apenas administradores podem deletar beyblades.' },
        { status: 403 }
      )
    }

    const { id } = await params

    await prisma.beyblade.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar beyblade:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar beyblade' },
      { status: 500 }
    )
  }
} 