import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const tools = [
  { icon: '📋', label: 'Lesson Plans' },
  { icon: '📐', label: 'Unit Plans' },
  { icon: '🔔', label: 'Bell Ringers' },
  { icon: '📝', label: 'Quizzes & Tests' },
  { icon: '✅', label: 'Answer Keys' },
  { icon: '📊', label: 'Rubrics' },
  { icon: '✉️', label: 'Parent Emails' },
  { icon: '🚌', label: 'Sub Plans' },
  { icon: '♿', label: 'Differentiation' },
  { icon: '📄', label: 'Report Card Comments' },
  { icon: '📚', label: 'Study Guides' },
  { icon: '📎', label: 'Assignments' },
]

const testimonials = [
  { quote: "I used to spend my entire Sunday night planning. Now I'm done in under an hour. TeacherPilot is the first tool that actually understands what teachers need.", name: "Sarah M.", role: "5th Grade Teacher, Texas", initials: "SM" },
  { quote: "The sub plan feature alone is worth it. I called in sick at 6am and had a full plan ready before my principal even woke up.", name: "David K.", role: "8th Grade Science, Ohio", initials: "DK" },
  { quote: "It does differentiation without me having to ask twice. ELL, IEP, advanced — it just handles it. My department head now wants the whole team on it.", name: "Priya L.", role: "Middle School ELA, California", initials: "PL" },
]

