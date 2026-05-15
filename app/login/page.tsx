import { AuthForm } from '@/components/auth/auth-form'

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <AuthForm mode="login" />
    </main>
  )
}