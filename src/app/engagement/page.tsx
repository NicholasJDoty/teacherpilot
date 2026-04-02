'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

const ACTIVITY_TYPES = [
  { id: 'hook',     label: '🎣 Hook',           desc: 'Attention-grabbing opener' },
  { id: 'game',     label: '🎮 Game',            desc: 'Fun review activity' },
  { id: 'debate',   label: '🗣️ Debate',          desc: 'Discussion starter' },
  { id: 'movement', label: '🏃 Movement Break',  desc: 'Physical activity break' },
  { id: 'scenario', label: '🌍 Real-World',      desc: 'Real-world connection' },
  { id: 'exit',     label: '🚪 Exit Ticket',     desc: 'Quick check for understanding' },
]

export default function EngagementPage() {
  const router = useRouter()
  const [user, setUser]       = useState<any>(null)
  const [isPro, setIsPro]     = useState(false)
  const [loading, setLoading] = useState(true)
  const [topic, setTopic]     = useState('')
  const [type, setType]       = useState(ACTIVITY_TYPES[0])
  const [output, setOutput]   = useState('')
  const [generating, setGenerating] = useState(false)
  const [history, setHistory] = useState<{type: string, topic: string, output: string}[]>([])

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

  const generate = async () => {
    if (!topic.trim()) return
    setGenerating(true)
    setOutput('')

    try {
      const res  = await fetch('/api/engagement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, activityType: type.id, activityLabel: type.label, userId: user.id }),
      })
      const data = await res.json()
      if (data.output) {
        setOutput(data.output)
        setHistory(h => [{ type: type.label, topic, output: data.output }, ...h.slice(0, 9)])
      }
    } catch {
      setOutput('Something went wrong. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  if (loading) return <div style={{ minHeight: '100vh', background: 'var(--bg)' }} />

  // Pro gate
  if (!isPro) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ maxWidth: 480, textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>⚡</div>
            <span className="badge badge-accent" style={{ marginBottom: 16 }}>Pro Feature</span>
            <h2 style={{ margin: '16px auto', maxWidth: 380 }}>Student Engagement Engine</h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.7 }}>
              Generate instant hooks, games, debates, movement breaks, real-world scenarios, and exit tickets for any topic. Keep your class energized all day.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 32 }}>
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
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px', width: '100%' }}>

        <div style={{ marginBottom: 36 }}>
          <span className="badge badge-accent" style={{ marginBottom: 12 }}>Pro feature</span>
          <h1 style={{ fontSize: '1.8rem', marginBottom: 8 }}>⚡ Engagement Engine</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Generate instant activities to keep your class energized. Type a topic, pick a type, get something ready to use.
          </p>
        </div>

        <div className="card" style={{ padding: '28px', marginBottom: 24 }}>
          {/* Activity type selector */}
          <div style={{ marginBottom: 20 }}>
            <label className="label">What kind of activity?</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
              {ACTIVITY_TYPES.map(t => (
                <button key={t.id} onClick={() => setType(t)}
                  style={{ padding: '10px 12px', borderRadius: 'var(--radius-md)', border: `1px solid ${type.id === t.id ? 'var(--accent)' : 'var(--border)'}`, background: type.id === t.id ? 'var(--accent-dim)' : 'var(--bg-elevated)', color: type.id === t.id ? 'var(--accent)' : 'var(--text-secondary)', fontSize: '0.82rem', cursor: 'pointer', fontWeight: type.id === t.id ? 600 : 400, transition: 'all 0.15s', textAlign: 'left' }}>
                  <div style={{ marginBottom: 2 }}>{t.label}</div>
                  <div style={{ fontSize: '0.72rem', opacity: 0.7 }}>{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="label">Topic or lesson</label>
            <input className="input" placeholder="e.g. The Water Cycle, Fractions, Civil War, Shakespeare…"
              value={topic} onChange={e => setTopic(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && generate()} />
          </div>

          <button className="btn btn-primary" onClick={generate}
            disabled={generating || !topic.trim()}
            style={{ opacity: generating || !topic.trim() ? 0.7 : 1 }}>
            {generating ? '⟳ Generating…' : `Generate ${type.label} →`}
          </button>
        </div>

        {/* Output */}
        {output && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>✦ {type.label} — {topic}</div>
              <button onClick={() => navigator.clipboard.writeText(output)} className="btn btn-secondary btn-sm">Copy</button>
            </div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '24px 28px', fontSize: '0.9rem', lineHeight: 1.8, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
              {output}
            </div>
            <button onClick={generate} className="btn btn-ghost btn-sm" style={{ marginTop: 10 }}>
              ↺ Generate another version
            </button>
          </div>
        )}

        {/* Recent history */}
        {history.length > 1 && (
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Recent</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {history.slice(1).map((h, i) => (
                <button key={i} onClick={() => setOutput(h.output)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', cursor: 'pointer', textAlign: 'left' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{h.type}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{h.topic}</span>
                </button>
              ))}
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