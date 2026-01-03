import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Navigation() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Docs', href: '/docs' },
    { name: 'Test', href: '/test/licensing' },
  ];

  if (session?.user?.role === 'ADMIN') {
    navLinks.push({ name: 'Admin', href: '/admin/dashboard' });
  } else if (session?.user?.role === 'USER') {
    navLinks.push({ name: 'Dashboard', href: '/user/dashboard' });
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-semibold text-gray-900">
              Licensing Platform
            </Link>
          </div>

          <div className="flex items-center space-x-8">
            <div className="hidden md:flex space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium ${router.pathname === link.href 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-900'}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center">
              {status === 'loading' ? (
                <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
              ) : session ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">{session.user.email}</span>
                  <button
                    onClick={() => signOut()}
                    className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Link
                    href="/auth/signin"
                    className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="px-3 py-1 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}