'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

const GRADES   = ['All Grades', 'K-2', '3-5', '6-8', '9-12']
const SUBJECTS = ['All Subjects', 'Math', 'Science', 'ELA', 'Social Studies', 'History', 'Art', 'PE', 'Music', 'World Language', 'Special Education', 'Other']

type Post = {
  id: string
  title: string
  content: string
  grade_level: string
  subject: string
  resource_type: string
  likes: number
  created_at: string
  user_id: string
  author_email?: string
  comment_count?: number
  user_liked?: boolean
  user_saved?: boolean
}

export default function StaffroomPage() {
  const router = useRouter()
  const [user, setUser]         = useState<any>(null)
  const [isPro, setIsPro]       = useState(false)
  const [posts, setPosts]       = useState<Post[]>([])
  const [loading, setLoading]   = useState(true)
  const [grade, setGrade]       = useState('All Grades')
  const [subject, setSubject]   = useState('All Subjects')
  const [search, setSearch]     = useState('')
  const [showNew, setShowNew]   = useState(false)

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)

      const { data: profile } = await supabase
        .from('profiles').select('is_pro').eq('id', user.id).single()
      if (!profile?.is_pro) {
        // Non-pro users see the gate page
        setIsPro(false)
        setLoading(false)
        return
      }
      setIsPro(true)
      loadPosts(user.id)
    }
    init()
  }, [])

  const loadPosts = async (uid: string) => {
    setLoading(true)
    const supabase = createClient()
    let query = supabase
      .from('staffroom_posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (grade !== 'All Grades')     query = query.eq('grade_level', grade)
    if (subject !== 'All Subjects') query = query.eq('subject', subject)

    const { data } = await query.limit(50)

    if (data) {
      // Get liked/saved status
      const { data: liked } = await supabase
        .from('staffroom_likes').select('post_id').eq('user_id', uid)
      const { data: saved } = await supabase
        .from('staffroom_saved').select('post_id').eq('user_id', uid)
      const { data: comments } = await supabase
        .from('staffroom_comments').select('post_id')

      const likedIds = new Set((liked || []).map((l: any) => l.post_id))
      const savedIds = new Set((saved || []).map((s: any) => s.post_id))
      const commentCounts: Record<string, number> = {}
      ;(comments || []).forEach((c: any) => {
        commentCounts[c.post_id] = (commentCounts[c.post_id] || 0) + 1
      })

      setPosts(data.map((p: any) => ({
        ...p,
        user_liked: likedIds.has(p.id),
        user_saved: savedIds.has(p.id),
        comment_count: commentCounts[p.id] || 0,
      })))
    }
    setLoading(false)
  }

  const handleLike = async (post: Post) => {
    if (!user) return
    const supabase = createClient()
    if (post.user_liked) {
      await supabase.from('staffroom_likes').delete().eq('post_id', post.id).eq('user_id', user.id)
      await supabase.from('staffroom_posts').update({ likes: post.likes - 1 }).eq('id', post.id)
    } else {
      await supabase.from('staffroom_likes').insert({ post_id: post.id, user_id: user.id })
      await supabase.from('staffroom_posts').update({ likes: post.likes + 1 }).eq('id', post.id)
    }
    loadPosts(user.id)
  }

  const handleSave = async (post: Post) => {
    if (!user) return
    const supabase = createClient()
    if (post.user_saved) {
      await supabase.from('staffroom_saved').delete().eq('post_id', post.id).eq('user_id', user.id)
    } else {
      await supabase.from('staffroom_saved').insert({ post_id: post.id, user_id: user.id })
    }
    loadPosts(user.id)
  }

  const filteredPosts = posts.filter(p =>
    search === '' ||
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.content.toLowerCase().includes(search.toLowerCase())
  )

  // ── Pro gate ──────────────────────────────────────────────
  if (!loading && !isPro) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
        <Header user={user} isPro={false} />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ maxWidth: 520, textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 20 }}>🏫</div>
            <span className="badge badge-accent" style={{ marginBottom: 16 }}>Pro Feature</span>
            <h2 style={{ margin: '16px auto 16px', maxWidth: 420 }}>
              Welcome to{' '}
              <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>The Staffroom</em>
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.7 }}>
              The Staffroom is where TeacherPilot Pro members share lesson plans, quizzes, rubrics, and ideas — organized by grade level and subject.
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 32 }}>
              Browse thousands of teacher-made resources, post your own, and connect with educators across the country.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/pricing" className="btn btn-primary btn-lg">Upgrade to Pro →</Link>
              <Link href="/dashboard" className="btn btn-secondary btn-lg">Back to dashboard</Link>
            </div>
            {/* Preview blur */}
            <div style={{ marginTop: 48, position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              <div style={{ filter: 'blur(4px)', pointerEvents: 'none', opacity: 0.5 }}>
                {[
                  { title: '5th Grade Water Cycle Lesson Bundle', grade: '3-5', subject: 'Science', likes: 24 },
                  { title: 'Algebra 1 Quiz with Answer Key — Linear Equations', grade: '9-12', subject: 'Math', likes: 18 },
                  { title: 'Parent Email Templates for IEP Meetings', grade: 'K-2', subject: 'Special Education', likes: 31 },
                ].map((p, i) => (
                  <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '16px 20px', marginBottom: 10, textAlign: 'left' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>{p.title}</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <span className="badge badge-accent" style={{ fontSize: '0.7rem' }}>{p.grade}</span>
                      <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>{p.subject}</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>♥ {p.likes}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 0%, var(--bg) 80%)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 20 }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Upgrade to see all posts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Main staffroom ────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <Header user={user} isPro={isPro} />

      <div style={{ maxWidth: 900, margin: '0 auto', width: '100%', padding: '32px 24px' }}>

        {/* Page header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: 6 }}>🏫 The Staffroom</h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Share resources. Get inspired. Built by teachers, for teachers.
            </p>
          </div>
          <button onClick={() => setShowNew(true)} className="btn btn-primary">
            + Share a resource
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
          <input
            className="input"
            style={{ flex: 1, minWidth: 200, padding: '10px 14px' }}
            placeholder="Search resources…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="input"
            style={{ width: 'auto', cursor: 'pointer' }}
            value={grade}
            onChange={e => { setGrade(e.target.value); loadPosts(user.id) }}
          >
            {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <select
            className="input"
            style={{ width: 'auto', cursor: 'pointer' }}
            value={subject}
            onChange={e => { setSubject(e.target.value); loadPosts(user.id) }}
          >
            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Posts */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text-muted)' }}>Loading…</div>
        ) : filteredPosts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 24px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📭</div>
            <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>No posts yet. Be the first to share a resource!</p>
            <button onClick={() => setShowNew(true)} className="btn btn-primary">Share a resource</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filteredPosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={user.id}
                onLike={() => handleLike(post)}
                onSave={() => handleSave(post)}
              />
            ))}
          </div>
        )}
      </div>

      {/* New post modal */}
      {showNew && (
        <NewPostModal
          userId={user.id}
          onClose={() => setShowNew(false)}
          onPosted={() => { setShowNew(false); loadPosts(user.id) }}
        />
      )}
    </div>
  )
}

