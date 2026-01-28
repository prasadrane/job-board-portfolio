import { Injectable } from '@nestjs/common';

@Injectable()
export class ResumeService {
    async parseResume(file: Express.Multer.File) {
        // Mock implementation - replace with OpenAI/Textract later
        return {
            name: 'John Doe',
            skills: ['TypeScript', 'NestJS', 'React', 'Node.js'],
            education: [
                {
                    degree: 'Bachelor of Science in Computer Science',
                    school: 'University of Tech',
                    year: 2023
                }
            ],
            experience: [
                {
                    role: 'Software Engineer',
                    company: 'Tech Corp',
                    duration: '2 years'
                }
            ],
            summary: 'Experienced full stack developer...'
        };
    }
}
