import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const ratchets = await prisma.ratchet.findMany({
      select: {
        id: true,
        name: true
      }
    })

    return NextResponse.json({ ratchets })
  } catch (error) {
    console.error('Erro ao buscar ratchets:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar ratchets' },
      { status: 500 }
    )
  }
} 