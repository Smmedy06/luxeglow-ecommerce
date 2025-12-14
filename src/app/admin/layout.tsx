'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { isAdmin } from '@/lib/admin';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isUserAdmin, setIsUserAdmin] = useState(false);

  useEffect(() => {
    const checkAdminAccess = async () => {
      // Allow access to login page
      if (pathname === '/admin/login') {
        setIsLoading(false);
        return;
      }

      // Check if user is authenticated
      if (!user) {
        router.push('/admin/login');
        return;
      }

      // Check if user is admin
      const adminStatus = await isAdmin();
      setIsUserAdmin(adminStatus);

      if (!adminStatus) {
        router.push('/admin/login');
        return;
      }

      setIsLoading(false);
    };

    checkAdminAccess();
  }, [user, router, pathname]);

  // Show login page without admin layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ba9157] mx-auto mb-4"></div>
          <p className="text-[#6b5d52]">Checking admin access...</p>
        </div>
      </div>
    );
  }

  if (!isUserAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex flex-col lg:flex-row">
        <AdminSidebar />
        <div className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}

