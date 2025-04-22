"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface BeybladeDetalhes {
  id: number
  nome: string
  imagem: string
  descricao: string
  tipo: string
  peso: string
  detalhes: {
    energia: number
    velocidade: number
    defesa: number
    stamina: number
  }
}

export default function BeybladeDetalhes({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [beyblade, setBeyblade] = useState<BeybladeDetalhes | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [user, setUser] = useState<any | null>(null)

  useEffect(() => {
    const fetchBeybladeDetalhes = async () => {
      try {
        const response = await fetch(`/api/beyblades/${params.id}`)
        if (!response.ok) {
          throw new Error('Beyblade não encontrado')
        }
        const data = await response.json()
        setBeyblade(data)
      } catch (error) {
        console.error('Erro ao buscar detalhes do beyblade:', error)
      } finally {
        setLoading(false)
      }
    }

    const fetchUser = async () => {
      try {
        const response = await fetch('/api/perfil')
        if (!response.ok) {
          throw new Error('Usuário não encontrado')
        }
        const data = await response.json()
        setUser(data)
      } catch (error) {
        console.error('Erro ao buscar informações do usuário:', error)
      }
    }

    if (params.id) {
      fetchBeybladeDetalhes()
    }

    fetchUser()
  }, [params.id])

  const handleAddToCollection = async () => {
    try {
      setError(null)
      setSuccess(null)
      
      if (!beyblade) {
        throw new Error('Beyblade não encontrado')
      }

      const response = await fetch('/api/colecao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          beybladeId: beyblade.id,
          nome: beyblade.nome,
          tipo: beyblade.tipo
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao adicionar beyblade à coleção')
      }

      setSuccess('Beyblade adicionado à sua coleção com sucesso!')
      
      // Redireciona para a página de coleção após 2 segundos
      setTimeout(() => {
        router.push('/colecao')
      }, 2000)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao adicionar beyblade à coleção')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-2xl">Carregando...</div>
      </div>
    )
  }

  if (!beyblade) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-2xl">Beyblade não encontrado</div>
      </div>
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
              <Link href="/meus-combos" className="px-6 py-4 text-lg font-medium border-r border-white">
                MEUS COMBOS
              </Link>
              <Link href="/listabeyblade" className="px-6 py-4 text-lg font-medium">
                VOLTAR
              </Link>
            </nav>

            <div className="flex items-center space-x-1">
              <Link href="/perfil" className="px-6 py-4 text-lg font-medium border-l border-white">
                {user?.username || 'Blader'}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Imagem */}
            <div className="flex justify-center items-center">
              <div className="w-96 h-96 relative">
                <Image
                  src={beyblade.imagem}
                  alt={beyblade.nome}
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Detalhes */}
            <div className="space-y-6">
              <h1 className="text-4xl font-bold">{beyblade.nome}</h1>
              <p className="text-xl text-gray-600">{beyblade.descricao}</p>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Tipo:</span>
                  <span className="text-lg">{beyblade.tipo}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Peso:</span>
                  <span className="text-lg">{beyblade.peso}</span>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Estatísticas</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Energia</span>
                      <span>{beyblade.detalhes.energia}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full" 
                        style={{ width: `${beyblade.detalhes.energia}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Velocidade</span>
                      <span>{beyblade.detalhes.velocidade}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${beyblade.detalhes.velocidade}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Defesa</span>
                      <span>{beyblade.detalhes.defesa}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${beyblade.detalhes.defesa}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Stamina</span>
                      <span>{beyblade.detalhes.stamina}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-600 h-2 rounded-full" 
                        style={{ width: `${beyblade.detalhes.stamina}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleAddToCollection}
                className="w-full bg-[#d9d9d9] text-black font-bold py-3 px-12 rounded-md hover:bg-gray-400 transition-colors"
              >
                ADICIONAR À MINHA COLEÇÃO
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="h-16 bg-black"></footer>
    </main>
  )
}