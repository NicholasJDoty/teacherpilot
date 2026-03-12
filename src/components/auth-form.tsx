'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

export function AuthForm({
  mode,
}: {
  mode: 'login' | 'signup'
}) {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const isLogin = mode === 'login'

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          throw error
        }

        router.push('/dashboard')
        router.refresh()
      } else {
        const redirectTo = `${window.location.origin}/auth/callback`

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectTo,
          },
        })

        if (error) {
          throw error
        }

        setMessage(
          'Account created. Check your email and confirm your address before logging in.'
        )
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setGoogleLoading(true)
    setError('')
    setMessage('')

    try {
      const redirectTo = `${window.location.origin}/auth/callback`

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
        },
      })

      if (error) {
        throw error
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed.')
      setGoogleLoading(false)
    }
  }

  return (
    <div
      className="card"
      style={{
        maxWidth: '460px',
        margin: '0 auto',
        padding: '28px',
      }}
    >
      <div style={{ marginBottom: '18px' }}>
        <h1
          style={{
            margin: '0 0 8px 0',
            fontSize: '30px',
            fontWeight: 800,
            color: '#0f172a',
          }}
        >
          {isLogin ? 'Welcome back' : 'Create your account'}
        </h1>

        <p
          style={{
            margin: 0,
            color: '#64748b',
            lineHeight: 1.7,
          }}
        >
          {isLogin
            ? 'Sign in to access your teacher workspace.'
            : 'Start your free TeacherPilot account.'}
        </p>
      </div>

      <button
        type="button"
        className="btn-secondary"
        onClick={handleGoogleAuth}
        disabled={googleLoading}
        style={{
          width: '100%',
          justifyContent: 'center',
          marginBottom: '14px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            width: '18px',
            height: '18px',
            borderRadius: '999px',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 700,
            background: '#ffffff',
            color: '#0f172a',
            border: '1px solid #cbd5e1',
          }}
        >
          G
        </span>
        {googleLoading
          ? 'Opening Google...'
          : isLogin
          ? 'Continue with Google'
          : 'Sign up with Google'}
      </button>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '14px',
        }}
      >
        <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>
          OR
        </span>
        <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
      </div>

      <form onSubmit={handleEmailAuth} style={{ display: 'grid', gap: '14px' }}>
        <div>
          <label className="label">Email</label>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label className="label">Password</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            required
          />
        </div>

        {error && (
          <div
            style={{
              borderRadius: '12px',
              border: '1px solid #fecaca',
              background: '#fef2f2',
              color: '#b91c1c',
              padding: '12px 14px',
              fontSize: '14px',
              lineHeight: 1.6,
            }}
          >
            {error}
          </div>
        )}

        {message && (
          <div
            style={{
              borderRadius: '12px',
              border: '1px solid #bbf7d0',
              background: '#f0fdf4',
              color: '#166534',
              padding: '12px 14px',
              fontSize: '14px',
              lineHeight: 1.6,
            }}
          >
            {message}
          </div>
        )}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading
            ? isLogin
              ? 'Signing in...'
              : 'Creating account...'
            : isLogin
            ? 'Login'
            : 'Create account'}
        </button>
      </form>

      <p
        style={{
          marginTop: '16px',
          marginBottom: 0,
          color: '#64748b',
          fontSize: '14px',
          lineHeight: 1.7,
        }}
      >
        {isLogin ? (
          <>
            Don&apos;t have an account?{' '}
            <Link href="/signup" style={{ color: '#0f172a', fontWeight: 700 }}>
              Start free
            </Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#0f172a', fontWeight: 700 }}>
              Login
            </Link>
          </>
        )}
      </p>
    </div>
  )
}