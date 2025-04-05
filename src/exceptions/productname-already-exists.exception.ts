import { ConflictException } from '@nestjs/common';

export class ProductNameAlreadyExistsException extends ConflictException {
  constructor(name: string) {
    super(`Product with name ${name} already exists`);
  }
}