const steps = [
  { num: '01', title: 'Tell it what you need', desc: 'Enter your grade, subject, topic, and any special requirements like ELL supports or IEP accommodations.' },
  { num: '02', title: 'Get a ready-to-use resource', desc: 'TeacherPilot generates a complete, structured document in seconds — not a template, a finished product.' },
  { num: '03', title: 'Save, export, and reuse', desc: 'Your library grows with you. Export to PDF, copy to Google Docs, or come back to it any time.' },
]

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 24px 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse, rgba(245,166,35,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="animate-fade-up" style={{ marginBottom: 24 }}>
          <span className="badge badge-accent">✦ Built for K–12 Teachers</span>
        </div>

        <h1 className="animate-fade-up-delay-1" style={{ maxWidth: 820, margin: '0 auto 24px' }}>
          Stop spending{' '}
          <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Sunday nights</em>
          {' '}planning
        </h1>

        <p className="animate-fade-up-delay-2" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', maxWidth: 580, margin: '0 auto 40px' }}>
          TeacherPilot generates lesson plans, quizzes, rubrics, sub plans, and parent emails in minutes — fully formatted, ready to use, saved to your library.
        </p>

        <div className="animate-fade-up-delay-3" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/signup"  className="btn btn-primary btn-lg">Start free — no credit card →</Link>
          <Link href="/pricing" className="btn btn-secondary btn-lg">See pricing</Link>
        </div>

        <div className="animate-fade-up-delay-4" style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ display: 'flex' }}>
            {['#F87171','#FB923C','#FBBF24'].map((c, i) => (
              <div key={i} style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: '2px solid var(--bg)', marginLeft: i > 0 ? -8 : 0, fontSize: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0D0F12', fontWeight: 700 }}>
                {['SK','MR','PL'][i]}
              </div>
            ))}
          </div>
          <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Joined by <strong style={{ color: 'var(--text-primary)' }}>4,200+ teachers</strong> across all 50 states
          </span>
        </div>

        {/* Demo card */}
        <div className="animate-fade-up-delay-5" style={{ marginTop: 72, width: '100%', maxWidth: 720, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.5)', textAlign: 'left' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-elevated)' }}>
            {['#F87171','#FBBF24','#34D399'].map((c,i) => <div key={i} style={{ width: 11, height: 11, borderRadius: '50%', background: c }} />)}
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: 8 }}>TeacherPilot — Generate</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <div style={{ padding: '28px', borderRight: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Your prompt</div>
              <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', padding: '14px 16px', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, border: '1px solid var(--border-light)' }}>
                <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Grade:</span> 5th Grade Science<br />
                <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Topic:</span> The Water Cycle<br />
                <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Time:</span> 45 minutes<br />
                <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Needs:</span> ELL supports, exit ticket
              </div>
            </div>
            <div style={{ padding: '28px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Generated in 4 seconds</div>
              {['✓  Bell ringer + hook activity','✓  Mini-lesson with visuals','✓  ELL scaffolds + IEP mods','✓  Guided practice (15 min)','✓  Exit ticket + homework','✓  Teacher notes & standards'].map((item, i) => (
                <div key={i} style={{ fontSize: '0.82rem', color: 'var(--green)', marginBottom: 7 }}>{item}</div>
              ))}
              <div style={{ marginTop: 16, padding: '8px 12px', background: 'var(--green-dim)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--green)', fontWeight: 600 }}>⏱ Saved ~90 minutes</div>
            </div>
          </div>
        </div>
      </section>

      {/* TOOLS GRID */}
      <section style={{ padding: '80px 24px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="badge badge-accent" style={{ marginBottom: 16 }}>Everything you need</span>
            <h2 style={{ maxWidth: 520, margin: '12px auto 16px' }}>Every tool teachers use every week</h2>
            <p style={{ maxWidth: 460, margin: '0 auto' }}>One subscription covers your entire workflow — planning to grading to parent communication.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
            {tools.map((t, i) => (
              <div key={i} className="card" style={{ padding: '20px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: 10 }}>{t.icon}</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--text-primary)' }}>{t.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '80px 24px', background: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2>How it works</h2>
            <p style={{ maxWidth: 400, margin: '12px auto 0' }}>Three steps between you and a finished resource.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ padding: '32px 28px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '3.5rem', fontWeight: 700, color: 'var(--border)', lineHeight: 1, marginBottom: 16 }}>{s.num}</div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: 10, color: 'var(--text-primary)' }}>{s.title}</h3>
                <p style={{ fontSize: '0.9rem' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: '80px 24px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2>Teachers don&apos;t lie</h2>
            <p style={{ maxWidth: 400, margin: '12px auto 0' }}>Real feedback from real classrooms.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {testimonials.map((t, i) => (
              <div key={i} className="card" style={{ padding: '28px' }}>
                <div style={{ color: 'var(--accent)', fontSize: '1.4rem', marginBottom: 16 }}>❝</div>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>{t.quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--accent-dim)', border: '1px solid rgba(245,166,35,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)' }}>{t.initials}</div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>{t.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: '80px 24px', background: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: 24 }}>You didn&apos;t become a teacher to spend weekends planning</h2>
          <p style={{ fontSize: '1.05rem', marginBottom: 40, maxWidth: 520, margin: '0 auto 40px' }}>
            The average teacher spends 11 hours per week on tasks outside of actual teaching. TeacherPilot attacks the biggest time-wasters.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 48 }}>
            {[
              { stat: '4 min',  label: 'Average lesson plan time' },
              { stat: '1–3 hrs',label: 'Saved per week' },
              { stat: '12+',    label: 'Tools in one place' },
              { stat: '4,200+', label: 'Teachers using it' },
            ].map((s, i) => (
              <div key={i} style={{ padding: '20px 16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--accent)', marginBottom: 4 }}>{s.stat}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
          <Link href="/signup" className="btn btn-primary btn-lg">Get your time back →</Link>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: '80px 24px' }}>
        <div className="container">
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 'clamp(40px, 6vw, 72px)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(245,166,35,0.07) 0%, transparent 60%)', pointerEvents: 'none' }} />
            <span className="badge badge-green" style={{ marginBottom: 20 }}>✓ 10 free generations/month</span>
            <h2 style={{ maxWidth: 560, margin: '12px auto 20px' }}>Start free. Upgrade when it earns its place.</h2>
            <p style={{ maxWidth: 420, margin: '0 auto 36px' }}>No credit card. No commitment. If TeacherPilot doesn&apos;t save you real time in the first week, cancel with one click.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/signup"  className="btn btn-primary btn-lg">Create free account →</Link>
              <Link href="/pricing" className="btn btn-secondary btn-lg">View pricing</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}