'use client';

import { useAuth } from '@/context/auth-context';
import { CandidateDashboard } from '@/components/dashboard/candidate-dashboard';
import { EmployerDashboard } from '@/components/dashboard/employer-dashboard';
import { UserRole } from '@jobboard/shared';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
        router.push('/login');
    }
  }, [isLoading, user, router]);

  if (isLoading) {
      return (
        <div className="flex justify-center items-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">
          Welcome, {user.firstName}!
      </h1>
      
      {user.role === UserRole.CANDIDATE && <CandidateDashboard />}
      {user.role === UserRole.EMPLOYER && <EmployerDashboard />}
      {user.role === UserRole.ADMIN && <div>Admin Dashboard (Coming Soon)</div>}
    </div>
  );
}
