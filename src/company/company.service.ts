import { Injectable, HttpException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RelationId, Repository } from 'typeorm';
import { Company } from './company.entity';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';
import { AppLoggerService } from '../logger/logger.service';
import { CompanyNameAlreadyExistsException } from '../exceptions/companyname-already-exists.exception';
import { CompanyNotFoundException } from '../exceptions/company-not-found.exception';
import { User } from '../users/user.entity';
import { UserNotFoundWithIdException } from '../exceptions/user-not-found-with-id.exception';
import { UserNotAccessToCompanyException } from '../exceptions/user-not-access-to-company.exception';
@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly logger: AppLoggerService,
  ) {}

  async create(
    createCompanyDto: CreateCompanyDto,
    userId: number,
  ): Promise<Company> {
    const { name } = createCompanyDto;

    const existingCompany = await this.companyRepository.findOne({
      where: { name },
    });
    if (existingCompany) {
      throw new CompanyNameAlreadyExistsException(name);
    }

    const owner = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!owner) {
      throw new UserNotFoundWithIdException(userId);
    }

    try {
      const company = this.companyRepository.create({
        ...createCompanyDto,
        owner,
      });
      await this.companyRepository.save(company);
      this.logger.log(`Company created: ${JSON.stringify(company)}`);
      return company;
    } catch (error) {
      this.logger.error(`Error creating company: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException(`Error creating company`);
    }
  }

  async findById(id: number): Promise<Company> {
    try {
      const company = await this.companyRepository.findOne({
        where: { id },
        relations: ['owner'],
      });
      if (!company) {
        throw new CompanyNotFoundException(id);
      }

      return company;
    } catch (error) {
      this.logger.error(`Error finding company by ID: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException(`Error finding company by ID: ${id}`);
    }
  }

  async findAll(): Promise<Company[]> {
    try {
      return await this.companyRepository.find({ relations: ['owner'] });
    } catch (error) {
      this.logger.error(`Error finding company by ID: ${error.message}`);
      throw new BadRequestException(`Error finding all companies`);
    }
  }

  async update(
    id: number,
    updateCompanyDto: UpdateCompanyDto,
    userId: number,
  ): Promise<Company> {
    const existingCompany = await this.companyRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!existingCompany) {
      throw new CompanyNotFoundException(id);
    }

    const { name } = updateCompanyDto;
    if (name) {
      const companyWithSameName = await this.companyRepository.findOne({
        where: { name },
      });
      if (companyWithSameName) {
        throw new CompanyNameAlreadyExistsException(name);
      }
    }

    if (existingCompany.owner.id !== userId) {
      throw new UserNotAccessToCompanyException(userId);
    }

    try {
      await this.companyRepository.update(id, updateCompanyDto);
      const updatedCompany = await this.findById(id);
      this.logger.log(`Company updated: ${JSON.stringify(updatedCompany)}`);
      return updatedCompany;
    } catch (error) {
      this.logger.error(
        `Error updating company by ID: ${id} - ${error.message}`,
      );
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException(`Error updating company by ID: ${id}`);
    }
  }

  async delete(id: number, userId: number): Promise<any> {
    const existingCompany = await this.companyRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!existingCompany) {
      throw new CompanyNotFoundException(id);
    }

    if (existingCompany.owner.id !== userId) {
      throw new UserNotAccessToCompanyException(userId);
    }

    try {
      await this.companyRepository.delete(id);
      this.logger.log(`Company with ID ${id} was deleted}`);
      return {
        message: `Company with ID ${id} has been successfully deleted.`,
      };
    } catch (error) {
      this.logger.error(
        `Error deleting company by ID: ${id} - ${error.message}`,
      );
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException(`Error deleting company by ID: ${id}`);
    }
  }
}
