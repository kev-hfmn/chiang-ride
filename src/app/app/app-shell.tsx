'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Home, Search, User, Bike, Briefcase, Settings, Calendar, CalendarDays, ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

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

  const isHome = pathname === '/app' || pathname === '/app/shop-admin'

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC]">
      {/* Top Header - Premium Floating Style */}
      <header className="h-16 bg-linear-to-r from-emerald-600 to-green-600 flex items-center justify-between px-6 sticky top-0 z-50 shadow-lg shadow-green-900/10 shrink-0 border-none">
        <div className="flex items-center gap-3">
          <Link href="/app" className="font-black text-xl text-white tracking-tighter flex items-center gap-2 group">
            <div className="bg-white p-1 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
              <Image src="https://iili.io/fg6gAZb.md.png" alt="Chiang Ride" width={24} height={24} className="w-6 h-6" />
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
            Renter
          </button>
          <button 
            onClick={() => isShopMode || toggleMode()}
            className={cn(
              "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all duration-300",
              isShopMode ? "bg-orange-500 text-white shadow-md scale-105 border border-orange-400/30" : "text-white/60 hover:text-white"
            )}
          >
            Shop
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-28 md:pb-6 scroll-smooth">
        <div className="container mx-auto max-w-2xl min-h-full px-4 pb-4 pt-6 md:px-6 md:pb-6 md:pt-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom Tab Bar (Mobile) - Modern Glassmorphism Dock */}
      <div className="fixed bottom-6 left-0 right-0 z-50 px-4 md:hidden pointer-events-none">
        <nav className="max-w-md mx-auto bg-white/90 backdrop-blur-xl h-18 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] flex items-center justify-around px-2 border border-white/20 pointer-events-auto">
          {!isShopMode ? (
            <>
              <NavItem href="/app" icon={Home} label="Home" active={pathname === '/app'} />
              <NavItem href="/app/shops" icon={Search} label="Explore" active={pathname === '/app/shops'} />
              <NavItem href="/app/bookings" icon={Bike} label="Rides" active={pathname.includes('bookings')} />
              <NavItem href="/app/profile" icon={User} label="Profile" active={pathname.includes('profile')} />
            </>
          ) : (
            <>
              <NavItem href="/app/shop-admin" icon={Briefcase} label="Stats" active={pathname === '/app/shop-admin'} />
              <NavItem href="/app/shop-admin/inventory" icon={Bike} label="Fleet" active={pathname.includes('inventory')} />
              <NavItem href="/app/shop-admin/bookings" icon={Calendar} label="Bookings" active={pathname.includes('bookings')} />
              <NavItem href="/app/shop-admin/settings" icon={Settings} label="Admin" active={pathname.includes('settings')} />
            </>
          )}
        </nav>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block fixed left-0 top-16 bottom-0 w-64 bg-white border-r p-6 overflow-y-auto">
         <nav className="space-y-1">
             <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 px-3">
                 {isShopMode ? 'Shop Management' : 'Renter Menu'}
             </h3>
             {!isShopMode ? (
              <>
                <DesktopNavItem href="/app" icon={Home} label="Home Dashboard" active={pathname === '/app'} />
                <DesktopNavItem href="/app/shops" icon={Search} label="Find a Shop" active={pathname === '/app/shops'} />
                <DesktopNavItem href="/app/bookings" icon={Bike} label="My Bookings" active={pathname.includes('bookings')} />
                <DesktopNavItem href="/app/profile" icon={User} label="Account Profile" active={pathname.includes('profile')} />
              </>
            ) : (
              <>
                <DesktopNavItem href="/app/shop-admin" icon={Briefcase} label="Shop Overview" active={pathname === '/app/shop-admin'} />
                <DesktopNavItem href="/app/shop-admin/inventory" icon={Bike} label="Manage Inventory" active={pathname.includes('inventory')} />
                <DesktopNavItem href="/app/shop-admin/calendar" icon={CalendarDays} label="Shop Calendar" active={pathname.includes('calendar')} />
                <DesktopNavItem href="/app/shop-admin/bookings" icon={Calendar} label="Active Orders" active={pathname.includes('bookings')} />
                <DesktopNavItem href="/app/shop-admin/settings" icon={Settings} label="Global Settings" active={pathname.includes('settings')} />
              </>
            )}
         </nav>
      </aside>
    </div>
  )
}

function NavItem({ href, icon: Icon, label, active }: { href: string; icon: any; label: string; active: boolean }) {
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

function DesktopNavItem({ href, icon: Icon, label, active }: { href: string; icon: any; label: string; active: boolean }) {
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
