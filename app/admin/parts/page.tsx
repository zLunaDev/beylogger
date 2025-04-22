'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface Blade {
  id: number
  name: string
  images: {
    id: number
    image: string
  }[]
}

interface Ratchet {
  id: number
  name: string
  images: {
    id: number
    image: string
  }[]
}

interface Bit {
  id: number
  name: string
  images: {
    id: number
    image: string
  }[]
}

export default function PartsManagement() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [parts, setParts] = useState<{
    blades: Blade[]
    ratchets: Ratchet[]
    bits: Bit[]
  }>({
    blades: [],
    ratchets: [],
    bits: []
  })

  useEffect(() => {
    fetchParts()
  }, [])

  const fetchParts = async () => {
    try {
      const response = await fetch('/api/parts')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao carregar peças')
      }

      setParts(data)
    } catch (error) {
      setError('Erro ao carregar peças disponíveis')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number, type: 'blade' | 'ratchet' | 'bit') => {
    if (!confirm('Tem certeza que deseja deletar esta peça?')) {
      return
    }

    try {
      const response = await fetch(`/api/parts/${id}?type=${type}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao deletar peça')
      }

      setSuccess('Peça deletada com sucesso!')
      fetchParts() // Recarrega a lista de peças
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao deletar peça')
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl">Carregando...</div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <header className="flex justify-between items-center p-6 md:px-12 bg-black text-white">
        <div className="text-4xl font-bold tracking-wider">BEYLOG</div>
        <div className="space-x-6">
          <Link href="/admin/dashboard" className="text-xl font-medium tracking-wider hover:text-gray-300">
            DASHBOARD
          </Link>
          <Link href="/admin/parts/add" className="text-xl font-medium tracking-wider hover:text-gray-300">
            ADICIONAR PEÇA
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black">Gerenciar Peças</h1>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Blades */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Blades</h2>
            <div className="space-y-4">
              {parts.blades.map((blade) => (
                <div key={blade.id} className="border-2 border-black rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">{blade.name}</h3>
                    <div className="w-24 h-24 relative mt-2 bg-gray-100 rounded-lg overflow-hidden">
                      {blade.images?.[0]?.image ? (
                        <Image
                          src={`data:image/jpeg;base64,${blade.images[0].image}`}
                          alt={blade.name}
                          fill
                          className="object-contain"
                          sizes="(max-width: 96px) 100vw, 96px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-400">Sem imagem</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(blade.id, 'blade')}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    Deletar
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Ratchets */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Ratchets</h2>
            <div className="space-y-4">
              {parts.ratchets.map((ratchet) => (
                <div key={ratchet.id} className="border-2 border-black rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">{ratchet.name}</h3>
                    <div className="w-24 h-24 relative mt-2 bg-gray-100 rounded-lg overflow-hidden">
                      {ratchet.images?.[0]?.image ? (
                        <Image
                          src={`data:image/jpeg;base64,${ratchet.images[0].image}`}
                          alt={ratchet.name}
                          fill
                          className="object-contain"
                          sizes="(max-width: 96px) 100vw, 96px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-400">Sem imagem</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(ratchet.id, 'ratchet')}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    Deletar
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Bits */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Bits</h2>
            <div className="space-y-4">
              {parts.bits.map((bit) => (
                <div key={bit.id} className="border-2 border-black rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">{bit.name}</h3>
                    <div className="w-24 h-24 relative mt-2 bg-gray-100 rounded-lg overflow-hidden">
                      {bit.images?.[0]?.image ? (
                        <Image
                          src={`data:image/jpeg;base64,${bit.images[0].image}`}
                          alt={bit.name}
                          fill
                          className="object-contain"
                          sizes="(max-width: 96px) 100vw, 96px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-400">Sem imagem</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(bit.id, 'bit')}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    Deletar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}