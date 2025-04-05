import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseFilters,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { HttpExceptionFilter } from '../filters/http-exception.filter';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('products')
@UseFilters(HttpExceptionFilter)
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post(':companyId')
  async createProductForCompany(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Body() createProductDto: CreateProductDto,
  ) {
    return await this.productService.create(createProductDto, companyId);
  }

  @Get()
  async findAll() {
    return await this.productService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.productService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req,
  ) {
    const userId = req.user.userId;
    return await this.productService.update(id, updateProductDto, userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Req() req) {
    const userId = req.user.userId;
    return await this.productService.delete(id, userId);
  }
}
