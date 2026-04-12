import { Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { LostItemsModule } from './lost-items/lost-items.module';
import { FoundItemsModule } from './found-items/found-items.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { CommentsModule } from './comments/comments.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UploadModule } from './common/upload/upload.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AdminModule } from './admin/admin.module';
import { ReportsModule } from './reports/reports.module';
import { NotificationModule } from './notifications/notification.module';
import { AIModule } from './ai/ai.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { BanGuard } from './common/guards/ban.guard';
import { OptionalJwtAuthGuard } from './common/guards/OptionalJwtAuthGuard.guard';
import { TransformInterceptor } from './common/response.interceptor';
import { AllExceptionsFilter } from './common/exception.filter';
import configuration from './configuration';

@Module({
  imports: [
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          rootPath: configService.get<string>('upload.directory') || '',
          serveRoot: '/uploads',
        },
      ],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<string>('database.type') as 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        namingStrategy: new SnakeNamingStrategy(),
        synchronize: false,
        logging: false,
      }),
    }),
    AuthModule,
    UploadModule,
    UsersModule,
    CategoriesModule,
    LostItemsModule,
    FoundItemsModule,
    AnnouncementsModule,
    CommentsModule,
    AdminModule,
    ReportsModule,
    NotificationModule,
    AIModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          whitelist: true,
          transform: true,
        }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: OptionalJwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: BanGuard,
    },
  ],
})
export class AppModule {}
