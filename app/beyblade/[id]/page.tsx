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
  attack: number
  stamina: number
  defesa: number
  equilibrio: number
}

export default function BeybladeDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [beyblade, setBeyblade] = useState<Beyblade | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBeyblade = async () => {
      try {
        const response = await fetch(`/api/beyblades/${params.id}`)
        if (!response.ok) {
          throw new Error('Erro ao carregar beyblade')
        }
        const data = await response.json()
        setBeyblade(data)
      } catch (error) {
        console.error('Erro:', error)
        setError('Erro ao carregar beyblade. Por favor, tente novamente.')
      } finally {
        setLoading(false)
      }
    }

    fetchBeyblade()
  }, [params.id])

  if (loading) {
    return (
      <main className="flex flex-col min-h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl">Carregando...</div>
        </div>
      </main>
    )
  }

  if (error || !beyblade) {
    return (
      <main className="flex flex-col min-h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl text-red-600">{error || 'Beyblade não encontrada'}</div>
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
            <Link href="/dashboard" className="text-3xl font-bold tracking-wider">BEYLOG</Link>

            <nav className="hidden md:flex space-x-1">
              <Link href="/colecao" className="px-6 py-4 text-lg font-medium border-r border-white">
                MEUS BEYS
              </Link>
              <Link href="/meus-combos" className="px-6 py-4 text-lg font-medium">
                MEUS COMBOS
              </Link>
            </nav>

            <div className="flex items-center space-x-1">
              <Link href="/listabeyblade" className="px-6 py-4 text-lg font-medium border-l border-white">
                VOLTAR
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Imagem da Beyblade */}
            <div className="flex flex-col items-center">
              <div className="w-[400px] h-[400px] relative mb-4 flex items-center justify-center overflow-hidden">
                {beyblade.blade.images?.[0]?.image ? (
                  <Image
                    src={`data:image/jpeg;base64,${beyblade.blade.images[0].image}`}
                    alt={`${beyblade.blade.name} Beyblade`}
                    width={400}
                    height={400}
                    className="object-contain w-full h-full"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">Sem imagem</span>
                  </div>
                )}
              </div>
            </div>

            {/* Detalhes da Beyblade */}
            <div className="flex flex-col">
              <h1 className="text-4xl font-bold mb-8">
                {`${beyblade.blade.name} ${beyblade.ratchet.name} ${beyblade.bit.name}`}
              </h1>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-2">Blade</h2>
                  <p className="text-lg">{beyblade.blade.name}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-2">Ratchet</h2>
                  <p className="text-lg">{beyblade.ratchet.name}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-2">Bit</h2>
                  <p className="text-lg">{beyblade.bit.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-100 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-2">Ataque</h2>
                  <p className="text-lg">{beyblade.attack}</p>
                </div>
                <div className="bg-blue-100 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-2">Defesa</h2>
                  <p className="text-lg">{beyblade.defesa}</p>
                </div>
                <div className="bg-green-100 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-2">Stamina</h2>
                  <p className="text-lg">{beyblade.stamina}</p>
                </div>
                <div className="bg-yellow-100 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-2">Equilíbrio</h2>
                  <p className="text-lg">{beyblade.equilibrio}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="h-16 bg-black"></footer>
    </main>
  )
}