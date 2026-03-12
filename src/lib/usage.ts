import { supabaseAdmin } from '@/lib/supabase-admin'

export const FREE_PLAN_MONTHLY_LIMIT = 10

export async function getUsageForMonth(userId: string) {
  const start = new Date()
  start.setDate(1)
  start.setHours(0, 0, 0, 0)

  const { count } = await supabaseAdmin
    .from('usage_events')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', start.toISOString())

  return count ?? 0
}

export async function getPlan(userId: string) {
  const { data } = await supabaseAdmin
    .from('profiles')
    .select('plan, stripe_subscription_status')
    .eq('id', userId)
    .single()

  return data?.plan ?? 'free'
}

export async function canGenerate(userId: string) {
  const plan = await getPlan(userId)
  const usage = await getUsageForMonth(userId)

  if (plan === 'pro') {
    return { allowed: true, usage, limit: 'Unlimited' as const }
  }

  return {
    allowed: usage < FREE_PLAN_MONTHLY_LIMIT,
    usage,
    limit: FREE_PLAN_MONTHLY_LIMIT,
  }
}