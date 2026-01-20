import Link from 'next/link'
import { CheckCircle, Shield, MapPin, Search, Camera, Star, Calendar, FileText, Users, MessageCircle, Bike, Clock, CreditCard, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <Link className="flex items-center justify-center gap-2 font-bold text-xl tracking-tight text-green-700" href="/">
          <span className="text-2xl">🛵</span>
          <span>Chiang Ride</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <Link className="text-sm font-medium text-gray-600 hover:text-green-700 transition-colors hidden sm:block" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium text-gray-600 hover:text-green-700 transition-colors hidden sm:block" href="#how-it-works">
            How It Works
          </Link>
          <Link className="text-sm font-medium text-gray-600 hover:text-green-700 transition-colors hidden sm:block" href="#for-shops">
            For Shops
          </Link>
          <Link 
            className="inline-flex h-9 items-center justify-center rounded-full bg-green-600 px-4 text-sm font-medium text-white shadow-sm transition-all hover:bg-green-700 hover:shadow-md"
            href="/app"
          >
            Open App
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-400/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl"></div>
          
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-300"></span>
                </span>
                Now live in Chiang Mai
              </div>
              
              <div className="space-y-6 max-w-4xl">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  Rent a Scooter in Chiang Mai
                  <span className="block text-yellow-400 mt-2">Without the Gamble.</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-green-50/90 text-lg md:text-xl font-medium leading-relaxed">
                  Browse real-time availability, book from verified shops, and keep your passport safe. 
                  The smart way to explore Northern Thailand.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-4">
                <Link
                  className="group inline-flex h-14 items-center justify-center rounded-xl bg-orange-500 px-8 text-lg font-bold text-white shadow-lg shadow-orange-500/30 transition-all hover:scale-105 hover:bg-orange-400 hover:shadow-xl hover:shadow-orange-500/40"
                  href="/app"
                >
                  Find a Bike
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  className="inline-flex h-14 items-center justify-center rounded-xl border-2 border-white/30 bg-white/10 backdrop-blur-sm px-8 text-lg font-semibold text-white transition-all hover:bg-white/20 hover:border-white/40"
                  href="/app/shop-admin"
                >
                  I'm a Shop Owner
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center justify-center gap-8 pt-8 text-sm text-green-100/80">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <span>No passport deposits</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Verified shops only</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>Real-time availability</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem/Solution Section */}
        <section id="features" className="w-full py-20 md:py-28 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
                ⚠️ The Problem
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
                Renting a scooter shouldn't feel like a scam
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Every traveler in Chiang Mai knows the struggle. We built the solution.
              </p>
            </div>
            
            <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="group relative flex flex-col p-8 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-100 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="p-3 bg-white rounded-xl shadow-sm w-fit mb-4">
                  <Shield className="h-7 w-7 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Passport Hostage</h3>
                <p className="text-gray-600 leading-relaxed">
                  Stop leaving your most important document with strangers. Our shops accept fair cash or card deposits only.
                </p>
              </div>
              
              <div className="group relative flex flex-col p-8 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl border border-orange-100 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="p-3 bg-white rounded-xl shadow-sm w-fit mb-4">
                  <Search className="h-7 w-7 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Real-Time Availability</h3>
                <p className="text-gray-600 leading-relaxed">
                  See what's actually in stock for your dates. No more walking shop to shop hearing "maybe tomorrow".
                </p>
              </div>
              
              <div className="group relative flex flex-col p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 transition-all hover:shadow-lg hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
                <div className="p-3 bg-white rounded-xl shadow-sm w-fit mb-4">
                  <MapPin className="h-7 w-7 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Verified Shops Only</h3>
                <p className="text-gray-600 leading-relaxed">
                  We vet every listing. Check real reviews, bike condition, and clear policies before you book.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Live Bike Catalog Feature */}
        <section className="w-full py-20 md:py-28 bg-gray-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 rounded-full px-4 py-1.5 text-sm font-medium">
                  🔥 Core Feature
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
                  Live Bike Catalog
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  An Airb*b-style grid of available scooters across all verified shops. Filter by bike type, price, 
                  location, and availability dates. See exactly what you're getting before you book.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                    <span>Filter by Honda Click, Scoopy, PCX, and more</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                    <span>See real photos and bike year/condition</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                    <span>Compare prices across multiple shops</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                    <span>Book instantly for your travel dates</span>
                  </li>
                </ul>
                <Link 
                  href="/app" 
                  className="inline-flex items-center gap-2 text-green-700 font-semibold hover:text-green-800 transition-colors"
                >
                  Browse available bikes <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              
              {/* Visual mockup */}
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                  <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="flex-1 bg-white rounded-md px-3 py-1 text-sm text-gray-500 text-center">
                      chiangride.com/app
                    </div>
                  </div>
                  <div className="p-4 grid grid-cols-2 gap-3">
                    {[
                      { name: 'Honda Click 125i', price: '250', color: 'bg-blue-100' },
                      { name: 'Honda Scoopy', price: '200', color: 'bg-pink-100' },
                      { name: 'Honda PCX 160', price: '400', color: 'bg-purple-100' },
                      { name: 'Yamaha NMAX', price: '350', color: 'bg-orange-100' },
                    ].map((bike, i) => (
                      <div key={i} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <div className={`${bike.color} rounded-lg h-20 mb-2 flex items-center justify-center`}>
                          <Bike className="h-10 w-10 text-gray-400" />
                        </div>
                        <p className="font-semibold text-sm text-gray-900">{bike.name}</p>
                        <p className="text-green-600 font-bold">฿{bike.price}/day</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-green-600 text-white rounded-xl px-4 py-2 shadow-lg text-sm font-medium">
                  ✓ Real-time updates
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section id="how-it-works" className="w-full py-20 md:py-28 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
                How It Works
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                From search to ride in under 5 minutes
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
              <div className="relative text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-600 text-white text-2xl font-bold mx-auto mb-6 shadow-lg shadow-green-600/30">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Browse & Compare</h3>
                <p className="text-gray-600">
                  Search available scooters by your dates. Compare prices, conditions, and shop reviews.
                </p>
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-green-300 to-green-100"></div>
              </div>
              
              <div className="relative text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-600 text-white text-2xl font-bold mx-auto mb-6 shadow-lg shadow-green-600/30">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Book Online</h3>
                <p className="text-gray-600">
                  Reserve your bike with a small deposit. Get instant confirmation via Direct Message.
                </p>
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-green-300 to-green-100"></div>
              </div>
              
              <div className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-600 text-white text-2xl font-bold mx-auto mb-6 shadow-lg shadow-green-600/30">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Pick Up & Ride</h3>
                <p className="text-gray-600">
                  Show up at the shop, sign a clear digital contract, pay the balance, and ride!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="w-full py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Built for Modern Travelers
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Everything you need for a hassle-free rental experience
              </p>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex gap-4 p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-2.5 bg-purple-100 rounded-lg h-fit">
                  <Camera className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Snap & Store Docs</h3>
                  <p className="text-gray-600 text-sm">
                    Digital record of your rental: photos of the bike, receipt, and contract stored in-app.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-2.5 bg-yellow-100 rounded-lg h-fit">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Review Bridge</h3>
                  <p className="text-gray-600 text-sm">
                    Post-rental prompts to leave Google reviews — helping great shops get discovered.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-2.5 bg-green-100 rounded-lg h-fit">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Shop Info Profiles</h3>
                  <p className="text-gray-600 text-sm">
                    Opening hours, deposit policies, direct message links — all the info in one place.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-2.5 bg-blue-100 rounded-lg h-fit">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Digital Contracts</h3>
                  <p className="text-gray-600 text-sm">
                    Sign on your phone. No more messy paper agreements or unclear terms.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-2.5 bg-indigo-100 rounded-lg h-fit">
                  <MessageCircle className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Direct Message</h3>
                  <p className="text-gray-600 text-sm">
                    Message shops directly. Get quick answers without language barriers.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-2.5 bg-pink-100 rounded-lg h-fit">
                  <CreditCard className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Fair Deposits</h3>
                  <p className="text-gray-600 text-sm">
                    Cash or card deposits only. Clear refund policies. No surprises.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* For Shop Owners */}
        <section id="for-shops" className="w-full py-20 md:py-28 bg-green-700 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
          
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium">
                  🏪 For Shop Owners
                </div>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                  Grow Your Rental Business
                </h2>
                <p className="text-lg text-green-100 leading-relaxed">
                  We don't disrupt the local economy — we digitize it. Get professional tools to manage your 
                  fleet, reach more customers, and build your reputation online.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <span className="font-medium">Simple availability toggle — update stock in seconds</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                      <Users className="h-5 w-5" />
                    </div>
                    <span className="font-medium">Reach travelers searching for verified shops</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                      <Star className="h-5 w-5" />
                    </div>
                    <span className="font-medium">Boost your Google Maps reviews automatically</span>
                  </li>
                </ul>
                <Link
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-8 text-base font-bold text-green-700 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                  href="/app/shop-admin"
                >
                  Register Your Shop
                </Link>
              </div>
              
              {/* Shop dashboard mockup */}
              <div className="bg-white rounded-2xl shadow-2xl p-6 text-gray-900">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg">Shop Dashboard</h3>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Live</span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500">Active Bikes</p>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500">This Month</p>
                    <p className="text-2xl font-bold text-green-600">฿48,500</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center">
                        <Bike className="h-5 w-5 text-green-700" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Honda Click #3</p>
                        <p className="text-xs text-gray-500">Available</p>
                      </div>
                    </div>
                    <div className="w-12 h-6 bg-green-500 rounded-full relative">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-200 rounded-lg flex items-center justify-center">
                        <Bike className="h-5 w-5 text-orange-700" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">PCX 160 #1</p>
                        <p className="text-xs text-gray-500">Rented until Jan 25</p>
                      </div>
                    </div>
                    <div className="w-12 h-6 bg-gray-300 rounded-full relative">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial / Social Proof */}
        <section className="w-full py-20 md:py-28 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <blockquote className="text-2xl md:text-3xl font-medium text-gray-900 mb-6">
                "Finally, I didn't have to leave my passport behind! Found a great shop in 2 minutes and 
                the whole process was smooth. This is how it should've been all along."
              </blockquote>
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                  S
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Sarah M.</p>
                  <p className="text-sm text-gray-500">Digital Nomad from Australia</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-20 md:py-28 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
          
          <div className="container px-4 md:px-6 mx-auto relative z-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-6">
              Ready to Ride?
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
              Join thousands of travelers who rent smarter in Chiang Mai. 
              Browse bikes, compare shops, and book in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                className="group inline-flex h-14 items-center justify-center rounded-xl bg-green-500 px-8 text-lg font-bold text-white shadow-lg shadow-green-500/30 transition-all hover:scale-105 hover:bg-green-400"
                href="/app"
              >
                Browse Available Bikes
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="w-full py-12 bg-gray-900 text-gray-400">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <span className="text-2xl">🛵</span>
              <span>Chiang Ride</span>
            </div>
            <nav className="flex flex-wrap justify-center gap-6 text-sm">
              <Link className="hover:text-white transition-colors" href="#">About</Link>
              <Link className="hover:text-white transition-colors" href="#">Terms</Link>
              <Link className="hover:text-white transition-colors" href="#">Privacy</Link>
              <Link className="hover:text-white transition-colors" href="#">Contact</Link>
            </nav>
            <p className="text-sm">© 2026 Chiang Ride. Made with ❤️ in CNX.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
