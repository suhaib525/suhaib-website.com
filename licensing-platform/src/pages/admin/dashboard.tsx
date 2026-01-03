import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated' && session.user.role !== 'ADMIN') {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchLicenses();
    }
  }, [session]);

  const fetchLicenses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/licenses');
      const data = await response.json();
      
      if (response.ok) {
        setLicenses(data.data);
      } else {
        setError(data.error || 'Failed to fetch licenses');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLicense = async () => {
    try {
      const response = await fetch('/api/admin/licenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId: 'default-product-id', // This should come from product selection
          type: 'PERMANENT',
          maxActivations: 1
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        fetchLicenses(); // Refresh the list
      } else {
        setError(data.error || 'Failed to create license');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  if (status === 'loading') {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null; // Will be redirected
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Admin Dashboard - Licensing Platform</title>
      </Head>

      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Licensing Platform</h1>
            </div>
            <div className="flex items-center">
              <span className="mr-4 text-sm text-gray-600">Welcome, {session.user.email}</span>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Licenses</h2>
            <button
              onClick={handleCreateLicense}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create License
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">Loading licenses...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License Key</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activations</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {licenses.length > 0 ? (
                    licenses.map((license) => (
                      <tr key={license.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{license.key}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{license.product?.name || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{license.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{license.status}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{license.activations?.length || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{license.expiresAt || 'Never'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">No licenses found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}