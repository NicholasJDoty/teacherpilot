import Link from 'next/link'
import { AuthForm } from '@/components/auth-form'

export default function SignupPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <header
        style={{
          borderBottom: '1px solid #e2e8f0',
          background: '#ffffff',
        }}
      >
        <div
          className="container-page"
          style={{
            minHeight: '72px',
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
              fontSize: '22px',
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
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                background: '#0f172a',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: 800,
              }}
            >
              T
            </span>
            TeacherPilot
          </Link>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link href="/pricing" className="btn-secondary">
              Pricing
            </Link>
            <Link href="/login" className="btn-secondary">
              Login
            </Link>
          </div>
        </div>
      </header>

      <main className="container-page" style={{ paddingTop: '56px', paddingBottom: '56px' }}>
        <AuthForm mode="signup" />
      </main>
    </div>
  )
}