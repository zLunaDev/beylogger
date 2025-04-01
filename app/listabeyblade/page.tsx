'use client'

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface Beyblade {
  id: number
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
  }
  bit: {
    id: number
    name: string
  }
}

export default function ListaBeybladePage() {
  const router = useRouter()
  const [beyblades, setBeyblades] = useState<Beyblade[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const fetchBeyblades = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('/api/beyblades/list')
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Erro ao carregar beyblades')
        }

        if (!Array.isArray(data)) {
          throw new Error('Dados inválidos recebidos do servidor')
        }

        setBeyblades(data)
      } catch (error) {
        console.error('Erro ao carregar beyblades:', error)
        setError(error instanceof Error ? error.message : 'Erro ao carregar beyblades disponíveis')
      } finally {
        setLoading(false)
      }
    }

    fetchBeyblades()
  }, [])

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
              <Link href="/colecao" className="px-6 py-4 text-lg font-medium border-r border-white">
                MEUS BEYS
              </Link>
              <Link href="/meus-combos" className="px-6 py-4 text-lg font-medium">
                MEUS COMBOS
              </Link>
            </nav>

            <div className="flex items-center space-x-1">
              <Link href="/dashboard" className="px-6 py-4 text-lg font-medium border-l border-white">
                VOLTAR
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center mb-16">BEYBLADES</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {beyblades.map((beyblade) => {
              const imageUrl = beyblade.blade.images?.[0]?.image
                ? `data:image/jpeg;base64,${beyblade.blade.images[0].image}`
                : null

              return (
                <div key={beyblade.id} className="border-2 border-black rounded-lg p-6 flex flex-col items-center">
                  <div className="w-[300px] h-[300px] relative mb-4 flex items-center justify-center overflow-hidden">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={`${beyblade.blade.name} Beyblade`}
                        width={300}
                        height={300}
                        className="object-contain w-full h-full"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">Sem imagem</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xl font-medium mb-6">
                    {`${beyblade.blade.name} ${beyblade.ratchet.name} ${beyblade.bit.name}`}
                  </p>
                  <div className="flex flex-col items-center">
                    <Link 
                      href={`/beybladedetalhes/${beyblade.id}`}
                      className="bg-[#d9d9d9] text-black font-bold py-2 px-12 rounded-md w-full text-center hover:bg-[#c9c9c9] transition-colors"
                    >
                      VER DETALHES
                    </Link>
                    {error && (
                      <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-center">
                        {error}
                      </div>
                    )}
                    {success && (
                      <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md text-center">
                        {success}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="h-16 bg-black"></footer>
    </main>
  )
}

