import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />

      <section className="container-page" style={{ paddingTop: '72px', paddingBottom: '72px' }}>
        <div className="card" style={{ padding: '32px', maxWidth: '900px', margin: '0 auto' }}>
          <h1
            style={{
              margin: '0 0 16px 0',
              fontSize: '36px',
              fontWeight: 800,
              color: '#0f172a',
            }}
          >
            Privacy Policy
          </h1>

          <div style={{ color: '#475569', lineHeight: 1.8, display: 'grid', gap: '16px' }}>
            <p>
              TeacherPilot stores account information, saved outputs, usage data, and payment-related
              subscription information necessary to provide the service.
            </p>

            <p>
              We use third-party providers such as Supabase, Stripe, OpenAI, and Google APIs to power
              authentication, billing, AI generation, and export features.
            </p>

            <p>
              We do not sell personal information. We use collected information to operate, improve,
              and secure TeacherPilot.
            </p>

            <p>
              Teachers should avoid entering unnecessary sensitive student information into AI tools.
              TeacherPilot is intended for instructional resource generation, not permanent student-record storage.
            </p>

            <p>
              If you have privacy questions, contact the TeacherPilot business email associated with your account setup.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}