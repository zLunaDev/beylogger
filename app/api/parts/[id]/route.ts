import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

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
        { error: 'Acesso negado. Apenas administradores podem deletar peças.' },
        { status: 403 }
      )
    }

    const partId = parseInt(await params.id)

    // Verifica se a peça existe e seu tipo
    const [blade, ratchet, bit] = await Promise.all([
      prisma.blade.findUnique({ 
        where: { id: partId },
        include: {
          beyblades: true,
          combos: true
        }
      }),
      prisma.ratchet.findUnique({ 
        where: { id: partId },
        include: {
          beyblades: true,
          combos: true
        }
      }),
      prisma.bit.findUnique({ 
        where: { id: partId },
        include: {
          beyblades: true,
          combos: true
        }
      })
    ])

    if (!blade && !ratchet && !bit) {
      return NextResponse.json(
        { error: 'Peça não encontrada' },
        { status: 404 }
      )
    }

    // Verifica se a peça está em uso
    if (blade && (blade.beyblades.length > 0 || blade.combos.length > 0)) {
      return NextResponse.json(
        { error: 'Não é possível deletar esta peça pois ela está sendo usada em beyblades ou combos' },
        { status: 400 }
      )
    }

    if (ratchet && (ratchet.beyblades.length > 0 || ratchet.combos.length > 0)) {
      return NextResponse.json(
        { error: 'Não é possível deletar esta peça pois ela está sendo usada em beyblades ou combos' },
        { status: 400 }
      )
    }

    if (bit && (bit.beyblades.length > 0 || bit.combos.length > 0)) {
      return NextResponse.json(
        { error: 'Não é possível deletar esta peça pois ela está sendo usada em beyblades ou combos' },
        { status: 400 }
      )
    }

    // Deleta a peça e suas imagens
    if (blade) {
      await prisma.bladeImage.deleteMany({
        where: { bladeId: partId }
      })
      await prisma.blade.delete({
        where: { id: partId }
      })
    } else if (ratchet) {
      await prisma.ratchetImage.deleteMany({
        where: { ratchetId: partId }
      })
      await prisma.ratchet.delete({
        where: { id: partId }
      })
    } else if (bit) {
      await prisma.bitImage.deleteMany({
        where: { bitId: partId }
      })
      await prisma.bit.delete({
        where: { id: partId }
      })
    }

    return NextResponse.json({ message: 'Peça deletada com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar peça:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar peça' },
      { status: 500 }
    )
  }
} 