import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend (Next.js will run on different port)
  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:3000'], // Next.js default ports
    credentials: true,
  });

  app.setGlobalPrefix('api');

  const port = 3001;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📡 WebSocket server is running on: ws://localhost:${port}`);
}

bootstrap().catch((err) => {
  console.error('Error starting application:', err);
  process.exit(1);
});
