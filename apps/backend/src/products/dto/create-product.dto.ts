import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional,
  IsPositive, IsString, IsUrl, MaxLength, Min, MinLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 14 })
  @IsInt()
  @IsPositive()
  categoryId: number;

  @ApiProperty({ example: 'MHZVTK', maxLength: 20 })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  sku: string;

  @ApiProperty({ example: 'Ciki Ciki', maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 500 })
  @IsNumber()
  @Min(0)
  weight: number;

  @ApiProperty({ example: 5 })
  @IsNumber()
  @Min(0)
  width: number;

  @ApiProperty({ example: 5 })
  @IsNumber()
  @Min(0)
  length: number;

  @ApiProperty({ example: 5 })
  @IsNumber()
  @Min(0)
  height: number;

  @ApiProperty({ required: false, example: 'https://example.com/image.jpg' })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ example: 30000 })
  @IsInt()
  @Min(0)
  price: number;

  @ApiProperty({ default: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ example: 120 })
  @IsInt()
  @Min(0)
  stock: number;
}
