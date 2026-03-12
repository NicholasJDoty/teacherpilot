import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 })
    }

    const body = await req.json()
    const id = body.id as string | undefined

    if (!id) {
      return NextResponse.json({ error: 'Missing saved output id.' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('saved_outputs')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Delete failed.'

    return NextResponse.json({ error: message }, { status: 500 })
  }
}