'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Job, JobType } from '@jobboard/shared';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { JobCard } from '@/components/jobs/job-card';
import { Loader2 } from 'lucide-react';

export default function JobsPage() {
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    type: '',
  });

  const { data: jobs, isLoading } = useQuery<Job[]>({
    queryKey: ['jobs', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.location) params.append('location', filters.location);
      if (filters.type) params.append('type', filters.type);
      const { data } = await api.get(`/jobs?${params.toString()}`);
      return data;
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // React Query will automatically refetch when state changes,
    // but we can prevent default form submission here.
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Find Your Dream Job</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search jobs..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <Input
            placeholder="Location"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          />
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="">All Types</option>
            {Object.values(JobType).map((type) => (
              <option key={type} value={type}>
                {type.replace('_', ' ')}
              </option>
            ))}
          </select>
           <Button type="button" onClick={() => setFilters({search: '', location: '', type: ''})} variant="outline">
            Clear
          </Button>
        </form>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs?.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
          {jobs?.length === 0 && (
             <div className="col-span-full text-center py-12 text-gray-500">
                No jobs found matching your criteria.
             </div>
          )}
        </div>
      )}
    </div>
  );
}
