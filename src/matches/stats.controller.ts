import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller()
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('scorers')
  getScorers(@Query('categoryId', ParseIntPipe) categoryId: number) {
    return this.statsService.getScorersByCategory(categoryId);
  }

  @Get('cards')
  getCards(
    @Query('categoryId', ParseIntPipe) categoryId: number,
    @Query('tipo') tipo?: string,
  ) {
    return this.statsService.getCardsByCategory(categoryId, tipo);
  }
}
