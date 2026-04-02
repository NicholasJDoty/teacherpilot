import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import LiveDemo from '@/components/LiveDemo'

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
  { quote: "I used to spend my entire Sunday night planning. Now I'm done in under an hour. TeachersPilot is the first tool that actually knows my classroom.", name: "Sarah M.", role: "5th Grade Teacher, Texas", initials: "SM" },
  { quote: "The sub plan feature alone is worth it. I called in sick at 6am and had a full plan ready before my principal even woke up.", name: "David K.", role: "8th Grade Science, Ohio", initials: "DK" },
  { quote: "After I set up My Classroom profile, I just type the topic and it handles everything — grade level, my ELL students, TEKS standards. It's like it reads my mind.", name: "Priya L.", role: "Middle School ELA, California", initials: "PL" },
]

const comparison = [
  { feature: 'AI lesson plans & quizzes',           us: true,  magic: true,  diffit: true  },
  { feature: 'Knows your classroom automatically',  us: true,  magic: false, diffit: false },
  { feature: 'Teacher community (The Staffroom)',   us: true,  magic: false, diffit: false },
  { feature: 'Sub plan generator',                  us: true,  magic: true,  diffit: false },
  { feature: 'Parent email generator',              us: true,  magic: true,  diffit: false },
  { feature: 'Report card comments',                us: true,  magic: true,  diffit: false },
  { feature: 'Auto ELL/IEP differentiation',        us: true,  magic: false, diffit: true  },
  { feature: 'PDF export',                          us: true,  magic: false, diffit: false },
  { feature: 'Saved resource library',              us: true,  magic: true,  diffit: false },
  { feature: 'Free tier',                           us: true,  magic: true,  diffit: true  },
  { feature: 'Pro price',                           us: '$14/mo', magic: '$3/mo*', diffit: 'Free*' },
]

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 24px 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse, rgba(245,166,35,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="animate-fade-up" style={{ marginBottom: 24 }}>
          <span className="badge badge-accent">✦ The only AI tool that knows your classroom</span>
        </div>

        <h1 className="animate-fade-up-delay-1" style={{ maxWidth: 860, margin: '0 auto 24px' }}>
          Stop re-explaining your classroom{' '}
          <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>every single time</em>
        </h1>

        <p className="animate-fade-up-delay-2" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', maxWidth: 600, margin: '0 auto 16px' }}>
          TeachersPilot remembers your grade level, subjects, state standards, and student needs — so every lesson plan, quiz, and rubric is automatically built for <em>your</em> classroom.
        </p>

        <p className="animate-fade-up-delay-2" style={{ fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: 500, margin: '0 auto 40px' }}>
          Other AI tools make you start from scratch every time. We don&apos;t.
        </p>

        <div className="animate-fade-up-delay-3" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/signup" className="btn btn-primary btn-lg">Start free — no credit card →</Link>
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
      </section>

      {/* MY CLASSROOM FEATURE — THE DIFFERENTIATOR */}
      <section style={{ padding: '80px 24px', background: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 48, alignItems: 'center' }}>
            <div>
              <span className="badge badge-accent" style={{ marginBottom: 16 }}>✦ Only on TeachersPilot</span>
              <h2 style={{ marginBottom: 20 }}>Your classroom.<br />Remembered forever.</h2>
              <p style={{ fontSize: '1rem', lineHeight: 1.8, marginBottom: 24 }}>
                Set up your classroom profile once — grade level, subjects, state standards, ELL percentage, IEP percentage, teaching style. Then just type the topic.
              </p>
              <p style={{ fontSize: '1rem', lineHeight: 1.8, marginBottom: 32, color: 'var(--text-muted)' }}>
                Every lesson plan, quiz, and rubric is automatically built for your specific students. No other tool does this.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  'Type "water cycle lesson" → get a complete 45-min plan aligned to TEKS with ELL scaffolds',
                  'Type "fractions quiz" → get a differentiated quiz matched to your grade and standards',
                  'Type "parent email about behavior" → get a warm, professional email in your school\'s tone',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--green)', marginTop: 2, flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '28px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: -12, left: 24 }}>
                <span className="badge badge-green">My Classroom Profile</span>
              </div>
              <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { label: 'Teacher', value: 'Ms. Johnson' },
                  { label: 'Grade', value: '5th Grade' },
                  { label: 'Subject', value: 'Science & ELA' },
                  { label: 'Standards', value: 'TEKS (Texas)' },
                  { label: 'ELL students', value: '35%' },
                  { label: 'IEP/504', value: '20%' },
                  { label: 'Style', value: 'Project-based learning' },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < 6 ? '1px solid var(--border)' : 'none' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{row.label}</span>
                    <span style={{ fontSize: '0.88rem', color: 'var(--accent)', fontWeight: 600 }}>{row.value}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 20, padding: '12px 16px', background: 'var(--green-dim)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(62,207,142,0.3)', fontSize: '0.82rem', color: 'var(--green)', textAlign: 'center' }}>
                ✓ Every generation uses this context automatically
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE DEMO */}
      <section style={{ padding: '80px 24px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="badge badge-accent" style={{ marginBottom: 16 }}>Try it now</span>
            <h2 style={{ maxWidth: 520, margin: '12px auto 16px' }}>See it work in real time</h2>
            <p style={{ maxWidth: 440, margin: '0 auto' }}>No signup needed. Type a topic and see what TeachersPilot generates.</p>
          </div>
          <LiveDemo />
        </div>
      </section>

      {/* TOOLS GRID */}
      <section style={{ padding: '80px 24px', background: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ maxWidth: 520, margin: '0 auto 16px' }}>12 tools. One subscription.</h2>
            <p style={{ maxWidth: 460, margin: '0 auto' }}>Everything you need from Monday planning to Friday grades, all in one place.</p>
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

      {/* COMPARISON TABLE */}
      <section style={{ padding: '80px 24px', background: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="badge badge-accent" style={{ marginBottom: 16 }}>How we compare</span>
            <h2 style={{ maxWidth: 520, margin: '12px auto 16px' }}>TeachersPilot vs the rest</h2>
            <p style={{ maxWidth: 440, margin: '0 auto' }}>We built what others missed.</p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 500, borderBottom: '1px solid var(--border)' }}>Feature</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--accent-dim)' }}>
                    <span style={{ color: 'var(--accent)', fontWeight: 700 }}>TeachersPilot</span>
                  </th>
                  <th style={{ textAlign: 'center', padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 500, borderBottom: '1px solid var(--border)' }}>MagicSchool AI</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 500, borderBottom: '1px solid var(--border)' }}>Diffit</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{row.feature}</td>
                    <td style={{ textAlign: 'center', padding: '12px 16px', background: 'rgba(245,166,35,0.04)' }}>
                      {typeof row.us === 'boolean'
                        ? <span style={{ color: row.us ? 'var(--green)' : 'var(--red)', fontSize: '1.1rem' }}>{row.us ? '✓' : '✗'}</span>
                        : <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{row.us}</span>}
                    </td>
                    <td style={{ textAlign: 'center', padding: '12px 16px' }}>
                      {typeof row.magic === 'boolean'
                        ? <span style={{ color: row.magic ? 'var(--green)' : 'var(--text-muted)', fontSize: '1.1rem' }}>{row.magic ? '✓' : '✗'}</span>
                        : <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{row.magic}</span>}
                    </td>
                    <td style={{ textAlign: 'center', padding: '12px 16px' }}>
                      {typeof row.diffit === 'boolean'
                        ? <span style={{ color: row.diffit ? 'var(--green)' : 'var(--text-muted)', fontSize: '1.1rem' }}>{row.diffit ? '✓' : '✗'}</span>
                        : <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{row.diffit}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 12 }}>* Pricing and features based on publicly available information. May change.</p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: '80px 24px' }}>
        <div className="container">
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 'clamp(40px, 6vw, 72px)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(245,166,35,0.07) 0%, transparent 60%)', pointerEvents: 'none' }} />
            <span className="badge badge-green" style={{ marginBottom: 20 }}>✓ 10 free generations/month</span>
            <h2 style={{ maxWidth: 560, margin: '12px auto 20px' }}>The only tool that gets smarter the more you use it.</h2>
            <p style={{ maxWidth: 420, margin: '0 auto 36px' }}>Set up your classroom profile once. Every generation after that is automatically personalized for your students, your standards, your teaching style.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/signup" className="btn btn-primary btn-lg">Create free account →</Link>
              <Link href="/pricing" className="btn btn-secondary btn-lg">View pricing</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}