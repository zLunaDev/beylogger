'use client'

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Heart } from "lucide-react"

interface User {
  id: number
  email: string
  username: string | null
  isAdmin: boolean
}

interface LastBeyblade {
  id: number
  nome: string
  imagem: string
  tipo: string
  stats: {
    attack: number
    stamina: number
    defesa: number
    equilibrio: number
  }
}

interface TopCombo {
  id: number
  nome: string
  imagem: string | null
  likes: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [lastBeyblade, setLastBeyblade] = useState<LastBeyblade | null>(null)
  const [topCombo, setTopCombo] = useState<TopCombo | null>(null)
  const [topDayCombo, setTopDayCombo] = useState<TopCombo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        })

        if (!response.ok) {
          throw new Error('Não autorizado')
        }

        const data = await response.json()
        console.log('Dados do usuário recebidos:', data)
        setUser(data.user)
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    const fetchData = async () => {
      try {
        // Busca o combo mais votado do dia
        const topDayResponse = await fetch('/api/combos/top-day')
        if (!topDayResponse.ok) throw new Error('Erro ao buscar combo mais votado do dia')
        const topDayData = await topDayResponse.json()
        if (topDayData) {
          setTopDayCombo(topDayData)
        }

        // Busca o último beyblade adicionado
        const lastBeybladeResponse = await fetch('/api/beyblades/last')
        if (!lastBeybladeResponse.ok) throw new Error('Erro ao buscar último beyblade')
        const lastBeybladeData = await lastBeybladeResponse.json()
        if (lastBeybladeData) {
          setLastBeyblade(lastBeybladeData)
        }

        // Busca o combo com mais likes do usuário
        const topComboResponse = await fetch('/api/combos')
        if (!topComboResponse.ok) throw new Error('Erro ao buscar combo com mais likes')
        const topComboData = await topComboResponse.json()
        if (topComboData.topCombo) {
          setTopCombo({
            id: topComboData.topCombo.id,
            nome: `${topComboData.topCombo.blade.name} ${topComboData.topCombo.ratchet.name} ${topComboData.topCombo.bit.name}`,
            imagem: topComboData.topCombo.blade.images[0]?.image || null,
            likes: topComboData.topCombo.likes
          })
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error)
        setError('Erro ao carregar dados')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
    fetchData()
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      router.push('/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
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

  if (!user) {
    return null
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
              <Link href="/perfil" className="px-6 py-4 text-lg font-medium border-l border-white">
                {user.username || 'Blader'}
              </Link>
              <button
                onClick={handleLogout}
                className="px-6 py-4 text-lg font-medium border-l border-white hover:text-gray-300"
              >
                SAIR
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center mb-16">BEM VINDO: {user.username || 'Blader'}</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Card 1 */}
            <div className="border-2 border-black rounded-lg p-6 flex flex-col items-center">
              <h2 className="text-xl font-semibold mb-4">Seu Combo com mais likes:</h2>
              <div className="w-48 h-48 relative mb-4">
                {topCombo?.imagem ? (
                  <Image
                    src={`data:image/jpeg;base64,${topCombo.imagem}`}
                    alt={topCombo.nome}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">Sem imagem</span>
                  </div>
                )}
              </div>
              <p className="text-xl font-medium mb-6">{topCombo?.nome || "Nenhum combo adicionado"}</p>
              {topCombo?.id ? (
                <Link 
                  href={`/editar-combo?id=${topCombo.id}`} 
                  className="bg-[#d9d9d9] text-black font-bold py-2 px-12 rounded-md w-full text-center hover:bg-gray-300 transition-colors"
                >
                  EDITAR
                </Link>
              ) : (
                <button className="bg-[#d9d9d9] text-black font-bold py-2 px-12 rounded-md w-full opacity-50 cursor-not-allowed">EDITAR</button>
              )}
            </div>

            {/* Card 2 */}
            <div className="border-2 border-black rounded-lg p-6 flex flex-col items-center">
              <h2 className="text-xl font-semibold mb-4">Ultimo Beyblade Adicionado</h2>
              <div className="w-48 h-48 relative mb-4 flex items-center justify-center">
                {lastBeyblade?.imagem ? (
                  <Image
                    src={lastBeyblade.imagem}
                    alt={lastBeyblade.nome}
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
              <p className="text-xl font-medium mb-6">{lastBeyblade?.nome || "Nenhum beyblade adicionado"}</p>
              {lastBeyblade?.id ? (
                <Link
                  href={`/beybladedetalhes/${lastBeyblade.id}`}
                  className="bg-[#d9d9d9] text-black font-bold py-2 px-12 rounded-md w-full text-center hover:bg-gray-200 transition-colors"
                >
                  VER DETALHES
                </Link>
              ) : (
                <p className="text-gray-500 italic">Em breve...</p>
              )}
            </div>

            {/* Card 3 */}
            <div className="border-2 border-black rounded-lg p-6 flex flex-col items-center">
              <h2 className="text-xl font-semibold mb-4">Combo Mais Votado Do Dia:</h2>
              <div className="w-48 h-48 relative mb-4">
                {topDayCombo?.imagem ? (
                  <Image
                    src={`data:image/jpeg;base64,${topDayCombo.imagem}`}
                    alt={topDayCombo.nome}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">Sem combo hoje</span>
                  </div>
                )}
              </div>
              <p className="text-xl font-medium mb-6">{topDayCombo?.nome || "Nenhum combo votado hoje"}</p>
              {topDayCombo && (
                <div className="flex items-center justify-center space-x-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span>{topDayCombo.likes} likes</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center space-x-8">
            <Link href="/listabeyblade" className="bg-[#d9d9d9] text-black font-bold py-3 px-12 rounded-full">
              BEYBLADES
            </Link>
            <Link href="/combos" className="bg-[#d9d9d9] text-black font-bold py-3 px-12 rounded-full">
              COMBOS
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="h-16 bg-black"></footer>
    </main>
  )
}

