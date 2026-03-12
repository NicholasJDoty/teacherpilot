import { DashboardShell } from '@/components/dashboard-shell'
import { GeneratorForm } from '@/components/generator-form'
import { requireUser } from '@/lib/auth'

export default async function GeneratePage() {
  await requireUser()

  return (
    <DashboardShell>
      <GeneratorForm />
    </DashboardShell>
  )
}