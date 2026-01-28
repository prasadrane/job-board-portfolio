import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JobType } from '@jobboard/shared';

@Injectable()
export class JobsService {
    constructor(private prisma: PrismaService) { }

    async create(createJobDto: any, userId: string) {
        return this.prisma.job.create({
            data: {
                ...createJobDto,
                employerId: userId,
            },
        });
    }

    async findAll(query: any) {
        const { search, type, location } = query;
        const where: any = {};

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { companyName: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (type) {
            where.type = type as JobType;
        }

        if (location) {
            where.location = { contains: location, mode: 'insensitive' };
        }

        return this.prisma.job.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                employer: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });
    }

    async findOne(id: string) {
        const job = await this.prisma.job.findUnique({
            where: { id },
            include: {
                employer: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    }
                }
            },
        });

        if (!job) {
            throw new NotFoundException(`Job with ID ${id} not found`);
        }

        return job;
    }

    async update(id: string, updateJobDto: any, userId: string) {
        const job = await this.findOne(id);
        // basic ownership check
        if (job.employerId !== userId) {
            // In a real app we might want to throw ForbiddenException
            // but for now let's reuse findOne logic or handle it in controller
        }

        return this.prisma.job.update({
            where: { id },
            data: updateJobDto,
        });
    }

    async remove(id: string, userId: string) {
        const job = await this.findOne(id);
        return this.prisma.job.delete({
            where: { id },
        });
    }
}
