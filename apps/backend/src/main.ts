import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/response.interceptor';
import { AllExceptionsFilter } from './common/exception.filter';
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
  console.log(`Backend API running on http://localhost:${port}`);
}
import { ConfigService } from '@nestjs/config';
bootstrap();
