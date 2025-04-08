import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (code) {
      const cookieStore = cookies()
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
      await supabase.auth.exchangeCodeForSession(code)
      
      // Get the user to check if this is a new sign-in
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Check if user already has a company
        const { data: existingCompanyUser } = await supabase
          .from('company_users')
          .select('company_id')
          .eq('user_id', user.id)
          .single()
          
        if (!existingCompanyUser?.company_id && user.user_metadata?.company_name) {
          // User doesn't have a company yet but provided a company name
          const { error: companyError, data: companyData } = await supabase
            .from('companies')
            .insert({
              name: user.user_metadata.company_name || 'My Company',
              created_by: user.id
            })
            .select()
            .single()

          if (!companyError && companyData) {
            // Add user to company_users as admin
            await supabase
              .from('company_users')
              .insert({
                company_id: companyData.id,
                user_id: user.id,
                role: 'admin',
                status: 'active'
              })
          }
        }
        
        // Update user profile with any additional details provided
        if (user.user_metadata?.full_name || user.user_metadata?.phone) {
          await supabase.auth.updateUser({
            data: {
              full_name: user.user_metadata?.full_name || user.user_metadata?.name,
              phone: user.user_metadata?.phone,
              // Preserve existing metadata
              ...user.user_metadata
            }
          })
        }
      }
    }

    // After successful authentication, redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url))
  } catch (error) {
    console.error('Callback error:', error)
    return NextResponse.redirect(new URL('/auth/error', request.url))
  }
} 