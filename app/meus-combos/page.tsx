"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Trash2, Plus, Pencil } from "lucide-react"
import { useRouter } from "next/navigation"

interface Combo {
  id: number
  nome: string
  imagem: string | null
  likes: number
  liked: boolean
  usuario: {
    id: number
    username: string
  }
  userId: number
}

export default function MeusCombosPage() {
  const [combos, setCombos] = useState<Combo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<number | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (!response.ok) {
          throw new Error('Erro ao carregar usuário')
        }
        const data = await response.json()
        setUserId(data.user.id)
        setUsername(data.user.username)
      } catch (error) {
        console.error('Erro:', error)
        router.push('/login')
      }
    }

    fetchUserId()
  }, [router])

  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const response = await fetch('/api/combos/user')
        if (!response.ok) throw new Error('Erro ao carregar combos')
        const data = await response.json()
        setCombos(data)
      } catch (error) {
        console.error('Erro ao carregar combos:', error)
        setError('Erro ao carregar combos. Por favor, tente novamente.')
      } finally {
        setLoading(false)
      }
    }

    fetchCombos()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este combo?')) {
      return
    }

    try {
      const response = await fetch(`/api/combos/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir combo')
      }

      setCombos(combos.filter(combo => combo.id !== id))
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao excluir combo')
    }
  }

  const handleLike = async (id: number) => {
    try {
      const response = await fetch(`/api/combos/${id}/like`, {
        method: 'POST'
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar like')
      }

      // Atualiza o estado local com o combo atualizado
      const updatedCombo = await response.json()
      setCombos(combos.map(combo => 
        combo.id === id ? updatedCombo : combo
      ))
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao atualizar like')
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
              <Link href="/colecao" className="px-6 py-4 text-lg font-medium border-r border-white">
                MEUS BEYS
              </Link>
              <Link href="/combos" className="px-6 py-4 text-lg font-medium">
                COMBOS
              </Link>
            </nav>

            <div className="flex items-center space-x-1">
              <span className="px-6 py-4 text-lg font-medium border-l border-white">
                {username || 'Blader'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold">MEUS COMBOS</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Frame de Criar Combo */}
            <div className="bg-white border-2 border-black rounded-lg overflow-hidden">
              <div className="relative h-64 bg-white flex items-center justify-center">
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <Plus className="w-16 h-16 text-gray-400" />
                </div>
              </div>
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">Criar Novo Combo</h2>
                <p className="text-gray-600 mb-4">Crie um novo combo personalizado</p>
                <Link
                  href="/criar-combo"
                  className="block w-full px-4 py-2 bg-black text-white font-bold rounded-md hover:bg-gray-800 transition-colors text-center"
                >
                  Criar Combo
                </Link>
              </div>
            </div>

            {/* Lista de Combos */}
            {combos.map(combo => (
              <div key={combo.id} className="bg-white border-2 border-black rounded-lg overflow-hidden">
                <div className="relative h-64 bg-white flex items-center justify-center">
                  {combo.imagem ? (
                    <Image
                      src={`data:image/jpeg;base64,${combo.imagem}`}
                      alt={combo.nome}
                      fill
                      className="object-contain p-4"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <span className="text-gray-400">Sem imagem</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-2">{combo.nome}</h2>
                  <p className="text-gray-600 mb-4">Criado por: Você</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleLike(combo.id)}
                        className={`flex items-center space-x-1 ${
                          combo.liked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                        }`}
                      >
                        <Heart className="h-5 w-5" />
                        <span>{combo.likes}</span>
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/editar-combo?id=${combo.id}`}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Pencil className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(combo.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="h-16 bg-black"></footer>
    </main>
  )
} 