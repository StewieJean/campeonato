import { IsBoolean, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class GenerateFixtureDto {
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  categoryId!: number;

  @IsOptional()
  @IsBoolean()
  sobrescribir?: boolean;
}
