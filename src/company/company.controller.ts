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
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';
import { HttpExceptionFilter } from '../filters/http-exception.filter';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('companies')
@UseFilters(HttpExceptionFilter)
@UseGuards(JwtAuthGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  async create(@Body() createCompanyDto: CreateCompanyDto) {
    return await this.companyService.create(createCompanyDto);
  }

  @Get()
  async findAll() {
    return await this.companyService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.companyService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return await this.companyService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.companyService.delete(id);
  }
}
