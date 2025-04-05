import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { AppLoggerService } from '../logger/logger.service';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategoryService, AppLoggerService],
  controllers: [CategoryController],
  exports: [CategoryService],
})
export class CategoryModule {}
