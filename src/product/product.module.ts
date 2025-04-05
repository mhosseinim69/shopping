import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Company } from '../company/company.entity';
import { Category } from '../category/category.entity';
import { AppLoggerService } from '../logger/logger.service';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Company, Category])],
  providers: [ProductService, AppLoggerService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
