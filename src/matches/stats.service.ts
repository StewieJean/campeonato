import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { MatchEventType } from './dto/create-match-event.dto';

const CARD_TYPES: MatchEventType[] = ['AMARILLA', 'AZUL', 'ROJA'];

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getScorersByCategory(categoryId: number) {
    await this.requireCategory(categoryId);

    return this.aggregateByPlayer(categoryId, { tipo: 'GOL' }, ['goles']);
  }

  async getCardsByCategory(categoryId: number, tipo?: string) {
    await this.requireCategory(categoryId);

    if (tipo) {
      const upper = tipo.toUpperCase();
      if (!CARD_TYPES.includes(upper as MatchEventType)) {
        throw new BadRequestException(
          `Tipo invalido. Debe ser uno de: ${CARD_TYPES.join(', ')}.`,
        );
      }

      return this.aggregateByPlayer(
        categoryId,
        { tipo: upper },
        ['cantidad'],
        upper,
      );
    }

    const eventWhere: Prisma.MatchEventWhereInput = {
      tipo: { in: CARD_TYPES as string[] },
      match: { categoryId },
    };

    const grouped = await this.prisma.matchEvent.groupBy({
      by: ['playerId', 'tipo'],
      where: eventWhere,
      _count: { _all: true },
    });

    const playerIds = [...new Set(grouped.map((g) => g.playerId))];
    const players = await this.loadPlayers(playerIds);

    const byPlayer = new Map<
      number,
      { amarillas: number; azules: number; rojas: number; total: number }
    >();

    for (const row of grouped) {
      const entry =
        byPlayer.get(row.playerId) ?? {
          amarillas: 0,
          azules: 0,
          rojas: 0,
          total: 0,
        };
      const count = row._count._all;
      if (row.tipo === 'AMARILLA') entry.amarillas = count;
      if (row.tipo === 'AZUL') entry.azules = count;
      if (row.tipo === 'ROJA') entry.rojas = count;
      entry.total += count;
      byPlayer.set(row.playerId, entry);
    }

    const result = [...byPlayer.entries()]
      .map(([playerId, counts]) => {
        const player = players.get(playerId);
        return {
          ...counts,
          jugador: player ?? null,
        };
      })
      .sort(
        (a, b) =>
          b.total - a.total ||
          b.rojas - a.rojas ||
          b.azules - a.azules ||
          b.amarillas - a.amarillas,
      );

    return result;
  }

  private async aggregateByPlayer(
    categoryId: number,
    extraWhere: Prisma.MatchEventWhereInput,
    fields: string[],
    tipoEspecifico?: string,
  ) {
    const grouped = await this.prisma.matchEvent.groupBy({
      by: ['playerId'],
      where: {
        ...extraWhere,
        match: { categoryId },
      },
      _count: { _all: true },
    });

    const playerIds = grouped.map((g) => g.playerId);
    const players = await this.loadPlayers(playerIds);

    const fieldName = fields[0];

    return grouped
      .map((g) => ({
        [fieldName]: g._count._all,
        ...(tipoEspecifico && { tipo: tipoEspecifico }),
        jugador: players.get(g.playerId) ?? null,
      }))
      .sort((a, b) => (b[fieldName] as number) - (a[fieldName] as number));
  }

  private async loadPlayers(playerIds: number[]) {
    if (playerIds.length === 0) return new Map();

    const players = await this.prisma.player.findMany({
      where: { id: { in: playerIds } },
      include: {
        team: {
          include: {
            category: true,
            professionalCollege: true,
          },
        },
      },
    });

    return new Map(players.map((p) => [p.id, p]));
  }

  private async requireCategory(categoryId: number) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException('No se encontro la categoria.');
    }
    return category;
  }
}
