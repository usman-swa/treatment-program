import { PrismaClient } from '@prisma/client';
import { createMocks } from 'node-mocks-http';
import handler from './create-activity';

jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        treatmentProgram: {
            create: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const prisma = new PrismaClient();

describe('/api/create-activity API Endpoint', () => {
    xit('should return 200 for OPTIONS request', async () => {
        const { req, res } = createMocks({
            method: 'OPTIONS',
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(200);
    }, 20000); // Increase timeout to 20 seconds

    it('should return 400 if required fields are missing', async () => {
        const { req, res } = createMocks({
            method: 'POST',
            body: {},
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(400);
    });

    it('should create a new activity and return 201', async () => {
        const { req, res } = createMocks({
            method: 'POST',
            body: {
                week: 'week39',
                weekday: 'MONDAY',
                title: 'New Activity',
                completed: false,
            },
        });

        prisma.treatmentProgram.create.mockResolvedValue({
            id: 1,
            week: 'week39',
            weekday: 'MONDAY',
            title: 'New Activity',
            completed: false,
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(201);
    });

    it('should return 500 if there is an error creating the activity', async () => {
        const { req, res } = createMocks({
            method: 'POST',
            body: {
                week: 'week39',
                weekday: 'MONDAY',
                title: 'New Activity',
                completed: false,
            },
        });

        // Simulate an error by mocking the Prisma client
        prisma.treatmentProgram.create.mockImplementation(() => {
            throw new Error('Failed to create activity');
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(500);
    });

    it('should return 405 for methods other than POST', async () => {
        const { req, res } = createMocks({
            method: 'GET',
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(405);
    });
});