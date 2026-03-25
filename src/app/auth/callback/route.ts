import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const cookieStore = await cookies()

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll()  { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {}
          },
        },
      }
    )

    const { data } = await supabase.auth.exchangeCodeForSession(code)

    // Send welcome email for new Google OAuth signups
    // Check if this is a new user (created within last 30 seconds)
    if (data?.user?.email) {
      const createdAt = new Date(data.user.created_at).getTime()
      const now       = Date.now()
      const isNewUser = now - createdAt < 30000 // 30 seconds

      if (isNewUser) {
        try {
          await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/welcome-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: data.user.email }),
          })
        } catch {
          // Silently fail
        }
      }
    }
  }

  return NextResponse.redirect(new URL('/dashboard', request.url))
}