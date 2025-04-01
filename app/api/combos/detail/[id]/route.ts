import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Use params.id directly, don't try to await it
    const comboId = parseInt(params.id);
    
    if (isNaN(comboId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }
    
    const combo = await prisma.combo.findUnique({
      where: {
        id: comboId,
      },
      include: {
        blade: {
          include: {
            images: true,
          },
        },
        ratchet: {
          include: {
            images: true,
          },
        },
        bit: {
          include: {
            images: true,
          },
        },
      },
    });
    
    if (!combo) {
      return NextResponse.json({ error: 'Combo não encontrado' }, { status: 404 });
    }
    
    return NextResponse.json(combo);
  } catch (error) {
    console.error('Erro ao buscar detalhes do combo:', error);
    return NextResponse.json(
      { error: 'Erro interno ao buscar detalhes do combo' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
