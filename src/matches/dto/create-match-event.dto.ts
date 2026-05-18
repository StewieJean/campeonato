import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export const MATCH_EVENT_TYPES = ['GOL', 'AMARILLA', 'AZUL', 'ROJA'] as const;
export type MatchEventType = (typeof MATCH_EVENT_TYPES)[number];

export class CreateMatchEventDto {
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  playerId!: number;

  @IsIn(MATCH_EVENT_TYPES)
  tipo!: MatchEventType;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minuto?: number;
}
