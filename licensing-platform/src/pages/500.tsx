import Layout from '@/components/Layout';
import Link from 'next/link';

export default function Custom500() {
  return (
    <Layout title="Server Error">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">500 - Server Error</h1>
          <p className="text-xl text-gray-600 mb-8">Something went wrong on our end.</p>
          <Link
            href="/"
            className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go Home
          </Link>
        </div>
      </div>
    </Layout>
  );
}