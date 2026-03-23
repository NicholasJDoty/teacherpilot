import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 100, paddingBottom: 80 }}>
        <div className="container-narrow" style={{ padding: '60px 24px' }}>
          <h1 style={{ marginBottom: 8 }}>Terms of Service</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: 48, fontSize: '0.9rem' }}>Last updated: January 1, 2026</p>

          {[
            { title: 'Acceptance of terms', body: 'By creating an account and using TeacherPilot, you agree to these Terms of Service. If you do not agree, please do not use the service.' },
            { title: 'Use of the service', body: 'TeacherPilot is designed for educational use by K–12 teachers. You may use generated content in your classroom freely. You may not resell or redistribute generated content as a standalone product.' },
            { title: 'Free and paid plans', body: 'The free plan includes 10 generations per month. The Pro plan is billed monthly or annually and includes unlimited generations. You can cancel at any time from your account settings.' },
            { title: 'Refunds', body: 'We offer a 7-day free trial on Pro. If you are unsatisfied after upgrading, contact us within 7 days of your first charge for a full refund.' },
            { title: 'Content ownership', body: 'You own the content you create using TeacherPilot. We do not claim ownership over your prompts or generated outputs.' },
            { title: 'Prohibited use', body: 'You may not use TeacherPilot to generate harmful, illegal, or misleading content. Accounts found in violation of this policy will be terminated.' },
            { title: 'Limitation of liability', body: 'TeacherPilot is provided as-is. We are not liable for any damages arising from use of the service. Always review AI-generated content before using it in your classroom.' },
            { title: 'Contact', body: 'Questions about these terms? Email us at hello@teacherpilot.app.' },
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