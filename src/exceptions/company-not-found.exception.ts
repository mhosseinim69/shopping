import { NotFoundException } from '@nestjs/common';

export class CompanyNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Company with id ${id} not found`);
  }
}
