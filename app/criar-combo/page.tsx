"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search } from "lucide-react"

interface Blade {
  id: number
  name: string
  images: {
    id: number
    image: string
  }[]
}

export default function CreateComboPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Blade[]>([])
  const [selectedBlade, setSelectedBlade] = useState<Blade | null>(null)
  const [allBlades, setAllBlades] = useState<Blade[]>([])
  const [selectedBladeImage, setSelectedBladeImage] = useState<string | null>(null)

  useEffect(() => {
    const fetchBlades = async () => {
      try {
        const response = await fetch('/api/blades')
        if (!response.ok) throw new Error('Erro ao carregar blades')
        const data: Blade[] = await response.json()
        setAllBlades(data)
      } catch (error) {
        console.error('Erro:', error)
      }
    }
    fetchBlades()
  }, [])

  // Filtrar blades conforme digita
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = allBlades.filter(blade => 
        blade.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setSearchResults(filtered)
    } else {
      setSearchResults([])
    }
  }, [searchQuery, allBlades])

  const selectBlade = async (blade: Blade) => {
    setSelectedBlade(blade)
    setSearchQuery("")
    setSearchResults([])
    
    try {
      // Busca a imagem da blade específica
      const response = await fetch(`/api/blades/${blade.id}/image`)
      if (!response.ok) throw new Error('Erro ao carregar imagem')
      const imageData = await response.json()
      setSelectedBladeImage(imageData.image)
    } catch (error) {
      console.error('Erro ao carregar imagem:', error)
      setSelectedBladeImage(null)
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
            <h2 className="text-2xl font-bold text-center mb-8">BLADE</h2>

            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div className="flex flex-col items-center">
                <div className="w-64 h-64 relative mb-4 bg-white">
                  {selectedBladeImage && (
                    <Image
                      src={`data:image/jpeg;base64,${selectedBladeImage}`}
                      alt={selectedBlade?.name || ""}
                      fill
                      className="object-contain"
                    />
                  )}
                </div>
                <p className="text-lg">{selectedBlade?.name || 'Selecione uma Blade'}</p>
              </div>

              <div className="relative">
                <label htmlFor="blade-search" className="block text-lg font-medium mb-2">
                  Selecione a Blade:
                </label>
                <div className="relative">
                  <input
                    id="blade-search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-3 pr-10 border border-black rounded-md"
                    placeholder="Pesquisar blades..."
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Search className="h-5 w-5 text-gray-500" />
                  </div>
                </div>

                {searchResults.length > 0 && (
                  <div className="absolute w-full mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md bg-white z-10">
                    {searchResults.map(blade => (
                      <button
                        key={blade.id}
                        onClick={() => selectBlade(blade)}
                        className="w-full p-2 text-left hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                      >
                        {blade.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Link 
              href="/criar-combo/step-2" 
              className={`bg-[#d9d9d9] text-black font-bold py-3 px-16 rounded-full ${
                !selectedBlade ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#c9c9c9]'
              }`}
              onClick={(e) => {
                if (!selectedBlade) {
                  e.preventDefault()
                  alert('Selecione uma blade antes de avançar')
                } else {
                  localStorage.setItem('selectedBlade', JSON.stringify({
                    ...selectedBlade,
                    images: selectedBladeImage ? [{ id: 1, image: selectedBladeImage }] : []
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