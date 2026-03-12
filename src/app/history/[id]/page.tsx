import Link from 'next/link'
import { notFound } from 'next/navigation'
import { DashboardShell } from '@/components/dashboard-shell'
import { requireUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-admin'
import SavedOutputDetailClient from './saved-output-detail-client'

export default async function HistoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await requireUser()
  const { id } = await params

  const { data, error } = await supabaseAdmin
    .from('saved_outputs')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !data) {
    notFound()
  }

  const title = `${data.tool.replaceAll('_', ' ')} — ${data.topic}`
  const meta = `${data.grade_level} • ${data.subject} • Saved ${new Date(
    data.created_at
  ).toLocaleDateString()}`

  return (
    <DashboardShell>
      <div className="mb-6 flex items-center justify-between no-print">
        <div>
          <p className="text-sm text-slate-500">Saved output</p>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">{meta}</p>
        </div>

        <Link href="/history" className="btn-secondary">
          Back to history
        </Link>
      </div>

      <SavedOutputDetailClient content={data.content} title={title} meta={meta} />
    </DashboardShell>
  )
}