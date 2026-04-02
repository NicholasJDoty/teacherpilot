'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

type Step = {
  time: string
  title: string
  instruction: string
  tip?: string
  duration_seconds: number
}

type Session = {
  id: string
  title: string
  subject: string
  grade_level: string
  duration_min: number
  steps: Step[]
  status: string
}

export default function LiveModePage() {
  const router = useRouter()
  const [user, setUser]           = useState<any>(null)
  const [phase, setPhase]         = useState<'setup' | 'live' | 'done'>('setup')
  const [loading, setLoading]     = useState(false)
  const [generating, setGenerating] = useState(false)

  // Setup form
  const [topic, setTopic]         = useState('')
  const [subject, setSubject]     = useState('')
  const [grade, setGrade]         = useState('')
  const [duration, setDuration]   = useState(45)

  // Live session
  const [session, setSession]     = useState<Session | null>(null)
  const [stepIndex, setStepIndex] = useState(0)
  const [elapsed, setElapsed]     = useState(0)
  const [running, setRunning]     = useState(false)
  const [pivot, setPivot]         = useState('')
  const [pivotLoading, setPivotLoading] = useState(false)
  const [pivotResult, setPivotResult]   = useState('')

  // Timer
  useEffect(() => {
    if (!running) return
    const interval = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => clearInterval(interval)
  }, [running])

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)

      // Pre-fill from classroom profile
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (profile) {
        if (profile.grade_levels?.length) setGrade(profile.grade_levels[0])
        if (profile.subjects?.length) setSubject(profile.subjects[0])
      }
    }
    init()
  }, [])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const generateLesson = async () => {
    if (!topic.trim()) return
    setGenerating(true)

    try {
      const res  = await fetch('/api/live-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, subject, grade, duration, userId: user.id }),
      })
      const data = await res.json()
      if (data.session) {
        setSession(data.session)
        setPhase('live')
        setRunning(true)
      }
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  const handlePivot = async (situation: string) => {
    if (!session) return
    setPivotLoading(true)
    setPivotResult('')
    const currentStep = session.steps[stepIndex]

    try {
      const res  = await fetch('/api/live-pivot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          situation,
          currentStep: currentStep.title,
          topic: session.title,
          grade: session.grade_level,
          subject: session.subject,
          userId: user.id,
        }),
      })
      const data = await res.json()
      if (data.suggestion) setPivotResult(data.suggestion)
    } catch {
      setPivotResult('Try asking students to think-pair-share for 2 minutes.')
    } finally {
      setPivotLoading(false)
    }
  }

  const nextStep = () => {
    if (!session) return
    if (stepIndex < session.steps.length - 1) {
      setStepIndex(i => i + 1)
      setPivotResult('')
      setPivot('')
    } else {
      setPhase('done')
      setRunning(false)
    }
  }

  const currentStep = session?.steps[stepIndex]
  const progress = session ? ((stepIndex + 1) / session.steps.length) * 100 : 0

  // ── SETUP SCREEN ─────────────────────────────────────
  if (phase === 'setup') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ width: '100%', maxWidth: 540 }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🎯</div>
              <span className="badge badge-green" style={{ marginBottom: 12 }}>Free feature</span>
              <h1 style={{ fontSize: '2rem', marginBottom: 12 }}>Live Lesson Mode</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                Get a real-time lesson guide you run step by step. Tap &quot;Next&quot; as you go. Hit a problem? Get instant AI pivots.
              </p>
            </div>

            <div className="card" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="label">What are you teaching?</label>
                  <input className="input" placeholder="e.g. The Water Cycle" value={topic} onChange={e => setTopic(e.target.value)} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="label">Grade level</label>
                    <input className="input" placeholder="e.g. 5th grade" value={grade} onChange={e => setGrade(e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Subject</label>
                    <input className="input" placeholder="e.g. Science" value={subject} onChange={e => setSubject(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="label">Class duration (minutes)</label>
                  <select className="input" value={duration} onChange={e => setDuration(parseInt(e.target.value))} style={{ cursor: 'pointer' }}>
                    {[30, 45, 50, 60, 90].map(d => <option key={d} value={d}>{d} minutes</option>)}
                  </select>
                </div>

                <button className="btn btn-primary" onClick={generateLesson} disabled={generating || !topic.trim()}
                  style={{ width: '100%', justifyContent: 'center', marginTop: 8, opacity: generating || !topic.trim() ? 0.7 : 1 }}>
                  {generating ? '⟳ Building your lesson guide…' : 'Start Live Lesson →'}
                </button>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <Link href="/dashboard" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>← Back to dashboard</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── DONE SCREEN ──────────────────────────────────────
  if (phase === 'done') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ textAlign: 'center', maxWidth: 440 }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🎉</div>
            <h2 style={{ marginBottom: 12 }}>Lesson complete!</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>
              You taught for {formatTime(elapsed)}. How did it go?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link href={`/post-lesson?topic=${encodeURIComponent(session?.title || '')}`} className="btn btn-primary" style={{ justifyContent: 'center' }}>
                Reflect on this lesson → (Pro)
              </Link>
              <Link href="/live" className="btn btn-secondary" style={{ justifyContent: 'center' }}>
                Start another lesson
              </Link>
              <Link href="/dashboard" className="btn btn-ghost" style={{ justifyContent: 'center' }}>
                Back to dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── LIVE SCREEN ──────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Live header */}
      <header style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', animation: 'pulse-glow 2s infinite' }} />
          <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>LIVE — {session?.title}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontFamily: 'monospace', fontSize: '1rem', color: 'var(--accent)', fontWeight: 700 }}>{formatTime(elapsed)}</span>
          <button onClick={() => { setPhase('done'); setRunning(false) }} className="btn btn-ghost btn-sm">End lesson</button>
        </div>
      </header>

      {/* Progress bar */}
      <div style={{ height: 3, background: 'var(--border)' }}>
        <div style={{ height: '100%', background: 'var(--accent)', width: `${progress}%`, transition: 'width 0.5s ease' }} />
      </div>

      <div style={{ flex: 1, padding: '24px', maxWidth: 680, margin: '0 auto', width: '100%' }}>

        {/* Step counter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Step {stepIndex + 1} of {session?.steps.length}
          </span>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {session?.steps.slice(stepIndex + 1).length} steps remaining
          </span>
        </div>

        {/* Current step */}
        {currentStep && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: 'var(--accent)', background: 'var(--accent-dim)', padding: '3px 10px', borderRadius: 999, border: '1px solid rgba(245,166,35,0.3)' }}>
                {currentStep.time}
              </span>
              <h2 style={{ fontSize: '1.3rem', color: 'var(--text-primary)' }}>{currentStep.title}</h2>
            </div>

            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px 28px', marginBottom: 16, fontSize: '1rem', color: 'var(--text-primary)', lineHeight: 1.8 }}>
              {currentStep.instruction}
            </div>

            {currentStep.tip && (
              <div style={{ background: 'var(--accent-dim)', border: '1px solid rgba(245,166,35,0.3)', borderRadius: 'var(--radius-md)', padding: '12px 16px', fontSize: '0.88rem', color: 'var(--accent)' }}>
                💡 <strong>Teacher tip:</strong> {currentStep.tip}
              </div>
            )}
          </div>
        )}

        {/* Next button */}
        <button onClick={nextStep} className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', marginBottom: 32, fontSize: '1.05rem', padding: '16px' }}>
          {stepIndex < (session?.steps.length || 0) - 1 ? 'Next step →' : 'Complete lesson ✓'}
        </button>

        {/* Pivot buttons */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            Something happening? Get instant help:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {[
              { label: "They're confused 😕", value: 'students are confused and not understanding the material' },
              { label: "They're bored 😴", value: 'students look bored and disengaged' },
              { label: "Too fast ⏩", value: 'moving too fast and students are falling behind' },
              { label: "Too slow ⏸️", value: 'students finished early and have extra time' },
              { label: "Behavior issues 😤", value: 'there are classroom management and behavior issues' },
              { label: "Running late ⏰", value: 'running out of time and need to wrap up quickly' },
            ].map((p, i) => (
              <button key={i} onClick={() => handlePivot(p.value)}
                style={{ padding: '8px 14px', borderRadius: 999, border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-secondary)', fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.15s' }}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pivot result */}
        {pivotLoading && (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            ⟳ Getting suggestion…
          </div>
        )}
        {pivotResult && (
          <div style={{ background: 'var(--green-dim)', border: '1px solid rgba(62,207,142,0.3)', borderRadius: 'var(--radius-md)', padding: '16px 20px', fontSize: '0.92rem', color: 'var(--text-primary)', lineHeight: 1.7 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>AI Suggestion</div>
            {pivotResult}
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