'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

const TOOLS = [
  { id: 'lesson_plan',     label: 'Lesson Plan',          icon: '📋' },
  { id: 'unit_plan',       label: 'Unit Plan',            icon: '📐' },
  { id: 'bell_ringer',     label: 'Bell Ringer',          icon: '🔔' },
  { id: 'quiz',            label: 'Quiz / Test',          icon: '📝' },
  { id: 'rubric',          label: 'Rubric',               icon: '📊' },
  { id: 'parent_email',    label: 'Parent Email',         icon: '✉️' },
  { id: 'sub_plan',        label: 'Sub Plan 🚨',          icon: '🚌' },
  { id: 'differentiation', label: 'Differentiation',      icon: '♿' },
  { id: 'report_comments', label: 'Report Card Comments', icon: '📄' },
  { id: 'study_guide',     label: 'Study Guide',          icon: '📚' },
  { id: 'assignment',      label: 'Assignment',           icon: '📎' },
  { id: 'answer_key',      label: 'Answer Key',           icon: '✅' },
]

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser]                       = useState<any>(null)
  const [tool, setTool]                       = useState(TOOLS[0])
  const [prompt, setPrompt]                   = useState('')
  const [output, setOutput]                   = useState('')
  const [loading, setLoading]                 = useState(false)
  const [saved, setSaved]                     = useState(false)
  const [library, setLibrary]                 = useState<any[]>([])
  const [tab, setTab]                         = useState<'generate'|'library'>('generate')
  const [generationsUsed, setGenerationsUsed] = useState(0)
  const [isPro, setIsPro]                     = useState(false)
  const [upgraded, setUpgraded]               = useState(false)

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      loadLibrary(user.id)
      loadUsage(user.id)

      // Show success message if coming from Stripe
      const params = new URLSearchParams(window.location.search)
      if (params.get('upgraded') === 'true') {
        setUpgraded(true)
        setTimeout(() => setUpgraded(false), 5000)
        // Remove param from URL
        window.history.replaceState({}, '', '/dashboard')
      }
    }
    init()
  }, [])

  const loadLibrary = async (uid: string) => {
    const supabase = createClient()
    const { data } = await supabase
      .from('generations')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
      .limit(50)
    if (data) setLibrary(data)
  }

  const loadUsage = async (uid: string) => {
    const supabase = createClient()
    const start = new Date()
    start.setDate(1); start.setHours(0,0,0,0)
    const { count } = await supabase
      .from('generations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', uid)
      .gte('created_at', start.toISOString())
    setGenerationsUsed(count || 0)

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_pro')
      .eq('id', uid)
      .single()
    if (profile?.is_pro) setIsPro(true)
  }

  const generate = async () => {
    if (!prompt.trim() || (!isPro && generationsUsed >= 10)) return
    setLoading(true); setSaved(false); setOutput('')
    try {
      const res  = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolType: tool.id, toolLabel: tool.label, prompt, userId: user.id }),
      })
      const data = await res.json()
      if (data.output) { setOutput(data.output); setGenerationsUsed(n => n + 1) }
      else setOutput('Something went wrong. Please try again.')
    } catch {
      setOutput('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const save = async () => {
    if (!output || !user) return
    const supabase = createClient()
    const { error } = await supabase.from('generations').insert({
      user_id: user.id, tool_type: tool.id, tool_label: tool.label, prompt, output,
    })
    if (!error) { setSaved(true); loadLibrary(user.id) }
  }

  const exportPDF = () => {
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`<html><head><title>${tool.label}</title><style>body{font-family:Georgia,serif;max-width:800px;margin:40px auto;color:#111;line-height:1.7}pre{white-space:pre-wrap;font-family:inherit}</style></head><body><h1>${tool.label}</h1><p style="color:#666;font-size:.9rem">${prompt}</p><hr/><pre>${output}</pre></body></html>`)
    win.document.close(); win.print()
  }

  const logout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const limitReached = !isPro && generationsUsed >= 10

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>

      {/* Upgrade success banner */}
      {upgraded && (
        <div style={{ background: 'var(--green-dim)', borderBottom: '1px solid rgba(62,207,142,0.3)', padding: '12px 24px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--green)', fontWeight: 500 }}>
          🎉 Welcome to Pro! Unlimited generations unlocked.
        </div>
      )}

      {/* Header */}
      <header style={{ borderBottom: '1px solid var(--border)', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-card)', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, background: 'var(--accent)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.85rem', color: '#0D0F12' }}>T</div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1rem' }}>TeacherPilot</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ padding: '4px 12px', borderRadius: 999, background: limitReached ? 'rgba(248,113,113,0.1)' : 'var(--bg-elevated)', border: `1px solid ${limitReached ? 'rgba(248,113,113,0.3)' : 'var(--border)'}`, fontSize: '0.78rem', color: limitReached ? 'var(--red)' : 'var(--text-muted)' }}>
            {isPro ? '∞ Pro' : `${generationsUsed}/10 this month`}
          </div>
          {!isPro && (
            <Link href="/pricing" className="btn btn-primary btn-sm">Upgrade to Pro</Link>
          )}
          <button onClick={logout} className="btn btn-ghost btn-sm">Log out</button>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Sidebar */}
        <aside style={{ width: 220, borderRight: '1px solid var(--border)', padding: '16px 12px', overflowY: 'auto', background: 'var(--bg-card)', display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '4px 8px', marginBottom: 4 }}>Tools</div>
          {TOOLS.map(t => (
            <button key={t.id}
              onClick={() => { setTool(t); setTab('generate'); setOutput(''); setSaved(false) }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', textAlign: 'left', background: tool.id === t.id ? 'var(--accent-dim)' : 'transparent', color: tool.id === t.id ? 'var(--accent)' : 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: tool.id === t.id ? 600 : 400, transition: 'all 0.15s', width: '100%' }}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
          <div style={{ marginTop: 'auto', paddingTop: 16 }}>
            <button onClick={() => setTab('library')}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', background: tab === 'library' ? 'var(--bg-elevated)' : 'transparent', color: tab === 'library' ? 'var(--text-primary)' : 'var(--text-muted)', fontSize: '0.85rem' }}>
              <span>📁</span> My Library
              {library.length > 0 && (
                <span style={{ marginLeft: 'auto', background: 'var(--border)', borderRadius: 999, padding: '1px 7px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>{library.length}</span>
              )}
            </button>
          </div>
        </aside>

        {/* Main */}
        <main style={{ flex: 1, overflow: 'auto', padding: '28px 32px' }}>
          {tab === 'generate' ? (
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: '1.4rem', marginBottom: 4 }}>{tool.icon} {tool.label}</h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Describe what you need — grade, subject, topic, accommodations, length.</p>
              </div>

              {limitReached && (
                <div style={{ padding: '16px 20px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: 'var(--radius-md)', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--red)', fontSize: '0.9rem', marginBottom: 2 }}>Monthly limit reached</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Upgrade to Pro for unlimited generations.</div>
                  </div>
                  <Link href="/pricing" className="btn btn-primary btn-sm">Upgrade →</Link>
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <label className="label">What do you need?</label>
                <textarea className="input" style={{ minHeight: 130 }}
                  placeholder="Example: 5th grade science, The Water Cycle, 45-minute lesson, needs ELL supports, exit ticket, and homework"
                  value={prompt} onChange={e => setPrompt(e.target.value)} disabled={limitReached} />
              </div>

              <button className="btn btn-primary" onClick={generate}
                disabled={loading || !prompt.trim() || limitReached}
                style={{ opacity: (loading || !prompt.trim() || limitReached) ? 0.6 : 1 }}>
                {loading ? '⟳ Generating…' : `Generate ${tool.label} →`}
              </button>

              {output && (
                <div style={{ marginTop: 32 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>✦ Generated output</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => navigator.clipboard.writeText(output)} className="btn btn-secondary btn-sm">Copy</button>
                      <button onClick={exportPDF} className="btn btn-secondary btn-sm">Export PDF</button>
                      <button onClick={save} className="btn btn-sm"
                        style={{ background: saved ? 'var(--green-dim)' : 'var(--accent-dim)', color: saved ? 'var(--green)' : 'var(--accent)', border: `1px solid ${saved ? 'rgba(62,207,142,0.3)' : 'rgba(245,166,35,0.3)'}` }}>
                        {saved ? '✓ Saved' : 'Save to library'}
                      </button>
                    </div>
                  </div>
                  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '24px 28px', fontSize: '0.9rem', lineHeight: 1.8, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', maxHeight: 600, overflowY: 'auto' }}>
                    {output}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
              <h2 style={{ fontSize: '1.4rem', marginBottom: 6 }}>📁 My Library</h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: 28 }}>All your saved resources in one place.</p>
              {library.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 24px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📂</div>
                  <p style={{ color: 'var(--text-muted)' }}>No saved resources yet. Generate something and hit Save!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {library.map(item => (
                    <div key={item.id} className="card" style={{ padding: '20px 24px', cursor: 'pointer' }}
                      onClick={() => { setTool(TOOLS.find(t => t.id === item.tool_type) || TOOLS[0]); setPrompt(item.prompt); setOutput(item.output); setTab('generate'); setSaved(true) }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                            <span className="badge badge-accent" style={{ fontSize: '0.7rem' }}>{item.tool_label}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(item.created_at).toLocaleDateString()}</span>
                          </div>
                          <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 500, marginBottom: 4 }}>{item.prompt.slice(0, 100)}{item.prompt.length > 100 ? '…' : ''}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.output.slice(0, 120)}…</div>
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Open →</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
      <style>{`@media(max-width:640px){aside{display:none}}`}</style>
    </div>
  )
}