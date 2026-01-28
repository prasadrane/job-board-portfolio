import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Job } from '@jobboard/shared';
import Link from 'next/link';
import { MapPin, Building2, Timer } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                 <CardTitle className="text-xl mb-1">{job.title}</CardTitle>
                 <CardDescription className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" /> {job.companyName}
                 </CardDescription>
            </div>
            <Badge variant="secondary">{job.type.replace('_', ' ')}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {job.location}
            </div>
             <div className="flex items-center gap-1">
                <Timer className="h-4 w-4" /> {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
            </div>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
      </CardContent>
      <CardFooter>
        <Link href={`/jobs/${job.id}`} className="w-full">
            <Button className="w-full">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
