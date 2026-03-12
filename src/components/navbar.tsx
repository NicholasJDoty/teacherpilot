import Link from 'next/link'

export function Navbar() {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(248, 250, 252, 0.92)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      <div
        className="container-page"
        style={{
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '24px',
            fontWeight: 800,
            color: '#0f172a',
            letterSpacing: '-0.03em',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#0f172a',
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: 800,
            }}
          >
            T
          </span>
          TeacherPilot
        </Link>

        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <Link
            href="/pricing"
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#475569',
              padding: '8px 10px',
            }}
          >
            Pricing
          </Link>

          <Link href="/login" className="btn-secondary">
            Login
          </Link>

          <Link href="/signup" className="btn-primary">
            Start free
          </Link>
        </nav>
      </div>
    </header>
  )
}