import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsMongoId, IsOptional, IsString, Min } from 'class-validator';

export class QueryPlintProductionDto {
  @ApiPropertyOptional() @IsOptional() @IsString()
  q?: string; // по name

  @ApiPropertyOptional() @IsOptional() @IsMongoId()
  plint?: string;

  @ApiPropertyOptional() @IsOptional() @IsMongoId()
  user?: string;

  @ApiPropertyOptional() @IsOptional() @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional() @IsOptional() @IsDateString()
  dateTo?: string;

  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0)
  skip?: number;

  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1)
  limit?: number;
}
