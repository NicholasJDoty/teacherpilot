'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

const GRADE_OPTIONS = ['K', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th']
const SUBJECT_OPTIONS = ['Math', 'Science', 'ELA', 'Social Studies', 'History', 'Art', 'PE', 'Music', 'World Language', 'Special Education', 'Computer Science', 'Other']
const STANDARDS_OPTIONS = ['Common Core', 'TEKS (Texas)', 'NGSS (Science)', 'State Standards', 'Other']
const STYLE_OPTIONS = ['Direct instruction', 'Project-based learning', 'Inquiry-based', 'Flipped classroom', 'Differentiated instruction', 'Mixed/flexible']

export default function ClassroomProfilePage() {
  const router = useRouter()
  const [user, setUser]       = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)

  const [form, setForm] = useState({
    display_name:       '',
    school_name:        '',
    grade_levels:       [] as string[],
    subjects:           [] as string[],
    state:              '',
    standards:          '',
    ell_percent:        0,
    iep_percent:        0,
    class_size:         25,
    teaching_style:     '',
    additional_context: '',
  })

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profile) {
        setForm({
          display_name:       profile.display_name       || '',
          school_name:        profile.school_name        || '',
          grade_levels:       profile.grade_levels       || [],
          subjects:           profile.subjects           || [],
          state:              profile.state              || '',
          standards:          profile.standards          || '',
          ell_percent:        profile.ell_percent        || 0,
          iep_percent:        profile.iep_percent        || 0,
          class_size:         profile.class_size         || 25,
          teaching_style:     profile.teaching_style     || '',
          additional_context: profile.additional_context || '',
        })
      }
      setLoading(false)
    }
    init()
  }, [])

  const toggleArray = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    const supabase = createClient()
    await supabase.from('profiles').update({
      ...form,
      profile_complete: true,
      updated_at: new Date().toISOString(),
    }).eq('id', user.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <p style={{ color: 'var(--text-muted)' }}>Loading…</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid var(--border)', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-card)', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, background: 'var(--accent)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.85rem', color: '#0D0F12' }}>T</div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1rem' }}>TeachersPilot</span>
        </Link>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/dashboard" className="btn btn-ghost btn-sm">← Back to dashboard</Link>
        </div>
      </header>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '48px 24px' }}>
        {/* Page header */}
        <div style={{ marginBottom: 40 }}>
          <span className="badge badge-accent" style={{ marginBottom: 12 }}>✦ Makes every output smarter</span>
          <h1 style={{ fontSize: '2rem', marginBottom: 12 }}>My Classroom</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}>
            Fill this out once. TeachersPilot will automatically use your classroom context in every generation — no need to re-type your grade, standards, or student needs every time.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

          {/* Basic info */}
          <div className="card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: 20, color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontWeight: 600 }}>About you</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label className="label">Your name</label>
                <input className="input" placeholder="Ms. Johnson" value={form.display_name} onChange={e => setForm(f => ({ ...f, display_name: e.target.value }))} />
              </div>
              <div>
                <label className="label">School name</label>
                <input className="input" placeholder="Lincoln Elementary" value={form.school_name} onChange={e => setForm(f => ({ ...f, school_name: e.target.value }))} />
              </div>
              <div>
                <label className="label">State</label>
                <input className="input" placeholder="Texas" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} />
              </div>
              <div>
                <label className="label">Class size</label>
                <input className="input" type="number" min={1} max={50} value={form.class_size} onChange={e => setForm(f => ({ ...f, class_size: parseInt(e.target.value) || 25 }))} />
              </div>
            </div>
          </div>

          {/* Grade levels */}
          <div className="card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: 6, color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontWeight: 600 }}>Grade levels you teach</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 16 }}>Select all that apply</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {GRADE_OPTIONS.map(g => (
                <button key={g} onClick={() => setForm(f => ({ ...f, grade_levels: toggleArray(f.grade_levels, g) }))}
                  style={{ padding: '7px 14px', borderRadius: 999, border: `1px solid ${form.grade_levels.includes(g) ? 'var(--accent)' : 'var(--border)'}`, background: form.grade_levels.includes(g) ? 'var(--accent-dim)' : 'var(--bg-elevated)', color: form.grade_levels.includes(g) ? 'var(--accent)' : 'var(--text-secondary)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: form.grade_levels.includes(g) ? 600 : 400, transition: 'all 0.15s' }}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Subjects */}
          <div className="card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: 6, color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontWeight: 600 }}>Subjects you teach</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 16 }}>Select all that apply</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {SUBJECT_OPTIONS.map(s => (
                <button key={s} onClick={() => setForm(f => ({ ...f, subjects: toggleArray(f.subjects, s) }))}
                  style={{ padding: '7px 14px', borderRadius: 999, border: `1px solid ${form.subjects.includes(s) ? 'var(--accent)' : 'var(--border)'}`, background: form.subjects.includes(s) ? 'var(--accent-dim)' : 'var(--bg-elevated)', color: form.subjects.includes(s) ? 'var(--accent)' : 'var(--text-secondary)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: form.subjects.includes(s) ? 600 : 400, transition: 'all 0.15s' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Standards & style */}
          <div className="card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: 20, color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontWeight: 600 }}>Standards & teaching style</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label className="label">Standards you follow</label>
                <select className="input" value={form.standards} onChange={e => setForm(f => ({ ...f, standards: e.target.value }))} style={{ cursor: 'pointer' }}>
                  <option value="">Select…</option>
                  {STANDARDS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Teaching style</label>
                <select className="input" value={form.teaching_style} onChange={e => setForm(f => ({ ...f, teaching_style: e.target.value }))} style={{ cursor: 'pointer' }}>
                  <option value="">Select…</option>
                  {STYLE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Student needs */}
          <div className="card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: 6, color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontWeight: 600 }}>Student needs</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 20 }}>TeachersPilot will automatically include appropriate supports in every output</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <label className="label">ELL students (%)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <input type="range" min={0} max={100} value={form.ell_percent} onChange={e => setForm(f => ({ ...f, ell_percent: parseInt(e.target.value) }))} style={{ flex: 1, accentColor: 'var(--accent)' }} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent)', minWidth: 36 }}>{form.ell_percent}%</span>
                </div>
              </div>
              <div>
                <label className="label">IEP/504 students (%)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <input type="range" min={0} max={100} value={form.iep_percent} onChange={e => setForm(f => ({ ...f, iep_percent: parseInt(e.target.value) }))} style={{ flex: 1, accentColor: 'var(--accent)' }} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent)', minWidth: 36 }}>{form.iep_percent}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional context */}
          <div className="card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: 6, color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontWeight: 600 }}>Anything else?</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 16 }}>Any other context that would help TeachersPilot generate better resources for your classroom</p>
            <textarea className="input" style={{ minHeight: 100 }}
              placeholder="e.g. My students are high energy and respond well to movement breaks. We use a lot of graphic organizers. Most students are below grade level in reading."
              value={form.additional_context}
              onChange={e => setForm(f => ({ ...f, additional_context: e.target.value }))}
            />
          </div>

          {/* Save button */}
          <button onClick={handleSave} disabled={saving} className="btn btn-primary btn-lg"
            style={{ width: '100%', justifyContent: 'center', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Saving…' : saved ? '✓ Saved! Every generation will now use your classroom context' : 'Save my classroom profile →'}
          </button>

          {saved && (
            <div style={{ padding: '16px 20px', background: 'var(--green-dim)', border: '1px solid rgba(62,207,142,0.3)', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', color: 'var(--green)', textAlign: 'center' }}>
              ✓ Profile saved! Go generate something — it will automatically use your classroom context.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}