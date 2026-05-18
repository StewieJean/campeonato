import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMatchDto {
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  categoryId!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  jornada!: number;

  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  homeTeamId!: number;

  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  awayTeamId!: number;

  @IsOptional()
  @IsDateString()
  fecha?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  cancha?: string;
}
