"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"

interface Ratchet {
  id: number
  name: string
  images: {
    id: number
    image: string
  }[]
}

export default function CreateComboStep2Page() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Ratchet[]>([])
  const [selectedRatchet, setSelectedRatchet] = useState<Ratchet | null>(null)
  const [allRatchets, setAllRatchets] = useState<Ratchet[]>([])
  const [selectedRatchetImage, setSelectedRatchetImage] = useState<string | null>(null)
  const [selectedBlade, setSelectedBlade] = useState<any>(null)

  useEffect(() => {
    // Recupera a blade selecionada do localStorage
    const savedBlade = localStorage.getItem('selectedBlade')
    
    // Verifica se a etapa anterior foi completada
    if (!savedBlade) {
      router.push('/criar-combo')
      return
    }
    
    setSelectedBlade(JSON.parse(savedBlade))

    // Carrega os ratchets
    const fetchRatchets = async () => {
      try {
        const response = await fetch('/api/ratchets')
        if (!response.ok) throw new Error('Erro ao carregar ratchets')
        const data: Ratchet[] = await response.json()
        setAllRatchets(data)
      } catch (error) {
        console.error('Erro:', error)
      }
    }
    fetchRatchets()
  }, [router])

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = allRatchets.filter(ratchet => 
        ratchet.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setSearchResults(filtered)
    } else {
      setSearchResults([])
    }
  }, [searchQuery, allRatchets])

  const selectRatchet = async (ratchet: Ratchet) => {
    setSelectedRatchet(ratchet)
    setSearchQuery("")
    setSearchResults([])
    
    try {
      const response = await fetch(`/api/ratchets/${ratchet.id}/image`)
      if (!response.ok) throw new Error('Erro ao carregar imagem')
      const imageData = await response.json()
      setSelectedRatchetImage(imageData.image)
    } catch (error) {
      console.error('Erro ao carregar imagem:', error)
      setSelectedRatchetImage(null)
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
            <h2 className="text-2xl font-bold text-center mb-8">RATCHET</h2>

            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div className="flex flex-col items-center">
                <div className="w-64 h-64 relative mb-4 bg-white">
                  {selectedRatchetImage && (
                    <Image
                      src={`data:image/jpeg;base64,${selectedRatchetImage}`}
                      alt={selectedRatchet?.name || ""}
                      fill
                      className="object-contain"
                    />
                  )}
                </div>
                <p className="text-lg">{selectedRatchet?.name || 'Selecione um Ratchet'}</p>
              </div>

              <div className="relative">
                <label htmlFor="ratchet-search" className="block text-lg font-medium mb-2">
                  Selecione o Ratchet:
                </label>
                <div className="relative">
                  <input
                    id="ratchet-search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-3 pr-10 border border-black rounded-md"
                    placeholder="Pesquisar ratchets..."
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Search className="h-5 w-5 text-gray-500" />
                  </div>
                </div>

                {searchResults.length > 0 && (
                  <div className="absolute w-full mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md bg-white z-10">
                    {searchResults.map(ratchet => (
                      <button
                        key={ratchet.id}
                        onClick={() => selectRatchet(ratchet)}
                        className="w-full p-2 text-left hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                      >
                        {ratchet.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Link 
              href="/criar-combo"
              className="bg-gray-300 text-black font-bold py-3 px-16 rounded-full hover:bg-gray-400"
            >
              VOLTAR
            </Link>
            <Link 
              href="/criar-combo/step-3" 
              className={`bg-[#d9d9d9] text-black font-bold py-3 px-16 rounded-full ${
                !selectedRatchet ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#c9c9c9]'
              }`}
              onClick={(e) => {
                if (!selectedRatchet) {
                  e.preventDefault()
                  alert('Selecione um ratchet antes de avançar')
                } else {
                  localStorage.setItem('selectedRatchet', JSON.stringify({
                    ...selectedRatchet,
                    images: selectedRatchetImage ? [{ id: 1, image: selectedRatchetImage }] : []
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