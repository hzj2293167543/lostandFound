import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { LostItemsModule } from './lost-items/lost-items.module';
import { FoundItemsModule } from './found-items/found-items.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { CommentsModule } from './comments/comments.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import path from 'path';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import { ConfigModule, ConfigService } from '@nestjs/config';

const env = process.env.NODE_ENV || 'development'; // 默认开发环境
const filePath = path.join(__dirname, '..', 'config', `.env.${env}.yaml`);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        () => {
          return yaml.load(fs.readFileSync(filePath, 'utf8')) as object;
        },
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [], // 不需要额外导入，因为 YamlConfigLoaderModule 已全局注册 ConfigService
      inject: [ConfigService], // 注入 ConfigService
      useFactory: (configService: ConfigService) => ({
        type: configService.get<string>('database.type') as 'mysql',
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
    UsersModule,
    CategoriesModule,
    LostItemsModule,
    FoundItemsModule,
    AnnouncementsModule,
    CommentsModule,
  ],
})
export class AppModule {}
