'use client'

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

export default function CreateComboStep3Page() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Bit[]>([])
  const [selectedBit, setSelectedBit] = useState<Bit | null>(null)
  const [allBits, setAllBits] = useState<Bit[]>([])
  const [selectedBitImage, setSelectedBitImage] = useState<string | null>(null)
  const [selectedBlade, setSelectedBlade] = useState<any>(null)
  const [selectedRatchet, setSelectedRatchet] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Recupera as peças selecionadas do localStorage
    const savedBlade = localStorage.getItem('selectedBlade')
    const savedRatchet = localStorage.getItem('selectedRatchet')
    
    // Verifica se todas as etapas anteriores foram completadas
    if (!savedBlade || !savedRatchet) {
      // Se não tiver blade, volta para a primeira etapa
      if (!savedBlade) {
        router.push('/criar-combo')
      } 
      // Se tiver blade mas não tiver ratchet, volta para a segunda etapa
      else if (!savedRatchet) {
        router.push('/criar-combo/step-2')
      }
      return
    }
    
    setSelectedBlade(JSON.parse(savedBlade))
    setSelectedRatchet(JSON.parse(savedRatchet))

    // Carrega os bits
    const fetchBits = async () => {
      try {
        const response = await fetch('/api/bits')
        if (!response.ok) throw new Error('Erro ao carregar bits')
        const data: Bit[] = await response.json()
        setAllBits(data)
      } catch (error) {
        console.error('Erro:', error)
      }
    }
    fetchBits()
  }, [router])

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
    
    try {
      const response = await fetch(`/api/bits/${bit.id}/image`)
      if (!response.ok) throw new Error('Erro ao carregar imagem')
      const imageData = await response.json()
      setSelectedBitImage(imageData.image)
    } catch (error) {
      console.error('Erro ao carregar imagem:', error)
      setSelectedBitImage(null)
    }
  }

  const saveCombo = async () => {
    if (!selectedBlade || !selectedRatchet || !selectedBit) {
      alert('Selecione todas as peças antes de salvar')
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch('/api/combos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bladeId: selectedBlade.id,
          ratchetId: selectedRatchet.id,
          bitId: selectedBit.id
        })
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar combo')
      }

      // Limpa o localStorage
      localStorage.removeItem('selectedBlade')
      localStorage.removeItem('selectedRatchet')

      // Redireciona para a página de combos
      router.push('/meus-combos')
    } catch (error) {
      console.error('Erro ao salvar combo:', error)
      alert('Erro ao salvar combo. Tente novamente.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="text-3xl font-bold tracking-wider">BEYLOG</Link>

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
          <h1 className="text-4xl font-bold text-center mb-16">CRIAR COMBO</h1>

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
              href="/criar-combo/step-2"
              className="bg-gray-300 text-black font-bold py-3 px-16 rounded-full hover:bg-gray-400"
            >
              VOLTAR
            </Link>
            <button 
              onClick={saveCombo}
              disabled={!selectedBit || isSaving}
              className={`bg-[#d9d9d9] text-black font-bold py-3 px-16 rounded-full ${
                !selectedBit || isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#c9c9c9]'
              }`}
            >
              {isSaving ? 'SALVANDO...' : 'SALVAR COMBO'}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="h-16 bg-black"></footer>
    </main>
  )
}