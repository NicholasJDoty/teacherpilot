'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase'

const freeFeatures = ['10 generations per month', 'All 12 tool types', 'Save & reopen outputs', 'PDF export', 'Copy to clipboard']
const proFeatures  = ['Unlimited generations', 'All 12 tool types', 'My Classroom auto-personalization', 'Full resource library', 'PDF export', 'The Staffroom community', 'Standards alignment', 'One-click ELL/IEP differentiation', 'Priority support']

const faqs = [
  { q: 'Can I really cancel any time?', a: 'Yes. Cancel from your account settings in 30 seconds. No emails, no hoops, no fees.' },
  { q: 'Does my school need to approve this?', a: 'Most teachers sign up personally. At $4.99/month it\'s easy to expense or pay out of pocket. We also have school and district plans — email us for a proposal.' },
  { q: 'What makes TeachersPilot different from MagicSchool AI?', a: 'My Classroom profile. You fill it out once — grade level, subjects, state standards, ELL%, IEP% — and every generation is automatically personalized for your specific students. No other tool does this.' },
  { q: 'Is my content private?', a: 'Yes. Your saved materials are only visible to you. We do not share or sell your data.' },
  { q: 'What grade levels does it support?', a: 'K–12 across all subjects. The more context in your classroom profile, the better every output gets.' },
]

export default function PricingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handleUpgrade = async (plan: 'monthly' | 'annual') => {
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/signup?next=pricing'); return }

    try {
      const res  = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (data.redirect) { router.push('/login?next=pricing'); return }
      if (data.url) window.location.href = data.url
      else { setError('Something went wrong. Please try again.'); setLoading(false) }
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 100 }}>

        <div style={{ textAlign: 'center', padding: '60px 24px 0' }}>
          <span className="badge badge-accent" style={{ marginBottom: 16 }}>Simple pricing</span>
          <h1 style={{ maxWidth: 600, margin: '12px auto 20px' }}>
            Less than a{' '}
            <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>cup of coffee</em>
          </h1>
          <p style={{ maxWidth: 480, margin: '0 auto', fontSize: '1.05rem' }}>
            The AI teaching tool that actually knows your classroom — for $4.99/month.
          </p>
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
              <p style={{ fontSize: '0.9rem', marginTop: 10, color: 'var(--text-muted)' }}>Try it before you commit.</p>
            </div>
            <Link href="/signup" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', marginBottom: 28 }}>
              Create free account
            </Link>
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
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 700 }}>$4.99</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>/month</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--green)', marginTop: 4 }}>Or $39/year — save 35%</div>
              <p style={{ fontSize: '0.9rem', marginTop: 10, color: 'var(--text-muted)' }}>
                Less than a coffee. Saves 2+ hours every week.
              </p>
            </div>

            {error && (
              <div style={{ padding: '10px 14px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '6px', fontSize: '0.85rem', color: 'var(--red)', marginBottom: 16 }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
              <button onClick={() => handleUpgrade('monthly')} disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Loading…' : 'Start free for 7 days →'}
              </button>
              <button onClick={() => handleUpgrade('annual')} disabled={loading} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}>
                Get annual plan — $39/year
              </button>
            </div>

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

        {/* Value callout */}
        <div style={{ padding: '0 24px 60px', maxWidth: 900, margin: '0 auto' }}>
          <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px 32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 24, textAlign: 'center' }}>
            {[
              { stat: '$4.99', label: 'Per month' },
              { stat: '2+ hrs', label: 'Saved per week' },
              { stat: '12', label: 'Tools included' },
              { stat: '7 days', label: 'Free trial' },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--accent)', marginBottom: 4 }}>{s.stat}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* District CTA */}
        <div style={{ padding: '0 24px 80px', maxWidth: 900, margin: '0 auto' }}>
          <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '12px', padding: '28px 32px', display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Schools & Districts</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: 6 }}>Get your whole department on TeachersPilot</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', maxWidth: 420 }}>Team plans available. We&apos;ll send you a ready-made proposal to take to your principal.</p>
            </div>
            <a href="mailto:hello@teacherspilot.com" className="btn btn-secondary">Contact us →</a>
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
          <h2 style={{ marginBottom: 16 }}>$4.99/month. Cancel any time.</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: 400, margin: '0 auto 32px' }}>
            Start with 10 free generations. No credit card. Upgrade when it earns its place.
          </p>
          <Link href="/signup" className="btn btn-primary btn-lg">Try it free →</Link>
        </div>
      </div>
      <Footer />
    </>
  )
}