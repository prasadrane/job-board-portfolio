import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request, UploadedFile, UseInterceptors, ForbiddenException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApplicationsService } from './applications.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, ApplicationStatus } from '@jobboard/shared';

@Controller('applications')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ApplicationsController {
    constructor(private readonly applicationsService: ApplicationsService) { }

    @Post()
    @Roles(UserRole.CANDIDATE)
    @UseInterceptors(FileInterceptor('resume'))
    create(@Body() createApplicationDto: any, @Request() req, @UploadedFile() file: Express.Multer.File) {
        return this.applicationsService.create(req.user.userId, createApplicationDto, file);
    }

    @Get()
    findAll(@Request() req) {
        return this.applicationsService.findAll(req.user.userId, req.user.role);
    }

    @Patch(':id/status')
    @Roles(UserRole.EMPLOYER, UserRole.ADMIN)
    async updateStatus(@Param('id') id: string, @Body('status') status: ApplicationStatus, @Request() req) {
        const application = await this.applicationsService.findOne(id);

        // Authorization check for Employer
        if (req.user.role === UserRole.EMPLOYER) {
            if (application.job.employerId !== req.user.userId) {
                throw new ForbiddenException('You can only update applications for your jobs');
            }
        }

        return this.applicationsService.updateStatus(id, status);
    }
}
