'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Image
            src="/images/logo.jpg"
            alt="LuxeGlow Logo"
            width={100}
            height={35}
            className="h-9 w-auto object-contain"
            priority
          />
          <h1 className="text-2xl font-bold text-[#2c2520]">LuxeGlow Admin</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="text-[#6b5d52] hover:text-[#ba9157] transition-colors"
          >
            View Site
          </Link>
          {user && (
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-[#2c2520]">{user.name}</p>
                <p className="text-xs text-[#6b5d52]">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

