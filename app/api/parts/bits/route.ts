import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const bits = await prisma.bit.findMany({
      select: {
        id: true,
        name: true
      }
    })

    return NextResponse.json({ bits })
  } catch (error) {
    console.error('Erro ao buscar bits:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar bits' },
      { status: 500 }
    )
  }
} 