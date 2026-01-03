import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '@/components/Layout';

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [licenses, setLicenses] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
      router.push('/admin/dashboard');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user) {
      fetchUserData();
    }
  }, [session]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch user's licenses
      const licensesResponse = await fetch('/api/user/licenses');
      const licensesData = await licensesResponse.json();
      
      // Fetch user's products
      const productsResponse = await fetch('/api/user/products');
      const productsData = await productsResponse.json();

      if (licensesResponse.ok && productsResponse.ok) {
        setLicenses(licensesData.data || []);
        setProducts(productsData.data || []);
      } else {
        setError(licensesData.error || productsData.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          Loading...
        </div>
      </Layout>
    );
  }

  if (!session) {
    return null; // Will be redirected
  }

  return (
    <Layout>
      <Head>
        <title>User Dashboard - Licensing Platform</title>
      </Head>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Welcome, {session.user.email}</h2>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Sign Out
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* My Licenses Section */}
            <div className="bg-white shadow sm:rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">My Licenses</h3>

              {licenses.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License Key</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {licenses.map((license) => (
                        <tr key={license.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{license.key}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{license.product?.name || 'N/A'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{license.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">You don't have any licenses yet.</p>
              )}
            </div>

            {/* My Products Section */}
            <div className="bg-white shadow sm:rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">My Products</h3>
                <button
                  onClick={() => router.push('/user/products/create')}
                  className="px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create Product
                </button>
              </div>

              {products.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Licenses</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product._count?.licenses || 0}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button
                              onClick={() => router.push(`/user/products/${product.id}`)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">You don't have any products yet.</p>
              )}
            </div>
          </div>

          {/* API Keys Section */}
          <div className="mt-6 bg-white shadow sm:rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">API Keys</h3>
              <button
                onClick={() => router.push('/user/api-keys/create')}
                className="px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Create API Key
              </button>
            </div>

            <p className="text-gray-500">API keys allow your applications to communicate with the licensing platform.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}