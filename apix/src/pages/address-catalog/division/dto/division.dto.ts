import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from 'src/dto/pagination.dto';

import { OptionPayloadDto } from 'src/dto/api-response.dto';

export class AddDivisionDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class InsertManyDivisionDto {
  @Type(() => AddDivisionDto)
  data: AddDivisionDto[];

  option: OptionPayloadDto;
}

export class FilterDivisionDto {
  @IsOptional()
  @IsString()
  name: string;
}

export class OptionDivisionDto {
  @IsOptional()
  @IsBoolean()
  deleteMany: boolean;
}

export class UpdateDivisionDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  ids: string[];
}

export class FilterAndPaginationDivisionDto {
  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => FilterDivisionDto)
  filter: FilterDivisionDto;

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
