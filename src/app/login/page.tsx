import { AuthForm } from '@/components/auth-form'

export default function LoginPage() {
  return (
    <div className="container-page py-20">
      <AuthForm mode="login" />
    </div>
  )
}