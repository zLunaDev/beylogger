'use client'

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include' // Importante para enviar/receber cookies
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer login')
      }

      // Redireciona para o dashboard correto baseado no tipo de usuário
      if (data.user.isAdmin) {
        router.push('/admin/dashboard')
      } else {
        router.push('/dashboard')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  return (
    <main className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center p-6 md:px-12 bg-black text-white">
        <div className="text-4xl font-bold tracking-wider">BEYLOG</div>
        <Link href="/" className="text-xl font-medium tracking-wider">
          TELA INICIAL
        </Link>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-white">
        <div className="w-full max-w-md rounded-[30px] border-2 border-black p-8 shadow-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">ENTRAR</h1>
            <div className="h-0.5 w-full bg-black"></div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full p-3 border border-black rounded-md"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block font-medium">
                Senha
              </label>
              <input
                id="password"
                type="password"
                className="w-full p-3 border border-black rounded-md"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-[#d9d9d9] text-black font-bold py-3 rounded-md"
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </div>
          </form>

          <div className="text-center mt-6 space-y-2">
            <div>
              <Link href="/register" className="text-black hover:underline">
                Deseja Criar uma conta?
              </Link>
            </div>
            <div>
              <Link href="/admin/register" className="text-black hover:underline">
                Cadastrar como Administrador
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="h-16 bg-black"></footer>
    </main>
  )
}

