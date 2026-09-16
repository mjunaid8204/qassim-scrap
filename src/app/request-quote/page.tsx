'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function RequestQuotePage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Copper');
  const [city, setCity] = useState('Buraidah');
  const [price, setPrice] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let imageUrl = null;

      // 1. Upload image if selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('listings-images')
          .upload(filePath, imageFile);

        if (uploadError) {
          throw new Error('Image upload failed: ' + uploadError.message);
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('listings-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      // 2. Insert listing into database
      const { error: dbError } = await supabase.from('listings').insert([
        {
          title,
          category,
          city,
          price_sar: Number(price),
          description: `${description}\n\nContact Phone: ${phone}`,
          images: imageUrl ? [imageUrl] : [],
          status: 'pending',
        },
      ]);

      if (dbError) throw dbError;

      setSuccess(true);
      setTitle('');
      setPrice('');
      setPhone('');
      setDescription('');
      setImageFile(null);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

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
            <Link href="/listings" className="bg-emerald-700 hover:bg-emerald-600 px-4 py-2 rounded-lg font-medium transition text-sm">
              Browse Listings (تصفح السكراب)
            </Link>
          </nav>
        </div>
      </header>

      {/* Form Content */}
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="mb-6 border-b border-slate-100 pb-4">
            <h2 className="text-2xl font-extrabold text-slate-800">📋 Request a Quote / Sell Scrap (طلب تسعيرة)</h2>
            <p className="text-slate-600 text-sm mt-1">Fill out the details below to list your scrap material in Buraidah & Qassim.</p>
          </div>

          {success ? (
            <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-2xl text-center">
              <h3 className="text-2xl font-bold text-emerald-800 mb-2">Request Submitted Successfully!</h3>
              <p className="text-slate-600 text-sm mb-6">Your scrap request has been sent to admin for review. Once approved, it will appear on the public market.</p>
              <button
                onClick={() => setSuccess(false)}
                className="bg-emerald-800 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow hover:bg-emerald-700 transition"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">{error}</div>}

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Scrap Title / Item Name</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g., Factory Copper Wires / Used Car Batteries"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm"
                  >
                    <option value="Copper">Copper (نحاس)</option>
                    <option value="Iron & Steel">Iron & Steel (حديد)</option>
                    <option value="Batteries">Batteries (بطاريات)</option>
                    <option value="Old Cars & Machinery">Old Cars & Machinery (سيارات وسكراب)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">City / Location in Qassim</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm"
                  >
                    <option value="Buraidah">Buraidah (بريدة)</option>
                    <option value="Unaizah">Unaizah (عنيزة)</option>
                    <option value="Ar Rass">Ar Rass (الرس)</option>
                    <option value="Al Bukayriyah">Al Bukayriyah (البكيرية)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Expected Price (SAR)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    placeholder="e.g., 1500"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Phone Number (Saudi)</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="05XXXXXXXX"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Scrap Photo (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-100 file:text-emerald-800 hover:file:bg-emerald-200 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Description & Details</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                  placeholder="Describe quantity, condition, or pickup requirements..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-xl transition shadow-md text-base"
              >
                {loading ? 'Uploading & Submitting...' : 'Submit Quote Request (إرسال الطلب)'}
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-400 text-center py-6 mt-16">
        <p>© 2026 Qassim Scrap Market. Buraidah, Saudi Arabia.</p>
      </footer>
    </div>
  );
}