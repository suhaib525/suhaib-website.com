import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '@/components/Layout';

export default function CreateAPIKey() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [name, setName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (status === 'loading') {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          Loading...
        </div>
      </Layout>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name) {
      setError('API key name is required');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/user/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name
        })
      });

      const data = await response.json();

      if (response.ok) {
        setApiKey(data.apiKey);
        setSuccess(true);
      } else {
        setError(data.error || 'Failed to create API key');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Create API Key - Licensing Platform</title>
      </Head>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Create API Key</h2>
            <button
              onClick={() => router.push('/user/dashboard')}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Back to Dashboard
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              <h3 className="font-medium mb-2">API Key Created Successfully!</h3>
              <p className="mb-2">Your new API key:</p>
              <div className="bg-gray-100 p-3 rounded font-mono text-sm break-all mb-3">
                {apiKey}
              </div>
              <p className="text-sm text-green-800">
                <strong>Important:</strong> This is the only time you'll see this key. Make sure to copy it now!
              </p>
            </div>
          )}

          <div className="bg-white shadow sm:rounded-lg p-6">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  API Key Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., My Application API Key"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Give your API key a descriptive name to help you remember what it's used for.
                </p>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading || success}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${(loading || success) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Creating API key...' : 'Generate API Key'}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-3">API Key Usage</h3>
              <p className="text-gray-600 mb-4">
                Use this API key to authenticate your applications with the Licensing Platform API.
              </p>
              <div className="bg-gray-50 p-4 rounded">
                <pre className="text-sm overflow-x-auto">
{`// Example usage with fetch
fetch('https://your-platform.com/api/validate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    licenseKey: 'ABCD-EFGH-IJKL-MNOP',
    hwid: 'hardware-id-hash'
  })
})`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}