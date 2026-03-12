import Link from 'next/link'

export function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid #e2e8f0',
        background: '#ffffff',
      }}
    >
      <div
        className="container-page"
        style={{
          paddingTop: '28px',
          paddingBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ color: '#64748b', fontSize: '14px' }}>
          © {new Date().getFullYear()} TeacherPilot
        </div>

        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <Link href="/pricing" style={{ color: '#475569', fontSize: '14px', fontWeight: 600 }}>
            Pricing
          </Link>
          <Link href="/privacy" style={{ color: '#475569', fontSize: '14px', fontWeight: 600 }}>
            Privacy
          </Link>
          <Link href="/terms" style={{ color: '#475569', fontSize: '14px', fontWeight: 600 }}>
            Terms
          </Link>
        </div>
      </div>
    </footer>
  )
}