import {
  Body,
  Controller,
  Get,
  Headers,
  ParseIntPipe,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { extractBearerToken } from '../security/session-token.util';
import { GenerateFixtureDto } from './dto/generate-fixture.dto';
import { FixtureService } from './fixture.service';

@Controller('fixture')
export class FixtureController {
  constructor(
    private readonly fixtureService: FixtureService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  getByCategory(@Query('categoryId', ParseIntPipe) categoryId: number) {
    return this.fixtureService.getByCategory(categoryId);
  }

  @Post('generate')
  generate(
    @Headers('authorization') authorization: string | undefined,
    @Body() body: GenerateFixtureDto,
  ) {
    const token = extractBearerToken(authorization);
    if (!token) {
      throw new UnauthorizedException('Debes enviar un token Bearer valido.');
    }
    this.authService.verifyToken(token, 'admin');

    return this.fixtureService.generate(body);
  }
}
