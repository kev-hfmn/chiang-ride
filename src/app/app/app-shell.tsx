'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, Search, User, Bike, Briefcase, Settings, Calendar, CalendarDays } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AppShellProps {
  children: React.ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isShopMode, setIsShopMode] = useState(pathname.includes('shop-admin'))

  // Update mode if the path changes explicitly to a shop admin route (e.g. from direct navigation)
  useEffect(() => {
    if (pathname.includes('shop-admin') && !isShopMode) {
      setIsShopMode(true)
    }
  }, [pathname])

  const toggleMode = () => {
    const newMode = !isShopMode
    setIsShopMode(newMode)
    if (newMode) {
      router.push('/app/shop-admin')
    } else {
      router.push('/app')
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top Header */}
      <header className="h-16 bg-white border-b flex items-center justify-between px-4 sticky top-0 z-50 shadow-sm shrink-0">
        <Link href="/app" className="font-extrabold text-xl text-green-700 tracking-tight flex items-center gap-2">
          Chiang Ride 🛵
        </Link>
        <div className="flex items-center gap-2">
          <span className={cn("text-xs font-medium", !isShopMode ? "text-green-700" : "text-gray-400")}>
            Renter
          </span>
          <button
            onClick={toggleMode}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2",
              isShopMode ? "bg-orange-500" : "bg-green-600"
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                isShopMode ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
          <span className={cn("text-xs font-medium", isShopMode ? "text-orange-600" : "text-gray-400")}>
            Shop
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-6">
        <div className="container mx-auto max-w-2xl min-h-full p-4">
          {children}
        </div>
      </main>

      {/* Bottom Tab Bar (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t h-16 flex items-center justify-around px-2 z-50 md:hidden pb-safe">
        {!isShopMode ? (
          <>
            <NavItem href="/app" icon={Home} label="Home" active={pathname === '/app'} />
            <NavItem href="/app/shops" icon={Search} label="Explore" active={pathname === '/app/shops'} />
            <NavItem href="/app/bookings" icon={Bike} label="Rides" active={pathname.includes('bookings')} />
            <NavItem href="/app/profile" icon={User} label="Profile" active={pathname.includes('profile')} />
          </>
        ) : (
          <>
            <NavItem href="/app/shop-admin" icon={Briefcase} label="Dashboard" active={pathname === '/app/shop-admin'} />
            <NavItem href="/app/shop-admin/inventory" icon={Bike} label="Fleet" active={pathname.includes('inventory')} />
            <NavItem href="/app/shop-admin/bookings" icon={Calendar} label="Bookings" active={pathname.includes('bookings')} />
            <NavItem href="/app/shop-admin/settings" icon={Settings} label="Settings" active={pathname.includes('settings')} />
          </>
        )}
      </nav>

      {/* Desktop Sidebar (Hidden on Mobile) - Simplified for this layout */}
      <aside className="hidden md:block fixed left-0 top-16 bottom-0 w-64 bg-white border-r p-4 overflow-y-auto">
         <nav className="space-y-1">
             <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
                 {isShopMode ? 'Shop Management' : 'Renter Menu'}
             </h3>
             {!isShopMode ? (
              <>
                <DesktopNavItem href="/app" icon={Home} label="Home" active={pathname === '/app'} />
                <DesktopNavItem href="/app/shops" icon={Search} label="Explore Shops" active={pathname === '/app/shops'} />
                <DesktopNavItem href="/app/bookings" icon={Bike} label="My Rides" active={pathname.includes('bookings')} />
                <DesktopNavItem href="/app/profile" icon={User} label="Profile" active={pathname.includes('profile')} />
              </>
            ) : (
              <>
                <DesktopNavItem href="/app/shop-admin" icon={Briefcase} label="Dashboard" active={pathname === '/app/shop-admin'} />
                <DesktopNavItem href="/app/shop-admin/inventory" icon={Bike} label="Fleet Management" active={pathname.includes('inventory')} />
                <DesktopNavItem href="/app/shop-admin/calendar" icon={CalendarDays} label="Availability" active={pathname.includes('calendar')} />
                <DesktopNavItem href="/app/shop-admin/bookings" icon={Calendar} label="Bookings" active={pathname.includes('bookings')} />
                <DesktopNavItem href="/app/shop-admin/settings" icon={Settings} label="Shop Settings" active={pathname.includes('settings')} />
              </>
            )}
         </nav>
      </aside>
    </div>
  )
}

function NavItem({ href, icon: Icon, label, active }: { href: string; icon: any; label: string; active: boolean }) {
  return (
    <Link href={href} className={cn("flex flex-col items-center justify-center w-full h-full space-y-1", active ? "text-green-700" : "text-gray-400 hover:text-gray-600")}>
      <Icon className="w-6 h-6" />
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  )
}

function DesktopNavItem({ href, icon: Icon, label, active }: { href: string; icon: any; label: string; active: boolean }) {
    return (
      <Link href={href} className={cn("flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors", active ? "bg-green-50 text-green-700" : "text-gray-700 hover:bg-gray-100")}>
        <Icon className="w-5 h-5" />
        <span>{label}</span>
      </Link>
    )
  }
