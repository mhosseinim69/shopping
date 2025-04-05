import { BadRequestException } from '@nestjs/common';

export class CompanyHasGotProductException extends BadRequestException {
  constructor(id: number) {
    super(`Company with id ${id} has got product`);
  }
}
