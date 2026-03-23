import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 100, paddingBottom: 80 }}>
        <div className="container-narrow" style={{ padding: '60px 24px' }}>
          <h1 style={{ marginBottom: 8 }}>Privacy Policy</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: 48, fontSize: '0.9rem' }}>Last updated: January 1, 2026</p>

          {[
            { title: 'What we collect', body: 'We collect your email address when you create an account, and the content you generate and save using TeacherPilot. We do not collect any personally identifiable information about your students.' },
            { title: 'How we use your data', body: 'Your email is used to log you in and send you account-related messages. Your saved generations are stored so you can access them later. We do not sell your data to third parties.' },
            { title: 'Data storage', body: 'Your data is stored securely using Supabase (PostgreSQL). Payment information is handled entirely by Stripe — we never see or store your credit card details.' },
            { title: 'Cookies', body: 'We use cookies only for authentication purposes — to keep you logged in. We do not use tracking or advertising cookies.' },
            { title: 'Your rights', body: 'You can delete your account and all associated data at any time by contacting us at hello@teacherpilot.app. We will process deletion requests within 30 days.' },
            { title: 'Contact', body: 'Questions about privacy? Email us at hello@teacherpilot.app.' },
          ].map((section, i) => (
            <div key={i} style={{ marginBottom: 40 }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: 10, color: 'var(--text-primary)' }}>{section.title}</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>{section.body}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  )
}