import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { StandingsService } from './standings.service';

@Controller('standings')
export class StandingsController {
  constructor(private readonly standingsService: StandingsService) {}

  @Get()
  getByCategory(@Query('categoryId', ParseIntPipe) categoryId: number) {
    return this.standingsService.getByCategory(categoryId);
  }
}
