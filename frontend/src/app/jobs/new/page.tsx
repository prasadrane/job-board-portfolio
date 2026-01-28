'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { JobType } from '@jobboard/shared';

export default function PostJobPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
      title: '',
      companyName: '',
      location: '',
      type: JobType.FULL_TIME,
      description: '',
      requirements: '', 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
        const payload = {
            ...formData,
            requirements: formData.requirements.split('\n').filter(r => r.trim() !== '')
        };

        await api.post('/jobs', payload);
        router.push('/dashboard');
    } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to post job');
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Post a New Job</CardTitle>
          <CardDescription>Find the best talent for your team</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
             <div className="space-y-2">
                <label className="text-sm font-medium">Job Title</label>
                <Input
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. Senior Software Engineer"
                />
            </div>
             <div className="space-y-2">
                <label className="text-sm font-medium">Company Name</label>
                 <Input
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <Input
                        required
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        placeholder="e.g. Remote, San Francisco"
                    />
                </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Job Type</label>
                    <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value as JobType})}
                    >
                        {Object.values(JobType).map((type) => (
                        <option key={type} value={type}>
                            {type.replace('_', ' ')}
                        </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea 
                    required
                    className="min-h-[150px]"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
            </div>

             <div className="space-y-2">
                <label className="text-sm font-medium">Requirements (One per line)</label>
                <Textarea 
                    required
                    className="min-h-[100px]"
                    value={formData.requirements}
                    onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                    placeholder="- 3+ years of React experience&#10;- Knowledge of Node.js"
                />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button className="w-full" type="submit" disabled={isSubmitting}>
                 {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Post Job
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
