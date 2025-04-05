import { Injectable, HttpException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { Company } from '../company/company.entity';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { AppLoggerService } from '../logger/logger.service';
import { ProductNameAlreadyExistsException } from '../exceptions/productname-already-exists.exception';
import { ProductNotFoundException } from '../exceptions/product-not-found.exception-not-found.exception';
import { CompanyNotFoundException } from '../exceptions/company-not-found.exception';
import { CompanyHasGotProductException } from '../exceptions/company-has-got-product.exception-not-found.exception';
import { UserNotAccessToProductException } from '../exceptions/user-not-access-to-product.exception';
import { ProductNotFoundWithBarcodeException } from '../exceptions/product-not-found.exception-not-found-with-barcode.exception';
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly logger: AppLoggerService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    companyId: number,
  ): Promise<Product> {
    const { name } = createProductDto;

    const existingProduct = await this.productRepository.findOne({
      where: { name },
    });
    if (existingProduct) {
      throw new ProductNameAlreadyExistsException(name);
    }

    const company = await this.companyRepository.findOne({
      where: { id: companyId },
      relations: ['product'],
    });
    if (!company) {
      throw new CompanyNotFoundException(companyId);
    }
    if (company.product) {
      throw new CompanyHasGotProductException(companyId);
    }

    try {
      const product = this.productRepository.create({
        ...createProductDto,
        company,
      });
      await this.productRepository.save(product);
      this.logger.log(`Product created: ${JSON.stringify(product)}`);
      return product;
    } catch (error) {
      this.logger.error(`Error creating product: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException(`Error creating product`);
    }
  }

  async findByBarcode(barcode: string): Promise<Product> {
    try {
      const product = await this.productRepository.findOne({
        where: { barcode },
        relations: ['company'],
      });
      console.log('findByBarcode', product);
      if (!product) {
        throw new ProductNotFoundWithBarcodeException(barcode);
      }
      return product;
    } catch (error) {
      this.logger.error(`Error finding product by barcode: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException(
        `Error finding product by barcode: ${barcode}`,
      );
    }
  }

  async findById(id: number): Promise<Product> {
    try {
      const product = await this.productRepository.findOne({
        where: { id },
        relations: ['company'],
      });
      if (!product) {
        throw new ProductNotFoundException(id);
      }

      return product;
    } catch (error) {
      this.logger.error(`Error finding product by ID: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException(`Error finding product by ID: ${id}`);
    }
  }

  async findAll(): Promise<Product[]> {
    try {
      return await this.productRepository.find({ relations: ['company'] });
    } catch (error) {
      this.logger.error(`Error finding product by ID: ${error.message}`);
      throw new BadRequestException(`Error finding all products`);
    }
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    userId: number,
  ): Promise<Product> {
    const existingProduct = await this.productRepository.findOne({
      where: { id },
      relations: ['company', 'company.owner'],
    });
    console.log('existingProduct', existingProduct);
    if (!existingProduct) {
      throw new ProductNotFoundException(id);
    }
    console.log('after existingProduct');

    const { name } = updateProductDto;
    if (name) {
      const productWithSameName = await this.productRepository.findOne({
        where: { name },
      });
      if (productWithSameName) {
        throw new ProductNameAlreadyExistsException(name);
      }
    }

    if (existingProduct.company.owner.id !== userId) {
      throw new UserNotAccessToProductException(userId);
    }

    try {
      await this.productRepository.update(id, updateProductDto);
      const updatedProduct = await this.findById(id);
      this.logger.log(`Product updated: ${JSON.stringify(updatedProduct)}`);
      return updatedProduct;
    } catch (error) {
      this.logger.error(
        `Error updating product by ID: ${id} - ${error.message}`,
      );
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException(`Error updating product by ID: ${id}`);
    }
  }

  async delete(id: number, userId: number): Promise<any> {
    const existingProduct = await this.productRepository.findOne({
      where: { id },
      relations: ['company', 'company.owner'],
    });
    if (!existingProduct) {
      throw new ProductNotFoundException(id);
    }

    if (existingProduct.company.owner.id !== userId) {
      throw new UserNotAccessToProductException(userId);
    }

    try {
      await this.productRepository.delete(id);
      this.logger.log(`Product with ID ${id} was deleted}`);
      return {
        message: `Product with ID ${id} has been successfully deleted.`,
      };
    } catch (error) {
      this.logger.error(
        `Error deleting product by ID: ${id} - ${error.message}`,
      );
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException(`Error deleting product by ID: ${id}`);
    }
  }
}
