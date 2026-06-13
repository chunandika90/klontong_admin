import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsPositive, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryProductDto {
  @ApiPropertyOptional({ default: 1 })
  @IsInt()
  @IsPositive()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Search by name or SKU' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  categoryId?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  isActive?: boolean;

  @ApiPropertyOptional({ enum: ['name', 'price', 'stock', 'createdAt'], default: 'createdAt' })
  @IsString()
  @IsOptional()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'], default: 'DESC' })
  @IsString()
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
