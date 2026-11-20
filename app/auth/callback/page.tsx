'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()
  const started = useRef(false)
  const [message, setMessage] = useState('Confirming your email…')

  useEffect(() => {
    if (started.current) return
    started.current = true

    const code = new URLSearchParams(window.location.search).get('code')
    if (!code) {
      setMessage('This confirmation link is invalid or has expired. Please sign in or request a new link.')
      return
    }

    void supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      if (error) {
        setMessage('We could not confirm your email. Please request a new confirmation link.')
        return
      }

      router.replace('/')
    })
  }, [router])

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <p className="max-w-md text-center text-muted-foreground" role="status" aria-live="polite">
        {message}
      </p>
    </main>
  )
}
