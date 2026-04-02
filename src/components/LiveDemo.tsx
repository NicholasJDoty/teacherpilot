'use client'
import { useState } from 'react'
import Link from 'next/link'

const DEMO_TOOLS = [
  { id: 'lesson_plan',  label: 'Lesson Plan',  icon: '📋' },
  { id: 'quiz',         label: 'Quiz',         icon: '📝' },
  { id: 'rubric',       label: 'Rubric',       icon: '📊' },
  { id: 'parent_email', label: 'Parent Email', icon: '✉️' },
  { id: 'sub_plan',     label: 'Sub Plan',     icon: '🚌' },
]

export default function LiveDemo() {
  const [tool, setTool]       = useState(DEMO_TOOLS[0])
  const [prompt, setPrompt]   = useState('')
  const [output, setOutput]   = useState('')
  const [loading, setLoading] = useState(false)
  const [used, setUsed]       = useState(false) // only 1 free demo

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return
    setLoading(true)
    setOutput('')

    try {
      const res  = await fetch('/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolLabel: tool.label, prompt }),
      })
      const data = await res.json()
      if (data.output) { setOutput(data.output); setUsed(true) }
      else setOutput('Something went wrong. Please try again.')
    } catch {
      setOutput('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.4)' }}>
      {/* Window chrome */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-elevated)' }}>
        {['#F87171','#FBBF24','#34D399'].map((c,i) => <div key={i} style={{ width: 11, height: 11, borderRadius: '50%', background: c }} />)}
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: 8 }}>TeachersPilot — Live Demo</span>
        <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--accent)' }}>✦ No signup required</span>
      </div>

      <div style={{ padding: '28px' }}>
        {/* Tool selector */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {DEMO_TOOLS.map(t => (
            <button key={t.id} onClick={() => setTool(t)}
              style={{ padding: '7px 14px', borderRadius: 999, border: `1px solid ${tool.id === t.id ? 'var(--accent)' : 'var(--border)'}`, background: tool.id === t.id ? 'var(--accent-dim)' : 'var(--bg-elevated)', color: tool.id === t.id ? 'var(--accent)' : 'var(--text-secondary)', fontSize: '0.82rem', cursor: 'pointer', fontWeight: tool.id === t.id ? 600 : 400, transition: 'all 0.15s' }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <div style={{ marginBottom: 16 }}>
          <label className="label">Describe what you need</label>
          <textarea className="input" style={{ minHeight: 90 }}
            placeholder={`e.g. 5th grade science, The Water Cycle, 45 minutes`}
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            disabled={used}
          />
        </div>

        {!used ? (
          <button className="btn btn-primary" onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            style={{ opacity: (loading || !prompt.trim()) ? 0.6 : 1 }}>
            {loading ? '⟳ Generating…' : `Generate ${tool.label} →`}
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Want unlimited generations?</span>
            <Link href="/signup" className="btn btn-primary btn-sm">Create free account →</Link>
          </div>
        )}

        {/* Output */}
        {output && (
          <div style={{ marginTop: 24, background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px 24px', fontSize: '0.88rem', lineHeight: 1.8, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', maxHeight: 400, overflowY: 'auto' }}>
            {output}
          </div>
        )}
      </div>
    </div>
  )
}