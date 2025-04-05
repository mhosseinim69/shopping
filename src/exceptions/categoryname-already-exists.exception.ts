import { ConflictException } from '@nestjs/common';

export class CategoryNameAlreadyExistsException extends ConflictException {
  constructor(name: string) {
    super(`Category with name ${name} already exists`);
  }
}
