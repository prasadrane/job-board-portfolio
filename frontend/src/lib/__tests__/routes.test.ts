import { API_ROUTES } from '@/lib/routes';
import { describe, it, expect } from 'vitest';

describe('API Routes', () => {
    it('generates correct job detail route', () => {
        expect(API_ROUTES.JOBS.DETAIL('123')).toBe('/jobs/123');
    });

    it('generates correct job apply route', () => {
        expect(API_ROUTES.JOBS.APPLY('abc-789')).toBe('/jobs/abc-789/apply');
    });
});
