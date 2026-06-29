import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), 'apps/backend-nestjs/.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('MSM Portfolio Backend - E2E Integration Suite', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');

    // Replicate exactly the CORS rules inside main.ts to test policies
    app.enableCors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const isLocal = origin.startsWith('http://localhost:') || origin === 'http://localhost';
        const isVercel = origin.endsWith('.vercel.app');
        if (isLocal || isVercel) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
    });

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // ── 1. CORS Security Verification ──────────────────────────────────────────
  describe('CORS Security Policy', () => {
    it('should allow requests coming from authorized Localhost domains', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/portfolio/skills?match=react')
        .set('Origin', 'http://localhost:5173');
      
      expect(response.status).toBe(200);
      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    });

    it('should allow requests coming from authorized Vercel Edge domains', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/portfolio/skills?match=react')
        .set('Origin', 'https://techno-moidin.vercel.app');
      
      expect(response.status).toBe(200);
      expect(response.headers['access-control-allow-origin']).toBe('https://techno-moidin.vercel.app');
    });

    it('should reject requests originating from untrusted/unauthorized external domains', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/portfolio/skills?match=react')
        .set('Origin', 'https://malicious-hacker.com');
      
      // Node.js CORS middleware returns a 500/Internal Server error when callback(new Error) is executed
      expect(response.status).toBe(500);
      expect(response.headers['access-control-allow-origin']).toBeUndefined();
    });
  });

  // ── 2. Dynamic CV PDF Stream ───────────────────────────────────────────────
  describe('GET /api/portfolio/resume', () => {
    it('should return a sleek dynamic PDF CV with correct content-disposition and attachment details', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/portfolio/resume');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toBe('application/pdf');
      expect(response.headers['content-disposition']).toContain('attachment; filename=Mohammed_Shaheer_Moidin_Resume.pdf');
      expect(response.body).toBeDefined();
    });
  });

  // ── 3. Skills Matcher Core Engine ──────────────────────────────────────────
  describe('GET /api/portfolio/skills', () => {
    it('should calculate proper compatibility metrics (96%) for React chip tags', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/portfolio/skills?match=react');

      expect(response.status).toBe(200);
      expect(response.body.score).toBe(96);
      expect(response.body.comment).toContain('Excellent match!');
      expect(response.body.highlightedProjects).toEqual(['4', '6', '7']);
      expect(response.body.highlights).toContain('Coordinated unit testing pipelines with React Jest.');
    });

    it('should resolve elite metrics (98%) for NestJS backend search architectures', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/portfolio/skills?match=nestjs');

      expect(response.status).toBe(200);
      expect(response.body.score).toBe(98);
      expect(response.body.comment).toContain('Expert match!');
      expect(response.body.highlightedProjects).toEqual(['1', '3']);
    });

    it('should gracefully degrade compatibility matrices if no skill tag is specified', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/portfolio/skills');

      expect(response.status).toBe(200);
      expect(response.body.score).toBe(0);
      expect(response.body.comment).toBe('No skill specified.');
      expect(response.body.highlightedProjects).toEqual([]);
    });
  });

  // ── 4. CEO Cost & Timelines Estimator ──────────────────────────────────────
  describe('POST /api/portfolio/calculate-scope', () => {
    it('should correctly calculate roadmap timelines and budget projections for medium scale profiles', async () => {
      const payload = {
        complexity: 'Medium',
        timelineMonths: 6,
        requiredScale: 'Medium'
      };

      const response = await request(app.getHttpServer())
        .post('/api/portfolio/calculate-scope')
        .send(payload);

      expect(response.status).toBe(201); // NestJS POST returns 201 Created by default
      expect(response.body.totalCostEstimate).toBe('$14,000'); // Base 8000 + 4000 (Medium) + 2000 (Medium Scale)
      expect(response.body.speedToMarketScore).toBe(82); // 90 - 5 (Medium Comp) - 3 (Medium Scale)
      expect(response.body.roadmap.length).toBe(4);
      expect(response.body.roadmap[0].status).toBe('completed');
    });

    it('should correctly calculate high scale budgets and roadmaps under timeline crunch charges', async () => {
      const payload = {
        complexity: 'High',
        timelineMonths: 2, // Timeline crunch charge
        requiredScale: 'High'
      };

      const response = await request(app.getHttpServer())
        .post('/api/portfolio/calculate-scope')
        .send(payload);

      expect(response.status).toBe(201);
      expect(response.body.totalCostEstimate).toBe('$24,000'); // Base 8000 + 8000 (High) + 5000 (High Scale) + 3000 (Crunch)
      expect(response.body.speedToMarketScore).toBe(70); // 90 - 15 (High Comp) - 10 (High Scale) + 5 (Fast Launch)
    });
  });

  // ── 5. CTO Sandbox Code Puzzles Debugger ──────────────────────────────────
  describe('POST /api/sandbox/verify-bug', () => {
    it('should resolve positive SQL resolution git diffs when correct lines are flagged for N+1 loops', async () => {
      const payload = {
        bugId: 'n1_loop',
        selectedLineNumbers: [8, 9] // correct lines inside unoptimized properties query loop
      };

      const response = await request(app.getHttpServer())
        .post('/api/sandbox/verify-bug')
        .send(payload);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Excellent debugging! You successfully spotted the N+1 database querying leak');
      expect(response.body.optimizedCode).toBeDefined();
      expect(response.body.diffText).toBeDefined();
    });

    it('should return failure feedback if incorrect lines are flagged inside database loops', async () => {
      const payload = {
        bugId: 'n1_loop',
        selectedLineNumbers: [1, 2] // incorrect lines (introductory comments)
      };

      const response = await request(app.getHttpServer())
        .post('/api/sandbox/verify-bug')
        .send(payload);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Incorrect line selection.');
    });

    it('should resolve positive Redis transaction locks when correct lines are flagged for race conditions', async () => {
      const payload = {
        bugId: 'race_condition',
        selectedLineNumbers: [4, 5] // correct lines where balance is selected before locking
      };

      const response = await request(app.getHttpServer())
        .post('/api/sandbox/verify-bug')
        .send(payload);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Superb spot! You identified the race condition');
      expect(response.body.optimizedCode).toBeDefined();
      expect(response.body.diffText).toBeDefined();
    });
  });

  // ── 6. Traffic Analytics Verification ──────────────────────────────────────
  describe('Traffic Analytics', () => {
    const testDeviceId = 'e2e-test-device-1234';

    it('should successfully record a visitor track event', async () => {
      const payload = {
        deviceId: testDeviceId,
        userAgent: 'Mozilla/5.0 E2E Testing Client',
        referrer: 'https://google.com'
      };

      const response = await request(app.getHttpServer())
        .post('/api/traffic/track')
        .send(payload);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    it('should successfully verify a valid gateway key', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/traffic/verify-gateway')
        .send({ key: 'msm-gateway' });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    it('should reject verification for an invalid gateway key', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/traffic/verify-gateway')
        .send({ key: 'invalid-key-here' });

      expect(response.status).toBe(401);
    });

    it('should reject fetching stats if no authentication token is provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/traffic/stats');
      expect(response.status).toBe(401);
    });

    it('should successfully authenticate with the correct passcode', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/traffic/auth')
        .send({ passcode: 'msmlabs26' });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
    });

    it('should retrieve aggregated traffic stats including the recorded visitor when utilizing a valid Bearer token', async () => {
      // 1. Authenticate to get active token
      const authRes = await request(app.getHttpServer())
        .post('/api/traffic/auth')
        .send({ passcode: 'msmlabs26' });
      const token = authRes.body.token;

      // Delay slightly to allow the asynchronous tracking operation to complete
      await new Promise(resolve => setTimeout(resolve, 300));

      // 2. Query stats using the token
      const response = await request(app.getHttpServer())
        .get('/api/traffic/stats')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.totalViews).toBeGreaterThanOrEqual(1);
      expect(response.body.uniqueViewers).toBeGreaterThanOrEqual(1);
      
      const visitor = response.body.visitors.find((v: any) => v.deviceId === testDeviceId);
      expect(visitor).toBeDefined();
      expect(visitor.ip).toBeDefined();
      expect(visitor.userAgent).toBe('Mozilla/5.0 E2E Testing Client');
      expect(visitor.country).toBe('Local Network');
      expect(visitor.isp).toBe('Localhost Loopback');
    });
  });
});
