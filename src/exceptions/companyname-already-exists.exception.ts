import { ConflictException } from '@nestjs/common';

export class CompanyNameAlreadyExistsException extends ConflictException {
  constructor(name: string) {
    super(`Company with name ${name} already exists`);
  }
}
