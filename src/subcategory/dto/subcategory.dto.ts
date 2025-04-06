import { IsNotEmpty, IsString, IsInt, IsOptional } from 'class-validator';

export class CreateSubcategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  categoryId: number;
}

export class UpdateSubcategoryDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsInt()
  categoryId: number;
}
