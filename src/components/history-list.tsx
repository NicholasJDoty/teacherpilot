'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Item {
  id: string
  tool: string
  topic: string
  subject: string
  grade_level: string
  created_at: string
}

export function HistoryList({ items }: { items: Item[] }) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Delete this saved output?')

    if (!confirmed) return

    try {
      setDeletingId(id)

      const res = await fetch('/api/delete-output', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      const text = await res.text()
      const data = text ? JSON.parse(text) : {}

      if (!res.ok) {
        throw new Error(data.error || 'Delete failed')
      }

      router.refresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Delete failed')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="font-semibold">Saved outputs</h2>
      </div>

      <div className="divide-y divide-slate-200">
        {items.map((item) => (
          <div key={item.id} className="px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-slate-900">
                  {item.tool.replaceAll('_', ' ')} — {item.topic}
                </p>
                <p className="text-sm text-slate-500">
                  {item.grade_level} • {item.subject}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <p className="text-sm text-slate-400">
                  {new Date(item.created_at).toLocaleDateString()}
                </p>

                <Link href={`/history/${item.id}`} className="btn-secondary">
                  View
                </Link>

                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                >
                  {deletingId === item.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="px-6 py-8 text-sm text-slate-500">
            No saved outputs yet.
          </div>
        )}
      </div>
    </div>
  )
}