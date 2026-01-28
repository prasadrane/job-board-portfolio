import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Application } from '@jobboard/shared';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export function CandidateDashboard() {
    const { data: applications, isLoading } = useQuery<Application[]>({
        queryKey: ['applications'],
        queryFn: async () => {
            const { data } = await api.get('/applications');
            return data;
        }
    });

    if (isLoading) return <Loader2 className="animate-spin" />;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">My Applications</h2>
            <div className="grid gap-4">
                {applications?.map((app: any) => (
                    <Card key={app.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                             <div className="space-y-1">
                                <CardTitle className="text-base font-semibold">
                                    {app.job.title}
                                </CardTitle>
                                <CardDescription>
                                    {app.job.companyName}
                                </CardDescription>
                             </div>
                             <Badge variant={
                                 app.status === 'PENDING' ? 'secondary' :
                                 app.status === 'REJECTED' ? 'destructive' : 'default'
                             }>
                                 {app.status}
                             </Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Applied on {format(new Date(app.appliedAt), 'MMM d, yyyy')}
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {applications?.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        You haven't applied to any jobs yet.
                    </div>
                )}
            </div>
        </div>
    );
}
