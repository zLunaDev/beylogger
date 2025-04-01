import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

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
        { error: 'Acesso negado. Apenas administradores podem acessar estatísticas.' },
        { status: 403 }
      )
    }

    // Busca as estatísticas
    const [totalBeyblades, totalBlades, totalRatchets, totalBits] = await Promise.all([
      prisma.beyblade.count(),
      prisma.blade.count(),
      prisma.ratchet.count(),
      prisma.bit.count()
    ])

    return NextResponse.json({
      totalBeyblades,
      totalBlades,
      totalRatchets,
      totalBits
    })
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas' },
      { status: 500 }
    )
  }
} 