// ── Header ────────────────────────────────────────────────
function Header({ user, isPro }: { user: any, isPro: boolean }) {
  const router = useRouter()
  const logout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }
  return (
    <header style={{ borderBottom: '1px solid var(--border)', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-card)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, background: 'var(--accent)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.85rem', color: '#0D0F12' }}>T</div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1rem' }}>TeacherPilot</span>
        </Link>
        <Link href="/dashboard" className="btn btn-ghost btn-sm">Dashboard</Link>
        <Link href="/staffroom" className="btn btn-ghost btn-sm" style={{ color: 'var(--accent)' }}>The Staffroom</Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {isPro && <span className="badge badge-accent">Pro</span>}
        <button onClick={logout} className="btn btn-ghost btn-sm">Log out</button>
      </div>
    </header>
  )
}

// ── Post card ─────────────────────────────────────────────
function PostCard({ post, currentUserId, onLike, onSave }: {
  post: Post
  currentUserId: string
  onLike: () => void
  onSave: () => void
}) {
  const [expanded, setExpanded] = useState(false)

  const exportPDF = () => {
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`<html><head><title>${post.title}</title><style>body{font-family:Georgia,serif;max-width:800px;margin:40px auto;color:#111;line-height:1.7}pre{white-space:pre-wrap;font-family:inherit}</style></head><body><h1>${post.title}</h1><p style="color:#666">${post.grade_level} · ${post.subject}</p><hr/><pre>${post.content}</pre></body></html>`)
    win.document.close(); win.print()
  }

  return (
    <div className="card" style={{ padding: '20px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, fontFamily: 'var(--font-body)' }}>
            {post.title}
          </h3>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span className="badge badge-accent" style={{ fontSize: '0.7rem' }}>{post.grade_level}</span>
            <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>{post.subject}</span>
            {post.resource_type && (
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', padding: '3px 8px', background: 'var(--bg-elevated)', borderRadius: 999, border: '1px solid var(--border)' }}>{post.resource_type}</span>
            )}
          </div>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0 }}>
          {new Date(post.created_at).toLocaleDateString()}
        </span>
      </div>

      {/* Content preview */}
      <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 14, whiteSpace: 'pre-wrap' }}>
        {expanded ? post.content : post.content.slice(0, 240) + (post.content.length > 240 ? '…' : '')}
      </div>
      {post.content.length > 240 && (
        <button onClick={() => setExpanded(!expanded)} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.82rem', cursor: 'pointer', marginBottom: 14, padding: 0 }}>
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <button onClick={onLike} style={{ display: 'flex', alignItems: 'center', gap: 5, background: post.user_liked ? 'rgba(245,166,35,0.1)' : 'var(--bg-elevated)', border: `1px solid ${post.user_liked ? 'rgba(245,166,35,0.3)' : 'var(--border)'}`, borderRadius: 999, padding: '5px 12px', cursor: 'pointer', fontSize: '0.8rem', color: post.user_liked ? 'var(--accent)' : 'var(--text-muted)', transition: 'all 0.15s' }}>
          ♥ {post.likes}
        </button>
        <button onClick={onSave} style={{ display: 'flex', alignItems: 'center', gap: 5, background: post.user_saved ? 'var(--green-dim)' : 'var(--bg-elevated)', border: `1px solid ${post.user_saved ? 'rgba(62,207,142,0.3)' : 'var(--border)'}`, borderRadius: 999, padding: '5px 12px', cursor: 'pointer', fontSize: '0.8rem', color: post.user_saved ? 'var(--green)' : 'var(--text-muted)', transition: 'all 0.15s' }}>
          {post.user_saved ? '✓ Saved' : '+ Save'}
        </button>
        <button onClick={exportPDF} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 999, padding: '5px 12px', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          ↓ PDF
        </button>
        <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          💬 {post.comment_count} comments
        </span>
      </div>
    </div>
  )
}

