import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const freeFeatures = ['10 generations per month','All 12 tool types','Save & reopen outputs','PDF export','Copy to clipboard']
const proFeatures  = ['Unlimited generations','All 12 tool types','Full resource library','PDF export','Standards alignment tags','One-click differentiation (ELL/IEP/Advanced)','Spanish translation for parent emails','Priority support']
const faqs = [
  { q: 'Can I really cancel any time?', a: 'Yes. Cancel from your account settings in 30 seconds. No emails, no hoops, no fees.' },
  { q: 'Does my school need to approve this?', a: 'Most teachers sign up personally. We also have school and district plans — email us and we can send you a proposal to hand to your principal.' },
  { q: 'What if I only need it during the school year?', a: 'Pause or cancel any time. We also offer an annual plan that works out to under $9/month if you want to lock in the best price.' },
  { q: 'Is my content private?', a: 'Yes. Your saved materials are only visible to you. We do not share or sell your data.' },
  { q: 'What grade levels does it support?', a: 'K–12 across all subjects. The more context you give (grade, subject, standards, accommodations), the better the outputs.' },
]

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 100 }}>

        <div style={{ textAlign: 'center', padding: '60px 24px 0' }}>
          <span className="badge badge-accent" style={{ marginBottom: 16 }}>Simple pricing</span>
          <h1 style={{ maxWidth: 600, margin: '12px auto 20px' }}>
            Pay for it only if it{' '}
            <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>earns its place</em>
          </h1>
          <p style={{ maxWidth: 440, margin: '0 auto', fontSize: '1.05rem' }}>Start free and upgrade when TeacherPilot becomes part of your weekly routine.</p>
        </div>

        {/* Cards */}
        <div style={{ padding: '60px 24px', maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, alignItems: 'start' }}>

          {/* Free */}
          <div className="card" style={{ padding: '36px 32px' }}>
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Free</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 700 }}>$0</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>/month</span>
              </div>
              <p style={{ fontSize: '0.9rem', marginTop: 10, color: 'var(--text-muted)' }}>For proving the value before you commit.</p>
            </div>
            <Link href="/signup" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', marginBottom: 28 }}>Create free account</Link>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {freeFeatures.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: 'var(--green)', fontSize: '0.9rem' }}>✓</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--accent)', borderRadius: '20px', padding: '36px 32px', position: 'relative', boxShadow: '0 0 40px rgba(245,166,35,0.1)' }}>
            <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)' }}>
              <span className="badge badge-accent">Most popular</span>
            </div>
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Pro</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 700 }}>$14</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>/month</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--green)', marginTop: 4 }}>Or $99/year — save 41%</div>
              <p style={{ fontSize: '0.9rem', marginTop: 10, color: 'var(--text-muted)' }}>For teachers who use it every week.</p>
            </div>
            <Link href="/signup?plan=pro" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: 28 }}>Start Pro free for 7 days →</Link>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {proFeatures.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: 'var(--accent)', fontSize: '0.9rem' }}>✦</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* District CTA */}
        <div style={{ padding: '0 24px 80px', maxWidth: 900, margin: '0 auto' }}>
          <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '12px', padding: '28px 32px', display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Schools & Districts</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: 6 }}>Get your whole department on TeacherPilot</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', maxWidth: 420 }}>Team plans start at $9/teacher/month. We&apos;ll send you a ready-made proposal to take to your principal.</p>
            </div>
            <a href="mailto:hello@teacherpilot.app" className="btn btn-secondary">Contact us →</a>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ borderTop: '1px solid var(--border)', padding: '80px 24px', background: 'var(--bg-card)' }}>
          <div className="container-narrow">
            <h2 style={{ textAlign: 'center', marginBottom: 48 }}>Common questions</h2>
            {faqs.map((faq, i) => (
              <div key={i} style={{ padding: '24px 0', borderBottom: i < faqs.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, fontSize: '0.95rem' }}>{faq.q}</div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '80px 24px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: 16 }}>Still on the fence?</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: 400, margin: '0 auto 32px' }}>Start with 10 free generations. No credit card. See if it saves you real time.</p>
          <Link href="/signup" className="btn btn-primary btn-lg">Try it free →</Link>
        </div>
      </div>
      <Footer />
    </>
  )
}