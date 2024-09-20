import { PrismaClient } from '@prisma/client';
import { createMocks } from 'node-mocks-http';
import handler from './treatment-program';

jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        treatmentProgram: {
            findMany: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const prisma = new PrismaClient();

describe('/api/treatment-program', () => {
    xit('should handle OPTIONS method', async () => {
        const { req, res } = createMocks({
            method: 'OPTIONS',
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(200);
    }, 20000); // Increase timeout to 20 seconds

    it('should return 200 and organized data for GET method', async () => {
        const mockPrograms = [
            { id: 1, week: '1', weekday: 'Monday', title: 'Program Title 1', completed: false },
            { id: 2, week: '1', weekday: 'Tuesday', title: 'Program Title 2', completed: true },
            { id: 3, week: '2', weekday: 'Monday', title: 'Program Title 3', completed: false },
        ];

        prisma.treatmentProgram.findMany.mockResolvedValue(mockPrograms);

        const { req, res } = createMocks({
            method: 'GET',
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(200);
        expect(res._getJSONData()).toEqual({
            "1": [
                { weekday: 'Monday', title: 'Program Title 1', completed: false },
                { weekday: 'Tuesday', title: 'Program Title 2', completed: true },
            ],
            "2": [
                { weekday: 'Monday', title: 'Program Title 3', completed: false },
            ],
        });
    });

    it('should return 500 if there is an error fetching data', async () => {
        prisma.treatmentProgram.findMany.mockRejectedValue(new Error('Database error'));

        const { req, res } = createMocks({
            method: 'GET',
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(500);
        expect(res._getJSONData()).toEqual({ error: 'Failed to fetch data' });
    });
});