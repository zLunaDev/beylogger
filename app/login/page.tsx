import Link from "next/link"

export default function LoginPage() {
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

          <form className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="block font-medium">
                Nome de Usuário ou Email
              </label>
              <input id="username" type="text" className="w-full p-3 border border-black rounded-md" required />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block font-medium">
                Senha
              </label>
              <input id="password" type="password" className="w-full p-3 border border-black rounded-md" required />
              <div className="text-right text-sm">
                <Link href="/forgot-password" className="text-black hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>
            </div>

            <div className="pt-4">
               <button type="submit" className="w-full bg-[#d9d9d9] text-black font-bold py-3 rounded-md">
                Entrar
              </button> 
            </div>
          </form>

          <div className="text-center mt-6">
            <Link href="/register" className="text-black hover:underline">
              Deseja Criar uma conta?
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="h-16 bg-black"></footer>
    </main>
  )
}

