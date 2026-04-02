'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

function PostLessonContent() {
  const router = useRouter()
  const params = useSearchParams()
  const topic  = params.get('topic') || ''

  const [user, setUser]         = useState<any>(null)
  const [isPro, setIsPro]       = useState(false)
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [result, setResult]     = useState('')

  const [worked,    setWorked]    = useState('')
  const [didnt,     setDidnt]     = useState('')
  const [struggled, setStruggled] = useState('')

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      const { data: profile } = await supabase.from('profiles').select('is_pro').eq('id', user.id).single()
      setIsPro(!!profile?.is_pro)
      setLoading(false)
    }
    init()
  }, [])

  const handleSubmit = async () => {
    if (!worked.trim() && !didnt.trim()) return
    setSaving(true)

    try {
      const res  = await fetch('/api/post-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, worked, didnt, struggled, userId: user.id }),
      })
      const data = await res.json()
      if (data.suggestions) setResult(data.suggestions)
    } catch {
      setResult('Could not generate suggestions. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <p style={{ color: 'var(--text-muted)' }}>Loading…</p>
    </div>
  )

  // Pro gate
  if (!isPro) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ maxWidth: 480, textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>🔍</div>
            <span className="badge badge-accent" style={{ marginBottom: 16 }}>Pro Feature</span>
            <h2 style={{ margin: '16px auto', maxWidth: 380 }}>Post-Lesson AI Reflection</h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.7 }}>
              Answer 3 quick questions after class. Get AI-powered next lesson adjustments, targeted interventions, and reteach suggestions.
            </p>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: 32 }}>
              The more you reflect, the smarter your next lesson gets.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/pricing" className="btn btn-primary btn-lg">Upgrade to Pro →</Link>
              <Link href="/dashboard" className="btn btn-secondary btn-lg">Back to dashboard</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <div style={{ maxWidth: 620, margin: '0 auto', padding: '48px 24px', width: '100%' }}>

        <div style={{ marginBottom: 36 }}>
          <span className="badge badge-accent" style={{ marginBottom: 12 }}>Post-lesson reflection</span>
          <h1 style={{ fontSize: '1.8rem', marginBottom: 8 }}>How did it go?</h1>
          {topic && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Lesson: {topic}</p>}
        </div>

        {!result ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="card" style={{ padding: '24px' }}>
              <label className="label" style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: 10 }}>
                ✅ What worked well?
              </label>
              <textarea className="input" style={{ minHeight: 90 }}
                placeholder="e.g. The group activity was engaging, students were on task during the video…"
                value={worked} onChange={e => setWorked(e.target.value)} />
            </div>

            <div className="card" style={{ padding: '24px' }}>
              <label className="label" style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: 10 }}>
                ❌ What didn&apos;t work?
              </label>
              <textarea className="input" style={{ minHeight: 90 }}
                placeholder="e.g. The exit ticket showed most students didn't grasp the main concept…"
                value={didnt} onChange={e => setDidnt(e.target.value)} />
            </div>

            <div className="card" style={{ padding: '24px' }}>
              <label className="label" style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: 10 }}>
                🤔 Who struggled and why? <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
              </label>
              <textarea className="input" style={{ minHeight: 90 }}
                placeholder="e.g. My ELL students struggled with the vocabulary. Three students in the back were off task…"
                value={struggled} onChange={e => setStruggled(e.target.value)} />
            </div>

            <button className="btn btn-primary" onClick={handleSubmit}
              disabled={saving || (!worked.trim() && !didnt.trim())}
              style={{ width: '100%', justifyContent: 'center', opacity: saving ? 0.7 : 1 }}>
              {saving ? '⟳ Analyzing your lesson…' : 'Get AI suggestions →'}
            </button>
          </div>
        ) : (
          <div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px', marginBottom: 24 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
                ✦ AI Suggestions for next time
              </div>
              <div style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                {result}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button onClick={() => { setResult(''); setWorked(''); setDidnt(''); setStruggled('') }} className="btn btn-secondary">
                Reflect on another lesson
              </button>
              <Link href="/dashboard" className="btn btn-ghost">Back to dashboard</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Header() {
  return (
    <header style={{ borderBottom: '1px solid var(--border)', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-card)' }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 28, height: 28, background: 'var(--accent)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.85rem', color: '#0D0F12' }}>T</div>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1rem' }}>TeachersPilot</span>
      </Link>
      <Link href="/dashboard" className="btn btn-ghost btn-sm">Dashboard</Link>
    </header>
  )
}

export default function PostLessonPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--bg)' }} />}>
      <PostLessonContent />
    </Suspense>
  )
}