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

    const resolvedParams = await Promise.resolve(params)
    const partId = parseInt(resolvedParams.id)
    
    // Get the part type from the query parameter
    const url = new URL(request.url)
    const partType = url.searchParams.get('type')
    
    console.log(`Attempting to delete part ID: ${partId}, Type: ${partType || 'not specified'}`)

    if (!partType || !['blade', 'ratchet', 'bit'].includes(partType)) {
      return NextResponse.json(
        { error: 'Tipo de peça inválido ou não especificado. Use ?type=blade, ?type=ratchet, ou ?type=bit' },
        { status: 400 }
      )
    }

    let partData = null;

    // Only check the specified part type
    if (partType === 'blade') {
      partData = await prisma.blade.findUnique({ 
        where: { id: partId },
        include: {
          beyblades: true,
          combos: true
        }
      });
      console.log(`Checking blade with ID ${partId}: ${!!partData}`);
    } else if (partType === 'ratchet') {
      partData = await prisma.ratchet.findUnique({ 
        where: { id: partId },
        include: {
          beyblades: true,
          combos: true
        }
      });
      console.log(`Checking ratchet with ID ${partId}: ${!!partData}`);
    } else if (partType === 'bit') {
      partData = await prisma.bit.findUnique({ 
        where: { id: partId },
        include: {
          beyblades: true,
          combos: true
        }
      });
      console.log(`Checking bit with ID ${partId}: ${!!partData}`);
    }

    if (!partData) {
      console.log(`${partType} with ID ${partId} not found`);
      return NextResponse.json(
        { error: `${partType} com ID ${partId} não encontrado` },
        { status: 404 }
      )
    }

    // Check if the part is being used
    if (partData.beyblades.length > 0 || partData.combos.length > 0) {
      console.log(`${partType} ${partId} has associations:`, {
        beyblades: partData.beyblades.length,
        combos: partData.combos.length
      });
      
      return NextResponse.json(
        { 
          error: `Não é possível deletar esta peça (${partType}) pois ela está sendo usada em beyblades ou combos`,
          details: {
            type: partType,
            beyblades: partData.beyblades.length,
            combos: partData.combos.length
          } 
        },
        { status: 400 }
      )
    }

    // Delete the part and its images
    console.log(`Deleting ${partType} with ID ${partId}`);
    
    if (partType === 'blade') {
      await prisma.bladeImage.deleteMany({
        where: { bladeId: partId }
      });
      await prisma.blade.delete({
        where: { id: partId }
      });
    } else if (partType === 'ratchet') {
      await prisma.ratchetImage.deleteMany({
        where: { ratchetId: partId }
      });
      await prisma.ratchet.delete({
        where: { id: partId }
      });
    } else if (partType === 'bit') {
      await prisma.bitImage.deleteMany({
        where: { bitId: partId }
      });
      await prisma.bit.delete({
        where: { id: partId }
      });
    }

    return NextResponse.json({ message: `${partType} com ID ${partId} deletado com sucesso` })
  } catch (error) {
    console.error('Erro ao deletar peça:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar peça' },
      { status: 500 }
    )
  }
}