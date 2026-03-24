import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: '48px 24px', marginTop: 80 }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ maxWidth: 280 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 26, height: 26, background: 'var(--accent)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, color: '#0D0F12' }}>T</div>
            TeacherPilot
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Built for real K–12 teachers. Save hours every week on planning, assessment, and communication.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Product</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link href="/pricing"   style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Pricing</Link>
              <Link href="/dashboard" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Dashboard</Link>
              <Link href="/signup"    style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Start free</Link>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Legal</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link href="/privacy" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Privacy</Link>
              <Link href="/terms"   style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Terms</Link>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1160, margin: '32px auto 0', paddingTop: 24, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>© 2026 TeacherPilot. All rights reserved.</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Made with ♥ for teachers everywhere</span>
      </div>
    </footer>
  )
}