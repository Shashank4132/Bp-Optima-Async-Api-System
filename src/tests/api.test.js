const request = require('supertest');
const app = require('../app');

jest.mock('bullmq', () => {
    return {
        Queue: jest.fn().mockImplementation(() => ({
            add: jest.fn().mockResolvedValue({ id: 'mock-job-123' }),
            getJob: jest.fn().mockImplementation((id) => {
                if (id === 'mock-job-123') {
                    return {
                        id: 'mock-job-123',
                        getState: jest.fn().mockResolvedValue('completed'),
                        data: { created_at: '2023-10-27T10:00:00.000Z', document_url: 'http://test.com' },
                        returnvalue: { word_count: 1500 },
                        failedReason: null
                    };
                }
                return null;
            })
        }))
    };
});

jest.mock('ioredis', () => {
    return jest.fn().mockImplementation(() => ({
        on: jest.fn(),
        quit: jest.fn() 
    }));
});


describe('Asynchronous Document Processing API', () => {
    
    describe('POST /api/v1/jobs', () => {
        it('Should successfully queue a job and return 202', async () => {
            const res = await request(app)
                .post('/api/v1/jobs')
                .send({ document_url: 'https://example.com/document.pdf' });

            expect(res.statusCode).toBe(202);
            expect(res.body).toHaveProperty('job_id', 'mock-job-123');
            expect(res.body.message).toBe('Job queued successfully');
        });

        it('Should fail validation and return 400 if URL is missing', async () => {
            const res = await request(app)
                .post('/api/v1/jobs')
                .send({});

            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe('Validation Error');
        });

        it('Should fail validation and return 400 if URL is invalid', async () => {
            const res = await request(app)
                .post('/api/v1/jobs')
                .send({ document_url: 'not-a-real-url' });

            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe('Validation Error');
        });
    });

    describe('GET /api/v1/jobs/:id', () => {
        it('Should return job status for a valid ID', async () => {
            const res = await request(app).get('/api/v1/jobs/mock-job-123');

            expect(res.statusCode).toBe(200);
            expect(res.body.job_id).toBe('mock-job-123');
            expect(res.body.status).toBe('completed');
            expect(res.body.result).toHaveProperty('word_count', 1500);
        });

        it('Should return 404 for an invalid job ID', async () => {
            const res = await request(app).get('/api/v1/jobs/invalid-999');
            
            expect(res.statusCode).toBe(404);
            expect(res.body.error).toBe('Job not found');
        });
    });
});