"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"

interface Bit {
  id: number
  name: string
  images: {
    id: number
    image: string
  }[]
}

export default function EditComboStep3Page() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Bit[]>([])
  const [selectedBit, setSelectedBit] = useState<Bit | null>(null)
  const [allBits, setAllBits] = useState<Bit[]>([])
  const [selectedBitImage, setSelectedBitImage] = useState<string | null>(null)
  const [editingCombo, setEditingCombo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Recupera os dados das etapas anteriores do localStorage
    const savedCombo = localStorage.getItem('editingCombo')
    
    // Verifica se a etapa anterior foi completada
    if (!savedCombo) {
      router.push('/editar-combo')
      return
    }
    
    const combo = JSON.parse(savedCombo)
    setEditingCombo(combo)
    
    // Se já tem um bit selecionado, defini-lo como o bit atual
    if (combo.bit) {
      setSelectedBit(combo.bit)
      
      // Buscar a imagem do bit diretamente pela API
      fetchBitImage(combo.bit.id)
    }

    // Carrega os bits
    const fetchBits = async () => {
      try {
        const response = await fetch('/api/bits')
        if (!response.ok) throw new Error('Erro ao carregar bits')
        const data = await response.json()
        setAllBits(data)
        setLoading(false)
      } catch (error) {
        console.error('Erro:', error)
        setError("Erro ao carregar bits")
        setLoading(false)
      }
    }
    fetchBits()
  }, [router])

  // Filtrar bits conforme digita
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = allBits.filter(bit => 
        bit.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setSearchResults(filtered)
    } else {
      setSearchResults([])
    }
  }, [searchQuery, allBits])

  const selectBit = async (bit: Bit) => {
    setSelectedBit(bit)
    setSearchQuery("")
    setSearchResults([])
    
    fetchBitImage(bit.id)
  }

  const handleFinishEdit = async () => {
    if (!editingCombo || !selectedBit) {
      alert('Selecione um bit antes de finalizar')
      return
    }

    setSaving(true)

    try {
      const response = await fetch(`/api/combos/${editingCombo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bladeId: editingCombo.blade.id,
          ratchetId: editingCombo.ratchet.id,
          bitId: selectedBit.id
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao salvar combo')
      }
      
      // Limpar localStorage
      localStorage.removeItem('editingCombo')
      localStorage.removeItem('selectedBlade')
      
      // Redirecionar para página de combos
      alert('Combo atualizado com sucesso!')
      router.push('/meus-combos')
    } catch (error) {
      console.error('Erro ao salvar combo:', error)
      alert(`Erro ao salvar combo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    } finally {
      setSaving(false)
    }
  }

  // Função separada para buscar a imagem do bit
  const fetchBitImage = async (bitId: number) => {
    try {
      const response = await fetch(`/api/bits/${bitId}/image`)
      if (!response.ok) throw new Error('Erro ao carregar imagem do bit')
      const imageData = await response.json()
      setSelectedBitImage(imageData.image)
    } catch (error) {
      console.error('Erro ao buscar imagem do bit:', error)
      setSelectedBitImage(null)
    }
  }

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

          <div className="border-2 border-black rounded-lg p-8 mb-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">BIT</h2>

            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div className="flex flex-col items-center">
                <div className="w-64 h-64 relative mb-4 bg-white">
                  {selectedBitImage && (
                    <Image
                      src={`data:image/jpeg;base64,${selectedBitImage}`}
                      alt={selectedBit?.name || ""}
                      fill
                      className="object-contain"
                    />
                  )}
                </div>
                <p className="text-lg">{selectedBit?.name || 'Selecione um Bit'}</p>
              </div>

              <div className="relative">
                <label htmlFor="bit-search" className="block text-lg font-medium mb-2">
                  Selecione o Bit:
                </label>
                <div className="relative">
                  <input
                    id="bit-search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-3 pr-10 border border-black rounded-md"
                    placeholder="Pesquisar bits..."
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Search className="h-5 w-5 text-gray-500" />
                  </div>
                </div>

                {searchResults.length > 0 && (
                  <div className="absolute w-full mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md bg-white z-10">
                    {searchResults.map(bit => (
                      <button
                        key={bit.id}
                        onClick={() => selectBit(bit)}
                        className="w-full p-2 text-left hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                      >
                        {bit.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Link 
              href="/editar-combo/step-2"
              className="bg-gray-300 text-black font-bold py-3 px-16 rounded-full hover:bg-gray-400"
            >
              VOLTAR
            </Link>
            <button 
              onClick={handleFinishEdit}
              disabled={!selectedBit || saving}
              className={`bg-[#d9d9d9] text-black font-bold py-3 px-16 rounded-full ${
                !selectedBit || saving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#c9c9c9]'
              }`}
            >
              {saving ? 'SALVANDO...' : 'FINALIZAR'}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="h-16 bg-black"></footer>
    </main>
  )
}
