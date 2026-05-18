import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SetResultDto {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  homeGoals!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  awayGoals!: number;
}
