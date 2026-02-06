import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // If "next" is in the params, use it, otherwise default to dashboard
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    
    // 🛡️ This part "exchanges" the temporary code for a real user session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // ✅ We use new URL() to ensure a valid absolute path for Next.js 15
      const forwardTo = new URL(next, origin)
      return NextResponse.redirect(forwardTo)
    }
  }

  // ❌ If something fails, send them to an error page
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}