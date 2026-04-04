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
import { join } from 'path';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
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

const env = process.env.NODE_ENV || 'development'; // 默认开发环境
const filePath = join(__dirname, '..', '..', 'config', `.env.${env}.yaml`);

@Module({
  imports: [
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule], // 导入 ConfigModule 确保 ConfigService 可用
      inject: [ConfigService], // 注入 ConfigService
      useFactory: (configService: ConfigService) => {
        const rootPath =
          configService.get('upload.directory') || join(__dirname, '..', '..', 'uploads');
        return [
          {
            rootPath,
            serveRoot: '/uploads',
          },
        ];
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        () => {
          return yaml.load(fs.readFileSync(filePath, 'utf8')) as object;
        },
      ],
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
    // 1️⃣ 全局管道 (因为需要传参 whitelist/transform，所以用 useFactory)
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          whitelist: true,
          transform: true,
        }),
    },
    // 2️⃣ 全局拦截器
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    // 3️⃣ 全局异常过滤器
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter, // NestJS 会自动把 ConfigService 注入给它！
    },
    // 4️⃣ 全局守卫 (顺序：先解包token -> 再查封禁)
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
