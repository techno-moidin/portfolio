import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Expose global /api prefix
  app.setGlobalPrefix('api');
  
  // Enable CORS for frontend requests (both native and Docker environments)
  app.enableCors({
    origin: '*', // Open origin access is ideal for local fullstack evaluation sandboxes
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 NestJS Backend running at: http://localhost:${port}/api`);
}
bootstrap();
