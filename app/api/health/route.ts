import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    // Tenta conectar ao banco de dados
    await prisma.$connect()
    
    // Tenta fazer uma consulta simples
    const parts = await prisma.part.findMany()
    
    return NextResponse.json({ 
      status: 'ok',
      database: 'connected',
      partsCount: parts.length
    })
  } catch (error) {
    console.error('Erro ao verificar saúde do banco de dados:', error)
    return NextResponse.json(
      { 
        status: 'error',
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
} 