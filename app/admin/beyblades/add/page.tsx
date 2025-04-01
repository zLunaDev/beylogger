"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Blade {
  id: number
  name: string
}

interface Ratchet {
  id: number
  name: string
}

interface Bit {
  id: number
  name: string
}

export default function AddBeyblade() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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

  const [formData, setFormData] = useState({
    bladeId: '',
    ratchetId: '',
    bitId: '',
    attack: '',
    stamina: '',
    defesa: '',
    equilibrio: ''
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

      setParts({
        blades: data.blades,
        ratchets: data.ratchets,
        bits: data.bits
      })
    } catch (error) {
      setError('Erro ao carregar peças disponíveis')
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

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

      setSuccess('Beyblade adicionado com sucesso!')
      setFormData({
        bladeId: '',
        ratchetId: '',
        bitId: '',
        attack: '',
        stamina: '',
        defesa: '',
        equilibrio: ''
      })
      if (e.currentTarget) {
        e.currentTarget.reset()
      }
    } catch (error) {
      console.error('Erro:', error)
      setError('Erro ao adicionar beyblade. Por favor, tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  return (
    <main className="flex flex-col min-h-screen">
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
              <Link href="/admin/beyblades" className="px-6 py-4 text-lg font-medium border-l border-white">
                VOLTAR
              </Link>
            </div>
          </div>
        </div>
      </header>

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
                  {parts.blades.map((blade) => (
                    <option key={blade.id} value={blade.id}>
                      {blade.name}
                    </option>
                  ))}
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
                  {parts.ratchets.map((ratchet) => (
                    <option key={ratchet.id} value={ratchet.id}>
                      {ratchet.name}
                    </option>
                  ))}
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
                  {parts.bits.map((bit) => (
                    <option key={bit.id} value={bit.id}>
                      {bit.name}
                    </option>
                  ))}
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

            {success && (
              <div className="text-green-600 text-center">{success}</div>
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

      <footer className="h-16 bg-black"></footer>
    </main>
  )
} 