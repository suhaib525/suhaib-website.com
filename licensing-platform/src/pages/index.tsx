import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <Layout showNavigation={false}>
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          Loading...
        </div>
      </Layout>
    );
  }

  if (session) {
    if (session.user.role === 'ADMIN') {
      router.push('/admin/dashboard');
      return null;
    }
    // For regular users, we could show a different dashboard
    return (
      <Layout>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Welcome to the Licensing Platform</h1>
          <p className="mt-4 text-gray-600">User dashboard coming soon...</p>
        </div>
      </Layout>
    );
  }

  return (
  <Layout showNavigation={false}>
  <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
  <div className="text-center py-12">
  <h1 className="text-4xl font-bold text-gray-900 mb-4">Licensing Platform</h1>
  <p className="text-xl text-gray-600 mb-8">A secure licensing solution for your software</p>
  <div className="flex justify-center space-x-4">
    <button
      onClick={() => router.push('/auth/signin')}
      className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      Sign In
    </button>
    <button
      onClick={() => router.push('/auth/signup')}
      className="px-6 py-3 border border-blue-600 text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      Sign Up
    </button>
  </div>
  </div>
  </div>
  </Layout>
  );
}