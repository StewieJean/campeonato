import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { handlePrismaError } from '../prisma/prisma-error.mapper';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { CreateMatchEventDto } from './dto/create-match-event.dto';
import { SetResultDto } from './dto/set-result.dto';
import { UpdateMatchDto } from './dto/update-match.dto';

interface ListFilters {
  categoryId?: number;
  jornada?: number;
  estado?: string;
  fecha?: string;
}

const MATCH_INCLUDE = {
  category: true,
  homeTeam: { include: { professionalCollege: true } },
  awayTeam: { include: { professionalCollege: true } },
  events: {
    include: {
      player: true,
      team: true,
    },
    orderBy: { id: 'asc' as const },
  },
} satisfies Prisma.MatchInclude;

@Injectable()
export class MatchesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(filters: ListFilters) {
    const where: Prisma.MatchWhereInput = {};

    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.jornada) where.jornada = filters.jornada;
    if (filters.estado) where.estado = filters.estado;

    if (filters.fecha) {
      const start = new Date(filters.fecha);
      if (Number.isNaN(start.getTime())) {
        throw new BadRequestException('Fecha invalida.');
      }
      const end = new Date(start);
      end.setUTCDate(end.getUTCDate() + 1);
      where.fecha = { gte: start, lt: end };
    }

    return this.prisma.match.findMany({
      where,
      include: MATCH_INCLUDE,
      orderBy: [
        { jornada: 'asc' },
        { fecha: 'asc' },
        { id: 'asc' },
      ],
    });
  }

  async findOne(id: number) {
    const match = await this.prisma.match.findUnique({
      where: { id },
      include: MATCH_INCLUDE,
    });

    if (!match) {
      throw new NotFoundException('No se encontro el partido.');
    }

    return match;
  }

  async create(data: CreateMatchDto) {
    if (data.homeTeamId === data.awayTeamId) {
      throw new BadRequestException(
        'El equipo local y visitante no pueden ser el mismo.',
      );
    }

    try {
      return await this.prisma.match.create({
        data: {
          categoryId: data.categoryId,
          jornada: data.jornada,
          homeTeamId: data.homeTeamId,
          awayTeamId: data.awayTeamId,
          fecha: data.fecha ? new Date(data.fecha) : null,
          cancha: data.cancha ?? null,
        },
        include: MATCH_INCLUDE,
      });
    } catch (error) {
      handlePrismaError(error, 'partido');
    }
  }

  async update(id: number, data: UpdateMatchDto) {
    const homeTeamId = data.homeTeamId;
    const awayTeamId = data.awayTeamId;

    if (
      homeTeamId !== undefined &&
      awayTeamId !== undefined &&
      homeTeamId === awayTeamId
    ) {
      throw new BadRequestException(
        'El equipo local y visitante no pueden ser el mismo.',
      );
    }

    try {
      return await this.prisma.match.update({
        where: { id },
        data: {
          ...(data.jornada !== undefined && { jornada: data.jornada }),
          ...(homeTeamId !== undefined && { homeTeamId }),
          ...(awayTeamId !== undefined && { awayTeamId }),
          ...(data.fecha !== undefined && {
            fecha: data.fecha ? new Date(data.fecha) : null,
          }),
          ...(data.cancha !== undefined && { cancha: data.cancha }),
        },
        include: MATCH_INCLUDE,
      });
    } catch (error) {
      handlePrismaError(error, 'partido');
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.match.delete({
        where: { id },
      });
    } catch (error) {
      handlePrismaError(error, 'partido');
    }
  }

  async setResult(id: number, data: SetResultDto) {
    try {
      return await this.prisma.match.update({
        where: { id },
        data: {
          homeGoals: data.homeGoals,
          awayGoals: data.awayGoals,
          estado: 'FINALIZADO',
        },
        include: MATCH_INCLUDE,
      });
    } catch (error) {
      handlePrismaError(error, 'partido');
    }
  }

  async addEvent(matchId: number, data: CreateMatchEventDto) {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
      select: {
        id: true,
        homeTeamId: true,
        awayTeamId: true,
      },
    });

    if (!match) {
      throw new NotFoundException('No se encontro el partido.');
    }

    const player = await this.prisma.player.findUnique({
      where: { id: data.playerId },
      select: { id: true, teamId: true },
    });

    if (!player) {
      throw new NotFoundException('No se encontro el jugador.');
    }

    if (player.teamId !== match.homeTeamId && player.teamId !== match.awayTeamId) {
      throw new BadRequestException(
        'El jugador no pertenece a ninguno de los equipos del partido.',
      );
    }

    try {
      return await this.prisma.matchEvent.create({
        data: {
          matchId,
          playerId: player.id,
          teamId: player.teamId,
          tipo: data.tipo,
          minuto: data.minuto ?? null,
        },
        include: {
          player: true,
          team: true,
        },
      });
    } catch (error) {
      handlePrismaError(error, 'evento');
    }
  }

  async removeEvent(matchId: number, eventId: number) {
    const event = await this.prisma.matchEvent.findUnique({
      where: { id: eventId },
      select: { matchId: true },
    });

    if (!event) {
      throw new NotFoundException('No se encontro el evento.');
    }

    if (event.matchId !== matchId) {
      throw new BadRequestException(
        'El evento no pertenece al partido indicado.',
      );
    }

    try {
      return await this.prisma.matchEvent.delete({
        where: { id: eventId },
      });
    } catch (error) {
      handlePrismaError(error, 'evento');
    }
  }
}
