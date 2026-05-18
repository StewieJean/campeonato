import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { extractBearerToken } from '../security/session-token.util';
import { CreateMatchDto } from './dto/create-match.dto';
import { CreateMatchEventDto } from './dto/create-match-event.dto';
import { SetResultDto } from './dto/set-result.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { MatchesService } from './matches.service';

@Controller('matches')
export class MatchesController {
  constructor(
    private readonly matchesService: MatchesService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  findAll(
    @Query('categoryId') categoryId?: string,
    @Query('jornada') jornada?: string,
    @Query('estado') estado?: string,
    @Query('fecha') fecha?: string,
  ) {
    return this.matchesService.findAll({
      categoryId: categoryId ? Number(categoryId) : undefined,
      jornada: jornada ? Number(jornada) : undefined,
      estado: estado || undefined,
      fecha: fecha || undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.matchesService.findOne(id);
  }

  @Post()
  create(
    @Headers('authorization') authorization: string | undefined,
    @Body() body: CreateMatchDto,
  ) {
    this.requireAdmin(authorization);
    return this.matchesService.create(body);
  }

  @Patch(':id')
  update(
    @Headers('authorization') authorization: string | undefined,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateMatchDto,
  ) {
    this.requireAdmin(authorization);
    return this.matchesService.update(id, body);
  }

  @Delete(':id')
  remove(
    @Headers('authorization') authorization: string | undefined,
    @Param('id', ParseIntPipe) id: number,
  ) {
    this.requireAdmin(authorization);
    return this.matchesService.remove(id);
  }

  @Patch(':id/resultado')
  setResult(
    @Headers('authorization') authorization: string | undefined,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: SetResultDto,
  ) {
    this.requireAdmin(authorization);
    return this.matchesService.setResult(id, body);
  }

  @Post(':id/eventos')
  addEvent(
    @Headers('authorization') authorization: string | undefined,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateMatchEventDto,
  ) {
    this.requireAdmin(authorization);
    return this.matchesService.addEvent(id, body);
  }

  @Delete(':id/eventos/:eventId')
  removeEvent(
    @Headers('authorization') authorization: string | undefined,
    @Param('id', ParseIntPipe) id: number,
    @Param('eventId', ParseIntPipe) eventId: number,
  ) {
    this.requireAdmin(authorization);
    return this.matchesService.removeEvent(id, eventId);
  }

  private requireAdmin(authorization: string | undefined) {
    const token = extractBearerToken(authorization);

    if (!token) {
      throw new UnauthorizedException('Debes enviar un token Bearer valido.');
    }

    this.authService.verifyToken(token, 'admin');
  }
}
