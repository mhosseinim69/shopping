import { Injectable, HttpException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/category.dto';
import { AppLoggerService } from '../logger/logger.service';
import { CategoryNameAlreadyExistsException } from '../exceptions/categoryname-already-exists.exception';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly logger: AppLoggerService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { name } = createCategoryDto;
    const existingCategory = await this.categoryRepository.findOne({
      where: { name },
    });
    if (existingCategory) {
      throw new CategoryNameAlreadyExistsException(name);
    }

    try {
      const category = this.categoryRepository.create(createCategoryDto);
      await this.categoryRepository.save(category);
      this.logger.log(`Category created: ${JSON.stringify(category)}`);
      return category;
    } catch (error) {
      this.logger.error(`Error creating category: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException(`Error creating category`);
    }
  }
}
