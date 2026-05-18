import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface StandingRow {
  teamId: number;
  nombre: string;
  pj: number;
  pg: number;
  pe: number;
  pp: number;
  gf: number;
  gc: number;
  dg: number;
  pts: number;
}

@Injectable()
export class StandingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getByCategory(categoryId: number) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException('No se encontro la categoria.');
    }

    const teams = await this.prisma.team.findMany({
      where: { categoryId },
      select: { id: true, nombre: true },
    });

    const rows = new Map<number, StandingRow>();
    for (const team of teams) {
      rows.set(team.id, {
        teamId: team.id,
        nombre: team.nombre,
        pj: 0,
        pg: 0,
        pe: 0,
        pp: 0,
        gf: 0,
        gc: 0,
        dg: 0,
        pts: 0,
      });
    }

    const matches = await this.prisma.match.findMany({
      where: {
        categoryId,
        estado: 'FINALIZADO',
        homeGoals: { not: null },
        awayGoals: { not: null },
      },
      select: {
        homeTeamId: true,
        awayTeamId: true,
        homeGoals: true,
        awayGoals: true,
      },
    });

    for (const m of matches) {
      const home = rows.get(m.homeTeamId);
      const away = rows.get(m.awayTeamId);
      if (!home || !away) continue;

      const hg = m.homeGoals!;
      const ag = m.awayGoals!;

      home.pj += 1;
      away.pj += 1;
      home.gf += hg;
      home.gc += ag;
      away.gf += ag;
      away.gc += hg;

      if (hg > ag) {
        home.pg += 1;
        home.pts += 3;
        away.pp += 1;
      } else if (hg < ag) {
        away.pg += 1;
        away.pts += 3;
        home.pp += 1;
      } else {
        home.pe += 1;
        away.pe += 1;
        home.pts += 1;
        away.pts += 1;
      }
    }

    for (const row of rows.values()) {
      row.dg = row.gf - row.gc;
    }

    const standings = [...rows.values()].sort(
      (a, b) =>
        b.pts - a.pts ||
        b.dg - a.dg ||
        b.gf - a.gf ||
        a.nombre.localeCompare(b.nombre),
    );

    return {
      category,
      standings: standings.map((row, idx) => ({ posicion: idx + 1, ...row })),
    };
  }
}