// ── New post modal ────────────────────────────────────────
function NewPostModal({ userId, onClose, onPosted }: {
  userId: string
  onClose: () => void
  onPosted: () => void
}) {
  const [title, setTitle]       = useState('')
  const [content, setContent]   = useState('')
  const [grade, setGrade]       = useState('3-5')
  const [subject, setSubject]   = useState('Science')
  const [resType, setResType]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.from('staffroom_posts').insert({
      user_id: userId,
      title: title.trim(),
      content: content.trim(),
      grade_level: grade,
      subject,
      resource_type: resType || null,
    })
    if (error) { setError(error.message); setLoading(false) }
    else onPosted()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '36px 32px', width: '100%', maxWidth: 580, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: '1.3rem' }}>Share a resource</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="label">Title</label>
            <input className="input" placeholder="e.g. 5th Grade Water Cycle Lesson Plan" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="label">Grade level</label>
              <select className="input" value={grade} onChange={e => setGrade(e.target.value)} style={{ cursor: 'pointer' }}>
                {GRADES.slice(1).map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Subject</label>
              <select className="input" value={subject} onChange={e => setSubject(e.target.value)} style={{ cursor: 'pointer' }}>
                {SUBJECTS.slice(1).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Resource type <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
            <select className="input" value={resType} onChange={e => setResType(e.target.value)} style={{ cursor: 'pointer' }}>
              <option value="">Select type…</option>
              {['Lesson Plan','Unit Plan','Quiz','Rubric','Bell Ringer','Sub Plan','Study Guide','Assignment','Parent Email','Other'].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label className="label">Content</label>
            <textarea className="input" style={{ minHeight: 200 }}
              placeholder="Paste your resource here — lesson plan, quiz, rubric, tips, or anything useful for other teachers…"
              value={content} onChange={e => setContent(e.target.value)} required />
          </div>

          {error && (
            <div style={{ padding: '10px 14px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--red)' }}>{error}</div>
          )}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Posting…' : 'Post to Staffroom →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}