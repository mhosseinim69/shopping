import { ConflictException } from '@nestjs/common';

export class SubcategoryNameAlreadyExistsException extends ConflictException {
  constructor(name: string) {
    super(`Subcategory with name ${name} already exists`);
  }
}
