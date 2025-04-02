import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from './config/config.service';
import { validationSchema } from './config/validation';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from './logger/logger.module';
import { AppLoggerService } from './logger/logger.service';
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
  ],
  providers: [AppLoggerService],
  exports: [AppLoggerService],
})
export class AppModule {}
