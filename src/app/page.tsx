import Link from 'next/link'
import { CheckCircle, Shield, MapPin, Search } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white sticky top-0 z-50">
        <Link className="flex items-center justify-center font-bold text-xl tracking-tight text-green-700" href="#">
          Chiang Ride 🛵
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium text-gray-700 hover:text-green-700 transition-colors" href="/app">
            Enter App (Demo)
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-16 md:py-32 lg:py-40 bg-green-700 text-white relative overflow-hidden">
          {/* Abstract Pattern Overlay */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
          
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="space-y-4 max-w-3xl">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl drop-shadow-sm">
                  Rent a Scooter in Chiang Mai <br/><span className="text-yellow-400">Without the Gamble.</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-green-50 md:text-xl font-medium">
                  Verified shops, real-time availability, and fair contracts. The smart way to explore the North.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <Link
                  className="inline-flex h-12 items-center justify-center rounded-lg bg-orange-500 px-8 text-base font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                  href="/app"
                >
                  Find a Bike
                </Link>
                <Link
                  className="inline-flex h-12 items-center justify-center rounded-lg border-2 border-white/20 bg-white/10 backdrop-blur-sm px-8 text-base font-semibold text-white shadow-sm transition-colors hover:bg-white/20"
                  href="/app/shop-admin"
                >
                  I'm a Shop Owner
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="w-full py-16 md:py-24 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Ride with Confidence</h2>
              <p className="mt-4 text-lg text-gray-600">We fixed the broken rental experience.</p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-start space-y-4 p-6 bg-gray-50 rounded-xl border border-gray-100 shadow-sm transition-shadow hover:shadow-md">
                <div className="p-3 bg-red-100 rounded-lg">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">No Passport Deposits</h3>
                <p className="text-gray-600">
                  Stop leaving your most important document with strangers. Our partner shops accept fair deposits.
                </p>
              </div>
              <div className="flex flex-col items-start space-y-4 p-6 bg-gray-50 rounded-xl border border-gray-100 shadow-sm transition-shadow hover:shadow-md">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Search className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Real Availability</h3>
                <p className="text-gray-600">
                  See what's actually in stock for your dates. No more "maybe tomorrow" messages.
                </p>
              </div>
              <div className="flex flex-col items-start space-y-4 p-6 bg-gray-50 rounded-xl border border-gray-100 shadow-sm transition-shadow hover:shadow-md">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Verified Shops Only</h3>
                <p className="text-gray-600">
                  We vet every listing. Check reviews, bike age, and shop policies before you book.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works / Value Prop */}
        <section className="w-full py-16 md:py-24 bg-green-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                  Simpler for You. <br/>Better for Locals.
                </h2>
                <p className="text-lg text-gray-600">
                  We don't disrupt the local economy; we digitize it. Shops get professional tools to manage their fleet, and you get a seamless booking experience.
                </p>
                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white font-bold">1</div>
                    <p className="font-medium text-gray-900">Browse verified scooters by date</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white font-bold">2</div>
                    <p className="font-medium text-gray-900">Book online with a small deposit</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white font-bold">3</div>
                    <p className="font-medium text-gray-900">Pick up & ride with a clear contract</p>
                  </div>
                </div>
              </div>
              
              {/* Abstract Visual Placeholder */}
              <div className="relative aspect-square md:aspect-video bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-white transform rotate-1 hover:rotate-0 transition-transform duration-500">
                 <div className="absolute inset-0 bg-green-100 flex items-center justify-center text-green-300">
                    {/* Placeholder for a nice lifestyle shot */}
                   <MapPin className="w-32 h-32 opacity-20" />
                   <span className="sr-only">Success Image</span>
                 </div>
                 <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-green-50">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="text-green-600 w-5 h-5 shrink-0" />
                      <p className="text-sm font-medium text-green-900">"Finally, I didn't have to leave my passport behind!"</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="w-full py-8 bg-gray-900 text-gray-400 text-sm">
        <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2024 Chiang Ride. Made with ❤️ in CNX.</p>
          <nav className="flex gap-6">
            <Link className="hover:text-white transition-colors" href="#">Terms</Link>
            <Link className="hover:text-white transition-colors" href="#">Privacy</Link>
            <Link className="hover:text-white transition-colors" href="#">Contact</Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
