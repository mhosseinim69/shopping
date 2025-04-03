import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { AppLoggerService } from '../logger/logger.service';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Company])],
  providers: [CompanyService, AppLoggerService],
  controllers: [CompanyController],
  exports: [CompanyService],
})
export class CompanyModule {}
