'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function ListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [filteredListings, setFilteredListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');

  const supabase = createClient();

  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setListings(data);
        setFilteredListings(data);
      }
      setLoading(false);
    }
    fetchListings();
  }, [supabase]);

  useEffect(() => {
    let result = listings;
    if (selectedCategory !== 'All') {
      result = result.filter((item) => item.category === selectedCategory);
    }
    if (selectedCity !== 'All') {
      result = result.filter((item) => item.city === selectedCity);
    }
    setFilteredListings(result);
  }, [selectedCategory, selectedCity, listings]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-emerald-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-wide">
            ♻️ Qassim Scrap <span className="text-emerald-300">| سوق السكراب</span>
          </h1>
          <nav className="space-x-4">
            <Link href="/" className="bg-emerald-700 hover:bg-emerald-600 px-4 py-2 rounded-lg font-medium transition text-sm">
              Home (الرئيسية)
            </Link>
            <Link href="/request-quote" className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-lg font-bold transition text-sm">
              Sell Scrap (بيع سكراب)
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-800">Available Scrap Listings</h2>
            <p className="text-slate-600 mt-1">Browse verified industrial and household scrap materials across Buraidah & Qassim region.</p>
          </div>
          <Link href="/request-quote" className="bg-emerald-800 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow transition">
            + Request New Quote
          </Link>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-bold text-slate-500 uppercase mr-2">Category:</span>
            {['All', 'Copper', 'Iron & Steel', 'Batteries', 'Old Cars & Machinery'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-emerald-800 text-white shadow'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
            <span className="text-xs font-bold text-slate-500 uppercase mr-2">City:</span>
            {['All', 'Buraidah', 'Unaizah', 'Ar Rass', 'Al Bukayriyah'].map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedCity === city
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500 font-medium">Loading verified scrap listings...</div>
        ) : filteredListings.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center">
            <p className="text-slate-500 text-lg mb-4">No approved scrap listings found matching your filter in Qassim region.</p>
            <button
              onClick={() => { setSelectedCategory('All'); setSelectedCity('All'); }}
              className="text-emerald-800 font-bold underline text-sm"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredListings.map((item: any) => {
              const imageUrl = item.images && item.images.length > 0 ? item.images[0] : null;
              
              // Professional bilingual pre-filled WhatsApp message
              const waMessage = `السلام عليكم، أنا مهتم بإعلان السكراب الخاص بك:\n📌 *${item.title}*\n🏷️ Category: ${item.category}\n💰 Price: ${item.price_sar} SAR\n📍 Location: ${item.city}, Qassim\n\nهل السلعة متوفرة؟ (Is this available?)`;

              return (
                <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition flex flex-col justify-between">
                  <div>
                    {imageUrl ? (
                      <div className="h-48 w-full bg-slate-100 relative overflow-hidden">
                        <img src={imageUrl} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="bg-emerald-900 text-emerald-100 px-4 py-2.5 flex justify-between items-center text-xs font-semibold">
                        <span>🏷️ {item.category}</span>
                        <span className="bg-emerald-700 px-2 py-0.5 rounded text-white uppercase text-[10px]">Verified</span>
                      </div>
                    )}
                    {imageUrl && (
                      <div className="bg-emerald-900 text-emerald-100 px-4 py-2 flex justify-between items-center text-xs font-semibold">
                        <span>🏷️ {item.category}</span>
                        <span className="bg-emerald-700 px-2 py-0.5 rounded text-white uppercase text-[10px]">Verified</span>
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-800 mb-2">{item.title}</h3>
                      <p className="text-slate-600 text-sm whitespace-pre-line mb-4 line-clamp-3">{item.description}</p>
                      <div className="flex items-center text-sm text-slate-500 mb-2">
                        <span>📍 Location: <strong className="text-slate-700">{item.city}, Qassim</strong></span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex justify-between items-center bg-slate-50 py-4">
                    <div>
                      <span className="text-xs text-slate-500 block">Expected Price</span>
                      <span className="text-xl font-extrabold text-emerald-800">{item.price_sar} SAR</span>
                    </div>
                    <a
                      href={`https://wa.me/966?text=${encodeURIComponent(waMessage)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold px-4 py-2 rounded-xl transition shadow"
                    >
                      WhatsApp Inquire
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-400 text-center py-6 mt-16">
        <p>© 2026 Qassim Scrap Market. Buraidah, Saudi Arabia.</p>
      </footer>
    </div>
  );
}