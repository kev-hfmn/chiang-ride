'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Home, Search, User, Bike, Briefcase, Settings, Calendar, CalendarDays, ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useLanguage } from '@/lib/i18n/language-context'

interface AppShellProps {
  children: React.ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useLanguage()
  // Detect admin mode based on /admin path (new route structure)
  const [isShopMode, setIsShopMode] = useState(pathname.startsWith('/admin'))

  // Update mode if the path changes explicitly to an admin route (e.g. from direct navigation)
  useEffect(() => {
    const shouldBeAdminMode = pathname.startsWith('/admin')
    if (shouldBeAdminMode !== isShopMode) {
      setIsShopMode(shouldBeAdminMode)
    }
  }, [pathname, isShopMode])

  const toggleMode = () => {
    const newMode = !isShopMode
    setIsShopMode(newMode)
    if (newMode) {
      router.push('/admin')
    } else {
      router.push('/dashboard')
    }
  }

  const isHome = pathname === '/dashboard' || pathname === '/admin' || pathname === '/shops'

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC]">
      {/* Top Header - Premium Floating Style */}
      <header className="h-16 bg-linear-to-r from-emerald-600 to-green-600 flex items-center justify-between px-2 sticky top-0 z-50 shadow-lg shadow-green-900/10 shrink-0 border-none">
        <div className="flex items-center gap-3">
          <Link href={isShopMode ? "/admin" : "/dashboard"} className="font-black text-xl text-white tracking-tighter flex items-center gap-2 group">
           <div className="bg-gray-50/90 rounded-2xl p-1 h-12 w-12">
              <Image src="/logo.png" alt="Chiang Ride" width={50} height={50} className=" " />
</div>
            <span>Chiang Ride</span>
          </Link>
        </div>

        <div className="flex items-center gap-2 bg-black/20 p-1 rounded-full border border-white/10 backdrop-blur-sm shadow-inner">
          <button
            onClick={() => !isShopMode || toggleMode()}
            className={cn(
              "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all duration-300",
              !isShopMode ? "bg-white text-green-700 shadow-md scale-105" : "text-white/60 hover:text-white"
            )}
          >
            {t('navRenter')}
          </button>
          <button
            onClick={() => isShopMode || toggleMode()}
            className={cn(
              "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all duration-300",
              isShopMode ? "bg-orange-500 text-white shadow-md scale-105 border border-orange-400/30" : "text-white/60 hover:text-white"
            )}
          >
            {t('navShop')}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-28 lg:pb-6 scroll-smooth lg:ml-64">
        <div className="container mx-auto max-w-2xl min-h-full px-2 pb-4 pt-6 md:px-6 md:pb-6 md:pt-10">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </div>
      </main>

      {/* Bottom Tab Bar (Mobile) - Modern Glassmorphism Dock */}
      <div className="fixed bottom-6 left-0 right-0 z-50 px-4 lg:hidden pointer-events-none">
        <nav className="max-w-md mx-auto bg-white/90 backdrop-blur-xl h-18 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.45)] flex items-center justify-around px-4 border border-white/20 pointer-events-auto">
          {!isShopMode ? (
            <>
              <NavItem href="/dashboard" icon={Home} label={t('navHome')} active={pathname === '/dashboard'} />
              <NavItem href="/shops" icon={Search} label={t('navExplore')} active={pathname.startsWith('/shops')} />
              <NavItem href="/bookings" icon={Bike} label={t('navRides')} active={pathname.startsWith('/bookings')} />
              <NavItem href="/profile" icon={User} label={t('navProfile')} active={pathname.startsWith('/profile')} />
            </>
          ) : (
            <>
              <NavItem href="/admin" icon={Home} label={t('navDashboard')} active={pathname === '/admin'} />
              <NavItem href="/admin/inventory" icon={Bike} label={t('navFleet')} active={pathname.startsWith('/admin/inventory')} />
              <NavItem href="/admin/calendar" icon={CalendarDays} label={t('navCalendar')} active={pathname.startsWith('/admin/calendar')} />
              <NavItem href="/admin/bookings" icon={Calendar} label={t('navBookings')} active={pathname.startsWith('/admin/bookings')} />
              <NavItem href="/admin/settings" icon={Settings} label={t('navAdmin')} active={pathname.startsWith('/admin/settings')} />
            </>
          )}
        </nav>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-16 bottom-0 w-64 bg-white border-r p-6 overflow-y-auto z-40">
         <nav className="space-y-1">
             <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 px-3">
                 {isShopMode ? t('navShopManagement') : t('navRenterMenu')}
             </h3>
             {!isShopMode ? (
              <>
                <DesktopNavItem href="/dashboard" icon={Home} label={t('navHomeDashboard')} active={pathname === '/dashboard'} />
                <DesktopNavItem href="/shops" icon={Search} label={t('navFindShop')} active={pathname.startsWith('/shops')} />
                <DesktopNavItem href="/bookings" icon={Bike} label={t('navMyBookings')} active={pathname.startsWith('/bookings')} />
                <DesktopNavItem href="/profile" icon={User} label={t('navAccountProfile')} active={pathname.startsWith('/profile')} />
              </>
            ) : (
              <>
                <DesktopNavItem href="/admin" icon={Briefcase} label={t('navShopOverview')} active={pathname === '/admin'} />
                <DesktopNavItem href="/admin/inventory" icon={Bike} label={t('navManageInventory')} active={pathname.startsWith('/admin/inventory')} />
                <DesktopNavItem href="/admin/calendar" icon={CalendarDays} label={t('navShopCalendar')} active={pathname.startsWith('/admin/calendar')} />
                <DesktopNavItem href="/admin/bookings" icon={Calendar} label={t('navActiveOrders')} active={pathname.startsWith('/admin/bookings')} />
                <DesktopNavItem href="/admin/settings" icon={Settings} label={t('navGlobalSettings')} active={pathname.startsWith('/admin/settings')} />
              </>
            )}
         </nav>
      </aside>
    </div>
  )
}

