import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function AuthError() {
  const router = useRouter();
  const { error } = router.query;

  useEffect(() => {
    // Auto-redirect to sign-in after 5 seconds
    const timer = setTimeout(() => {
      router.push('/auth/signin');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Head>
        <title>Authentication Error - Licensing Platform</title>
      </Head>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-red-600 mb-4">Authentication Error</h2>
            <p className="text-gray-600 mb-4">
              {error || 'An error occurred during authentication'}
            </p>
            <p className="text-sm text-gray-500">
              You will be redirected to the sign-in page in 5 seconds...
            </p>
            <button
              onClick={() => router.push('/auth/signin')}
              className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go to Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}