'use client'

import { createClient } from '@/lib/supabase/client'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleLogout = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    router.refresh()
    router.push('/login')
    setLoading(false)
  }

  return (
    <button 
      onClick={handleLogout}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 p-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all font-medium disabled:opacity-50"
    >
      <LogOut className="w-5 h-5" />
      {loading ? 'Logging out...' : 'Log Out'}
    </button>
  )
}
