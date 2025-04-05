import { NotFoundException } from '@nestjs/common';

export class ProductNotFoundWithBarcodeException extends NotFoundException {
  constructor(barcode: string) {
    super(`Product with barcode ${barcode} not found`);
  }
}
