import { DashboardShell } from '@/components/dashboard-shell'
import { HistoryList } from '@/components/history-list'
import { requireUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-admin'

export default async function HistoryPage() {
  const user = await requireUser()

  const { data } = await supabaseAdmin
    .from('saved_outputs')
    .select('id, tool, topic, subject, grade_level, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <DashboardShell>
      <HistoryList items={data || []} />
    </DashboardShell>
  )
}