import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateMatchDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  jornada?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  homeTeamId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  awayTeamId?: number;

  @IsOptional()
  @IsDateString()
  fecha?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  cancha?: string;
}
