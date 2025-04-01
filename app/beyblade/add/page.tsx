'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AddBeybladePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      bladeId: parseInt(formData.get('bladeId') as string),
      ratchetId: parseInt(formData.get('ratchetId') as string),
      bitId: parseInt(formData.get('bitId') as string),
      attack: parseInt(formData.get('attack') as string),
      defesa: parseInt(formData.get('defesa') as string),
      stamina: parseInt(formData.get('stamina') as string)
    }

    try {
      const response = await fetch('/api/beyblades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Erro ao adicionar beyblade')
      }

      router.push('/listabeyblade')
    } catch (error) {
      console.error('Erro:', error)
      setError('Erro ao adicionar beyblade. Por favor, tente novamente.')
    } finally {
      setLoading(false)
    }
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
          <h1 className="text-4xl font-bold text-center mb-12">ADICIONAR BEYBLADE</h1>

          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Blade
                </label>
                <select
                  name="bladeId"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione uma blade</option>
                  {/* Adicione as opções de blade aqui */}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ratchet
                </label>
                <select
                  name="ratchetId"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione um ratchet</option>
                  {/* Adicione as opções de ratchet aqui */}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bit
                </label>
                <select
                  name="bitId"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione um bit</option>
                  {/* Adicione as opções de bit aqui */}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ataque (0-10)
                </label>
                <input
                  type="number"
                  name="attack"
                  min="0"
                  max="10"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Defesa (0-10)
                </label>
                <input
                  type="number"
                  name="defesa"
                  min="0"
                  max="10"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stamina (0-10)
                </label>
                <input
                  type="number"
                  name="stamina"
                  min="0"
                  max="10"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-center">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adicionando...' : 'Adicionar Beyblade'}
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="h-16 bg-black"></footer>
    </main>
  )
} 