import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const blades = await prisma.blade.findMany({
      include: {
        images: true
      }
    })

    return NextResponse.json(blades)
  } catch (error) {
    console.error('Erro ao buscar blades:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar blades' },
      { status: 500 }
    )
  }
} 