import { IconComponent } from '@/lib/types/custom'

function NavItem({ href, icon: Icon, label, active }: { href: string; icon: IconComponent; label: string; active: boolean }) {
  return (
    <Link href={href} className="flex flex-col items-center justify-center w-full h-full relative group">
      <div className={cn(
        "flex flex-col items-center justify-center transition-all duration-300",
        active ? "text-green-600 -translate-y-1.5" : "text-gray-400 hover:text-gray-500"
      )}>
        <div className={cn(
          "p-2 rounded-2xl transition-all duration-300",
          active ? "bg-green-100/50 shadow-inner" : "group-hover:bg-gray-100"
        )}>
          <Icon className={cn("w-5 h-5 transition-transform duration-300", active ? "scale-110 stroke-[2.5px]" : "stroke-[2px]")} />
        </div>
        <span className={cn(
          "text-[8px] font-black uppercase tracking-widest mt-1 transition-all duration-300",
          active ? "text-green-700 opacity-100 scale-100" : "text-gray-400 opacity-100 scale-100"
        )}>
          {label}
        </span>
      </div>
      {active && (
        <motion.div 
          layoutId="activeTabIndicator"
          className="absolute -bottom-1 w-1 h-1 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"
        />
      )}
    </Link>
  )
}

function DesktopNavItem({ href, icon: Icon, label, active }: { href: string; icon: IconComponent; label: string; active: boolean }) {
    return (
      <Link href={href} className={cn(
        "flex items-center gap-4 px-4 py-3 text-sm font-bold rounded-2xl transition-all duration-200 group",
        active ? "bg-green-50 text-green-700 shadow-sm" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      )}>
        <div className={cn(
          "p-2 rounded-xl transition-colors",
          active ? "bg-green-600 text-white shadow-green-200 shadow-md" : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"
        )}>
          <Icon className="w-5 h-5" />
        </div>
        <span>{label}</span>
      </Link>
    )
}
