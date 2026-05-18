import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { FixtureController } from './fixture.controller';
import { FixtureService } from './fixture.service';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { StandingsController } from './standings.controller';
import { StandingsService } from './standings.service';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [
    MatchesController,
    FixtureController,
    StandingsController,
    StatsController,
  ],
  providers: [
    MatchesService,
    FixtureService,
    StandingsService,
    StatsService,
  ],
})
export class MatchesModule {}
