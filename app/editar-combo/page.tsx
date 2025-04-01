"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

interface Combo {
  id: number
  bladeId: number
  ratchetId: number
  bitId: number
  userId: number
  blade: {
    id: number
    name: string
    images: {
      id: number
      image: string
    }[]
  }
  ratchet: {
    id: number
    name: string
    images: {
      id: number
      image: string
    }[]
  }
  bit: {
    id: number
    name: string
    images: {
      id: number
      image: string
    }[]
  }
}

export default function EditComboPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const comboId = searchParams.get('id')
  
  const [combo, setCombo] = useState<Combo | null>(null)
  const [bladeImage, setBladeImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Carregar o combo existente
  useEffect(() => {
    const fetchCombo = async () => {
      if (!comboId) {
        setError("ID do combo não fornecido")
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/combos/detail/${comboId}`, {
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API response error:', response.status, errorText);
          throw new Error(`Erro ao carregar combo: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json()
        console.log("Combo carregado:", data)
        
        setCombo(data)
        
        // Buscar a imagem da blade
        if (data.blade && data.blade.id) {
          try {
            const bladeResponse = await fetch(`/api/blades/${data.blade.id}/image`)
            if (bladeResponse.ok) {
              const bladeData = await bladeResponse.json()
              setBladeImage(bladeData.image)
            }
          } catch (err) {
            console.error('Erro ao buscar imagem da blade:', err)
          }
        }

        // Armazenar o combo para as próximas etapas
        localStorage.setItem('editingCombo', JSON.stringify({
          id: data.id,
          blade: data.blade,
          ratchet: data.ratchet,
          bit: data.bit
        }))
        
        // Armazenar a blade selecionada no localStorage
        localStorage.setItem('selectedBlade', JSON.stringify(data.blade))
      } catch (error) {
        console.error('Erro ao carregar combo:', error)
        setError(`Erro ao carregar o combo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
      } finally {
        setLoading(false)
      }
    }

    fetchCombo()
  }, [comboId])

  if (loading) {
    return (
      <main className="flex flex-col min-h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl">Carregando...</div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex flex-col min-h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl text-red-600">{error}</div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-3xl font-bold tracking-wider">BEYLOG</div>

            <nav className="hidden md:flex space-x-1">
              <Link href="/meus-beys" className="px-6 py-4 text-lg font-medium border-r border-white">
                MEUS BEYS
              </Link>
              <Link href="/meus-combos" className="px-6 py-4 text-lg font-medium">
                MEUS COMBOS
              </Link>
            </nav>

            <div className="flex items-center space-x-1">
              <Link href="/perfil" className="px-6 py-4 text-lg font-medium border-l border-white">
                Usuario
              </Link>
              <Link href="/logout" className="px-6 py-4 text-lg font-medium border-l border-white">
                SAIR
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center mb-16">EDITAR COMBO</h1>

          {/* Mostrar Blade Selecionada */}
          <div className="border-2 border-black rounded-lg p-8 mb-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">BLADE</h2>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="flex flex-col items-center">
                <div className="w-64 h-64 relative mb-4 bg-white">
                  {bladeImage && (
                    <Image
                      src={`data:image/jpeg;base64,${bladeImage}`}
                      alt={combo?.blade.name || ""}
                      fill
                      className="object-contain"
                      priority
                    />
                  )}
                </div>
                <p className="text-lg font-medium">{combo?.blade.name || 'Blade do combo'}</p>
              </div>
              
              <div className="text-center">
                <p className="text-lg">
                  Esta blade foi selecionada automaticamente do combo existente.
                </p>
                <p className="text-lg mt-2">
                  Para criar um combo com uma blade diferente, use a opção "Criar Combo".
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Link 
              href="/meus-combos"
              className="bg-gray-300 text-black font-bold py-3 px-16 rounded-full hover:bg-gray-400"
            >
              VOLTAR
            </Link>
            <Link 
              href="/editar-combo/step-2" 
              className="bg-[#d9d9d9] text-black font-bold py-3 px-16 rounded-full hover:bg-[#c9c9c9]"
              onClick={() => {
                // Garantir que o localStorage está atualizado
                if (combo && bladeImage) {
                  const updatedBlade = {
                    ...combo.blade,
                    images: [{ id: 1, image: bladeImage }]
                  }
                  
                  localStorage.setItem('selectedBlade', JSON.stringify(updatedBlade))
                  
                  localStorage.setItem('editingCombo', JSON.stringify({
                    id: combo.id,
                    blade: updatedBlade,
                    ratchet: combo.ratchet,
                    bit: combo.bit
                  }))
                }
              }}
            >
              AVANÇAR
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="h-16 bg-black"></footer>
    </main>
  )
}
