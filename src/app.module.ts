import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from './config/config.service';
import { validationSchema } from './config/validation';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from './logger/logger.module';
import { AppLoggerService } from './logger/logger.service';
import { CompanyModule } from './company/company.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { SubcategoryModule } from './subcategory/subcategory.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      validationSchema: validationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('app.database.host'),
        port: configService.get<number>('app.database.port'),
        username: configService.get<string>('app.database.user'),
        password: configService.get<string>('app.database.password'),
        database: configService.get<string>('app.database.name'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    AuthModule,
    LoggerModule,
    CompanyModule,
    ProductModule,
    CategoryModule,
    SubcategoryModule,
    CacheModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          host: configService.get<string>('app.cache.host'),
          port: configService.get<string>('app.cache.port'),
          ttl: configService.get<string>('app.cache.ttl'),
        }),
      }),
      isGlobal: true,
    }),
  ],
  providers: [AppLoggerService],
  exports: [AppLoggerService],
})
export class AppModule {}
