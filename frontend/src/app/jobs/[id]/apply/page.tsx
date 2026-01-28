'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Job } from '@jobboard/shared';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Loader2, UploadCloud } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export default function ApplyPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { data: job, isLoading } = useQuery<Job>({
    queryKey: ['job', id],
    queryFn: async () => {
      const { data } = await api.get(`/jobs/${id}`);
      return data;
    },
    enabled: !!id,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resume) {
        setError('Please upload your resume');
        return;
    }

    setIsSubmitting(true);
    setError('');

    try {
        const formData = new FormData();
        formData.append('jobId', id as string);
        formData.append('coverLetter', coverLetter);
        formData.append('resume', resume);

        await api.post('/applications', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        router.push('/dashboard?success=true');
    } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
        setIsSubmitting(false);
    }
  };

  if (isLoading) {
       return (
        <div className="flex justify-center items-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  if (!job) return <div>Job not found</div>;

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Apply for {job.title}</CardTitle>
          <CardDescription>at {job.companyName}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium">Resume / CV</label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                     onClick={() => document.getElementById('resume-upload')?.click()}>
                    <UploadCloud className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                        {resume ? resume.name : "Click to upload your resume (PDF, DOCX)"}
                    </p>
                    <input 
                        id="resume-upload" 
                        type="file" 
                        accept=".pdf,.doc,.docx" 
                        className="hidden" 
                        onChange={(e) => {
                            if (e.target.files?.[0]) {
                                setResume(e.target.files[0]);
                                setError('');
                            }
                        }}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Cover Letter (Optional)</label>
                <Textarea 
                    placeholder="Why are you a good fit for this role?"
                    className="min-h-[150px]"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button className="w-full" type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Application
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
