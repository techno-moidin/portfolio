import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Expose global /api prefix
  app.setGlobalPrefix('api');
  
  const allowedOriginsString = process.env.ALLOWED_ORIGINS || '';
  const configuredOrigins = allowedOriginsString
    ? allowedOriginsString.split(',').map(o => o.trim())
    : [];

  // Enable secure dynamic CORS for frontend requests
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like curl, mobile clients, or server-to-server)
      if (!origin) return callback(null, true);
      
      const isLocal = origin.startsWith('http://localhost:') || origin === 'http://localhost';
      const isVercel = origin.endsWith('.vercel.app');
      const isConfigured = configuredOrigins.includes(origin);

      if (isLocal || isVercel || isConfigured) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 NestJS Backend running at: http://localhost:${port}/api`);
}
bootstrap();
