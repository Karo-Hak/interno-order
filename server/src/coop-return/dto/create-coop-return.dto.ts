import { IsArray, IsDateString, IsMongoId, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class GroupedItemDto {
  @IsString() name: string;
  @IsOptional() @IsNumber() @Min(0) width?: number;
  @IsOptional() @IsNumber() @Min(0) height?: number;
  @IsNumber() @Min(0) qty: number;
  @IsNumber() @Min(0) price: number;
  @IsNumber() @Min(0) sum: number;
}

export class CreateCoopReturnDto {
  @IsOptional() @IsDateString() date?: string;

  @IsArray() @ValidateNested({ each: true }) @Type(() => GroupedItemDto)
  groupedStretchTextureData: GroupedItemDto[];

  @IsArray() @ValidateNested({ each: true }) @Type(() => GroupedItemDto)
  groupedStretchProfilData: GroupedItemDto[];

  @IsArray() @ValidateNested({ each: true }) @Type(() => GroupedItemDto)
  groupedLightPlatformData: GroupedItemDto[];

  @IsArray() @ValidateNested({ each: true }) @Type(() => GroupedItemDto)
  groupedLightRingData: GroupedItemDto[];

  @IsOptional() @IsString() reason?: string;
  @IsOptional() @IsString() comment?: string;
  @IsOptional() picUrl?: string[];

  @IsMongoId() buyerId: string;
  @IsOptional() @IsMongoId() orderId?: string;
  @IsMongoId() userId: string;
}
