export declare enum UserRole {
    ADMIN = "ADMIN",
    EMPLOYER = "EMPLOYER",
    CANDIDATE = "CANDIDATE"
}
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}
export declare enum JobType {
    FULL_TIME = "FULL_TIME",
    PART_TIME = "PART_TIME",
    CONTRACT = "CONTRACT",
    INTERNSHIP = "INTERNSHIP",
    REMOTE = "REMOTE"
}
export interface Job {
    id: string;
    title: string;
    description: string;
    companyName: string;
    location: string;
    type: JobType;
    salaryRange?: string;
    requirements: string[];
    employerId: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare enum ApplicationStatus {
    PENDING = "PENDING",
    REVIEWING = "REVIEWING",
    INTERVIEWING = "INTERVIEWING",
    OFFERED = "OFFERED",
    REJECTED = "REJECTED"
}
export interface Application {
    id: string;
    jobId: string;
    candidateId: string;
    status: ApplicationStatus;
    resumeUrl: string;
    coverLetter?: string;
    appliedAt: Date;
    updatedAt: Date;
}
export interface AuthResponse {
    user: User;
    accessToken: string;
}
