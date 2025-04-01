import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
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
    peso: "60g"
  },
  {
    id: 2,
    nome: "CrimsonGaruda 4-70TP",
    imagem: "/placeholder.svg",
    descricao: "Beyblade de defesa com excelente equilíbrio",
    tipo: "Defense",
    peso: "70g"
  },
  {
    id: 3,
    nome: "ShelterDrake 7-80 GP",
    imagem: "/placeholder.svg",
    descricao: "Beyblade versátil com boa performance",
    tipo: "Balance",
    peso: "80g"
  }
]

export async function GET() {
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
        { error: 'Acesso negado. Apenas administradores podem acessar esta página.' },
        { status: 403 }
      )
    }

    const beyblades = await prisma.beyblade.findMany({
      include: {
        blade: {
          select: {
            id: true,
            name: true,
            images: {
              select: {
                id: true,
                image: true
              }
            }
          }
        },
        ratchet: {
          select: {
            id: true,
            name: true,
            images: {
              select: {
                id: true,
                image: true
              }
            }
          }
        },
        bit: {
          select: {
            id: true,
            name: true,
            images: {
              select: {
                id: true,
                image: true
              }
            }
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

    return NextResponse.json({ beyblades: beybladesWithBase64Images })
  } catch (error) {
    console.error('Erro ao buscar beyblades:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar beyblades' },
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
        { error: 'Acesso negado. Apenas administradores podem adicionar beyblades.' },
        { status: 403 }
      )
    }

    const data = await request.json()

    // Validação dos dados
    if (!data.bladeId || !data.ratchetId || !data.bitId || 
        !data.attack || !data.defesa || !data.stamina) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    // Verifica se as peças existem
    const [blade, ratchet, bit] = await Promise.all([
      prisma.blade.findUnique({ where: { id: data.bladeId } }),
      prisma.ratchet.findUnique({ where: { id: data.ratchetId } }),
      prisma.bit.findUnique({ where: { id: data.bitId } })
    ])

    if (!blade || !ratchet || !bit) {
      return NextResponse.json(
        { error: 'Uma ou mais peças não foram encontradas' },
        { status: 404 }
      )
    }

    // Cria a beyblade
    const beyblade = await prisma.beyblade.create({
      data: {
        bladeId: data.bladeId,
        ratchetId: data.ratchetId,
        bitId: data.bitId,
        attack: data.attack,
        defesa: data.defesa,
        stamina: data.stamina,
        equilibrio: Math.round((data.attack + data.defesa + data.stamina) / 3)
      }
    })

    return NextResponse.json(beyblade)
  } catch (error) {
    console.error('Erro ao criar beyblade:', error)
    return NextResponse.json(
      { error: 'Erro ao criar beyblade' },
      { status: 500 }
    )
  }
} 