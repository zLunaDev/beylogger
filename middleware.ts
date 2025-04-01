import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export function middleware(request: NextRequest) {
  // Rotas que não precisam de autenticação
  const publicRoutes = ['/login', '/register', '/', '/api/auth/login', '/api/auth/register']
  const isPublicRoute = publicRoutes.some(route => request.nextUrl.pathname.startsWith(route))

  // Se for uma rota pública, não precisa verificar autenticação
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Verifica o token nos cookies
  const token = request.cookies.get('token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string, isAdmin: boolean }

    // Verifica se é uma rota de administrador
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin') || 
                        request.nextUrl.pathname.startsWith('/api/admin') ||
                        request.nextUrl.pathname.startsWith('/api/beyblades')

    // Se for uma rota de administrador, verifica se o usuário é admin
    if (isAdminRoute && !decoded.isAdmin) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|placeholder.svg).*)'],
} 