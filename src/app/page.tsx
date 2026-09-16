import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header / Navbar */}
      <header className="bg-emerald-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-wide">
            ♻️ Qassim Scrap <span className="text-emerald-300">| قصيم سكراب</span>
          </h1>
          <nav className="space-x-4">
  <Link href="/listings" className="bg-emerald-700 hover:bg-emerald-600 px-4 py-2 rounded-lg font-medium transition text-sm">
    Browse Listings (تصفح السكراب)
  </Link>
  <Link href="/request-quote" className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg font-medium transition text-sm">
    Request Quote (طلب تسعيرة)
  </Link>
</nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-emerald-900 text-white py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-extrabold mb-4">
            Buy & Sell Industrial & Household Scrap in Qassim
          </h2>
          <p className="text-lg text-emerald-100 mb-8">
            Buraidah's trusted marketplace for Copper, Iron, Batteries, Cars, and Metals. Get instant quotes and best market rates.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/request-quote" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg transition">
              Sell Scrap Now
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-bold mb-6 text-slate-800">Popular Scrap Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {['Copper (نحاس)', 'Iron & Steel (حديد)', 'Batteries (بطاريات)', 'Old Cars & Machinery (سيارات وسكراب)'].map((cat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition">
              <h4 className="font-semibold text-lg text-emerald-800 mb-2">{cat}</h4>
              <p className="text-sm text-slate-600">Best rates in Buraidah, Unaizah, and surrounding areas.</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-400 text-center py-6 mt-12">
        <p>© 2026 Qassim Scrap Market. Buraidah, Saudi Arabia.</p>
      </footer>
    </div>
  );
}
