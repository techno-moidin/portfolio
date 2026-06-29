import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from both the monorepo root and the backend subdirectory
dotenv.config({ path: path.resolve(process.cwd(), 'apps/backend-nestjs/.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Expose global /api prefix
  app.setGlobalPrefix('api');
  
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
    : ['http://localhost:5173', 'http://localhost:3000'];

  // Robust CORS implementation for production subdomains
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const isConfigured = allowedOrigins.indexOf(origin) !== -1;
      const isLocal = origin.startsWith('http://localhost:') || origin === 'http://localhost';
      const isVercel = origin.endsWith('.vercel.app');

      if (isConfigured || isLocal || isVercel) {
        callback(null, true);
      } else {
        callback(new Error('Blocked by CORS Policy (MSM Labs Protection)'));
      }
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 NestJS Backend running at: http://localhost:${port}/api`);
}
bootstrap();
