import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { OptionPayloadDto } from 'src/dto/api-response.dto';
import { StatusType } from '../../../types/all-data-types.type';
import { PaginationDto } from '../../../dto/pagination.dto';

export class AddAffiliateFaqDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  status?: StatusType;
}

export class InsertManyAffiliateFaqDto {
  @Type(() => AddAffiliateFaqDto)
  data: AddAffiliateFaqDto[];

  option: OptionPayloadDto;
}

export class FilterAffiliateFaqDto {
  @IsOptional()
  @IsString()
  name: string;
}

export class OptionAffiliateFaqDto {
  @IsOptional()
  @IsBoolean()
  deleteMany: boolean;
}

export class UpdateAffiliateFaqDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  status?: 'draft' | 'publish';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  ids: string[];
}

export class FilterAndPaginationAffiliateFaqDto {
  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => FilterAffiliateFaqDto)
  filter: FilterAffiliateFaqDto;

  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => PaginationDto)
  pagination: PaginationDto;

  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  sort: object;

  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  select: any;
}
