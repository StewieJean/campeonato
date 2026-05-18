import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  IsUrl,
} from 'class-validator';

export class CreatePlayerDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombres!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  apellido_paterno!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  apellido_materno!: string;

  @IsString()
  @Length(8, 12)
  dni!: string;

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
