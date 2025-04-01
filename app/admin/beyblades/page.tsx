'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface Beyblade {
  id: number
  name: string
  blade: {
    id: number
    name: string
    attack: number
    stamina: number
    defesa: number
    equilibrio: number
    images: Array<{ id: number, image: string }>
  }
  ratchet: {
    id: number
    name: string
    images: Array<{ id: number, image: string }>
  }
  bit: {
    id: number
    name: string
    images: Array<{ id: number, image: string }>
  }
  attack: number
  stamina: number
  defesa: number
  equilibrio: number
}

interface Parts {
  ratchets: Array<{ id: number, name: string }>
  bits: Array<{ id: number, name: string }>
}

export default function BeybladesManagement() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [beyblades, setBeyblades] = useState<Beyblade[]>([])
  const [editingBeyblade, setEditingBeyblade] = useState<Beyblade | null>(null)
  const [parts, setParts] = useState<Parts>({ ratchets: [], bits: [] })
  const [editForm, setEditForm] = useState({
    attack: 0,
    stamina: 0,
    defesa: 0,
    ratchetId: 0,
    bitId: 0
  })

  const fetchBeyblades = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/beyblades')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao carregar beyblades')
      }

      if (!data.beyblades) {
        throw new Error('Dados inválidos recebidos do servidor')
      }

      setBeyblades(data.beyblades)
    } catch (error) {
      console.error('Erro ao carregar beyblades:', error)
      setError(error instanceof Error ? error.message : 'Erro ao carregar beyblades disponíveis')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBeyblades()

    const fetchParts = async () => {
      try {
        const [ratchetsResponse, bitsResponse] = await Promise.all([
          fetch('/api/parts/ratchets'),
          fetch('/api/parts/bits')
        ])

        if (!ratchetsResponse.ok) {
          const ratchetsError = await ratchetsResponse.json()
          throw new Error(ratchetsError.error || 'Erro ao carregar ratchets')
        }

        if (!bitsResponse.ok) {
          const bitsError = await bitsResponse.json()
          throw new Error(bitsError.error || 'Erro ao carregar bits')
        }

        const [ratchetsData, bitsData] = await Promise.all([
          ratchetsResponse.json(),
          bitsResponse.json()
        ])

        setParts({
          ratchets: ratchetsData.ratchets,
          bits: bitsData.bits
        })
      } catch (error) {
        console.error('Erro ao carregar partes:', error)
        setError(error instanceof Error ? error.message : 'Erro ao carregar partes disponíveis')
      }
    }

    fetchParts()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar esta beyblade?')) {
      return
    }

    try {
      const response = await fetch(`/api/beyblades/${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao deletar beyblade')
      }

      setSuccess('Beyblade deletada com sucesso!')
      fetchBeyblades() // Recarrega a lista de beyblades
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao deletar beyblade')
    }
  }

  const handleEdit = (beyblade: Beyblade) => {
    setEditingBeyblade(beyblade)
    setEditForm({
      attack: beyblade.attack,
      stamina: beyblade.stamina,
      defesa: beyblade.defesa,
      ratchetId: beyblade.ratchet.id,
      bitId: beyblade.bit.id
    })
  }

  const handleSaveEdit = async () => {
    if (!editingBeyblade) return

    try {
      const response = await fetch(`/api/beyblades/${editingBeyblade.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          attack: editForm.attack,
          stamina: editForm.stamina,
          defesa: editForm.defesa,
          ratchetId: editForm.ratchetId,
          bitId: editForm.bitId
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao atualizar beyblade')
      }

      setSuccess('Beyblade atualizada com sucesso!')
      setEditingBeyblade(null)
      fetchBeyblades()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao atualizar beyblade')
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl">Carregando beyblades...</div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-white">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="text-xl text-red-600 mb-4">Erro ao carregar beyblades</div>
          <div className="text-gray-600">{error}</div>
          <button
            onClick={fetchBeyblades}
            className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Tentar novamente
          </button>
        </div>
      </main>
    )
  }

  if (beyblades.length === 0) {
    return (
      <main className="min-h-screen bg-white">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="text-xl text-gray-600">Nenhuma beyblade encontrada</div>
          <Link
            href="/admin/beyblades/add"
            className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Adicionar Beyblade
          </Link>
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
          <Link href="/admin/beyblades/add" className="text-xl font-medium tracking-wider hover:text-gray-300">
            ADICIONAR BEYBLADE
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black">Gerenciar Beyblades</h1>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {beyblades.map((beyblade) => (
            <div key={beyblade.id} className="border-2 border-black rounded-lg p-6">
              <div className="flex flex-col items-center mb-4">
                <h3 className="text-xl font-bold mb-4">
                  {`${beyblade.blade.name} ${beyblade.ratchet.name} ${beyblade.bit.name}`}
                </h3>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(beyblade)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(beyblade.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                  >
                    Deletar
                  </button>
                </div>
              </div>

              <div className="w-full max-w-[200px] mx-auto aspect-square relative mb-4 bg-gray-100 rounded-lg overflow-hidden">
                {beyblade.blade.images && beyblade.blade.images.length > 0 ? (
                  <Image
                    src={`data:image/jpeg;base64,${beyblade.blade.images[0].image}`}
                    alt={`${beyblade.blade.name} Beyblade`}
                    fill
                    className="object-cover"
                    sizes="200px"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400">Sem imagem</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="font-semibold">Blade</h3>
                  <p>{beyblade.blade.name}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Ratchet</h3>
                  <p>{beyblade.ratchet.name}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Bit</h3>
                  <p>{beyblade.bit.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-100 p-3 rounded-lg">
                  <div className="font-semibold">Ataque</div>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-red-200 rounded-full h-2.5">
                      <div
                        className="bg-red-600 h-2.5 rounded-full"
                        style={{ width: `${(beyblade.attack / 10) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{beyblade.attack}/10</span>
                  </div>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <div className="font-semibold">Defesa</div>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-blue-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${(beyblade.defesa / 10) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{beyblade.defesa}/10</span>
                  </div>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <div className="font-semibold">Stamina</div>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-green-200 rounded-full h-2.5">
                      <div
                        className="bg-green-600 h-2.5 rounded-full"
                        style={{ width: `${(beyblade.stamina / 10) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{beyblade.stamina}/10</span>
                  </div>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <div className="font-semibold">Equilíbrio</div>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-yellow-200 rounded-full h-2.5">
                      <div
                        className="bg-yellow-600 h-2.5 rounded-full"
                        style={{ width: `${(beyblade.equilibrio / 10) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{beyblade.equilibrio}/10</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Edição */}
      {editingBeyblade && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Editar Beyblade</h2>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Ataque</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={editForm.attack}
                  onChange={(e) => setEditForm({
                    ...editForm,
                    attack: parseInt(e.target.value)
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Defesa</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={editForm.defesa}
                  onChange={(e) => setEditForm({
                    ...editForm,
                    defesa: parseInt(e.target.value)
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Stamina</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={editForm.stamina}
                  onChange={(e) => setEditForm({
                    ...editForm,
                    stamina: parseInt(e.target.value)
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ratchet</label>
                <select
                  value={editForm.ratchetId}
                  onChange={(e) => setEditForm({
                    ...editForm,
                    ratchetId: parseInt(e.target.value)
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
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
                <label className="block text-sm font-medium text-gray-700">Bit</label>
                <select
                  value={editForm.bitId}
                  onChange={(e) => setEditForm({
                    ...editForm,
                    bitId: parseInt(e.target.value)
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                >
                  <option value="">Selecione um bit</option>
                  {parts.bits.map((bit) => (
                    <option key={bit.id} value={bit.id}>
                      {bit.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingBeyblade(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
} 