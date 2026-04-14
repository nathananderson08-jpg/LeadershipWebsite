'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/portal/useAuth';

export default function DashboardIndexPage() {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (isAdmin) {
      router.replace('/portal/dashboard/programs');
    } else {
      router.replace('/portal/dashboard/practitioners/dashboard');
    }
  }, [isAdmin, loading, router]);

  return null;
}
