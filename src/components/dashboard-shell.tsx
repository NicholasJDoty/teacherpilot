import Link from 'next/link'
import { SignOutButton } from '@/components/sign-out-button'

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <header
        className="no-print"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <div
          className="container-page"
          style={{
            minHeight: '72px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
            flexWrap: 'wrap',
            paddingTop: '10px',
            paddingBottom: '10px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
              flexWrap: 'wrap',
            }}
          >
            <Link
              href="/dashboard"
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

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexWrap: 'wrap',
              }}
            >
              <Link href="/dashboard" className="btn-secondary">
                Dashboard
              </Link>
              <Link href="/workflows" className="btn-secondary">
                Workflows
              </Link>
              <Link href="/generate" className="btn-secondary">
                Generate
              </Link>
              <Link href="/history" className="btn-secondary">
                History
              </Link>
              <Link href="/pricing" className="btn-secondary">
                Upgrade
              </Link>
              <Link href="/settings" className="btn-secondary">
                Settings
              </Link>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                fontSize: '13px',
                color: '#64748b',
                fontWeight: 600,
              }}
            >
              Teacher workspace
            </div>

            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="container-page" style={{ paddingTop: '32px', paddingBottom: '40px' }}>
        {children}
      </main>
    </div>
  )
}