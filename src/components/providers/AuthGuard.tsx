'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { Role } from '@/types';
import { Spinner } from '@/components/ui';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
  redirectTo?: string;
}

export default function AuthGuard({
  children,
  allowedRoles,
  redirectTo = '/login',
}: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      // Redirect based on role
      switch (user.role) {
        case Role.ADMIN:
          router.push('/admin');
          break;
        case Role.PROVIDER:
          router.push('/provider/dashboard');
          break;
        case Role.CUSTOMER:
          router.push('/');
          break;
        default:
          router.push('/');
      }
      return;
    }

    setIsLoading(false);
  }, [isAuthenticated, user, allowedRoles, router, redirectTo]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}
