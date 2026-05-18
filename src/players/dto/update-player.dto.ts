import {
  IsDateString,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  IsUrl,
} from 'class-validator';

export class UpdatePlayerDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nombres?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  apellido_paterno?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  apellido_materno?: string;

  @IsOptional()
  @IsString()
  @Length(8, 12)
  dni?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  nro_colegiatura?: string;

  @IsOptional()
  @IsDateString()
  fecha_nacimiento?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  foto_url?: string;
}
