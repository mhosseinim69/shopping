import { Injectable, HttpException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subcategory } from './subcategory.entity';
import { Category } from '../category/category.entity';
import { CreateSubcategoryDto } from './dto/subcategory.dto';
import { AppLoggerService } from '../logger/logger.service';
import { SubcategoryNameAlreadyExistsException } from '../exceptions/subcategoryname-already-exists.exception';
import { CategoryNotFoundException } from '../exceptions/category-not-found.exception';

@Injectable()
export class SubcategoryService {
  constructor(
    @InjectRepository(Subcategory)
    private readonly subcategoryRepository: Repository<Subcategory>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly logger: AppLoggerService,
  ) {}

  async create(
    createSubcategoryDto: CreateSubcategoryDto,
  ): Promise<Subcategory> {
    const { name, categoryId } = createSubcategoryDto;
    console.log('0Subcategory name:', name);
    const existingSubcategory = await this.subcategoryRepository.findOne({
      where: { name },
    });
    if (existingSubcategory) {
      throw new SubcategoryNameAlreadyExistsException(name);
    }

    console.log('1Subcategory name:', name);

    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      throw new CategoryNotFoundException(categoryId);
    }

    console.log('2Subcategory name:', name);

    try {
      const subcategory = this.subcategoryRepository.create({
        name,
        category,
      });
      await this.subcategoryRepository.save(subcategory);
      this.logger.log(`Subcategory created: ${JSON.stringify(subcategory)}`);
      return subcategory;
    } catch (error) {
      this.logger.error(`Error creating subcategory: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException(`Error creating subcategory`);
    }
  }
}
