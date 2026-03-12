'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function UpgradeButton({
  className = 'btn-primary',
  label = 'Upgrade to Pro',
}: {
  className?: string
  label?: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    try {
      setLoading(true)

      const res = await fetch('/api/checkout', {
        method: 'POST',
      })

      if (res.status === 401) {
        router.push('/login')
        return
      }

      const text = await res.text()
      const data = text ? JSON.parse(text) : {}

      if (!res.ok) {
        throw new Error(data.error || 'Unable to start checkout.')
      }

      if (!data.url) {
        throw new Error('Stripe checkout URL was not returned.')
      }

      window.location.href = data.url
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Unable to start checkout.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button type="button" className={className} onClick={handleUpgrade} disabled={loading}>
      {loading ? 'Opening checkout...' : label}
    </button>
  )
}

export function BillingPortalButton({
  className = 'btn-secondary',
  label = 'Manage billing',
}: {
  className?: string
  label?: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handlePortal = async () => {
    try {
      setLoading(true)

      const res = await fetch('/api/portal', {
        method: 'POST',
      })

      if (res.status === 401) {
        router.push('/login')
        return
      }

      const text = await res.text()
      const data = text ? JSON.parse(text) : {}

      if (!res.ok) {
        throw new Error(data.error || 'Unable to open billing portal.')
      }

      if (!data.url) {
        throw new Error('Stripe billing portal URL was not returned.')
      }

      window.location.href = data.url
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Unable to open billing portal.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button type="button" className={className} onClick={handlePortal} disabled={loading}>
      {loading ? 'Opening billing...' : label}
    </button>
  )
}