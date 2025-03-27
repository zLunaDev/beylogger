import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">
       {/* Header */}
       <header className="flex justify-between items-center p-6 md:px-12 bg-black text-white">
        <div className="text-4xl font-bold tracking-wider">BEYLOG</div>
        <Link href="/login" className="text-xl font-medium tracking-wider">
          LOGIN
        </Link>
      </header>

      {/* Main Content */}
      <div className="px-6 md:px-12 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Column */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">
              O QUE É BEYBLADE X:
              <div className="h-1 w-[180px] bg-white mt-1"></div>
            </h2>
            <p className="text-lg leading-relaxed">
              Beyblade X é a nova geração da clássica franquia, trazendo batalhas mais rápidas e intensas com o sistema
              Xtreme Gear. As arenas agora possuem trilhos que permitem às beyblades alcançarem velocidades extremas,
              ativando o X Dash, um movimento especial que resulta em impactos mais fortes e maior chance de nocaute.
            </p>
            <div className="pt-4">
              <Link
                href="https://beyblade.com"
                className="inline-block bg-gray-300 text-black font-bold py-3 px-12 rounded-full"
              >
                SAIBA MAIS
              </Link>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">
              O QUE É O BEYLOG ?<div className="h-1 w-[180px] bg-white mt-1"></div>
            </h2>
            <p className="text-lg leading-relaxed">
              O BeyLog tem como propósito ser um local onde os fãs de Beyblade podem catalogar suas coleções e
              compartilhar seus combos favoritos de forma simples e acessível. Aqui, cada usuário pode criar seu perfil,
              organizar suas Beyblades e montar combinações únicas para que outros possam ver, avaliar e se inspirar
              para fazer seus próprios combos!
            </p>
            <div className="pt-4">
              <Link
                href="/register"
                className="inline-block bg-gray-300 text-black font-bold py-3 px-12 rounded-full"
              >
                REGISTRE-SE AQUI
              </Link>
            </div>
          </div>
        </div>

        {/* Trailer Section */}
        <div className="mt-16 text-center">
          <h2 className="text-4xl font-bold mb-8">TRAILER OFICIAL:</h2>
          <div className="max-w-3xl mx-auto relative">
          <iframe
            className="w-full aspect-video self-stretch md:min-h-96"
            src="https://www.youtube.com/embed/HAVN_TguX_Y"
            frameBorder="0"
            title="Product Overview Video"
            aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </main>
  )
}

