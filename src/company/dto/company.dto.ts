import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDate,
  Length,
} from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDate()
  createdAt?: Date;
}

export class UpdateCompanyDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}
