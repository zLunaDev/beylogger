import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const comboId = parseInt(params.id)
    
    // Verificar se o ID é válido
    if (isNaN(comboId)) {
      return NextResponse.json(
        { error: 'ID do combo inválido' },
        { status: 400 }
      )
    }

    // Obter os dados da requisição
    const { bladeId, ratchetId, bitId } = await request.json()

    // Verificar se todos os IDs necessários foram fornecidos
    if (!bladeId || !ratchetId || !bitId) {
      return NextResponse.json(
        { error: 'Todos os componentes são obrigatórios (blade, ratchet e bit)' },
        { status: 400 }
      )
    }

    // Verificar se o combo existe
    const existingCombo = await prisma.combo.findUnique({
      where: { id: comboId }
    })

    if (!existingCombo) {
      return NextResponse.json(
        { error: 'Combo não encontrado' },
        { status: 404 }
      )
    }

    // Atualizar o combo
    const updatedCombo = await prisma.combo.update({
      where: { id: comboId },
      data: {
        bladeId,
        ratchetId,
        bitId
      }
    })

    return NextResponse.json(updatedCombo)
  } catch (error) {
    console.error('Erro ao atualizar combo:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar combo' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const comboId = parseInt(params.id)

    // Verifica se o combo existe
    const combo = await prisma.combo.findUnique({
      where: { id: comboId }
    })

    if (!combo) {
      return NextResponse.json(
        { error: 'Combo não encontrado' },
        { status: 404 }
      )
    }

    // TODO: Verificar se o usuário tem permissão para deletar este combo
    // if (combo.userId !== currentUserId) {
    //   return NextResponse.json(
    //     { error: 'Não autorizado' },
    //     { status: 403 }
    //   )
    // }

    // Deleta o combo
    await prisma.combo.delete({
      where: { id: comboId }
    })

    return NextResponse.json({ message: 'Combo deletado com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar combo:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar combo' },
      { status: 500 }
    )
  }
} 