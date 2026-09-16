'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function AdminPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function checkUserAndFetch() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
        return;
      }
      fetchListings();
    }
    checkUserAndFetch();
  }, [router, supabase]);

  const fetchListings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setListings(data || []);
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('listings')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      alert('Error updating status: ' + error.message);
    } else {
      fetchListings();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Error deleting: ' + error.message);
    } else {
      fetchListings();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-wide">
            🛠️ Qassim Scrap - <span className="text-amber-400">Admin Dashboard</span>
          </h1>
          <nav className="space-x-4 flex items-center">
            <Link href="/" className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition">
              Home
            </Link>
            <Link href="/listings" className="bg-emerald-700 hover:bg-emerald-600 px-4 py-2 rounded-lg text-sm font-medium transition">
              View Public Listings
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg text-sm font-bold transition shadow"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800">Manage Scrap Requests</h2>
            <p className="text-slate-600 text-sm mt-0.5">Review, approve, or remove incoming seller quote submissions from Buraidah & Qassim.</p>
          </div>
          <button
            onClick={fetchListings}
            className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition shadow"
          >
            🔄 Refresh Data
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm">
            Error: {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-slate-500 font-medium">Checking security & loading requests...</div>
        ) : listings.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center">
            <p className="text-slate-500 text-lg">No quote requests found in the database.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider font-semibold">
                    <th className="p-4">Item & Category</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Price (SAR)</th>
                    <th className="p-4">Details / Contact</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {listings.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{item.title}</div>
                        <span className="inline-block bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded font-medium mt-1">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-4 text-slate-700 font-medium">
                        {item.city}, Qassim
                      </td>
                      <td className="p-4 font-extrabold text-emerald-800">
                        {item.price_sar} SAR
                      </td>
                      <td className="p-4 text-slate-600 max-w-xs truncate whitespace-pre-line">
                        {item.description}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                          item.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.status || 'pending'}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {item.status !== 'approved' ? (
                          <button
                            onClick={() => handleUpdateStatus(item.id, 'approved')}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-1.5 rounded-lg font-bold transition shadow-sm"
                          >
                            Approve
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateStatus(item.id, 'pending')}
                            className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs px-3 py-1.5 rounded-lg font-bold transition shadow-sm"
                          >
                            Set Pending
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-600 hover:bg-red-500 text-white text-xs px-3 py-1.5 rounded-lg font-bold transition shadow-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}