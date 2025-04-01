"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AdminRegister() {
  const router = useRouter()
  const [step, setStep] = useState<'code' | 'form'>('code')
  const [code, setCode] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState<string | null>(null)

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (code === '041103io') {
      setStep('form')
      setError(null)
    } else {
      setError('Código de acesso inválido')
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    try {
      const response = await fetch('/api/admin/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          isAdmin: true
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao cadastrar administrador')
      }

      router.push('/login')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao cadastrar administrador')
    }
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black">BEYLOG</h1>
          <p className="text-xl text-gray-600 mt-2">Cadastro de Administrador</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {step === 'code' ? (
          <form onSubmit={handleCodeSubmit} className="space-y-6">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                Código de Acesso
              </label>
              <input
                type="password"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white font-bold py-3 px-4 rounded-md hover:bg-gray-800 transition-colors"
            >
              Verificar Código
            </button>
          </form>
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar Senha
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                required
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setStep('code')}
                className="flex-1 bg-gray-200 text-black font-bold py-3 px-4 rounded-md hover:bg-gray-300 transition-colors"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="flex-1 bg-black text-white font-bold py-3 px-4 rounded-md hover:bg-gray-800 transition-colors"
              >
                Cadastrar
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm text-gray-600 hover:text-black">
            Já tem uma conta? Faça login
          </Link>
        </div>
      </div>
    </main>
  )
} 