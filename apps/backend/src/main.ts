import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOrigins = process.env.CORS_ORIGINS?.split(',') || [
    'http://localhost:5173',
    'http://localhost:5174',
  ];
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  app.setGlobalPrefix('api');
  const configService = app.get(ConfigService);
  const port = configService.get('app.port');

  await app.listen(port);
  const baseUrl = configService.get('app.baseUrl') || 'http://localhost:3000';
  console.log(`Backend API running on ${baseUrl}`);
}
// oxlint-disable-next-line unicorn/prefer-top-level-await
bootstrap();
