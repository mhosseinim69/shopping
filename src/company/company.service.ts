import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './company.entity';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';
import { AppLoggerService } from '../logger/logger.service';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly logger: AppLoggerService,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const company = this.companyRepository.create(createCompanyDto);
    await this.companyRepository.save(company);
    this.logger.log(`Company created: ${JSON.stringify(company)}`);
    return company;
  }

  async findById(id: number): Promise<Company> {
    const company = await this.companyRepository.findOne({ where: { id } });
    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    return company;
  }

  async findAll(): Promise<Company[]> {
    return await this.companyRepository.find();
  }

  async update(
    id: number,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    await this.companyRepository.update(id, updateCompanyDto);
    return await this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.companyRepository.delete(id);
  }
}
