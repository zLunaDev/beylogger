import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST() {
  try {
    console.log('Iniciando limpeza do banco de dados...')

    // Limpa o banco de dados na ordem correta para respeitar as chaves estrangeiras
    try {
      console.log('Deletando beyblades...')
      await prisma.beyblade.deleteMany()
      console.log('Beyblades deletados com sucesso')
    } catch (error) {
      console.error('Erro ao deletar beyblades:', error)
      throw error
    }
    
    try {
      console.log('Deletando combos...')
      await prisma.combo.deleteMany()
      console.log('Combos deletados com sucesso')
    } catch (error) {
      console.error('Erro ao deletar combos:', error)
      throw error
    }
    
    try {
      console.log('Deletando imagens...')
      await prisma.bladeImage.deleteMany()
      await prisma.ratchetImage.deleteMany()
      await prisma.bitImage.deleteMany()
      console.log('Imagens deletadas com sucesso')
    } catch (error) {
      console.error('Erro ao deletar imagens:', error)
      throw error
    }
    
    try {
      console.log('Deletando peças...')
      await prisma.blade.deleteMany()
      await prisma.ratchet.deleteMany()
      await prisma.bit.deleteMany()
      console.log('Peças deletadas com sucesso')
    } catch (error) {
      console.error('Erro ao deletar peças:', error)
      throw error
    }

    console.log('Criando partes padrão...')

    // Cria partes padrão
    try {
      console.log('Criando blade...')
      const blade = await prisma.blade.create({
        data: {
          name: 'GolemRock'
        }
      })
      console.log('Blade criado:', blade)

      console.log('Criando ratchet...')
      const ratchet = await prisma.ratchet.create({
        data: {
          name: '1-60'
        }
      })
      console.log('Ratchet criado:', ratchet)

      console.log('Criando bit...')
      const bit = await prisma.bit.create({
        data: {
          name: 'UN'
        }
      })
      console.log('Bit criado:', bit)

      console.log('Criando beyblade de exemplo...')
      const beyblade = await prisma.beyblade.create({
        data: {
          attack: 85,
          stamina: 75,
          defesa: 90,
          equilibrio: 80,
          bladeId: blade.id,
          ratchetId: ratchet.id,
          bitId: bit.id
        }
      })
      console.log('Beyblade criado:', beyblade)

      return NextResponse.json({ 
        message: 'Banco de dados inicializado com sucesso',
        parts: { blade, ratchet, bit },
        beyblade
      })
    } catch (error) {
      console.error('Erro ao criar partes ou beyblade:', error)
      throw error
    }
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao inicializar banco de dados',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
} 