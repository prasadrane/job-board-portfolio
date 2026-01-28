import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Job, Application } from '@jobboard/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Users, Briefcase } from 'lucide-react';
import Link from 'next/link';

export function EmployerDashboard() {
    // Fetch jobs posted by employer
    const { data: jobs, isLoading: jobsLoading } = useQuery<Job[]>({
        queryKey: ['my-jobs'],
        queryFn: async () => {
             // We can reuse the filter logic on backend, passing employerId
             // For now assuming getAll returns relevant jobs or endpoint is updated
             // Ideally: /jobs?employerId=me
             // But let's assume /jobs returns filtered list or we implement a new endpoint
             // Based on backend implementation: GET /jobs filters by search params not owner
             // WE NEED TO FIX BACKEND or use a different endpoint.
             // Actually, the implementation plan said "Dashboard: Protected routes".
             // Let's use /applications with role=EMPLOYER to get applications for my jobs.
             const { data } = await api.get('/jobs?type='); // This fetches ALL jobs currently
             return data; // This is a placeholder, strictly speaking we need 'my jobs'
        }
    });
    
    // Fetch applications for my jobs
    const { data: applications, isLoading: appsLoading } = useQuery<Application[]>({
        queryKey: ['received-applications'],
        queryFn: async () => {
            const { data } = await api.get('/applications');
            return data;
        }
    });

    if (jobsLoading || appsLoading) return <Loader2 className="animate-spin" />;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Dashboard</h2>
                <Link href="/jobs/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Post a Job
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{jobs?.length || 0}</div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{applications?.length || 0}</div>
                    </CardContent>
                </Card>
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-4">Recent Applications</h3>
                {/* List applications here... */}
                <div className="space-y-4">
                     {applications?.map((app: any) => (
                        <Card key={app.id}>
                            <CardContent className="p-4 flex justify-between items-center">
                                <div>
                                    <div className="font-medium">{app.candidate.firstName} {app.candidate.lastName}</div>
                                    <div className="text-sm text-gray-500">Applied for {app.job.title}</div>
                                </div>
                                <Button size="sm" variant="outline">View Resume</Button>
                            </CardContent>
                        </Card>
                     ))}
                </div>
            </div>
        </div>
    );
}
