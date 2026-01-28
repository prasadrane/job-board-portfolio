import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@jobboard/shared';

@Controller('jobs')
export class JobsController {
    constructor(private readonly jobsService: JobsService) { }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.EMPLOYER, UserRole.ADMIN)
    @Post()
    create(@Body() createJobDto: any, @Request() req) {
        return this.jobsService.create(createJobDto, req.user.userId);
    }

    @Get()
    findAll(@Query() query: any) {
        return this.jobsService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.jobsService.findOne(id);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.EMPLOYER, UserRole.ADMIN)
    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateJobDto: any, @Request() req) {
        const job = await this.jobsService.findOne(id);
        if (req.user.role !== UserRole.ADMIN && job.employerId !== req.user.userId) {
            throw new ForbiddenException('You can only update your own jobs');
        }
        return this.jobsService.update(id, updateJobDto, req.user.userId);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.EMPLOYER, UserRole.ADMIN)
    @Delete(':id')
    async remove(@Param('id') id: string, @Request() req) {
        const job = await this.jobsService.findOne(id);
        if (req.user.role !== UserRole.ADMIN && job.employerId !== req.user.userId) {
            throw new ForbiddenException('You can only delete your own jobs');
        }
        return this.jobsService.remove(id, req.user.userId);
    }
}
