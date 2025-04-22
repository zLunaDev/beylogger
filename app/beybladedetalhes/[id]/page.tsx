'use client'

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { use } from "react"

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

interface PageParams {
  id: string
}

function BeybladeContent({ id }: { id: string }) {
  const router = useRouter()
  const [beyblade, setBeyblade] = useState<Beyblade | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [addingToCollection, setAddingToCollection] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isInCollection, setIsInCollection] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          setIsAuthenticated(true)
          // Verifica se o beyblade está na coleção do usuário
          const collectionResponse = await fetch(`/api/beyblades/collection/check/${id}`)
          if (collectionResponse.ok) {
            const data = await collectionResponse.json()
            setIsInCollection(data.isInCollection)
            if (data.isInCollection) {
              setError('Esta beyblade já está na sua coleção')
            }
          } else {
            const errorData = await collectionResponse.json()
            setError(errorData.error || 'Erro ao verificar coleção')
          }
        } else {
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
        setIsAuthenticated(false)
        setError('Erro ao verificar autenticação')
      }
    }

    checkAuth()
  }, [id])

  useEffect(() => {
    const fetchBeyblade = async () => {
      try {
        const response = await fetch(`/api/beyblades/${id}`)
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
  }, [id])

  const handleAddToCollection = async () => {
    if (!beyblade || !isAuthenticated) {
      router.push('/login')
      return
    }

    if (isInCollection) {
      setError('Esta beyblade já está na sua coleção')
      return
    }

    try {
      setAddingToCollection(true)
      setError(null)
      setSuccess(null)

      const response = await fetch('/api/beyblades/collection/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          beybladeId: beyblade.id
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao adicionar beyblade à coleção')
      }

      setSuccess('Beyblade adicionado à sua coleção com sucesso!')
      setIsInCollection(true)
    } catch (error) {
      console.error('Erro:', error)
      setError(error instanceof Error ? error.message : 'Erro ao adicionar beyblade à coleção')
    } finally {
      setAddingToCollection(false)
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

  if (!beyblade) {
    return (
      <main className="flex flex-col min-h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl text-red-600">Beyblade não encontrada</div>
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
                MINHA COLEÇÃO
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Imagem e Botão */}
            <div className="flex flex-col items-center">
              <div className="w-[400px] h-[400px] relative mb-6">
                {beyblade.blade.images?.[0]?.image ? (
                  <Image
                    src={`data:image/jpeg;base64,${beyblade.blade.images[0].image}`}
                    alt={`${beyblade.blade.name} Beyblade`}
                    fill
                    className="object-contain"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">Sem imagem</span>
                  </div>
                )}
              </div>

              {isAuthenticated ? (
                <div className="flex flex-col items-center">
                  <button
                    onClick={handleAddToCollection}
                    disabled={addingToCollection || isInCollection}
                    className={`bg-[#d9d9d9] text-black font-bold py-3 px-8 rounded-md transition-colors shadow-lg ${
                      isInCollection 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:bg-[#c9c9c9]'
                    }`}
                  >
                    {addingToCollection ? 'Adicionando...' : isInCollection ? 'JÁ ESTÁ NA SUA COLEÇÃO' : 'ADICIONAR À MINHA COLEÇÃO'}
                  </button>
                  {(error || success) && (
                    <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
                      error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {error || success}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="bg-[#d9d9d9] text-black font-bold py-3 px-8 rounded-md hover:bg-[#c9c9c9] transition-colors shadow-lg"
                >
                  FAÇA LOGIN PARA ADICIONAR À COLEÇÃO
                </Link>
              )}
            </div>

            {/* Informações */}
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

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-lg font-semibold">Ataque</span>
                    <span className="text-lg">{beyblade.attack}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-red-500 h-4 rounded-full transition-all duration-500" 
                      style={{ width: `${(beyblade.attack / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-lg font-semibold">Defesa</span>
                    <span className="text-lg">{beyblade.defesa}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-blue-500 h-4 rounded-full transition-all duration-500" 
                      style={{ width: `${(beyblade.defesa / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-lg font-semibold">Stamina</span>
                    <span className="text-lg">{beyblade.stamina}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-green-500 h-4 rounded-full transition-all duration-500" 
                      style={{ width: `${(beyblade.stamina / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-lg font-semibold">Equilíbrio</span>
                    <span className="text-lg">{beyblade.equilibrio}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-yellow-500 h-4 rounded-full transition-all duration-500" 
                      style={{ width: `${(beyblade.equilibrio / 10) * 100}%` }}
                    ></div>
                  </div>
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

export default function BeybladeDetalhesPage({ params }: { params: PageParams }) {
  const { id } = use(params as unknown as Promise<PageParams>)
  return <BeybladeContent id={id} />
}