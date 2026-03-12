import { AuthForm } from '@/components/auth-form'

export default function SignupPage() {
  return (
    <div className="container-page py-20">
      <AuthForm mode="signup" />
    </div>
  )
}