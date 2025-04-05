import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsDate,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  barcode?: string;

  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @IsNotEmpty()
  @IsNumber()
  categoryId: number;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  barcode?: string;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;

  @IsOptional()
  @IsNumber()
  categoryId: number;
}
