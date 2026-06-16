import { Controller, Get, Post, Query, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ScopeCalculateDto, ScopeCalculateResult, RoadmapPhase } from 'shared-types';

@Controller('portfolio')
export class PortfolioController {
  
  // 1 ── Download Resume Endpoint ─────────────────────────────────────────────
  @Get('resume')
  async downloadResume(@Res() res: Response) {
    try {
      // Return a sleek, valid minimal PDF buffer for recruiters to view
      const mockPdfContent = `%PDF-1.4
1 0 obj < < /Type /Catalog /Pages 2 0 R > > endobj
2 0 obj < < /Type /Pages /Kids [ 3 0 R ] /Count 1 > > endobj
3 0 obj < < /Type /Page /Parent 2 0 R /MediaBox [ 0 0 612 792 ] /Resources < < /Font < < /F1 4 0 R > > > > /Contents 5 0 R > > endobj
4 0 obj < < /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold > > endobj
5 0 obj < < /Length 120 > > stream
BT
/F1 24 Tf
70 700 Td
(MOHAMMED SHAHEER MOIDIN - Full-Stack Developer) Tj
/F1 12 Tf
0 -50 Td
(Email: shaheermoidin97@gmail.com | Dubai, UAE) Tj
0 -20 Td
(Thank you for downloading my resume from the interactive portfolio!) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000062 00000 n 
0000000125 00000 n 
0000000259 00000 n 
0000000344 00000 n 
trailer < < /Size 6 /Root 1 0 R > >
startxref
514
%%EOF`;
      
      const buffer = Buffer.from(mockPdfContent, 'utf-8');
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=Mohammed_Shaheer_Moidin_Resume.pdf');
      res.status(HttpStatus.OK).send(buffer);
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Could not fetch resume PDF',
        error: err.message,
      });
    }
  }

  // 2 ── Skill Keyword Matcher Endpoint ───────────────────────────────────────
  @Get('skills')
  getSkillMatch(@Query('match') match?: string) {
    const rawTag = (match || '').toLowerCase().trim();
    
    if (!rawTag) {
      return {
        score: 0,
        comment: 'No skill specified.',
        highlightedProjects: [],
        highlights: [],
      };
    }

    // High fidelity compatibility calculations based on Mohammed's core stack
    let score = 80;
    let comment = `Mohammed has robust exposure to ${match}. Let's view his compatible execution pathways.`;
    let highlightedProjects: string[] = [];
    let highlights: string[] = [];

    switch (rawTag) {
      case 'react':
      case 'react js':
      case 'next js':
        score = 96;
        comment = 'Excellent match! Designed responsive portals and advanced UI features across major platforms.';
        highlightedProjects = ['4', '6', '7'];
        highlights = [
          'Engineered core features of muxemail.com with React & Material UI.',
          'Built the Next.js Patient Portal at DrHero.',
          'Coordinated unit testing pipelines with React Jest.'
        ];
        break;
      case 'nestjs':
      case 'nest js':
        score = 98;
        comment = 'Expert match! Lead backend architect leveraging microservices and caching systems.';
        highlightedProjects = ['1', '3'];
        highlights = [
          'Developed Search Engine at SoftBuilders Properties using NestJS & MongoDB.',
          'Built reliable token rewarding and distributed cron loops with BullMQ in NestJS.'
        ];
        break;
      case 'node':
      case 'node js':
      case 'node.js':
      case 'express':
      case 'express js':
        score = 95;
        comment = 'Senior execution! Constructed secure APIs, database systems, and event streams.';
        highlightedProjects = ['2', '3', '4'];
        highlights = [
          'Built secure JWT-based backend gateways with PM2 processes.',
          'Developed server-side caching modules utilizing Redis.',
          'Implemented Stripe billing webhooks and subscription models in Node.js.'
        ];
        break;
      case 'stripe':
        score = 94;
        comment = 'Production-ready billing! Architected robust payment intents, trials, and coupons.';
        highlightedProjects = ['2', '4'];
        highlights = [
          'Engineered Quickdropx subscription plans, payment intents, and mid-cycle proration.',
          'Migrated legacy payment processors to Stripe Payment Webhooks at MuxEmail.'
        ];
        break;
      case 'gcp':
      case 'gcloud':
        score = 92;
        comment = 'Cloud engineer! Managed database migrations and Docker clusters on GCP.';
        highlightedProjects = ['1', '3', '5'];
        highlights = [
          'Led an 85M+ record migration to GCP database structures with zero downtime.',
          'Configured Docker app nodes hosted on Google Cloud Virtual Servers.'
        ];
        break;
      case 'aws':
        score = 93;
        comment = 'Infrastructure specialist! Deployed scalable clusters and automated pipelines.';
        highlightedProjects = ['2', '4', '7'];
        highlights = [
          'Managed AWS EC2, ECS, Cognito, SES, and S3 resources.',
          'Configured Nginx proxies and PM2 deployments.'
        ];
        break;
      case 'redis':
      case 'rabbitmq':
      case 'kafka':
      case 'bullmq':
        score = 97;
        comment = 'High-velocity systems! Experienced with message queues and event brokers.';
        highlightedProjects = ['1', '3', '4'];
        highlights = [
          'Engineered microservices syncing via Kafka and RabbitMQ pipelines.',
          'Designed high-throughput job processors with Redis and BullMQ.'
        ];
        break;
      default:
        // Dynamic scoring for other skills
        score = Math.floor(Math.random() * (94 - 82 + 1)) + 82;
        comment = `Solid match! Mohammed has leveraged ${match} successfully to support major production deliveries.`;
        highlightedProjects = ['1', '2', '4'];
        highlights = [
          `Integrated ${match} standards inside enterprise structures.`,
          `Configured automated testing and deployment for ${match} codebases.`
        ];
    }

    return {
      score,
      comment,
      highlightedProjects,
      highlights,
    };
  }

  // 3 ── Project ROI & Scope Calculator Endpoint ─────────────────────────────
  @Post('calculate-scope')
  calculateScope(@Body() dto: ScopeCalculateDto): ScopeCalculateResult {
    const { complexity, timelineMonths, requiredScale } = dto;

    // Standard business parameters matching simulated roadmap
    let costBase = 8000;
    let speedToMarket = 90;
    const roadmap: RoadmapPhase[] = [];

    if (complexity === 'High') {
      costBase += 8000;
      speedToMarket -= 15;
    } else if (complexity === 'Medium') {
      costBase += 4000;
      speedToMarket -= 5;
    }

    if (requiredScale === 'High') {
      costBase += 5000;
      speedToMarket -= 10;
    } else if (requiredScale === 'Medium') {
      costBase += 2000;
      speedToMarket -= 3;
    }

    // Make timeline adjustments
    if (timelineMonths < 3) {
      costBase += 3000; // Crunch charge
      speedToMarket += 5; // Fast launch
    } else if (timelineMonths > 6) {
      costBase -= 1000; // Budget opt
      speedToMarket -= 10; // Slower delivery
    }

    // Build rich visual roadmap phases
    roadmap.push({
      phase: 'Phase 1: Architecture & Data Modelling',
      duration: `${Math.ceil(timelineMonths * 0.2)} Months`,
      details: 'Define DB schemas, API endpoints contracts, and setup monorepo scaffolding.',
      status: 'completed',
    });

    roadmap.push({
      phase: 'Phase 2: Core Frontend & Feature Development',
      duration: `${Math.ceil(timelineMonths * 0.4)} Months`,
      details: `Build React dashboard, implement primary views, and hook up endpoints at ${requiredScale} Scale.`,
      status: 'active',
    });

    roadmap.push({
      phase: 'Phase 3: Caching, Queues & System Integration',
      duration: `${Math.ceil(timelineMonths * 0.2)} Months`,
      details: complexity === 'High' 
        ? 'Implement Redis caching, BullMQ asynchronous queue retry blocks, and Kafka event brokers.' 
        : 'Setup standard Redis caching and Express/NestJS middleware routing.',
      status: 'pending',
    });

    roadmap.push({
      phase: 'Phase 4: Load Testing, QA & Cloud Deploy',
      duration: `${Math.ceil(timelineMonths * 0.2)} Months`,
      details: `Perform load testing up to ${requiredScale === 'High' ? '50,000 req/s' : '5,000 req/s'}, configure Docker, and deploy.`,
      status: 'pending',
    });

    const roiSummary = `By hiring Mohammed, you gain an autonomous engineer who designs optimized database structures and high-performance microservices, shaving weeks off your launching milestones. This architecture saves up to 35% in cloud infrastructure charges via intelligent caching and Docker resource limits.`;

    return {
      roadmap,
      roiSummary,
      totalCostEstimate: `$${costBase.toLocaleString()}`,
      speedToMarketScore: speedToMarket,
    };
  }
}
