import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GenerateFixtureDto } from './dto/generate-fixture.dto';

@Injectable()
export class FixtureService {
  constructor(private readonly prisma: PrismaService) {}

  async getByCategory(categoryId: number) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException('No se encontro la categoria.');
    }

    const matches = await this.prisma.match.findMany({
      where: { categoryId },
      include: {
        homeTeam: { include: { professionalCollege: true } },
        awayTeam: { include: { professionalCollege: true } },
      },
      orderBy: [{ jornada: 'asc' }, { fecha: 'asc' }, { id: 'asc' }],
    });

    const jornadas = new Map<number, typeof matches>();
    for (const match of matches) {
      const list = jornadas.get(match.jornada) ?? [];
      list.push(match);
      jornadas.set(match.jornada, list);
    }

    return {
      category,
      totalJornadas: jornadas.size,
      totalPartidos: matches.length,
      jornadas: [...jornadas.entries()]
        .sort(([a], [b]) => a - b)
        .map(([numero, partidos]) => ({ numero, partidos })),
    };
  }

  async generate(data: GenerateFixtureDto) {
    const category = await this.prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      throw new NotFoundException('No se encontro la categoria.');
    }

    const teams = await this.prisma.team.findMany({
      where: { categoryId: data.categoryId },
      select: { id: true, nombre: true },
      orderBy: { id: 'asc' },
    });

    if (teams.length < 2) {
      throw new BadRequestException(
        'Se necesitan al menos 2 equipos en la categoria para generar el fixture.',
      );
    }

    const existingCount = await this.prisma.match.count({
      where: { categoryId: data.categoryId },
    });

    if (existingCount > 0 && !data.sobrescribir) {
      throw new ConflictException(
        'Ya existen partidos para esta categoria. Envia { sobrescribir: true } para regenerar.',
      );
    }

    const pairings = roundRobinPairings(teams.map((t) => t.id));

    return this.prisma.$transaction(async (tx) => {
      if (existingCount > 0) {
        await tx.matchEvent.deleteMany({
          where: { match: { categoryId: data.categoryId } },
        });
        await tx.match.deleteMany({
          where: { categoryId: data.categoryId },
        });
      }

      const created = await tx.match.createMany({
        data: pairings.flatMap((jornadaPairs, jornadaIdx) =>
          jornadaPairs.map(([homeTeamId, awayTeamId]) => ({
            categoryId: data.categoryId,
            jornada: jornadaIdx + 1,
            homeTeamId,
            awayTeamId,
          })),
        ),
      });

      return {
        categoryId: data.categoryId,
        equipos: teams.length,
        jornadas: pairings.length,
        partidosCreados: created.count,
      };
    });
  }
}

function roundRobinPairings(teamIds: number[]): [number, number][][] {
  const BYE = -1;
  const ids = [...teamIds];
  if (ids.length % 2 === 1) ids.push(BYE);

  const n = ids.length;
  const rounds = n - 1;
  const half = n / 2;

  const rotation = ids.slice(1);
  const fixed = ids[0];
  const result: [number, number][][] = [];

  for (let round = 0; round < rounds; round++) {
    const lineup = [fixed, ...rotation];
    const pairs: [number, number][] = [];

    for (let i = 0; i < half; i++) {
      const home = lineup[i];
      const away = lineup[n - 1 - i];
      if (home === BYE || away === BYE) continue;

      if (round % 2 === 0) {
        pairs.push([home, away]);
      } else {
        pairs.push([away, home]);
      }
    }

    result.push(pairs);
    rotation.unshift(rotation.pop()!);
  }

  return result;
}
