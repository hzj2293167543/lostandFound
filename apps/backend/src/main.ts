import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/exception.filter';
import { TransformInterceptor } from './common/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );

  app.useGlobalInterceptors(new TransformInterceptor());
  const configService = app.get(ConfigService);

  app.useGlobalFilters(new AllExceptionsFilter(configService));
  const port = configService.get('app.port');

  await app.listen(port);
  const baseUrl = configService.get('app.baseUrl') || 'http://localhost:3000';
  console.log(`Backend API running on ${baseUrl}`);
}
bootstrap();
