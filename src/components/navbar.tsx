'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '0 24px', transition: 'all 0.3s ease',
      background: scrolled ? 'rgba(13,15,18,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
    }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, background: 'var(--accent)', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: '#0D0F12',
          }}>T</div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.15rem', color: 'var(--text-primary)' }}>TeacherPilot</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="desktop-nav">
          <Link href="/pricing" className="btn btn-ghost" style={{ fontSize: '0.9rem' }}>Pricing</Link>
          <Link href="/login"   className="btn btn-ghost" style={{ fontSize: '0.9rem' }}>Log in</Link>
          <Link href="/signup"  className="btn btn-primary btn-sm" style={{ marginLeft: 8 }}>Start free →</Link>
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className="mobile-menu-btn"
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', padding: 8 }}>
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Link href="/pricing"  className="btn btn-ghost" onClick={() => setMenuOpen(false)}>Pricing</Link>
          <Link href="/login"    className="btn btn-ghost" onClick={() => setMenuOpen(false)}>Log in</Link>
          <Link href="/signup"   className="btn btn-primary" onClick={() => setMenuOpen(false)}>Start free →</Link>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}