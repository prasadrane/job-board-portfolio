import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApplicationStatus } from '@jobboard/shared';

@Injectable()
export class ApplicationsService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, createApplicationDto: any, file: Express.Multer.File) {
        const { jobId, coverLetter } = createApplicationDto;

        // Check if already applied
        const existing = await this.prisma.application.findFirst({
            where: {
                jobId,
                candidateId: userId
            }
        });

        if (existing) {
            throw new ConflictException('You have already applied for this job');
        }

        // Mock file upload - in real app, upload to S3/Cloudinary and get URL
        const resumeUrl = file ? `uploads/${file.filename}` : 'mock-resume.pdf';

        return this.prisma.application.create({
            data: {
                jobId,
                candidateId: userId,
                coverLetter,
                resumeUrl,
                status: ApplicationStatus.PENDING,
            },
        });
    }

    async findAll(userId: string, role: string) {
        if (role === 'CANDIDATE') {
            return this.prisma.application.findMany({
                where: { candidateId: userId },
                include: { job: true },
                orderBy: { appliedAt: 'desc' }
            });
        } else if (role === 'EMPLOYER') {
            // Find applications for jobs posted by this employer
            return this.prisma.application.findMany({
                where: {
                    job: {
                        employerId: userId
                    }
                },
                include: {
                    job: true,
                    candidate: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    }
                },
                orderBy: { appliedAt: 'desc' }
            });
        } else {
            // Admin sees all
            return this.prisma.application.findMany({
                include: {
                    job: true,
                    candidate: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    }
                },
                orderBy: { appliedAt: 'desc' }
            });
        }
    }

    async findOne(id: string) {
        const application = await this.prisma.application.findUnique({
            where: { id },
            include: {
                job: true,
                candidate: true
            }
        });
        if (!application) {
            throw new NotFoundException('Application not found');
        }
        return application;
    }

    async updateStatus(id: string, status: ApplicationStatus) {
        return this.prisma.application.update({
            where: { id },
            data: { status },
        });
    }
}
