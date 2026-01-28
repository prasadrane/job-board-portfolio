export const API_ROUTES = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        PROFILE: '/auth/profile',
    },
    JOBS: {
        LIST: '/jobs',
        DETAIL: (id: string) => `/jobs/${id}`,
        CREATE: '/jobs',
        APPLY: (id: string) => `/jobs/${id}/apply`,
    },
    CANDIDATE: {
        DASHBOARD: '/candidate/dashboard',
    },
    EMPLOYER: {
        DASHBOARD: '/employer/dashboard',
    },
    RESUME: {
        PARSE: '/resume/parse',
        UPLOAD: '/resume/upload',
    },
} as const;
