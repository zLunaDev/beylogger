'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface DashboardStats {
  totalBeyblades: number
  totalBlades: number
  totalRatchets: number
  totalBits: number
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (!response.ok) {
          throw new Error('Não autorizado')
        }
        const data = await response.json()
        
        if (!data.user.isAdmin) {
          router.push('/dashboard')
          return
        }

        // Buscar estatísticas
        const statsResponse = await fetch('/api/admin/stats')
        if (!statsResponse.ok) {
          throw new Error('Erro ao carregar estatísticas')
        }
        const statsData = await statsResponse.json()
        setStats(statsData)
      } catch (error) {
        console.error('Erro:', error)
        setError('Erro ao carregar dashboard')
      } finally {
        setLoading(false)
      }
    }

    checkAdminAccess()
  }, [router])

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
              <Link href="/admin/beyblades" className="px-6 py-4 text-lg font-medium border-r border-white">
                BEYBLADES
              </Link>
              <Link href="/admin/parts" className="px-6 py-4 text-lg font-medium">
                PEÇAS
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
          <h1 className="text-4xl font-bold text-center mb-12">DASHBOARD ADMIN</h1>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-black text-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Total de Beyblades</h3>
              <p className="text-3xl font-bold">{stats?.totalBeyblades || 0}</p>
            </div>
            <div className="bg-black text-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Total de Blades</h3>
              <p className="text-3xl font-bold">{stats?.totalBlades || 0}</p>
            </div>
            <div className="bg-black text-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Total de Ratchets</h3>
              <p className="text-3xl font-bold">{stats?.totalRatchets || 0}</p>
            </div>
            <div className="bg-black text-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Total de Bits</h3>
              <p className="text-3xl font-bold">{stats?.totalBits || 0}</p>
            </div>
          </div>

          {/* Ações Rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link 
              href="/admin/beyblades/add"
              className="bg-black text-white p-6 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <h3 className="text-xl font-semibold mb-2">Adicionar Beyblade</h3>
              <p className="text-gray-300">Criar uma nova beyblade com peças existentes</p>
            </Link>
            <Link 
              href="/admin/parts/add"
              className="bg-black text-white p-6 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <h3 className="text-xl font-semibold mb-2">Adicionar Peça</h3>
              <p className="text-gray-300">Adicionar uma nova blade, ratchet ou bit</p>
            </Link>
            <Link 
              href="/admin/beyblades"
              className="bg-black text-white p-6 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <h3 className="text-xl font-semibold mb-2">Gerenciar Beyblades</h3>
              <p className="text-gray-300">Visualizar, editar ou remover beyblades</p>
            </Link>
            <Link 
              href="/admin/parts"
              className="bg-black text-white p-6 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <h3 className="text-xl font-semibold mb-2">Gerenciar Peças</h3>
              <p className="text-gray-300">Visualizar, editar ou remover peças</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="h-16 bg-black"></footer>
    </main>
  )
} 