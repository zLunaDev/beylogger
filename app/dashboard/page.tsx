import Image from "next/image"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-3xl font-bold tracking-wider">BEYLOG</div>

            <nav className="hidden md:flex space-x-1">
              <Link href="/meus-beys" className="px-6 py-4 text-lg font-medium border-r border-white">
                MEUS BEYS
              </Link>
              <Link href="/meus-combos" className="px-6 py-4 text-lg font-medium">
                MEUS COMBOS
              </Link>
            </nav>

            <div className="flex items-center space-x-1">
              <Link href="/perfil" className="px-6 py-4 text-lg font-medium border-l border-white">
                Usuario
              </Link>
              <Link href="/logout" className="px-6 py-4 text-lg font-medium border-l border-white">
                SAIR
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center mb-16">BEM VINDO: USUARIO</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Card 1 */}
            <div className="border-2 border-black rounded-lg p-6 flex flex-col items-center">
              <h2 className="text-xl font-semibold mb-4">Seu Combo com mais likes:</h2>
              <div className="w-48 h-48 relative mb-4">
                <Image
                  src="/placeholder.svg?height=192&width=192"
                  alt="Aero Pegasus Beyblade"
                  width={192}
                  height={192}
                  className="object-contain"
                />
              </div>
              <p className="text-xl font-medium mb-6">Aero Pegasus 5-60P</p>
              <button className="bg-[#d9d9d9] text-black font-bold py-2 px-12 rounded-md w-full">EDITAR</button>
            </div>

            {/* Card 2 */}
            <div className="border-2 border-black rounded-lg p-6 flex flex-col items-center">
              <h2 className="text-xl font-semibold mb-4">Ultimo Beyblade Adicionado</h2>
              <div className="w-48 h-48 relative mb-4">
                <Image
                  src="/placeholder.svg?height=192&width=192"
                  alt="GolemRock Beyblade"
                  width={192}
                  height={192}
                  className="object-contain"
                />
              </div>
              <p className="text-xl font-medium mb-6">GolemRock 1-60UN</p>
              <button className="bg-[#d9d9d9] text-black font-bold py-2 px-12 rounded-md w-full">VER MAIS</button>
            </div>

            {/* Card 3 */}
            <div className="border-2 border-black rounded-lg p-6 flex flex-col items-center">
              <h2 className="text-xl font-semibold mb-4">Combo Mais Votado Do Dia:</h2>
              <div className="w-48 h-48 relative mb-4">
                <Image
                  src="/placeholder.svg?height=192&width=192"
                  alt="Wizard Rod Beyblade"
                  width={192}
                  height={192}
                  className="object-contain"
                />
              </div>
              <p className="text-xl font-medium mb-6">Wizard Rod 9-60DB</p>
              <button className="bg-[#d9d9d9] text-black font-bold py-2 px-12 rounded-md w-full">VER DETALHES</button>
            </div>
          </div>

          <div className="flex justify-center space-x-8">
            <Link href="/beyblades" className="bg-[#d9d9d9] text-black font-bold py-3 px-12 rounded-full">
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

