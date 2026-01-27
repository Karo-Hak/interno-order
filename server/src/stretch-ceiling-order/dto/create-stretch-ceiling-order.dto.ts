import {
  IsString,
  IsNumber,
  IsOptional,
  IsMongoId,
  IsArray,
  ValidateNested,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

class TextureRowDto {
  @IsMongoId()
  textureId: string;

  @IsNumber()
  width: number;

  @IsNumber()
  height: number;

  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsString()
  comment?: string;
}

class ProfilRowDto {
  @IsMongoId()
  profilId: string;

  @IsNumber()
  length: number;

  @IsNumber()
  quantity: number;
}

class BardutyunRowDto {
  @IsMongoId()
  bardutyunId: string;

  @IsNumber()
  quantity: number;
}

class LightPlatformRowDto {
  @IsMongoId()
  platformId: string;

  @IsNumber()
  quantity: number;
}

class LightRingRowDto {
  @IsMongoId()
  ringId: string;

  @IsNumber()
  quantity: number;
}

class RoomDto {
  @IsString()
  name: string;

  @IsNumber()
  ceilingHeight: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TextureRowDto)
  textures: TextureRowDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProfilRowDto)
  profils: ProfilRowDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BardutyunRowDto)
  bardutyun: BardutyunRowDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LightPlatformRowDto)
  lightPlatforms: LightPlatformRowDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LightRingRowDto)
  lightRings: LightRingRowDto[];
}

class BuyerDto {
  @IsString()
  name: string;

  @IsString()
  phone1: string;

  @IsOptional()
  @IsString()
  phone2?: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  address?: string;
}

export class CreateStretchCeilingOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoomDto)
  rooms: RoomDto[];

  @ValidateNested()
  @Type(() => BuyerDto)
  buyer: BuyerDto;

  @IsNumber()
  groundTotal: number;

  @IsNumber()
  prepayment: number;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  comment?: string;
}
