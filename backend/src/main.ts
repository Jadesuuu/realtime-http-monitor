import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 *
 * Application Bootstrap
 *
 * Initializes and configures the NestJS application.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend (Next.js on port 3000)
  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:3000'], // Next.js default ports
  });

  // Global API prefix (all routes prefixed with /api)
  app.setGlobalPrefix('api');

  const port = 3001;
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`WebSocket server is running on: ws://localhost:${port}`);
}

bootstrap().catch((err) => {
  console.error('Error starting application:', err);
  process.exit(1);
});
