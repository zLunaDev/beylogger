"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

export default function AddPart() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    type: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Cria a peça com a imagem
      const partResponse = await fetch('/api/parts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          image: imagePreview
        }),
      })

      const partData = await partResponse.json()

      if (!partResponse.ok) {
        throw new Error(partData.error || 'Erro ao adicionar peça')
      }

      setSuccess('Peça adicionada com sucesso!')
      setFormData({
        name: '',
        type: ''
      })
      setImagePreview(null)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao adicionar peça')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <header className="flex justify-between items-center p-6 md:px-12 bg-black text-white">
        <div className="text-4xl font-bold tracking-wider">BEYLOG</div>
        <div className="space-x-6">
          <Link href="/admin/dashboard" className="text-xl font-medium tracking-wider hover:text-gray-300">
            DASHBOARD
          </Link>
          <Link href="/admin/beyblades" className="text-xl font-medium tracking-wider hover:text-gray-300">
            BEYBLADES
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black">Adicionar Nova Peça</h1>
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nome da Peça
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                required
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Tipo
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                required
              >
                <option value="">Selecione um tipo</option>
                <option value="Blade">Blade</option>
                <option value="Ratchet">Ratchet</option>
                <option value="Bit">Bit</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Imagem da Peça
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-black file:text-white
                hover:file:bg-gray-800"
            />
          </div>

          {imagePreview && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Preview da Imagem:</p>
              <div className="relative w-32 h-32">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-contain rounded-md"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/parts"
              className="px-4 py-2 bg-gray-200 text-black font-bold rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white font-bold rounded-md hover:bg-gray-800 transition-colors"
              disabled={loading}
            >
              {loading ? 'Adicionando...' : 'Adicionar Peça'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
} 