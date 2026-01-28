'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Job } from '@jobboard/shared';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, MapPin, Building2, Timer, DollarSign } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

export default function JobDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  
  const { data: job, isLoading } = useQuery<Job>({
    queryKey: ['job', id],
    queryFn: async () => {
      const { data } = await api.get(`/jobs/${id}`);
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  if (!job) {
      return <div>Job not found</div>;
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="grid gap-6">
        <div className="flex items-start justify-between">
            <div>
                <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                <div className="flex flex-wrap gap-4 text-gray-600">
                    <div className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" /> {job.companyName}
                    </div>
                    <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" /> {job.location}
                    </div>
                     <div className="flex items-center gap-1">
                        <Timer className="h-4 w-4" /> {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                    </div>
                    {job.salaryRange && (
                        <div className="flex items-center gap-1">
                             <DollarSign className="h-4 w-4" /> {job.salaryRange}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex gap-2">
                 <Badge variant="outline" className="text-lg px-4 py-1">{job.type.replace('_', ' ')}</Badge>
            </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Description</CardTitle>
                    </CardHeader>
                    <CardContent className="whitespace-pre-wrap">
                        {job.description}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Requirements</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <ul className="list-disc list-inside space-y-2">
                            {job.requirements.map((req, i) => (
                                <li key={i}>{req}</li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <div>
                 <Card>
                    <CardHeader>
                        <CardTitle>Apply Now</CardTitle>
                        <CardDescription>Interested in this role?</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {user ? (
                             <Link href={`/jobs/${job.id}/apply`}>
                                <Button className="w-full" size="lg">Apply for this Job</Button>
                            </Link>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-sm text-gray-500">Please login to apply for this position.</p>
                                <Link href={`/login?redirect=/jobs/${job.id}`}>
                                    <Button variant="outline" className="w-full">Login to Apply</Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </div>
  );
}
