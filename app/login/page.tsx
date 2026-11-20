'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/app/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, Lock, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { signIn, resendConfirmation } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [emailUnconfirmed, setEmailUnconfirmed] = useState(false)
  const [resendMessage, setResendMessage] = useState('')
  const [resending, setResending] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn(email, password)
      router.push('/')
    } catch (err: any) {
      const errorCode = typeof err?.code === 'string' ? err.code : ''
      const errorMessage = typeof err?.message === 'string' ? err.message.toLowerCase() : ''
      const requiresConfirmation = errorCode === 'email_not_confirmed' || errorMessage.includes('email not confirmed')

      setEmailUnconfirmed(requiresConfirmation)
      setError(
        requiresConfirmation
          ? 'Confirm your email before signing in. You can request a new confirmation link below.'
          : errorCode === 'invalid_credentials'
            ? 'Invalid email or password.'
            : 'We could not sign you in right now. Please try again.'
      )
      setResendMessage('')
    } finally {
      setLoading(false)
    }
  }

  const handleResendConfirmation = async () => {
    setResending(true)
    setResendMessage('')

    try {
      await resendConfirmation(email.trim())
      setResendMessage('A new confirmation link has been sent. Check your inbox and spam folder.')
    } catch (err: any) {
      const errorCode = typeof err?.code === 'string' ? err.code : ''
      setResendMessage(
        errorCode === 'over_email_send_rate_limit'
          ? 'Please wait a little before requesting another link.'
          : 'We could not send a confirmation email. Please try again later.'
      )
    } finally {
      setResending(false)
    }
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-md">
              <span className="text-lg font-bold text-primary-foreground">T</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Welcome to ThreadHub
          </h1>
          <p className="text-muted-foreground">
            B2B Textile Marketplace
          </p>
        </div>

        <Card>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Alert */}
              {error && !emailUnconfirmed && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setEmailUnconfirmed(false)
                      setResendMessage('')
                    }}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>

              {emailUnconfirmed && (
                <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
                  <p>{error}</p>
                  <Button
                    type="button"
                    variant="link"
                    disabled={resending || !email.trim()}
                    onClick={handleResendConfirmation}
                    className="mt-2 h-auto p-0 font-semibold text-accent"
                  >
                    {resending ? 'Sending link...' : 'Resend confirmation email'}
                  </Button>
                  {resendMessage && <p role="status" className="mt-2">{resendMessage}</p>}
                </div>
              )}

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link
                  href="#"
                  className="text-sm text-accent hover:text-accent/80 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-2 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link
                  href="/signup"
                  className="text-accent hover:text-accent/80 font-semibold transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="mt-6 bg-secondary/50">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-3">
              Demo credentials (for testing):
            </p>
            <div className="space-y-2 text-sm font-mono">
              <p className="text-foreground">Email: <span className="text-accent">demo@threadhub.com</span></p>
              <p className="text-foreground">Password: <span className="text-accent">demo123456</span></p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
