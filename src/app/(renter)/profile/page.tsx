import { createClient } from '@/lib/supabase/server'
import { LogoutButton } from '@/components/logout-button'
import { User, Mail, Shield } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  // DEMO MODE: If no real user, simulate one
  const user = authUser || {
    email: 'demo@chiang-ride.com',
    id: 'demo-renter-123',
    is_anonymous: true
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
            <User className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Your Profile</h1>
          <p className="text-gray-500 text-sm">Manage your account and preferences.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
        
        {!authUser && (
             <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                    <Shield className="w-4 h-4" />
                </div>
                <div>
                    <h3 className="font-bold text-blue-900 text-sm">Demo Mode Active</h3>
                    <p className="text-blue-700 text-xs mt-1">
                        You are viewing a simulated profile. Bookings and actions will use this demo identity.
                    </p>
                </div>
            </div>
        )}

        <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <Mail className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase font-semibold">Email</p>
                    <p className="font-medium text-gray-900">{user.email}</p>
                </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <Shield className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase font-semibold">User ID</p>
                    <p className="font-medium text-gray-900 font-mono text-sm">{user.id.slice(0, 15)}{user.id.length > 15 && '...'}</p>
                </div>
            </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
            <LogoutButton />
        </div>
      </div>
    </div>
  )
}
